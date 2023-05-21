const socket =io()
const messageForm = document.querySelector('#message-form')
const sendButton = document.querySelector('#send')
const text = document.querySelector('#text')
const sendLocation = document.querySelector('#sendLocation')
const messages = document.querySelector('#messages')
const sidebar = document.querySelector('#sidebar')
const locationTemplate= document.querySelector('#location-template').innerHTML
const messageTemplate = document.querySelector('#message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix:true})
socket.on('message',(message)=>{
    const html = Mustache.render(messageTemplate,{message:message.text,
    createdAt:moment(message.createdAt).format('h:mm A'),user:message.username})
    messages.insertAdjacentHTML('beforeend',html)
})
socket.on('locationMessage',(location)=>{
    const html = Mustache.render(locationTemplate,{url:location.url,createdAt:moment(location.createdAt).format('h:mm A'),user:location.username})
    messages.insertAdjacentHTML('beforeend',html)
})
socket.on('roomData',({room,users})=>{
const html = Mustache.render(sidebarTemplate,{
    room,
    users
})
sidebar.innerHTML = html 
})
messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    sendButton.setAttribute('disabled','disabled')
    socket.emit('sendMessage',text.value,()=>{
        sendButton.removeAttribute('disabled')
        text.value=''
        text.focus()
    })
})
sendLocation.addEventListener('click',()=>{
    if(!navigator.geolocation)
    return alert('No GPS detected in device')
    sendLocation.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{latitude:position.coords.latitude,longitude:position.coords.longitude},()=>{
            sendLocation.removeAttribute('disabled')
            console.log('Location shared')
        })
    })
})
socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }
})