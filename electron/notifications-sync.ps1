$ErrorActionPreference = 'SilentlyContinue'

# 1. Prepare WinRT Task Helper to avoid "GetAwaiter" errors in PowerShell
$code = @'
using System;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using Windows.Foundation;

public static class WinRTHelper {
    public static T Await<T>(IAsyncOperation<T> operation) {
        var task = Task.Run(async () => await operation);
        return task.GetAwaiter().GetResult();
    }
    public static void AwaitAction(IAsyncAction action) {
        var task = Task.Run(async () => await action);
        task.GetAwaiter().GetResult();
    }
}
'@

try {
    # Reference the WinRT interop assemblies
    Add-Type -TypeDefinition $code -ReferencedAssemblies "System.Runtime.WindowsRuntime"
    
    # 2. Get the Listener
    [Windows.UI.Notifications.Management.UserNotificationListener, Windows.UI.Notifications, ContentType=WindowsRuntime] | Out-Null
    [Windows.UI.Notifications.KnownNotificationBindings, Windows.UI.Notifications, ContentType=WindowsRuntime] | Out-Null
    
    $listener = [Windows.UI.Notifications.Management.UserNotificationListener]::Current
    
    Write-Host "__DEBUG__ Notification Sync Started (Official API). Monitoring..."

    # Create a loop for bidirectional sync
    while ($true) {
        $access = $listener.GetAccessStatus()
        if ($access -eq 'Unspecified') {
            # Try to request access asynchronously via our helper
            $access = [WinRTHelper]::Await($listener.RequestAccessAsync())
        }

        if ($access -eq 'Allowed') {
            # 3. GET ACTIVE NOTIFICATIONS
            $notifsOperation = $listener.GetNotificationsAsync([Windows.UI.Notifications.NotificationKinds]::Toast)
            $notifs = [WinRTHelper]::Await($notifsOperation)
            
            # Send the IDs of currently active notifications to help Notchly sync deletions
            $activeIds = @()
            foreach ($n in $notifs) {
                try {
                    $id = $n.Id
                    $activeIds += $id
                    $app = $n.AppInfo.DisplayInfo.DisplayName
                    $toast = $n.Notification.Visual.GetBinding([Windows.UI.Notifications.KnownNotificationBindings]::ToastGeneric)
                    if ($toast) {
                        $texts = $toast.GetTextElements()
                        $title = if ($texts.Count -gt 0) { $texts[0].Text } else { "" }
                        $body = if ($texts.Count -gt 1) { $texts[1].Text } else { "" }
                        
                        if ($title -or $body) {
                            # Using ID for precise syncing and deletion
                            Write-Host "__NOTIF_SYNC__$id|||$app|||$title|||$body"
                        }
                    }
                } catch { }
            }
            # Report the full list of active IDs so main process can prune disappeared ones
            Write-Host "__ACTIVE_IDS__$($activeIds -join ',')"
        }

        # 4. CHECK FOR INCOMING DELETE COMMANDS FROM MAIN PROCESS (via stdin)
        # We check if there's any input waiting for us
        if ($Host.UI.RawUI.KeyAvailable) {
            $input = Read-Host
            if ($input -match "^DISMISS\|(\d+)") {
                $dismissId = [uint32]$matches[1]
                Write-Host "__DEBUG__ Dismissing notification $dismissId from Windows center..."
                try {
                    $listener.RemoveNotification($dismissId)
                } catch {
                    Write-Host "__ERROR__ Failed to remove notification $dismissId"
                }
            }
        }

        Start-Sleep -Seconds 3
    }

} catch {
    Write-Host "__ERROR__ Critical Sync Error: $($_.Exception.Message)"
}
