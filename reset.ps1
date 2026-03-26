# Script de Limpieza y Reajuste - Dynamic Island
# Ejecuta este script si la aplicación se queda trabada o no se deja borrar.

Write-Host "--- Iniciando Limpieza Profunda ---" -ForegroundColor Cyan

# 1. Detener procesos por ruta y nombre
$targetPath = $PSScriptRoot
Write-Host "Buscando procesos en: $targetPath"
Get-CimInstance win32_process | Where-Object { $_.ExecutablePath -like "*$targetPath*" -or $_.Name -like "*dynamic-island-win*" } | ForEach-Object {
    Write-Host "Deteniendo proceso: $($_.Name) (ID: $($_.ProcessId))"
    Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
}

# 2. Forzar cierre de Electron genérico
taskkill /F /IM electron.exe /T 2>$null

# 3. Eliminar carpetas de construcción
Write-Host "Borrando carpetas de construcción..." -ForegroundColor Yellow
Remove-Item -Recurse -Force "$PSScriptRoot\dist" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$PSScriptRoot\dist-electron" -ErrorAction SilentlyContinue

Write-Host "--- Limpieza Completada ---" -ForegroundColor Green
Write-Host "Ahora puedes ejecutar 'npm run build' o borrar la carpeta del proyecto."
