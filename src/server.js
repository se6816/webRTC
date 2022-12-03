// import WebSocket from "ws"
import SocketIO from "socket.io"
import express from "express"
import http from "http"

const app=express();
app.set("view engine","pug");

app.set("views",__dirname+"/views");
app.use("/public",express.static(__dirname+"/public"));
app.get("/",(req, res)=>{
    res.render("home");
});

const server=http.createServer(app);
const io=SocketIO(server);            // {host}/socket.io/socket.io.js파일이 자동으로 생성됨
server.listen(4000,()=>{
    console.log("Start Server 3000!!");
});


function publicRooms(){
  const sids=io.sockets.adapter.sids;          // socket 모음
  const rooms=io.sockets.adapter.rooms;           // 방 모음
  const publicRooms=[];
  rooms.forEach((_,key)=>{
      if(sids.get(key)===undefined){
        publicRooms.push(key);
      }
  });
  return publicRooms;
}

function countClient(roomName){
  return io.sockets.adapter.rooms.get(roomName)?.size;
}

io.on("connection", (socket)=>{
    socket.emit("room_change",publicRooms());
    // socket.on의 매개변수
    // 첫번째는 이벤트 명
    // 두번쨰부터는 frontend로부터 받은 변수들, 여러개 받을 수 있음
    // 그리고 만약 socket 요청이 끝나면 어떠한 작업을 frontend에서 실행하고 싶다면
    // 마지막 매개변수에 frontend에서 io.emit()의 function을 집어넣어준다.
    // 서버에서 해당 function을 frontend에게 실행하라고 명령한다.
    // 또한 해당 function에 매개변수가 있다면 결과물같은 매개변수를 
    // 집어넣을 수 있다.  
     socket.on("enter",(roomName,nickname,done)=>{
        socket["nickname"]=nickname;
        socket.join(roomName);
        let count=countClient(roomName);
        done(roomName,count);
        socket.to(roomName).emit("welcome",socket.nickname,count);

        io.sockets.emit("room_change",publicRooms());
     });
     socket.on("disconnecting",()=>{
        socket.rooms.forEach(room => {
            socket.to(room).emit("bye",socket.nickname,countClient(room)-1);
        });
     });
     socket.on("disconnect",()=>{
      io.sockets.emit("room_change",publicRooms());
     });

     socket.on("message",(msg,roomName,done)=>{
         socket.to(roomName).emit("message",`${socket.nickname}: ${msg}`);
         done();
     });

     socket.on("nickname",(nickname,roomName,done)=>{
         let curNickName=socket.nickname;
         socket["nickname"]=nickname;
         socket.to(roomName).emit("message",curNickName+"님이"
                                  +socket.nickname+"으로 닉네임을 변경하였습니다." );
         done();
     });
});



/*
wss.on("connection",(socket)=>{                     // 자신에게 밖에 보내지 못함
    socket.on("close",()=>{
          console.log("Disconnected from Browser")
    });
    socket.on("message",(data)=>{
      socket.send(data.toString());
    });
    console.log("Connected from Browser");
});
*/

/*                                                  // ws를 이용한 websocket 통신
const wss= new WebSocket.Server({server});
const sockets=[];
wss.on("connection",(socket)=>{                     
  sockets.push(socket);
  socket["nickname"]="Anonymous"+guest_count;
  guest_count+=1;
  socket.on("close",()=>{
        console.log("Disconnected from Browser")
  });
  socket.on("message",(data)=>{
    let parsed=JSON.parse(data);
    switch(parsed.type){
      case "message":
        sockets.forEach((aSocket)=>{
          aSocket.send(socket.nickname+":"+parsed.payload);
        });
        break;
      case "nickname":
        let curNickName=socket.nickname;
        socket["nickname"]=parsed.payload;
        sockets.forEach((aSocket)=>{
          aSocket.send(curNickName+"님이 "+parsed.payload+"로 닉네임을 변경하셨습니다.");
        });
        break;
      default:

    }
    
  });
  console.log("Connected from Browser");
});
*/
