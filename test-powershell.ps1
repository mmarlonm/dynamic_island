$code = @"
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Windows.Media.Control;
using Windows.ApplicationModel.Appointments;

public class WinReader {
    public static string GetData() {
        try {
            string mediaJson = "null";
            var task = GlobalSystemMediaTransportControlsSessionManager.RequestAsync().AsTask();
            task.Wait();
            var manager = task.Result;
            var session = manager.GetCurrentSession();
            if (session != null) {
                var mediaTask = session.TryGetMediaPropertiesAsync().AsTask();
                mediaTask.Wait();
                var mediaProps = mediaTask.Result;
                var info = session.GetPlaybackInfo();
                bool isPlaying = info.PlaybackStatus == GlobalSystemMediaTransportControlsSessionPlaybackStatus.Playing;
                string title = mediaProps.Title != null ? mediaProps.Title.Replace("\"", "\\\"") : "";
                string artist = mediaProps.Artist != null ? mediaProps.Artist.Replace("\"", "\\\"") : "";
                string app = session.SourceAppUserModelId != null ? session.SourceAppUserModelId.Replace("\"", "\\\"") : "";
                mediaJson = $"{{\"title\": \"{title}\", \"artist\": \"{artist}\", \"isPlaying\": {isPlaying.ToString().ToLower()}, \"app\": \"{app}\"}}";
            }

            string eventsJson = "[]";
            try {
                var storeTask = AppointmentManager.RequestStoreAsync(AppointmentStoreAccessType.AllCalendarsReadOnly).AsTask();
                storeTask.Wait();
                var store = storeTask.Result;
                if (store != null) {
                    var options = new FindAppointmentsOptions();
                    options.MaxCount = 5;
                    var findTask = store.FindAppointmentsAsync(DateTime.Now.Date, TimeSpan.FromDays(1), options).AsTask();
                    findTask.Wait();
                    var appts = findTask.Result;
                    var apptStrings = new List<string>();
                    foreach(var a in appts) {
                        string subject = a.Subject != null ? a.Subject.Replace("\"", "\\\"") : "Event";
                        apptStrings.Add($"{{\"subject\": \"{subject}\", \"startTime\": \"{a.StartTime}\"}}");
                    }
                    eventsJson = "[" + string.Join(",", apptStrings) + "]";
                }
            } catch { }

            return $"{{\"type\": \"UPDATE\", \"media\": {mediaJson}, \"events\": {eventsJson}}}";
        } catch {
            return $"{{\"type\": \"UPDATE\", \"media\": null, \"events\": []}}";
        }
    }
}
"@

Add-Type -TypeDefinition $code -Language CSharp -ReferencedAssemblies @("System.Runtime.WindowsRuntime", "C:\Windows\System32\WinMetadata\Windows.Foundation.winmd", "C:\Windows\System32\WinMetadata\Windows.Media.winmd", "C:\Windows\System32\WinMetadata\Windows.ApplicationModel.winmd")

Write-Output ([WinReader]::GetData())
