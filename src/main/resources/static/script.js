var stompClient = null;

function showMessage(message) {
    $("#message-container-table").append(`<tr><td><b>${message.name} :</b> ${message.content}</td></tr>`)
}

function sendMessage() {
    let jsonObj = {
        name: localStorage.getItem("name"),
        content:$("#message").val()
    }
    stompClient.send("/app/message",{},JSON.stringify(jsonObj))
}

function connect() {

    let socket = new SockJS("/server")
    stompClient = Stomp.over(socket)
    stompClient.connect({}, function (frame) {
        console.log("connected : "+frame)
        $("#name-form").addClass('d-none')
        $("#chat-room").removeClass('d-none')

        //subscribe
        stompClient.subscribe("/topic/return-to", function (response) {

            showMessage(JSON.parse(response.body))
        })
    })
}



$(document).ready(e=> {

    $("#login").click(()=>{

        let name = $("#name").val();
        localStorage.setItem("name", name)

        connect();
    })

    $("#send").click(()=> {
        sendMessage()
    })

    $("#logOut").click(()=> {
        localStorage.removeItem("name")
        if(stompClient!==null) {
            stompClient.disconnect()
            $("#name-form").removeClass('d-none')
            $("#chat-room").addClass('d-none')
        }
    })
})

