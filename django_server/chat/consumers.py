from django.conf import settings

from channels.generic.websocket import AsyncJsonWebsocketConsumer

from .exceptions import ClientError

class ChatConsumer(AsyncJsonWebsocketConsumer):
  
    async def connect(self):
        if 1 == 1:
            await self.accept()
        # Store which rooms the user has joined on this connection
        self.rooms = set()

    async def receive_json(self, content):
        print(content)
        command = content.get("command", None)
        try:
            if command == "join":
                await self.join_room(content["room"])
            elif command == "send":
                await self.send_room(content["room"], content["message"])
        except ClientError as e:
            await self.send_json({"error": e.code})

    async def disconnect(self, code):
       
        for room_id in list(self.rooms):
            try:
                await self.leave_room(room_id)
            except ClientError:
                pass


    async def join_room(self, room_id):
        print(room_id)
        """
        Called by receive_json when someone sent a join command.
        """

        print("JOIN SERVER");
        room_title= "hello";
        room_groupname = "group1";
        ro_id = 1;
        if settings.NOTIFY_USERS_ON_ENTER_OR_LEAVE_ROOMS:
            await self.channel_layer.group_send(
                room_groupname,
                {
                    "type": "chat.join",
                    "room_id": room_id,
                    "username": "TOMS",
                }
            )

        await self.channel_layer.group_add(
            room_groupname,
            self.channel_name,
        )
        await self.send_json({
            "join": str(ro_id),
            "title": room_title,
        })

    async def send_room(self, room_id, message):
 
        print("SENDER FUNCTION");
        room_title= "hello";
        room_groupname = "group1";
        ro_id = 1;
        await self.channel_layer.group_send(
            room_groupname,
            {
                "type": "chat.message",
                "room_id": room_id,
                "username": "Hello world",
                "message": message,
            }
        )

    ##### Handlers for messages sent over the channel layer

    # These helper methods are named by the types we send - so chat.join becomes chat_join
    async def chat_join(self, event):
        """
        Called when someone has joined our chat.
        """
        # Send a message down to the client
        await self.send_json(
            {
                "msg_type": settings.MSG_TYPE_ENTER,
                "room": event["room_id"],
                "username": event["username"],
            },
        )

    async def chat_leave(self, event):
        """
        Called when someone has left our chat.
        """
        # Send a message down to the client
        await self.send_json(
            {
                "msg_type": settings.MSG_TYPE_LEAVE,
                "room": event["room_id"],
                "username": event["username"],
            },
        )

    async def chat_message(self, event):
        """
        Called when someone has messaged our chat.
        """
        # Send a message down to the client
        await self.send_json(
            {
                "msg_type": settings.MSG_TYPE_MESSAGE,
                "room": event["room_id"],
                "username": event["username"],
                "message": event["message"],
            },
        )
