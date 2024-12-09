import { Box, Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/chatProvider';
import axios from 'axios';
import UserListItem from '../UserComponent/UserList';
import UserBadgeItem from '../UserComponent/UserBadgeItem';

const GroupChatModel = ({children}) => {
    const {isOpen,onOpen,onClose} = useDisclosure(); 
    const [groupChatName, setGroupChatName] = useState();
    const [ selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState();
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const {user,chats,setChats } = ChatState();
    const handleDelete = (user)=>{
        setSelectedUsers(selectedUsers.filter(sel=>sel._id!==user._id));
    }
    const handleClose = () => {
      setSearchResult([]); // Clear search results
      onClose(); // Call the original onClose function to close the modal
    };
    const handleGroup= (user)=>{
        if(selectedUsers.some(selectedUser => selectedUser._id === user._id))
        {
            toast({

                title:"User Already Added",
                status:"warning",
                duration:3000,
                isClosable:true,
                position:"top"
              });
              return;
        }
    
        setSelectedUsers([...selectedUsers,user]);

    }
    
    const handleSubmit = async()=>{
        if(!groupChatName || selectedUsers.length===0)
        {
            toast({

                title:"Error occured!",
                description:"Please fill all the field",
                status:"warning",
                duration:3000,
                isClosable:true,
                position:"top"
              });
        }
        else if(selectedUsers.length<2)
        {
            toast({

                title:"Error occured!",
                description:" select two users to make a group",
                status:"error",
                duration:3000,
                isClosable:true,
                position:"top"
              });
        }
        else
        {
            setLoading(true);
            
            try {
                const config = {
                    headers:{
                      Authorization:`Bearer ${user.token}`,
                    },
                   }
                const body = {
                    name:groupChatName,
                    users:selectedUsers.map((user)=>user._id),
                };
                const {data} = await axios.post('/api/chat/group',body,config);
                setChats([data,...chats]);
                setLoading(false);
                onClose();
                setSearchResult([]);
                toast({ 
                    title:"New Group Chat is Created",
                    status:"success",
                    duration:3000,
                    isClosable:true,
                    position:"top"
                    });
            } catch (error) {
                setLoading(false);
                console.log(error)
                toast({ 
                title:"Error occured!",
                description:" something went wrong",
                status:"error",
                duration:3000,
                isClosable:true,
                position:"top"
                });
            }

        }
    }
    const handleSearch = async(query)=>{
        
        if (!query.trim()) {
            setSearchResult([]); // Clear previous results when query is empty
            return;
        }
    
        setSearch(query);
        try {
            setLoading(true);
            const config = {
                headers:{
                  Authorization:`Bearer ${user.token}`,
                },
               }
               
               const {data} = await axios.get(`/api/user/?search=${query}`,config);
               
               
               setSearchResult(data);

               setLoading(false);
        } catch (error) {
            
            setLoading(false);
            toast({

                title:"Error occured!",
                description:"Failed to Load the search result",
                status:"error",
                duration:3000,
                isClosable:true,
                position:"bottom-left"
              });
        }
    }

  return (
   
  
    <>
      <span onClick={onOpen}>{children}</span>
     

      <Modal
      
        isOpen={isOpen}
        onClose={handleClose}
      >
        <ModalOverlay />
        <ModalContent>

          <ModalHeader
          fontSize={"35px"}
          fontFamily={"work sans"}
          display={"flex"}
          justifyContent={"center"}
          >Create Groups</ModalHeader>
          <ModalCloseButton />
          <ModalBody display = "flex"
          flexDir={"column"}
          alignItems={"center"}
          pb={6}>
        
            <FormControl>
              <FormLabel>Group Name</FormLabel>
              <Input
              mb={3}  
              placeholder='Enter Group Name'
              value={groupChatName} 
              onChange={(e)=>{setGroupChatName(e.target.value)}}/>
            </FormControl>

            <FormControl mt={4}>
              
              <Input
              mb={"1"} 
              placeholder='Add Users eg: shubham, krishna' 
              onChange={(e)=>handleSearch(e.target.value)}
              />
            </FormControl>
            <Box display="flex" flexWrap={"wrap"} gap={2} mt={2} >
            {selectedUsers.map((user)=>{
                return(
                    <UserBadgeItem
                    key={user._id}
                    user = {user}
                    handleFunction = {()=>handleDelete(user)}
                    />
                )
            })}
            </Box>
            {loading?( <Spinner size="lg" color="blue.500" />):(searchResult?.slice(0,4).map((user)=>{
               
               return(
                    <UserListItem
                    key={user._id}
                    user= {user}
                    handleFunction={()=>handleGroup(user)}
                    ></UserListItem>

                )
            }))}
            
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' 
            mr={3}
            onClick={handleSubmit}>
              Create Group
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  
  )
}

export default GroupChatModel
