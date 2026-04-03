
$ErrorActionPreference = 'Stop'

# This C# block uses dynamic loading to avoid hard DLL references that might fail in different environments
$code = @'
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Windows.UI.Notifications;
using Windows.UI.Notifications.Management;

public class NotifReader {
    public static async Task<string> GetCurrent() {
        try {
            var listener = UserNotificationListener.Current;
            var access = await listener.GetAccessStatusAsync();
            if (access != UserNotificationListenerAccessStatus.Allowed) return "ERROR:Denied_" + access;

            var notifs = await listener.GetNotificationsAsync(NotificationKinds.Toast);
            var results = new List<string>();
            foreach (var n in notifs) {
                try {
                    var app = n.AppInfo.DisplayInfo.DisplayName;
                    var toast = n.Notification.Visual.GetBinding(KnownNotificationBindings.ToastGeneric);
                    if (toast != null) {
                        var texts = toast.GetTextElements();
                        var title = texts.Count > 0 ? texts[0].Text : "";
                        var body = texts.Count > 1 ? texts[1].Text : "";
                        results.Add(app + "|||" + title + "|||" + body);
                    }
                } catch {}
            }
            return string.Join("###", results);
        } catch (Exception e) {
            return "ERROR:" + e.Message;
        }
    }
}
'@

# We use the built-in Windows.winmd for WinRT definitions
Add-Type -TypeDefinition $code -ReferencedAssemblies "System.Runtime.WindowsRuntime"

$res = [NotifReader]::GetCurrent().GetAwaiter().GetResult()
Write-Output "RESULT:$res"
