
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Runtime.WindowsRuntime
[Windows.UI.Notifications.Management.UserNotificationListener, Windows.UI.Notifications, ContentType=WindowsRuntime] | Out-Null
$listener = [Windows.UI.Notifications.Management.UserNotificationListener]::Current
$access = $listener.GetAccessStatus()
if ($access -eq 'Unspecified') {
    $access = $listener.RequestAccessAsync().GetAwaiter().GetResult()
}

if ($access -eq 'Allowed') {
    $notifs = $listener.GetNotificationsAsync([Windows.UI.Notifications.NotificationKinds]::Toast).GetAwaiter().GetResult()
    foreach ($n in $notifs) {
        try {
            $app = $n.AppInfo.DisplayInfo.DisplayName
            $visual = $n.Notification.Visual
            $toast = $visual.GetBinding([Windows.UI.Notifications.KnownNotificationBindings]::ToastGeneric)
            if ($toast) {
                $texts = $toast.GetTextElements()
                $title = $texts[0].Text
                $body = if ($texts.Count -gt 1) { $texts[1].Text } else { "" }
                Write-Output "__NOTIF__$app|||$title|||$body"
            }
        } catch {}
    }
} else {
    Write-Output "__ERROR__AccessStatus: $access"
}
