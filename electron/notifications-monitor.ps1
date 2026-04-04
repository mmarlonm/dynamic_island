$ErrorActionPreference = 'SilentlyContinue'

$dbPath = "$env:LocalAppData\Microsoft\Windows\Notifications\wpndatabase.db"
$logPath = "$env:TEMP\notchly_robust_monitor.log"
$seenHashes = @{}

# Función de Hash Estable (MD5) compatible con PowerShell 5.1
function Get-LinkHash($text) {
    if ([string]::IsNullOrEmpty($text)) { return "empty" }
    $md5 = [System.Security.Cryptography.MD5]::Create()
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($text)
    $hash = $md5.ComputeHash($bytes)
    return [System.BitConverter]::ToString($hash).Replace("-", "").ToLower()
}

Write-Host "__DEBUG__ Motor de Notificaciones Robusto Iniciado. Entrando en bucle..."

while ($true) {
    if (Test-Path $dbPath) {
        try {
            $stream = [System.IO.File]::Open($dbPath, 'Open', 'Read', 'ReadWrite')
            $length = $stream.Length
            $seekPos = 0
            if ($length -gt 1048576) { $seekPos = $length - 1048576 }
            
            $stream.Seek($seekPos, 'Begin') | Out-Null
            $buffer = New-Object byte[] ($length - $seekPos)
            $stream.Read($buffer, 0, $buffer.Length) | Out-Null
            $stream.Close()

            $activeHashes = @{}
            
            # Intentar decodificar en ambos formatos comunes de Windows
            $string8 = [System.Text.Encoding]::UTF8.GetString($buffer)
            $string16 = [System.Text.Encoding]::Unicode.GetString($buffer)

            # Buscar etiquetas <toast> en ambos strings
            $regex = [regex]'(?si)<toast.*?</toast>'
            $matches8 = $regex.Matches($string8)
            $matches16 = $regex.Matches($string16)

            $allMatches = @()
            if ($matches8) { foreach ($m in $matches8) { $allMatches += $m.Value } }
            if ($matches16) { foreach ($m in $matches16) { $allMatches += $m.Value } }

            foreach ($xmlRaw in $allMatches) {
                try {
                    # Limpieza agresiva de caracteres nulos y basura binaria
                    $xmlClean = $xmlRaw -replace "`0", ""
                    $xmlClean = $xmlClean -replace "[^\x20-\x7E\xA0-\xFF\t\r\n]", ""
                    
                    if ($xmlClean -match '(?si)<toast.*?</toast>') {
                        [xml]$xmlObj = $xmlClean
                        $nodes = $xmlObj.toast.visual.binding.text
                        if ($nodes) {
                            $title = if ($nodes[0].'#text') { $nodes[0].'#text' } else { $nodes[0] }
                            $body = if ($nodes.Count -gt 1) { 
                                if ($nodes[1].'#text') { $nodes[1].'#text' } else { $nodes[1] }
                            } else { "" }

                            if ($title -or $body) {
                                $h = Get-LinkHash ("$title|$body")
                                $activeHashes[$h] = $true
                                
                                if (-not $seenHashes.ContainsKey($h)) {
                                    $appStr = "Notificación"
                                    if ($xmlClean -match 'Outlook') { $appStr = "Outlook" }
                                    elseif ($xmlClean -match 'WhatsApp') { $appStr = "WhatsApp" }
                                    elseif ($xmlClean -match 'Settings|Configuraci') { $appStr = "Configuración" }
                                    elseif ($xmlRaw -match 'Chrome') { $appStr = "Chrome" }
                                    
                                    Write-Host "__NOTIF__$appStr|||$title|||$body|||$h"
                                    $seenHashes[$h] = $true
                                }
                            }
                        }
                    }
                } catch { }
            }

            # Sincronización de borrado: si ya no está en la DB, quitar de Notchly
            $toRemove = @()
            foreach ($s in $seenHashes.Keys) {
                if (-not $activeHashes.ContainsKey($s)) { $toRemove += $s }
            }
            foreach ($r in $toRemove) {
                $seenHashes.Remove($r)
                Write-Host "__REMOVE__$r"
            }
        } catch {
            "$(Get-Date): Error $($_)" | Out-File $logPath -Append
        }
    }
    Start-Sleep -Seconds 5
}
