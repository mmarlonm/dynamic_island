
$events = Get-WinEvent -LogName "Microsoft-Windows-PushNotification-Platform/Operational" -MaxEvents 50 -ErrorAction SilentlyContinue | Where-Object { $_.Id -eq 5006 -or $_.Id -eq 5007 }
foreach ($e in $events) {
    try {
        $xml = [xml]$e.ToXml()
        $userData = $xml.Event.UserData
        # Check for Toast notifications
        if ($userData.ToastNotificationReceived) {
            $app = $userData.ToastNotificationReceived.AppId
            $notifId = $userData.ToastNotificationReceived.NotificationId
            Write-Host "APP:$app | NOTIF_ID:$notifId"
        }
    } catch {
        Write-Host "Error parsing XML for event $($e.Id)"
    }
}
