#!/bin/bash
SUBDOMAIN="qranalyticsbot"
while :; do 
   date
   ./node_modules/.bin/lt --port 8445 --subdomain $SUBDOMAIN
   sleep 30
done