virtualenv venv
source venv/bin/activate
python3.10 -m pip install -r requirements.txt
python3.10 project/manage.py migrate
