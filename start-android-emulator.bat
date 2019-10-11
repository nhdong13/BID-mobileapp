@echo off

if not exist %ANDROID_HOME% goto :EVNotFound
if exist %ANDROID_HOME% goto :StartAndroid

:EVNotFound
echo You haven't set the ANDROID_HOME Environment Variable
echo To set your ANDROID_HOME PATH search "Edit environtment variables for your account" or "Edit system variables"
echo Go to Android Studio -^> 'SDK Manager' 
echo or 'Settings -^> 'Appearance ^& Behavior' -^> 'System Settings' -^> 'Android SDK'

exit /b 0

:StartAndroid
echo Initiating android devices...

cd %ANDROID_HOME%

emulator -avd Nexus_5X_API_28

pause