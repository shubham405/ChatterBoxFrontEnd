
import { ChatState } from '../Context/chatProvider';
import SideDrawer from '../Components/Chats/sideDrawer';
import { Box } from '@chakra-ui/react';
import MyChats from '../Components/Chats/myChats';
import ChatBox from '../Components/Chats/chatBox';
import { useState } from 'react';


const ChatPage =  () => {
const [fetchAgain, setFetchAgain] = useState(false);

 
const {user} = ChatState();
  return (
    <div style={{width:"100%"}}>
    {user && <SideDrawer/>}
    <Box 
    display={"flex"}
    justifyContent={'space-between'}
    width={"100%"}
    height={"90vh"}
    padding={"10px"}>
      {user && <MyChats fetchAgain = {fetchAgain} />}
      {user && <ChatBox fetchAgain = {fetchAgain} setFetchAgain = {setFetchAgain}/>}
    </Box>
    </div>
  )
}

export default ChatPage
