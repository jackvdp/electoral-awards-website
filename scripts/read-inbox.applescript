set maxEmails to 20

tell application "Microsoft Outlook"
	set allFolders to every mail folder
	set inboxFolder to missing value

	repeat with f in allFolders
		if name of f is "Inbox" then
			if (count of messages of f) > 0 then
				set inboxFolder to f
				exit repeat
			end if
		end if
	end repeat

	if inboxFolder is missing value then
		return "Could not find an Inbox with messages."
	end if

	set allMessages to messages of inboxFolder
	set totalMessages to count of allMessages
	set fetchCount to maxEmails
	if totalMessages < maxEmails then set fetchCount to totalMessages

	set output to "INBOX (" & totalMessages & " total) -- showing " & fetchCount & " most recent" & return & return

	repeat with i from 1 to fetchCount
		set msg to item i of allMessages

		set msgSubject to subject of msg
		set msgDate to time received of msg
		set msgRead to is read of msg

		set s to sender of msg
		set msgSenderName to name of s
		set msgSenderEmail to address of s

		set msgBody to plain text content of msg
		if length of msgBody > 200 then
			set msgPreview to (text 1 thru 200 of msgBody) & "..."
		else
			set msgPreview to msgBody
		end if

		if msgRead then
			set readFlag to "[READ]   "
		else
			set readFlag to "[UNREAD] "
		end if

		set output to output & readFlag & "[" & i & "] " & msgSubject & return
		set output to output & "  From:     " & msgSenderName & " <" & msgSenderEmail & ">" & return
		set output to output & "  Received: " & (msgDate as string) & return
		set output to output & "  Preview:  " & msgPreview & return
		set output to output & return
	end repeat

	return output
end tell
