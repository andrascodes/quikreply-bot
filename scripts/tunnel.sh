#!/bin/bash
SUBDOMAIN="qranalyticsbot"
while :; do 
   date
   ./node_modules/.bin/lt --port 3000 --subdomain $SUBDOMAIN
   sleep 30
done