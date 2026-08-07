-- IsaacNet Uninstaller
-- Password: Isaac + macOS admin elevation

on run
	-- Step 1: Ask for IsaacNet password
	try
		tell application "System Events"
			set dialogResult to display dialog "Enter password to uninstall IsaacNet:" & return & return default answer "" with hidden answer buttons {"Cancel", "Uninstall"} default button "Uninstall" with title "IsaacNet Uninstaller"
			set userInput to text returned of dialogResult
		end tell
	on error number -128
		return
	end try
	
	if userInput is not "Isaac" then
		display dialog "Incorrect password. Uninstall aborted." with title "IsaacNet" buttons {"OK"} default button "OK" with icon stop
		return
	end if
	
	-- Step 2: Run removal with admin privileges
	try
		do shell script "
/usr/sbin/chflags -R nouchg '/Applications/IsaacNet.app' '/Applications/IsaacNet' '/Applications/Uninstall IsaacNet.app' 2>/dev/null
/bin/rm -rf '/Applications/IsaacNet.app' '/Applications/IsaacNet' '/Applications/Uninstall IsaacNet.app' 2>/dev/null
/usr/sbin/networksetup -setwebproxystate 'Wi-Fi' off 2>/dev/null
/usr/sbin/networksetup -setsecurewebproxystate 'Wi-Fi' off 2>/dev/null
" with administrator privileges
		display dialog "IsaacNet has been completely uninstalled." with title "IsaacNet" buttons {"OK"} default button "OK"
	on error errMsg
		display dialog "Uninstall failed: " & errMsg with title "IsaacNet" buttons {"OK"} default button "OK" with icon stop
	end try
end run
