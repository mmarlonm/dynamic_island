$ErrorActionPreference = 'SilentlyContinue'

# Hash function for stable IDs
function Get-LinkHash($text) {
    if ([string]::IsNullOrEmpty($text)) { return "empty" }
    $md5 = [System.Security.Cryptography.MD5]::Create()
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($text)
    $hash = $md5.ComputeHash($bytes)
    return [System.BitConverter]::ToString($hash).Replace("-", "").ToLower()
}

# WinRT Appointment Bridge
function Get-Appointments {
    try {
        [void][Windows.ApplicationModel.Appointments.AppointmentManager, Windows.ApplicationModel.Appointments, ContentType = WindowsRuntime]
        
        # Async operation to get the store
        $asOp = [Windows.ApplicationModel.Appointments.AppointmentManager]::RequestStoreAsync([Windows.ApplicationModel.Appointments.AppointmentStoreAccessType]::AllCalendarsReadOnly)
        $asInfo = [Windows.Foundation.IAsyncInfo]$asOp
        while($asInfo.Status -eq 'Started') { [System.Threading.Thread]::Sleep(100) }
        $store = $asOp.GetResults()
        
        if (-not $store) { return @() }

        $now = [DateTimeOffset]::Now
        $startOfDay = $now.Date
        $endOfDay = $startOfDay.AddDays(1)

        # Async operation to find appointments
        $findOp = $store.FindAppointmentsAsync($startOfDay, ($endOfDay - $startOfDay))
        $findInfo = [Windows.Foundation.IAsyncInfo]$findOp
        while($findInfo.Status -eq 'Started') { [System.Threading.Thread]::Sleep(100) }
        $appointments = $findOp.GetResults()

        return $appointments
    } catch {
        return @()
    }
}

while ($true) {
    $apps = Get-Appointments
    
    if ($apps -and $apps.Count -gt 0) {
        foreach ($a in $apps) {
            $title = $a.Subject
            $start = $a.StartTime.ToString("HH:mm")
            $end = ($a.StartTime + $a.Duration).ToString("HH:mm")
            $loc = $a.Location
            $id = Get-LinkHash ("$title|$start|$end")
            
            # Icon type: Teams/Zoom keywords in title or location
            $type = "calendar"
            if ($title -match "Teams|Meeting|Reunión|Zoom|Google Meet" -or $loc -match "Teams|Zoom") {
                $type = "video"
            }

            Write-Host "__EVENT__$title|||$start|||$end|||$loc|||$type|||$id"
        }
    } else {
        # Fallback empty check (optional debug)
        # Write-Host "__DEBUG__ No events found"
    }

    # Poll every 5 minutes
    Start-Sleep -Seconds 300
}
