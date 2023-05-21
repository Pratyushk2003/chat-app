const users = []
const addUser = ({id,username,room})=>{
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    if(!username||!room){
        return {
            error:'Username and Room are required'
        }
    }
    const existing = users.find((user)=>{
        return user.username===username&&user.room===room
    })
    if(existing){
        return {
            error:"Username already in use!"
        }
    }
    users.push({id,username,room})
    const user = {id,username,room}
    return {user}
}

const removeUSer = (id)=>{
     const index = users.findIndex((user)=>{
        return user.id===id
     })
     if(index!==-1){
        return users.splice(index,1)[0]
     }
}
const getUSer = (id)=>{
    const index = users.findIndex((user)=>{
        return user.id===id
     })
     if(index!==-1){
        return  users[index]
     }
     return undefined
}
const getUSerInRoom = (room)=>{
    const usersInRoom = []
    for(let i = 0;i<users.length;i++){
        if(users[i].room===room)
        usersInRoom.push(users[i])
    }
    return usersInRoom
}
// console.log(addUser({id:ZbNsysIQhNAEU6yLAAAD,username:'ab',room:'1234'}))
module.exports ={addUser,removeUSer,getUSer,getUSerInRoom}