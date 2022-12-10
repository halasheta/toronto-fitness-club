#!/bin/bash
cd fitness-club
(npm start &)
python3 ../PB/project/manage.py runserver
