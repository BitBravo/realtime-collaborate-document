## How to run the frontend side(Angular 4)

# Websocket PORT SETTING

- angualr_client/src/app.component.ts

  socket = new WebSocket(this.ws_scheme + '://<Your IP address>:<PORT>/chat/');

  That is your server ip address and port number

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
