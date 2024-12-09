import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/chatProvider';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';

import { getSender } from '../../Config/ChatLogics';
import ChatLoading from './chatLoading';
import GroupChatModel from './GroupChatModel';

const MyChats = ({fetchAgain}) => {
  const[loggedUser, setLoggedUser] = useState(JSON.parse(localStorage.getItem("userInfo")));
  const {user,selectedChat,setSelectedChat,chats,setChats} = ChatState();
  useEffect(()=>{
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  },[fetchAgain]);
  const toast = useToast();
  const fetchChats=  async ()=>
  {
    try{
      
     const config = {
      headers:{
        Authorization:`Bearer ${user.token}`,
      },
     }
     const {data} = await axios.get(`/api/chat/`,config);
    console.log(data);
     setChats(data);

    }
    catch(error){
      toast({

        title:"Error occured!",
        description:"Failed to Load the search result",
        status:"error",
        duration:3000,
        isClosable:true,
        position:"bottom -left"
      });
    }
  }
  
 
  return (
    <Box
    display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
    flexDir="column"
    alignItems="center"
    p={3}
    bg="white"
    w={{ base: "100%", md: "30%" }}
    h={{ base: "100%", md: "90vh" }} 
    borderRadius="lg"
    borderWidth="1px"
  >
    <Box
      pb={3}
      px={3}
      fontSize={{ base: "28px", md: "30px" }}
      fontFamily="work sans"
      display="flex"
      w="100%"
    
      justifyContent="space-between"
      alignItems="center"
    >
      Chats
      <GroupChatModel >
      <Button
        display="flex"
        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
        rightIcon={<AddIcon />}
        fontFamily="work sans"
        
      >
        Create Group
      </Button>
      </GroupChatModel>
    </Box>
    <Box
      p={3}
      
      fontFamily="work sans"
      display="flex"
      flexDir={"column"}
      bg={"#f8f8f8"}
      w={"100%"}
      h={"80%"}
      borderRadius={"lg"}
      overflowY={"hidden"}>
        {chats?(<Stack overflowY={"scroll"}>
          {
            chats.map((chat)=>{
              return (<Box
              onClick={()=>{setSelectedChat(chat)}}
              cursor="pointer"
              bg={selectedChat === chat?"#38b2ac":"#e8e8e8"}
              color={selectedChat=== chat? (chat.isGroupChat?"blue":"white"):"black"}
              
              px={3}
              py={2}
              borderRadius={"lg"}
              key={chat._id}
              >
                <Text>{!chat.isGroupChat?(getSender(loggedUser,chat.users)):(chat.chatName)}</Text>

              </Box>)
            })
          }
        </Stack>) :(<ChatLoading/>)}
    </Box>
  </Box>
  )
}

export default MyChats;