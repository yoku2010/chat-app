(function ($) {
    var socket = io(), $ol = $("#messages");
    socket.on("connect", function () {
        console.log("connected to server");
    });
    socket.on("disconnect", function () {
        console.log("disconnected from server");
    });
    socket.on("newMessage", function (message) {
        var $li = $("<li></li>").text(`${message.from}: ${message.text}`);
        $li.appendTo($ol);
    });
    socket.on("newLocationMessage", function (message) {
        var $li = $("<li></li>").text(`${message.from}: `),
            $a = $("<a></a>").text("My Current Location").attr({
                target: "_blank",
                href: message.url
            });
        $li.append($a);
        $li.appendTo($ol);
    });

    var $form = $("#message_form").on("submit", function (e) {
        e.preventDefault();
        socket.emit("createMessage", {
            from: "Yogesh",
            text: $("#id_message").val()
        }, function (data) {
            console.log("got it", data);
        });
        $form[0].reset();
    });

    var locationBtn = $("#send_location").on("click", function () {
        if(!navigator.geolocation) {
            return alert("Geolocation not supported by your browser.");
        }
        navigator.geolocation.getCurrentPosition(function(position) {
            socket.emit("createLocationMessage", {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        }, function () {
            alert("Unable to fetch location.");
        })
    });
})(jQuery);