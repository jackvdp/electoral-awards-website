-- CSV Email Sender (responsive rewrite)
--
-- Fixes over the original:
--   * CSV parsing handed to python3 (instant, handles quoted fields properly)
--     instead of character-by-character AppleScript loops
--   * Template imported into Outlook once per run, not once per email
--   * Outlook "tell" blocks kept tight; all dialogs and string work outside them
--   * Confirmation dialog shows a summary, not every record
--   * Per-email delay cut from 30s to 2s, with a progress bar during sends
--   * "activate" before dialogs so they are frontmost and get clicks immediately
--   * choose file starts in Documents (avoids stalls enumerating Dropbox-synced Desktop)
--
-- Save as an app from Script Editor: File > Export… > File Format: Application.
-- Requires Microsoft Outlook and /usr/bin/python3.

property templateFile : missing value
property csvFile : missing value
property attachmentsFolder : ""
property myPid : 0

on run
	set myPid to (do shell script "echo $PPID") as integer
	repeat
		my bringToFront()
		set statusInfo to "CSV Email Sender" & return & return & ¬
			"Headers wrapped in {{ }} are replaced in the email." & return & ¬
			"One header must contain 'email'; an optional one may contain 'attachments'." & return & ¬
			"Multiple recipients per row: separate with comma, semicolon, space or new line." & return & return & ¬
			"Template: " & my displayName(templateFile) & return & ¬
			"CSV: " & my displayName(csvFile) & return & ¬
			"Attachments: " & my displayFolderName(attachmentsFolder)
		set mainChoice to button returned of (display dialog statusInfo buttons {"Setup Files", "Send Emails", "Quit"} default button "Setup Files" with icon note)
		if mainChoice is "Setup Files" then
			my showFileSetup()
		else if mainChoice is "Send Emails" then
			if templateFile is missing value or csvFile is missing value then
				display dialog "Select a template and a CSV first." buttons {"OK"} default button "OK" with icon stop
			else
				my showSendMenu()
			end if
		else
			exit repeat
		end if
	end repeat
end run

on showFileSetup()
	repeat
		my bringToFront()
		set setupText to "File setup" & return & return & ¬
			"Template: " & my displayName(templateFile) & return & ¬
			"CSV: " & my displayName(csvFile) & return & ¬
			"Attachments: " & my displayFolderName(attachmentsFolder)
		set choice to button returned of (display dialog setupText buttons {"Select Template", "Select CSV", "More…"} default button "Select Template" with icon note)
		if choice is "Select Template" then
			try
				set templateFile to choose file with prompt "Select your email template:" of type {"eml", "emltpl"} default location (path to documents folder)
			end try
		else if choice is "Select CSV" then
			try
				set csvFile to choose file with prompt "Select your CSV file:" of type {"csv"} default location (path to documents folder)
			end try
		else
			set choice2 to button returned of (display dialog setupText buttons {"Select Attachments Folder", "Back to Main Menu"} default button "Back to Main Menu" with icon note)
			if choice2 is "Select Attachments Folder" then
				try
					set attachmentsFolder to (choose folder with prompt "Select folder containing attachment files:" default location (path to documents folder)) as string
				end try
			else
				exit repeat
			end if
		end if
	end repeat
end showFileSetup

on showSendMenu()
	my bringToFront()
	set menuText to "Ready to send" & return & return & ¬
		"Template: " & my displayName(templateFile) & return & ¬
		"CSV: " & my displayName(csvFile) & return & ¬
		"Attachments: " & my displayFolderName(attachmentsFolder)
	set choice to button returned of (display dialog menuText buttons {"Test Email", "Send All", "Back"} default button "Test Email" with icon note)
	if choice is "Test Email" then
		my doTestEmail()
	else if choice is "Send All" then
		my doBulkSend()
	end if
end showSendMenu

on doTestEmail()
	my bringToFront()
	set testAddress to ""
	try
		set testAddress to text returned of (display dialog "Send the first CSV row as a test." & return & "Enter the test email address:" default answer "" buttons {"Cancel", "Send Test"} default button "Send Test")
	on error number -128
		return
	end try
	if testAddress is "" then return
	set parsed to my loadCSVData()
	if parsed is missing value then return
	set {headerList, dataRows, emailIndex, attachmentsIndex} to parsed
	try
		set tpl to my loadTemplate()
		my sendOneEmail(headerList, item 1 of dataRows, testAddress, tpl, true, attachmentsIndex)
		display dialog "Test email sent to " & testAddress buttons {"OK"} default button "OK" with icon note
	on error errMsg
		display dialog "Test email failed: " & errMsg buttons {"OK"} default button "OK" with icon stop
	end try
