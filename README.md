## How to run the frontend side(Angular 4)

# Websocket PORT SETTING

- angualr_client/src/app.component.ts

  socket = new WebSocket(`${this.ws_scheme}:// ${<Your IP address>} : ${<PORT>}/chat/`);
  That is your server ip address and port number


  OR

  You have to run the frontend using the ip address: like this.  http://192.168.31.1:9999

  

 # Run
 
 `bash

 $npm install

 $npm start



 ## How to run the backend server

 # Requirement 

 - Django1.11
 	pip install django1.11
 - Channels 1.1.1,  asgi-redis1.1.0, asgiref 1.0.1
   pip install daphne==1.1.0 channels==1.1.1 asgi-redis==1.1.0 asgiref==1.0.1

# Environemnt install

- Install Python.

  https://www.python.org/downloads/

- Install the django packages.

  `bash

  $ cd django_backend

  $ pip install -r requirements.txt

- Database migration

  $ python manage.py migrate

# Run

  `bash

  $python manage.py runserver <Your IP>:8000



## Screen

