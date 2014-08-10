
var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(3000);

var clients = {};
var numUsers = 1;

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.sockets.on('connection', function (socket) {

  socket.on('add-user', function(data){
    numUsers++;
    clients[data.username] = {
      "socket": socket.id
    };
     console.log("No of Users : " + numUsers);
socket.emit("login",{noUsers: numUsers});
  });

  socket.on('private-message', function(data){
    console.log("Sending: " + data.content + " to " + data.username);
   
      var cd;
      for(var name in clients)
      {
        if(clients[name].socket != socket.id)
        {
        cd=clients[name].socket;
        data.paddle=clients[name].paddle;
        break;
      }
      }
      io.sockets.connected[cd].emit("add-message", data);
     //   socket.emit('paddle-collect',data);
   
  });





  //Removing the socket on disconnect
  socket.on('disconnect', function() {
  	for(var name in clients) {
  		if(clients[name].socket === socket.id) {
  			delete clients[name];
  			break;
  		}
  	}	
  })

});



