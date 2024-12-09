import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';
import {BellIcon, ChevronDownIcon} from '@chakra-ui/icons'
import { ChatState } from '../../Context/chatProvider';
import ProfileModel from './ProfileModel';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from './chatLoading';
import UserListItem from '../UserComponent/UserList';
import { getSender } from '../../Config/ChatLogics';
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';



const SideDrawer = () => {
  const [search,setSearch] = useState("");
  const[searchResult,setSearchResult] = useState([]);
  const[loading, setLoading] = useState(false);
  const[loadingChat,setLoadinChat] = useState(false);
  const {user,setSelectedChat,chats,setChats,notification, setNotification} = ChatState();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const searchHandler = async()=>{
    if(!search)
    {
      toast({

        title:"Please enter name or email to search",
        status:"warning",
        duration:3000,
        isClosable:true,
        position:"top-left"
      });
      return;
      
    }
    try{
      setLoading(true);
     const config = {
      headers:{
        Authorization:`Bearer ${user.token}`,
      },
     }
     const {data} = await axios.get(`/api/user/?search=${search}`,config);
     setLoading(false);
     setSearchResult(data);
     

    }
    catch(error){
      toast({

        title:"Error occured!",
        description:"Failed to Load the search result",
        status:"error",
        duration:3000,
        isClosable:true,
        position:"bottom  -left"
      });
      setLoading(false);
    }
    
  }
  const accessChat = async(userId)=>{
    try {
      setLoadinChat(true);
      const config = {
        headers:{
          "Content-type":"application/json",
          Authorization:`Bearer ${user.token}`,
        },
       }
       const {data}  = await axios.post('/api/chat',{userId},config);
       if(!chats.find((c)=>c._id===data._id))
       {
        setChats([data,...chats]);
       }
       setSelectedChat(data);
       setLoadinChat(false);
       onClose();
    } catch (error) {
      toast({

        title:"Error occured!",
        description:"Failed to Load the Chat result",
        status:"error",
        duration:3000,
        isClosable:true,
        position:"bottom  -left"
      });
      setLoadinChat(false);
    }
  }
  const logoutHandler = ()=>{
    localStorage.removeItem("userInfo");
    navigate("/");
  }
  return (
    <>
    <Box variant={"ghost"}
        justifyContent={"space-between"}
        display={"flex"}
        alignItems={"center"}
        bg={"white"}
        width={"100%"}
        padding={"5px 10px 5px 10px"}
        >
      <Tooltip label="search User to Chat"
      hasArrow 
      placement='bottom-end'>
        <Button  variant={"ghost"}
        onClick={onOpen}
        ><i className='fa fa-search'/><Text 
        display={{ base: "none", md: "flex" }}
        px={"4"}>
          Search User</Text></Button> 
      </Tooltip>
      <Text fontSize={"2xl"} fontFamily={"work sans"}>Chatter Box </Text>
      <div>
        <Menu>
        <MenuButton padding={1}>
          <NotificationBadge
          count = {notification.length}
          effect = {Effect.SCALE}
          />
          <BellIcon fontSize={"2xl"} margin={1}/>
        </MenuButton>
        <MenuList pl={2}>
      {!notification.length && "No New Message"}
      {notification.map((notif)=>{
       return( <MenuItem
        key = {notif._id}
        onClick={()=>{
          setSelectedChat(notif.chat);
          setNotification(notification.filter((n)=>(n !== notif)))
        }}
        >

{notif.chat.isGroupChat?`New Message in ${notif.chat.chatName}`
:`New Message From ${getSender(user,notif.chat.users,)}`}
        </MenuItem>
      )})}
        </MenuList>
        </Menu>
        <Menu>
        <MenuButton padding={1}
        as={Button} rightIcon={<ChevronDownIcon/>}> 
        <Avatar size={"sm"} 
        cursor={"pointer"}
         name={user.name}
         src={user.pic}

        />
          
        </MenuButton>
        <MenuList>
          <ProfileModel user={user}>
          <MenuItem>MyProfile</MenuItem>
          </ProfileModel>
          <MenuDivider/>
          <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          
        </MenuList>
        </Menu>
      </div>
    </Box>
    <Drawer placement='left'
    onClose={onClose}
    isOpen={isOpen}
    >
      <DrawerOverlay></DrawerOverlay>
    <DrawerContent>
      <DrawerHeader borderBottomWidth={"1px"}>Search User</DrawerHeader>
      <DrawerBody>  
      <Box display={"flex"} paddingBlock={2}>
        <Input
        placeholder='Search By Email or Name'
        marginRight={2}
        value={search}
        onChange={(e)=>{setSearch(e.target.value)}}
        />
        <Button
        onClick={searchHandler}
        >Go</Button>
      </Box>
      <Box>{
        loading?(<ChatLoading/>):searchResult?.map((user)=>{
          
          return(<UserListItem
          key = {user._id}
          user = {user}
          handleFunction ={()=>accessChat(user._id)}/>) 
        })}</Box>
        {loadingChat && <Spinner marginLeft={"auto"} display={"flex"}/>}
    </DrawerBody>
    </DrawerContent>
    
    </Drawer>
    </>
  )
}

export default SideDrawer