end doTestEmail

on doBulkSend()
	set parsed to my loadCSVData()
	if parsed is missing value then return
	set {headerList, dataRows, emailIndex, attachmentsIndex} to parsed
	
	set totalEmailCount to 0
	repeat with rowFields in dataRows
		if emailIndex ≤ (count of rowFields) then
			set totalEmailCount to totalEmailCount + (count of my parseEmailAddresses(item emailIndex of rowFields))
		end if
	end repeat
	
	set summaryText to "Ready to send." & return & return & ¬
		"Rows: " & (count of dataRows) & return & ¬
		"Recipients: " & totalEmailCount & return & ¬
		"Template: " & my displayName(templateFile)
	if attachmentsFolder is not "" then
		set summaryText to summaryText & return & "Attachments folder: " & my displayFolderName(attachmentsFolder)
	end if
	my bringToFront()
	try
		display dialog summaryText & return & return & "Proceed?" buttons {"Cancel", "Send Emails"} default button "Send Emails" with icon note
	on error number -128
		return
	end try
	
	try
		set tpl to my loadTemplate()
	on error errMsg
		display dialog "Could not load the template: " & errMsg buttons {"OK"} default button "OK" with icon stop
		return
	end try
	
	set progress description to "Sending emails"
	set progress total steps to totalEmailCount
	set progress completed steps to 0
	set sentCount to 0
	set errorCount to 0
	repeat with rowFields in dataRows
		if emailIndex ≤ (count of rowFields) then
			set recipientList to my parseEmailAddresses(item emailIndex of rowFields)
			repeat with recipientEmail in recipientList
				try
					my sendOneEmail(headerList, rowFields, (recipientEmail as string), tpl, false, attachmentsIndex)
					set sentCount to sentCount + 1
				on error
					set errorCount to errorCount + 1
				end try
				set progress completed steps to sentCount + errorCount
				set progress additional description to ((sentCount + errorCount) as string) & " of " & totalEmailCount
				delay 2
			end repeat
		end if
	end repeat
	set progress total steps to 0
	set progress description to ""
	set progress additional description to ""
	
	my bringToFront()
	display dialog "Bulk send completed." & return & return & "Sent: " & sentCount & return & "Errors: " & errorCount buttons {"OK"} default button "OK" with icon note
end doBulkSend

-- Parse the whole CSV in one shot via python3; returns {headers, dataRows, emailIndex, attachmentsIndex}
on loadCSVData()
	set pySrc to "import csv,sys; rows=[r for r in csv.reader(open(sys.argv[1],newline='',encoding='utf-8-sig')) if any(f.strip() for f in r)]; sys.stdout.write(chr(30).join(chr(31).join(r) for r in rows))"
	set rawOut to ""
	try
		set rawOut to do shell script "/usr/bin/python3 -c " & quoted form of pySrc & " " & quoted form of POSIX path of csvFile
	on error errMsg
		display dialog "Could not read the CSV: " & errMsg buttons {"OK"} default button "OK" with icon stop
		return missing value
	end try
	if rawOut is "" then
		display dialog "The CSV appears to be empty." buttons {"OK"} default button "OK" with icon stop
		return missing value
	end if
	
	set AppleScript's text item delimiters to character id 30
	set rawRows to text items of rawOut
	set AppleScript's text item delimiters to character id 31
	set allRows to {}
	repeat with r in rawRows
		set end of allRows to text items of (r as string)
	end repeat
	set AppleScript's text item delimiters to ""
	
	if (count of allRows) < 2 then
		display dialog "Need at least a header row plus one data row." buttons {"OK"} default button "OK" with icon stop
		return missing value
	end if
	
	set headerList to item 1 of allRows
	set emailIndex to 0
	set attachmentsIndex to 0
	repeat with i from 1 to count of headerList
		set h to item i of headerList
		if h contains "email" then set emailIndex to i
		if h contains "attachment" then set attachmentsIndex to i
	end repeat
	if emailIndex is 0 then
		display dialog "No email column found — one CSV header must contain 'email'." buttons {"OK"} default button "OK" with icon stop
		return missing value
	end if
	return {headerList, rest of allRows, emailIndex, attachmentsIndex}
end loadCSVData

