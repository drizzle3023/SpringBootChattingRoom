'use strict';

var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var userlistArea = document.querySelector('#userlistArea');
var connectingElement = document.querySelector('.connecting');

var stompClient = null;
var username = null;
var user_id = null;

var contextPath = "";

var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

$(document).ready(function () {

    // Connect to WebSocket Server.
    connect();

    contextPath = $("#contextPath").val();
    getActiveUsers();
    getLastMessages();
});

function getActiveUsers() {

    $.ajax({
        url: contextPath + "/getActiveUsers",
        type: "POST",
        error: function() {

        },
        success: function (data) {

            if (data != null && data != undefined) {

                userlistArea.innerHTML = "";
                var len = data.length;
                for (var i = 0; i < len; i ++) {

                    // Add to UserList
                    var userElement = document.createElement('li');
                    userElement.classList.add('userlist-user');
                    var avatarElement = document.createElement('i');
                    var avatarText = document.createTextNode(data[i].name[0]);
                    avatarElement.appendChild(avatarText);
                    avatarElement.style['background-color'] = getAvatarColor(data[i].name);

                    userElement.appendChild(avatarElement);

                    var usernameElement = document.createElement('span');
                    var usernameText = document.createTextNode(data[i].name);
                    usernameElement.appendChild(usernameText);
                    userElement.appendChild(usernameElement);

                    userlistArea.appendChild(userElement);

                }
                userlistArea.scrollTop = userlistArea.scrollHeight;
            }

        },
    });
}

function getLastMessages() {


    $.ajax({
        url: contextPath + "/getLastMessages",
        type: "POST",
        error: function() {

        },
        success: function (data) {

            if (data != null && data != undefined) {

                var len = data.length;
                for (var i = len - 1; i >= 0; i --) {

                    // Add to MessageArea
                    let messageElement = document.createElement('li');
                    messageElement.classList.add('chat-message');

                    let avatarElement = document.createElement('i');
                    let avatarText = document.createTextNode(data[i].user_name[0]);
                    avatarElement.appendChild(avatarText);
                    avatarElement.style['background-color'] = getAvatarColor(data[i].user_name);

                    messageElement.appendChild(avatarElement);

                    let usernameElement = document.createElement('span');
                    let usernameText = document.createTextNode(data[i].user_name);
                    usernameElement.appendChild(usernameText);
                    messageElement.appendChild(usernameElement);

                    let textElement = document.createElement('p');
                    let messageText = document.createTextNode(data[i].content);
                    textElement.appendChild(messageText);

                    messageElement.appendChild(textElement);

                    messageArea.appendChild(messageElement);

                }
                messageArea.scrollTop = messageArea.scrollHeight;
            }

        },
    });

}

function connect() {
    username = document.querySelector('#username').innerText.trim();
    user_id = document.querySelector('#user_id').value.trim();

    var socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, onConnected, onError);

}

function onConnected() {
    // Subscribe to the Public Topic
    stompClient.subscribe('/topic/public', onMessageReceived);

    // Tell your username, user_id to the server
    stompClient.send("/app/chat.addUser",
        {},
        JSON.stringify({sender: username, sender_id: user_id,type: 'JOIN'})
    )

    connectingElement.classList.add('hidden');
}


function onError(error) {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingElement.style.color = 'red';
}


function sendMessage(event) {
    var messageContent = messageInput.value.trim();

    if(messageContent && stompClient) {
        var chatMessage = {
            sender: username,
            sender_id: user_id,
            content: messageInput.value,
            type: 'CHAT'
        };

        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}


function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);

    var messageElement = document.createElement('li');

    if(message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' joined!';

        // Add to UserList
        getActiveUsers();

    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' left!';

        getActiveUsers();

    } else {
        messageElement.classList.add('chat-message');

        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);

        messageElement.appendChild(avatarElement);

        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);
    }

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}


function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }

    var index = Math.abs(hash % colors.length);
    return colors[index];
}

//usernameForm.addEventListener('submit', connect, true)
messageForm.addEventListener('submit', sendMessage, true)
