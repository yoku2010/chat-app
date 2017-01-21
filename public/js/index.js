(function ($, M) {
    var socket = io(), $ol = $("#messages");
    socket.on("connect", function () {
        console.log("connected to server");
    });
    socket.on("disconnect", function () {
        console.log("disconnected from server");
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