a = require("../index")
function go() {
    a.connect("Testbot","blue","=","A")
    a.onconnect = function(socket) {
        console.log("Connected!")
        a.setcommand("a",function(data, socket) {
            socket.send("AH")
            console.log(data)
        })
        a.onuserjoined(function(data) {
            console.log(data)
        })
        a.onuserleft(function(data) {
            console.log(data)
        })
        setTimeout(() => {
            console.log("updating color")
            a.updatecolor("White")
        }, 5000);
        setTimeout(() => {
            a.updatename("test2")
        }, 15000);
    }
}
go()