-- Import the template into Outlook once; returns {subject, content, attachmentPaths}
on loadTemplate()
	set extractFolder to attachmentsFolder
	if extractFolder is "" then set extractFolder to (path to temporary items) as string
	set tplAttachmentPaths to {}
	tell application "Microsoft Outlook"
		set importedMessage to import eml templateFile
		set tplContent to content of importedMessage
		set tplSubject to subject of importedMessage
		repeat with a in attachments of importedMessage
			try
				set extractPath to extractFolder & (name of a)
				save a in file extractPath
				set end of tplAttachmentPaths to extractPath
			end try
		end repeat
		delete importedMessage
	end tell
	return {tplSubject, tplContent, tplAttachmentPaths}
end loadTemplate

on sendOneEmail(headerList, rowFields, recipientEmail, tpl, isTest, attachmentsIndex)
	set {tplSubject, tplContent, tplAttachmentPaths} to tpl
	set msgSubject to tplSubject
	set msgContent to tplContent
	
	-- Replace every {{token}} (the header text itself) with the row's value
	repeat with i from 1 to count of headerList
		if i ≤ (count of rowFields) then
			set tokenName to item i of headerList
			set tokenValue to item i of rowFields
			set msgContent to my replaceText(msgContent, tokenName, tokenValue)
			set msgSubject to my replaceText(msgSubject, tokenName, tokenValue)
		end if
	end repeat
	if isTest then set msgSubject to "[TEST] " & msgSubject
	
	-- Resolve any CSV-specified attachment path before talking to Outlook
	set csvAttachmentPath to ""
	if attachmentsIndex > 0 and attachmentsIndex ≤ (count of rowFields) and attachmentsFolder is not "" then
		set attachmentFileName to my trimWhitespace(item attachmentsIndex of rowFields)
		if attachmentFileName is not "" then set csvAttachmentPath to attachmentsFolder & attachmentFileName
	end if
	
	tell application "Microsoft Outlook"
		set newEmail to make new outgoing message with properties {subject:msgSubject, content:msgContent}
		make new recipient at newEmail with properties {email address:{address:recipientEmail}}
		repeat with p in tplAttachmentPaths
			try
				make new attachment at newEmail with properties {file:(p as string) as alias}
			end try
		end repeat
		if csvAttachmentPath is not "" then
			try
				make new attachment at newEmail with properties {file:csvAttachmentPath as alias}
			end try
		end if
		send newEmail
	end tell
end sendOneEmail

on parseEmailAddresses(emailString)
	set s to my replaceText(emailString, ";", ",")
	set s to my replaceText(s, return, ",")
	set s to my replaceText(s, linefeed, ",")
	set s to my replaceText(s, " ", ",")
	set emailAddresses to {}
	set AppleScript's text item delimiters to ","
	set rawEmails to text items of s
	set AppleScript's text item delimiters to ""
	repeat with rawEmail in rawEmails
		set cleanEmail to rawEmail as string
		if cleanEmail is not "" and cleanEmail contains "@" then set end of emailAddresses to cleanEmail
	end repeat
	return emailAddresses
end parseEmailAddresses

on replaceText(sourceText, findText, replaceWith)
	set AppleScript's text item delimiters to findText
	set parts to text items of sourceText
	set AppleScript's text item delimiters to replaceWith
	set resultText to parts as string
	set AppleScript's text item delimiters to ""
	return resultText
end replaceText

on trimWhitespace(str)
	set trimmedStr to str
	repeat while length of trimmedStr > 0 and (character 1 of trimmedStr is " " or character 1 of trimmedStr is tab)
		set trimmedStr to text 2 thru -1 of trimmedStr
	end repeat
	repeat while length of trimmedStr > 0 and (character -1 of trimmedStr is " " or character -1 of trimmedStr is tab)
		set trimmedStr to text 1 thru -2 of trimmedStr
	end repeat
	return trimmedStr
end trimWhitespace

-- Since macOS Sonoma an app cannot reliably activate itself between dialogs
-- (cooperative activation), which leaves the next dialog backgrounded and the
-- app looking frozen until the user switches away and back. System Events can
-- still force the process frontmost.
on bringToFront()
	try
		tell application "System Events" to set frontmost of (first application process whose unix id is myPid) to true
	on error
		activate
	end try
end bringToFront

on displayName(f)
	if f is missing value or f is "" then return "None selected"
	try
		set AppleScript's text item delimiters to ":"
		set n to last text item of (f as string)
		set AppleScript's text item delimiters to ""
		return n
	on error
		set AppleScript's text item delimiters to ""
		return "Selected"
	end try
end displayName

on displayFolderName(f)
	if f is missing value or f is "" then return "None selected"
	try
		set AppleScript's text item delimiters to ":"
		set n to text item -2 of (f as string)
		set AppleScript's text item delimiters to ""
		return n
	on error
		set AppleScript's text item delimiters to ""
		return "Selected"
	end try
end displayFolderName


