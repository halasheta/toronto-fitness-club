#!/bin/sh

#Get current date
now=$(date +'%F'T'%T'Z)

#Use input token to curl request to charge endpoint
curl -H "Authorization: Bearer ${1}" http://localhost:8000/payments/charge/?date="${now}"
