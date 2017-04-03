#!/bin/bash
SUBDOMAIN="qranalyticsbot"
while :; do 
   date
   ./node_modules/.bin/lt --port $SERVER_PORT --subdomain $SUBDOMAIN
   sleep 30
done