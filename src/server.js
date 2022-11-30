// import WebSocket from "ws"
import SocketIO from "socket.io"
import express from "express"
import http from "http"

const app=express();
var guest_count=1;
app.set("view engine","pug");

app.set("views",__dirname+"/views");
app.use("/public",express.static(__dirname+"/public"));
app.get("/",(req, res)=>{
    res.render("home");
});


const server=http.createServer(app);
const io=SocketIO(server);
server.listen(4000,()=>{
    console.log("Start Server 3000!!");
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
