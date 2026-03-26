[Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager, Windows.Media.Control, ContentType = WindowsRuntime] | Out-Null
$manager = [Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager]::RequestAsync().GetAwaiter().GetResult()
$session = $manager.GetCurrentSession()

if ($session -ne $null) {
    $mediaProperties = $session.TryGetMediaPropertiesAsync().GetAwaiter().GetResult()
    $status = $session.GetPlaybackInfo().PlaybackStatus
    $result = @{
        Title = $mediaProperties.Title
        Artist = $mediaProperties.Artist
        Album = $mediaProperties.AlbumTitle
        IsPlaying = ($status.ToString() -eq 'Playing')
    }
    $result | ConvertTo-Json -Compress
} else {
    Write-Output "{}"
}
