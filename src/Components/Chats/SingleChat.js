import React, { useEffect, useState } from "react";

import { ChatState } from "../../Context/chatProvider";
import {
  Box,
  Flex,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../../Config/ChatLogics";
import ProfileModel from "./ProfileModel";
import UpdateGroupChatModel from "./UpdateGroupChatModel";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io, { Socket } from 'socket.io-client';
import animationData from "../../Animation/Animation.json"; 
import TypingAnimation from "../../Animation/TypingAnimation";
const ENDPOINT = "http://localhost:5000";
let socket,selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat,notification, setNotification } = ChatState();
  const [message, setMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const toast = useToast();
  const [socketConnected, setSocketConnected] = useState(false);
  //const [selectedChatCompare, setSelectedChatCompare] = useState(null);
  const[typing, setTyping] = useState(false);
  const[isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const defaultOptions={
    loop:true,
    autoplay:true,
    animationData:animationData,
    rendererSettings:
    {
      preserveAspectRatio:"xMidyMid slice",
    },
  }
  useEffect(()=>{
    socket = io(ENDPOINT);
    socket.emit('setup',user);
    socket.on("connected", ()=>setSocketConnected(true));
    socket.on("typing",()=>setIsTyping(true));
    socket.on("stop typing",()=>{setIsTyping(false)});

   },[])
  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessage(data);
      setLoading(false);
      socket.emit('join chat', selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occurred",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  useEffect(() => {
    if (selectedChat) {
      setMessage([]);  // Clear previous messages when switching chats
      fetchMessages();
    }
  }, [selectedChat]);
  useEffect(() => {
   
      fetchMessages();
      selectedChatCompare = selectedChat;
    
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (!selectedChat || selectedChat._id !== newMessageRecieved.chat._id) {
        // Ensure the notification is added only if it's not already in the list
        if (!notification.some((notif) => notif._id === newMessageRecieved._id)) {
          setNotification([newMessageRecieved, ...notification]);  // Add new message to notifications
          setFetchAgain(!fetchAgain);  // Trigger a re-fetch or action when a new notification is added
        }
      } else {
        // If the chat is selected, directly append the new message to the messages
        setMessage( [...message, newMessageRecieved]);
      }
    });
  
    // Cleanup the socket listener when the component unmounts
    
  }); 
  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage.trim()) {
      setNewMessage("");
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const body = {
          content: newMessage,
          chatId: selectedChat._id,
        };
        const { data } = await axios.post("/api/message/", body, config);
        setMessage([...message, data]);
        socket.emit("new message", data);
      } catch (error) {
        toast({
          title: "Error Occurred",
          description: error.response.data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if(!socketConnected)
    {
      return;
    }
    if(!typing)
    {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    
    let lastTypingTime = new Date().getTime();
    let timer = 3000;
    setTimeout(()=>{
      let timeNow = new Date().getTime();
      let timeDiff = timeNow-lastTypingTime;
      if(timeDiff>=timer && typing===true)
      { 
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    },timer);
  };

  return (
    <Box
      w="100%"
      h="auto"
      display="flex"
      flexDirection="column"
      p={2}
      bg="white"
      borderRadius="lg"
      overflow="hidden"
    >
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={3}
            w="100%"
            fontFamily={"Work sans"}
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <Flex justifyContent="space-between" alignItems="center" w="100%">
                {getSender(user, selectedChat.users)}
                <ProfileModel user={getSenderFull(user, selectedChat.users)} />
              </Flex>
            ) : (
              <Flex justifyContent="space-between" alignItems="center" w="100%">
                {selectedChat.chatName}
                <UpdateGroupChatModel
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </Flex>
            )}
          </Text>

          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            alignItems="stretch"
            p={3}
            bg="#f1f1f1"
            w="100%"
            h="70vh"
            borderRadius="lg"
            overflow="hidden"
          >
            {/* Messages container */}
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="flex-end" // Ensure the messages are at the bottom
              flex={1} // Take all available space
              overflowY="scroll"
              mb={3}
            >
              {loading ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="100%"
                  height="60vh" // Adjust this height as needed
                >
                  <Spinner size="xl" />
                </Box>
              ) : (
                <ScrollableChat message={message} />
              )}
            </Box>

            {/* Input field */}
            <FormControl onKeyDown={sendMessage} isRequired>
              {isTyping && typingUser !== user._id?<div>
               
               <TypingAnimation/>
                  
                

              </div>:(<div></div>)}
              <Input
                variant="filled"
                bg="#e0e0e0"
                placeholder="Enter a message..."
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize={"3xl"} pb={3} fontFamily={"Work Sans"}>
            Click on a User to Chat
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default SingleChat;
