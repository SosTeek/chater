const chatForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get userName and room from url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,

})
// console.log(username, room);
const socket = io();

//Join chatroom
socket.emit('joinroom', {username, room});

// Get rom and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

//Message from server
socket.on('message', (message)=> {
  console.log(message);
  outputMessage(message);

  //Scroll down
  chatMessage.scrollTop = chatMessage.scrollHeight;
})

// Message submit
chatForm.addEventListener('submit', (e)=> {
  e.preventDefault();

  //Get message text
  const msg = e.target.elements.msg.value;
  
  //Emit message to server
  socket.emit('chatMessage', msg);

  // Clear Input field
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
})

// Output message to DOM

function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`
  document.querySelector('.chat-messages').appendChild(div);
}

//Add roomname to dom
function outputRoomName(room){
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}
