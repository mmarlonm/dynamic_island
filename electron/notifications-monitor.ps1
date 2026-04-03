$ErrorActionPreference = 'SilentlyContinue'

# Path to the Windows Notification Database
$dbPath = "$env:LocalAppData\Microsoft\Windows\Notifications\wpndatabase.db"
$tempDb = "$env:TEMP\notchly_notif_scan.db"

Write-Host "__DEBUG__ Notification Monitor Started (Database Scan Mode). Entering loop..."

while ($true) {
    if (Test-Path $dbPath) {
        # Copy to avoid file lock
        Copy-Item -Path $dbPath -Destination $tempDb -Force
        
        # We use a robust regex to find notification payloads in the raw database file
        # This avoids needing a SQLite driver while still getting the data
        $content = [System.IO.File]::ReadAllBytes($tempDb)
        $text = [System.Text.Encoding]::UTF8.GetString($content)
        
        # Regex to find <toast> XML payloads and their associated app/handler names
        # We look for common app signatures in the database strings
        $matches = [regex]::Matches($text, '<toast[\s\S]*?<\/toast>')
        
        foreach ($m in $matches) {
            $xmlText = $m.Value
            try {
                [xml]$xml = $xmlText
                $binding = $xml.toast.visual.binding
                if ($binding) {
                    $texts = $binding.text
                    $title = $texts[0].'#text'
                    if (-not $title) { $title = $texts[0] }
                    
                    $body = if ($texts.Count -gt 1) { 
                        if ($texts[1].'#text') { $texts[1].'#text' } else { $texts[1] }
                    } else { "" }

                    # Try to find a nearby AppId or assume generic if not found
                    # To keep it simple, we'll prefix with "Alerta" if we can't find the exact app in this scan
                    if ($title -or $body) {
                        Write-Host "__NOTIF__Notificación|||$title|||$body"
                    }
                }
            } catch {}
        }
    }
    
    Start-Sleep -Seconds 5
}

