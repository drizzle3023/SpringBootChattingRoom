
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');

var username = null;
var user_id = null;

var contextPath = "";

var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

$(document).ready(function () {

    connectingElement.classList.add('hidden');

    // Search Button Click event
    $("#search-button").on("click", function () {

        let searchType = $("#sel-searchtype").val();
        let content = $("#txt-searchcontent").val().trim();

        if (content) {

            $.ajax({
                url: contextPath + "/search",
                type: "POST",
                data: {
                    search_type: searchType,
                    content: content
                },
                error: function() {

                },
                success: function (data) {

                    if (data != null && data != undefined) {

                        messageArea.innerHTML = "";
                        var len = data.length;

                        if (len < 1) {
                            connectingElement.classList.remove('hidden');
                            connectingElement.textContent = 'No Search Result!';
                            connectingElement.style.color = 'red';
                        } else {
                            connectingElement.classList.add('hidden');
                            for (var i = 0; i < len; i++) {

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
                    } else {
                        connectingElement.classList.remove('hidden');
                        connectingElement.textContent = 'Error Occured While Searching!';
                        connectingElement.style.color = 'red';
                    }

                },
            });
        }

    });

});

function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }

    var index = Math.abs(hash % colors.length);
    return colors[index];
}