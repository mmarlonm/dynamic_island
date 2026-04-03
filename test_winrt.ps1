
$ErrorActionPreference = 'Stop'
$code = @'
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Windows.UI.Notifications;
using Windows.UI.Notifications.Management;

public class NotifReader {
    public static async Task<string> GetNotifs() {
        try {
            var listener = UserNotificationListener.Current;
            var access = await listener.GetAccessStatusAsync();
            if (access != UserNotificationListenerAccessStatus.Allowed) return "ERROR:AccessDenied";
            var notifs = await listener.GetNotificationsAsync(NotificationKinds.Toast);
            var res = new List<string>();
            foreach (var n in notifs) {
                var app = n.AppInfo.DisplayInfo.DisplayName;
                var toast = n.Notification.Visual.GetBinding(KnownNotificationBindings.ToastGeneric);
                if (toast != null) {
                    var texts = toast.GetTextElements();
                    var title = texts.Count > 0 ? texts[0].Text : "";
                    var body = texts.Count > 1 ? texts[1].Text : "";
                    res.Add(app + "|||" + title + "|||" + body);
                }
            }
            return string.Join("###", res);
        } catch (Exception e) { return "ERROR:" + e.Message; }
    }
}
'@

try {
    # Reference the required WinMD for WinRT access
    Add-Type -TypeDefinition $code -ReferencedAssemblies "System.Runtime.WindowsRuntime", "Windows.Foundation", "Windows.UI"
    $res = [NotifReader]::GetNotifs().GetAwaiter().GetResult()
    Write-Output "RESULT:$res"
} catch {
    Write-Output "ERROR:$($_.Exception.Message)"
}
