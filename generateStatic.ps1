Write-Host "Start generation fo static resources"

npm run build

Remove-Item .\assets\bundles\static\css\fonts\ -Recurse -Confirm:$false  
 
Remove-Item .\assets\bundles\static\css\media\  -Recurse  -Confirm:$false

Move-Item .\assets\bundles\fonts   .\assets\bundles\static\css\
Move-Item .\assets\bundles\media   .\assets\bundles\static\css\

ECHO yes | python.exe .\manage.py collectstatic  


Write-Host "End generation fo static resources"
