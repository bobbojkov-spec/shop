#!/bin/bash
# Kill all MySQL connections for the current user
mysql -u root -e "SELECT CONCAT('KILL ', id, ';') FROM information_schema.processlist WHERE user = 'root' AND id != CONNECTION_ID();" | grep KILL | mysql -u root


