const socket=io();
const welcome=document.getElementById("welcome");
const enterRoomBtn=document.getElementById("enter");

const room=document.getElementById("room");

let curRoomName;
room.hidden=true;
function addMessage(msg){
    let ul=room.querySelector("ul");
    let li=document.createElement("li");
    li.innerText=msg;
    ul.appendChild(li);

}
function changeTitle(newCount){
    const h3=room.querySelector("h3");
    h3.innerText=`Room: ${curRoomName} (${newCount})`;
}
function showRoom(roomName,newCount){
    welcome.hidden=true;
    room.hidden=false;
    curRoomName=roomName;
    changeTitle(newCount);

    const sendBtn=document.getElementById("sendBtn");
    const nicknameBtn=document.getElementById("nicknameBtn");
    sendBtn.addEventListener("click", (e)=>{
        e.preventDefault();
        let msg=document.getElementById("msg");
        let value=msg.value;
        socket.emit("message",msg.value,curRoomName,()=>{
            addMessage(`You : ${value}`);
        });
        msg.value="";
        
    
    });
    
    nicknameBtn.addEventListener("click",(e)=>{
        e.preventDefault();
        let nickname=document.getElementById("nickname");
        socket.emit("nickname",nickname.value,curRoomName,()=>{
             addMessage("닉네임이 성공적으로 변경되었습니다.");
        });
        nickname.value="";
    
    });

}

socket.on("welcome",(nickname, newCount)=>{
    addMessage(`${nickname}  Joined!!`);
    changeTitle(newCount);
    

});
socket.on("bye",(nickname, newCount)=>{
    addMessage(`${nickname}  left!!`);
    changeTitle(newCount);

});
socket.on("message", (msg)=>{
    addMessage(msg);
});
socket.on("room_change",(rooms)=>{
    const roomList=welcome.querySelector("ul");
    roomList.innerHTML="";
    rooms.forEach(room => {
        let li=document.createElement("li");
        li.innerText=room;
        roomList.appendChild(li);
    });
});
enterRoomBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    let input=document.getElementById("roomName");
    let nickname=prompt("닉네임을 입력해주세요");
    if(nickname===null || nickname.trim()===""){
        alert("닉네임을 입력해주세요");
        return;

    }
    // socket.emit의 매개변수
    // 첫번째는 event명
    // 두번째부터는 넣고싶은 만큼 파라미터를 넣을 수 있다.
    // 만약 서버에서 작업이 끝나면 그 결과물을 받고 싶다거나
    // 어떠한 작업을 받고 싶다면 마지막 매개변수에 function을 추가한다. 
    socket.emit("enter",input.value,nickname,showRoom);
    input.value="";

    
});

