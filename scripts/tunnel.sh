#!/bin/bash
while :; do 
   date
   ./node_modules/.bin/lt --port $SERVER_PORT --subdomain $TUNNEL_SUBDOMAIN
   sleep 30
done