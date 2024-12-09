//for chats between two users
export const getSender = (loggedUser,users)=>
{   
  console.log(loggedUser,users);

    return users[0]._id ===loggedUser._id? users[1].name:users[0].name;
}
export const getSenderFull = (loggedUser,users)=>{
    return users[0]._id ===loggedUser._id? users[1]:users[0];

}

// message, currentMessage, indexofcurmessage, userid
export const isSameSender = (message, m, i, userId)=>{

    return (
        i<message.length-1
        && (message[i+1].sender._id !==m.sender._id
            || (message[i+1].sender._id===undefined &&
                message[i].sender._id !==userId))

    );

}
// checking last message of opposite user
export const isLastMessage = (message, i, userId)=>{
    return (i===message.length-1 
        && message[i].sender._id!==userId 
        && message[i].sender._id);

}
export const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
  };
  export const isSameSenderMargin = (messages, m, i, userId) => {
    // console.log(i === messages.length - 1);
  
    if (
      i < messages.length - 1 &&
      messages[i + 1].sender._id === m.sender._id &&
      messages[i].sender._id !== userId
    )
      return 33;
    else if (
      (i < messages.length - 1 &&
        messages[i + 1].sender._id !== m.sender._id &&
        messages[i].sender._id !== userId) ||
      (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
      return 0;
    else return "auto";
  };