require('./bootstrap');

import Echo from "laravel-echo"

window.io = require('socket.io-client');


window.Echo = new Echo({
    broadcaster: 'socket.io',
    host: window.location.hostname + ':6001'
});

let onlineUsersLength = 0;

window.Echo.join(`online`)
    .here((users) => { // when the user make login

        onlineUsersLength = users.length;

        if(users.length > 1) {
            $('#no-online-users').css('display', 'none');
        }

        let userId = $('meta[name = user-id]').attr('content');
        console.log(userId);

        users.forEach(function(user){
            if (user.id == userId) {
                return;
            }
            $('#online-users').append(` <li id="user-${user.id}" class="list-group-item">
                    <i class="fa fa-circle text-success"></i> ${ user.name }  
                </li>`);
        })
    })
    .joining((user) => { // when the user join on the chat
        onlineUsersLength++;
        $('#no-online-users').css('display', 'none');
        $('#online-users').append(` <li id="user-${user.id}" class="list-group-item"> <i class="fa fa-circle text-success"></i> ${ user.name } </li>`);
    })
    .leaving((user) => { // when the user leave the chat
        onlineUsersLength--;

        if(onlineUsersLength == 1) {
            $('#no-online-users').css('display', 'block');
        }
        $('#user-' + user.id).remove();
    });

// get the message body and send to store in the database with ajax request
$('#chat-text').keypress(function(e){
    if (e.which == 13) {
        e.preventDefault();
        let body = $(this).val();
        let url = $(this).data('url');

        $(this).val('');
        let userName = $('meta[name = user-name]').attr('content');

        $('#chat').append(`<div class="mt-4 w-50 text-white p-3 rounded float-right bg-primary">
                            <span> ${ userName } </span>
                            <p> ${ body } </p>
                        </div>
                        <div class="clearfix"></div>`
        );

        let data = {
            '_token': $('meta[name = csrf-token]').attr('content'),
            body // equals body: body
        };

        $.ajax({
            url: url,
            method: 'post',
            data: data,
            success: function () {
            }
        });
    }
});

// when the user send the message the others should see it
window.Echo.channel('chat-group')
    .listen('MessageDelivered', (e) => {
        $('#chat').append(`<div class="mt-4 w-50 text-white p-3 rounded float-left bg-warning">
                            <span> ${ e.message.user.name } </span>
                            <p> ${ e.message.body } </p> 
                        </div>
                        <div class="clearfix"></div>`);
    });
