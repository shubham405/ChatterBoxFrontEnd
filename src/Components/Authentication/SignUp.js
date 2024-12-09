import React, { useState  } from 'react'
import {  Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack } from '@chakra-ui/react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const  SignUp=()=> {
  
    const[name , setName] = useState("");
    const[email , setEmail] = useState("");
    const[password , setPassword] = useState("");
    const[confirmPassword , setConfirmPassword] = useState("");
    const[show,setShow] = useState(false);
    const[pics , setPics] = useState("");
    const[loading,setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();
    const postPics = (pics)=>{
      setLoading(true);
      
      if(pics===undefined)
      {
        toast({
          title: 'Please Select an Image',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }
      if(pics.type ==="image/jpeg" || pics.type==="image/png" || pics.type==="image/jpg")
      {
        
         const data  = new FormData();
         data.append("file",pics);
         data.append("upload_preset","Hey-Chat");
         data.append("cloud_name","dtvpodigw");
         fetch("https://api.cloudinary.com/v1_1/dtvpodigw/image/upload",{
          method:"post",
          body:data
        }).then((res)=>{

        res.json().then((data)=>{
          console.log(data.url.toString());
          
          setPics(data.url.toString());
          setLoading(false);
        })}).catch((err)=>{
          console.log(err);
          setLoading(false);
          
        })

        }
        else
        {
          toast({
            title: 'Please Select an Image',
            status: 'warning',
            duration: 3000,
            isClosable: true,
          });
          setLoading(false);
        }
    };
    const onClickShow = ()=>{
      setShow(!show);
    }
    const submitHandler = async ()=>
    {
      setLoading(true);
      if(!name || !password || !confirmPassword || !email)
      {
        toast({
          title: 'Please fill all the field',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position:"top"
        });
      }
      else if(password!==confirmPassword)
      {
        toast({
          title: 'Password Do Not Match',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position:"top"
        });
      }
      else
      {
        try {
          const config = {
            headers:{"Content-type":"application/json"}
          };
          
          const {data} = await axios.post('/api/user',{name,email,password,pics},config);
         
          
          toast({
            title: 'Account created.',
            description: "Now Enjoy Chatting.",
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          localStorage.setItem("userInfo", JSON.stringify(data));
          navigate('/chats');
        } catch (error) {
          toast({
            title: 'Error Occured!!',
            description: error.response ? error.response.data.message : error.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
            position:"top"
          });
        }
      }
      setLoading(false);
    }
  return (
    <VStack spacing={'5px'}>
    <FormControl id='name' isRequired>
        <FormLabel> Name</FormLabel>
        <Input placeholder='Enter Your Name'
         onChange={(e)=>{
            setName(e.target.value)
         }}/> 
    </FormControl>
    <FormControl id='email' isRequired>
        <FormLabel> Email</FormLabel>
        <Input 
        type='email'
        placeholder='Enter Your Email'
         onChange={(e)=>{
            setEmail(e.target.value)
         }}/> 
    </FormControl>
    <FormControl id='password' isRequired>
        <FormLabel> Password</FormLabel>
        <InputGroup>
        <Input
        type={show?'text':'password'}
        placeholder='Enter Your Password'
         onChange={(e)=>{
            setPassword(e.target.value)
         }}/>
         <InputRightElement width={'3rem'}>
         <Button height={"2.4rem"}
         
         size={"sm"}
         textAlign={'center'}
         onClick={onClickShow}>{show?"Hide":"Show"}</Button>
         </InputRightElement>
          </InputGroup>
    </FormControl>
    <FormControl id='confirmPassword' isRequired>
        <FormLabel> Confirm Password</FormLabel>
        <InputGroup>
        <Input
        type={show?'text':'password'}
        placeholder='Confirm Password'
         onChange={(e)=>{
          setConfirmPassword(e.target.value)
         }}/>
         <InputRightElement width={'3rem'}>
         <Button height={"2.4rem"}
         
         size={"sm"}
         textAlign={'center'}
         onClick={onClickShow}>{show?"Hide":"Show"}</Button>
         </InputRightElement>
          </InputGroup>
    </FormControl>
    <FormControl id ='pic'>
         <FormLabel>Upload your picture</FormLabel>
         <Input
         type='file'
         accept='image/*'
         onChange={(e)=>postPics(e.target.files[0])}
         />
    </FormControl>
    <Button
    colorScheme='blue'
    width={'70%'}
    marginTop={'15px'}
    onClick={submitHandler}
    isLoading={loading}
    >Sign Up</Button>

    </VStack>

  )
}

export default SignUp
