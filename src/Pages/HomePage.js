import React, { useEffect } from 'react'
import { Container, Box, Text, Tab, TabList,Tabs, TabPanel, TabPanels, TabIndicator

 } from '@chakra-ui/react'
import Login from '../Components/Authentication/Login'
import SignUp from '../Components/Authentication/SignUp'
import { useNavigate } from 'react-router-dom'
 
const HomePage = (props) => {

  
  const navigate = useNavigate();
  useEffect(()=>{
    const userInfo  = JSON.parse(localStorage.getItem("userInfo"));
    if(userInfo)
    {
        navigate("/chats");
    }
},[navigate]);
  return (
    <>
    <Container maxW={'xl'} centerContent>
     <Box display='flex'
      justifyContent={'center'}
       padding={1}
       margin={"30px 0 15px 0px"}
       bg={'white'}
       w={'100%'}
       borderRadius={'lg'}
       borderWidth={'1px'}
     
     >
      <Text 
        fontFamily={'work-sans'}
        fontSize={'2xl'}
        color={'black'}>Hey Chat</Text>
     </Box>
     <Box 
       padding={1}
       color={'black'}
       bg={'white'}
       w={'100%'}
       borderRadius={'lg'}
       borderWidth={'1px'}>
        <Tabs variant='unstyled' >
  <TabList marginBottom={'1em'} position='relative' >
    <Tab width={'50%'} >Login</Tab>
    <Tab width={'50%'}>Sign Up</Tab>
  </TabList>
  <TabIndicator mt='-1.5px' height='2px' bg='blue.500' borderRadius='1px' />
  <TabPanels>
    <TabPanel>
      <Login/>
    </TabPanel>
    <TabPanel>
      <SignUp/>
    </TabPanel>
  </TabPanels>
</Tabs>
       </Box>
       
    </Container>
    </>
  )
}

export default HomePage
