@echo off
echo ========================================
echo  FIXING FIREWALL FOR MOBILE ACCESS
echo ========================================
echo.
echo This will allow ports 3000 and 5000 through Windows Firewall
echo.
pause

echo.
echo Adding firewall rule for Frontend (Port 3000)...
netsh advfirewall firewall add rule name="Smart Tourist Frontend" dir=in action=allow protocol=TCP localport=3000

echo.
echo Adding firewall rule for Backend (Port 5000)...
netsh advfirewall firewall add rule name="Smart Tourist Backend" dir=in action=allow protocol=TCP localport=5000

echo.
echo ========================================
echo  FIREWALL RULES ADDED!
echo ========================================
echo.
echo Now try accessing from mobile:
echo   http://10.90.37.71:3000
echo.
echo Make sure your mobile is on the SAME WiFi!
echo.
pause
