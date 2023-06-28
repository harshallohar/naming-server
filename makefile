prod:
	pm2 start index.mjs --name renaming_service

create-zip:
	zip -r ~/sq.zip * -x *.csv  -x *.csv -x "thunder-tests/*" -x *.json
