Unregister-ScheduledTask -TaskName "ToolHeroDashboardRefresh" -Confirm:$false -ErrorAction SilentlyContinue
$action = New-ScheduledTaskAction -Execute "F:\money-site\scripts\auto-refresh.bat"
$trigger = New-ScheduledTaskTrigger -Daily -At "18:17"
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERNAME" -RunLevel Highest
Register-ScheduledTask -TaskName "ToolHeroDashboardRefresh" -Action $action -Trigger $trigger -Principal $principal -Force
Write-Host "Done - daily refresh at 6:17 PM"
