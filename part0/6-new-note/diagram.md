note over browser:
user saves a new note
browser creates new note (with date)
pushes it to notes list
redraws the list
and sends the new note to server
end note

browser->server: HTTP POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
server-->browser: {"message":"note created"}