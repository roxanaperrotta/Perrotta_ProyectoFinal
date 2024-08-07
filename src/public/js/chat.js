const socket = io();
const chatBox = document.getElementById('chatBox');

let user;

 Swal.fire({
    title:"Bienvenido",
    input:"text",
    text:"Ingresá un usuario para identificarte",
    inputValidator:(value)=>{
        return !value && "Identificate para continuar"
    },
    allowOutsideClick: false
 }).then(result=>{
    user = result.value
 });



chatBox.addEventListener ('keyup', async (event) =>{
    if (event.key === "Enter") {
       if (chatBox.value.trim().length >0){
        await socket.emit ("message", {user:user, message:chatBox.value}) ;
        chatBox.value='';
    }
}});

socket.on('messageLogs', data => {
    let log = document.getElementById('messageLogs')
    let messages = ''

    data.forEach(message => {
        messages = messages + `${message.user} dice: ${message.message} </br>`
    })

    log.innerHTML = messages
})

