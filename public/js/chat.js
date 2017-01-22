(function ($, M) {
    var socket = io(), $ol = $("#messages");

    function scrollToBottom() {
        var $newMessage = $ol.children("li:last-child");
        var clientHeight = $ol.prop("clientHeight");
        var scrollTop = $ol.prop("scrollTop");
        var scrollHeight = $ol.prop("scrollHeight");
        var newMessageHeight = $newMessage.innerHeight();
        var lastMessageHeight = $newMessage.prev().innerHeight();

        if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
            $ol.scrollTop(scrollHeight);
        }
    }
    socket.on("connect", function () {
        var params = $.deparam(window.location.search);
        socket.emit("join", params, function (err) {
            if (err) {
                alert(err);
                window.location.href = "/";
            } else {
                console.log("No error");
            }
        });
    });
    socket.on("disconnect", function () {
        console.log("disconnected from server");
    });
    socket.on("updateUserList", function (users) {
        var $userList = $("<ol></ol>");
        users.forEach(function(user) {
            $userList.append($("<li></li>").text(user));
        });
        $("#users").empty().append($userList);
    });
    socket.on("newMessage", function (message) {
        var formattedTime = moment(message.createdAt).format("h:mm a");
        var template = $("#message_template").html();
        var html = M.render(template, {
            text: message.text,
            from: message.from,
            createdAt: formattedTime
        });
        $ol.append(html);
        scrollToBottom();
    });
    socket.on("newLocationMessage", function (message) {
        var formattedTime = moment(message.createdAt).format("h:mm a");
        var template = $("#location_message_template").html();
        var html = M.render(template, {
            url: message.url,
            from: message.from,
            createdAt: formattedTime
        });
        $ol.append(html);
        scrollToBottom();
    });

    var $form = $("#message_form").on("submit", function (e) {
        e.preventDefault();
        socket.emit("createMessage", {
            from: "User",
            text: $("#id_message").val()
        }, function (data) {
            $form[0].reset();
        });
    });

    var locationBtn = $("#send_location").on("click", function () {
        if(!navigator.geolocation) {
            return alert("Geolocation not supported by your browser.");
        }
        locationBtn.prop("disabled", true).text("Sending location...");
        navigator.geolocation.getCurrentPosition(function(position) {
            socket.emit("createLocationMessage", {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
            locationBtn.prop("disabled", false).text("Send location");
        }, function () {
            alert("Unable to fetch location.");
            locationBtn.prop("disabled", false).text("Send location");
        })
    });
})(jQuery, Mustache);