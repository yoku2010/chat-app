(function ($) {
    var socket = io(), $ol = $("#messages");
    socket.on("connect", function () {
        console.log("connected to server");
    });
    socket.on("disconnect", function () {
        console.log("disconnected from server");
    });
    socket.on("newMessage", function (message) {
        console.log("newMessage", message);
        var $li = $("<li></li>").text(`${message.from}: ${message.text}`);
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
})(jQuery);