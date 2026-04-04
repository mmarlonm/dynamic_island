$ErrorActionPreference = 'Stop'
try {
    # Cargar ensamblados necesarios
    Add-Type -AssemblyName System.Runtime.WindowsRuntime
    
    # Obtener el Listener oficial
    $listener = [Windows.UI.Notifications.Management.UserNotificationListener]::Current
    
    # Solicitar acceso (formato Async para PowerShell)
    $op = $listener.RequestAccessAsync()
    while ($op.Status -eq 'Started') { Start-Sleep -m 100 }
    $access = $op.GetResults()

    if ($access -eq 'Allowed') {
        # Obtener notificaciones ACTIVAS
        $notifsOp = $listener.GetNotificationsAsync([Windows.UI.Notifications.NotificationKinds]::Toast)
        while ($notifsOp.Status -eq 'Started') { Start-Sleep -m 100 }
        $notifs = $notifsOp.GetResults()

        Write-Host "__DEBUG__ Access: $access | Count: $($notifs.Count)"
        foreach ($n in $notifs) {
            $appName = $n.AppInfo.DisplayInfo.DisplayName
            Write-Host "__DEBUG__ App: $appName | ID: $($n.Id)"
        }
    } else {
        Write-Host "__ERROR__ Acceso denegado: $access"
    }
} catch {
    Write-Host "__ERROR__ $($_.Exception.Message)"
}
