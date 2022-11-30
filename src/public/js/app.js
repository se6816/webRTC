const socket= new WebSocket(`ws://${window.location.host}`);
const ul=document.querySelector("ul");
const nickname_sendBtn=document.getElementById("nickName_sendBtn");
const msg_sendBtn=document.getElementById("msg_sendBtn");

function addMessage(data){
    let li=document.createElement("li");
    li.innerText=data;
    ul.append(li);
}
socket.addEventListener("open", ()=>{
    console.log("Connection!!");
});


socket.addEventListener("message",(message)=>{
    addMessage(message.data);
});

socket.addEventListener("close",()=>{
    console.log("disConnected from Server");
});

nickname_sendBtn.addEventListener("click",(event)=>{
    event.preventDefault();
    let nickname=document.querySelector("#nickname");
    let data={
        type : "nickname",
        payload : nickname.value
    };
    socket.send(JSON.stringify(data));
    nickname.value="";
});
msg_sendBtn.addEventListener("click",(event)=>{
    event.preventDefault();
    let msg=document.querySelector("#msg");
    let data={
        type : "message",
        payload : msg.value
    };
    socket.send(JSON.stringify(data));
    msg.value="";
});
