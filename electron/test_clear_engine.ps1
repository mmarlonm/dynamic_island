[void][Windows.UI.Notifications.Management.UserNotificationListener, Windows.UI.Notifications, ContentType = WindowsRuntime]
$l = [Windows.UI.Notifications.Management.UserNotificationListener]::Current
$o = $l.RequestAccessAsync()
while($o.Status -eq 'Started'){ [System.Threading.Thread]::Sleep(100) }
$access = $o.GetResults()

Write-Host "--- DIAGNOSTICO NOTCHLY ---"
Write-Host "SISTEMA_ACCESO: $access"

if($access -eq 'Allowed'){
    $notifsOp = $l.GetNotificationsAsync(1)
    while($notifsOp.Status -eq 'Started'){ [System.Threading.Thread]::Sleep(100) }
    $ns = $notifsOp.GetResults()
    Write-Host "NOTIFICACIONES_VISIBLES: $($ns.Count)"
    
    foreach($n in $ns){
        try {
            $app = $n.AppInfo.DisplayInfo.DisplayName
            Write-Host "INTENTANDO_BORRAR: $app (ID: $($n.Id))"
            $l.RemoveNotification($n.Id)
            Write-Host "RESULTADO: EXITO"
        } catch {
            Write-Host "RESULTADO: FALLO - $($_.Exception.Message)"
        }
    }
} else {
    Write-Host "ACCION_REQUERIDA: Debes permitir 'Notificaciones' en la Privacidad de Windows para Notchly"
}
Write-Host "--- FIN ---"
