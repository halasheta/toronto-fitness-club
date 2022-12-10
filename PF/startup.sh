#!/bin/bash
cd fitness-club
npm install
cd ../PB
virtualenv venv
source venv/bin/activate
python3 -m pip install -r requirements.txt
python3 project/manage.py migrate

