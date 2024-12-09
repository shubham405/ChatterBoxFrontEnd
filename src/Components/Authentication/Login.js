import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const onClickShow = () => {
    setShow(!show);
  };
  const submitHandler = async() => {
    setLoading(true);
    try {
      if (!password || !email) {
        toast({
          title: "Please fill all the field",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
      else
      {
        const config = {
            headers:{"Content-type":"application/json"}
          };

          const {data} = await axios.post('/api/user/login',{email,password},config);
          localStorage.setItem("userInfo", JSON.stringify(data));
          navigate('/chats');
      }
    } catch (error) {
        console.log("hey i am here", error.response);
        
        toast({
            title: 'Error Occured!!',
            description: error.response ? error.response.data.message : error.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
            position:"top"
          });
    }
    setLoading(false);
  };
  return (
    <VStack spacing={"5px"}>
      <FormControl id="loginEmail" isRequired>
        <FormLabel> Email</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </FormControl>
      <FormControl id="loginPassword" isRequired>
        <FormLabel> Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            value={password} 
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <InputRightElement width={"3rem"}>
            <Button
              height={"2.4rem"}
              size={"sm"}
              textAlign={"center"}
              
              onClick={onClickShow}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        width={"100%"}
        marginTop={"15px"}
        isLoading={loading}
        onClick={submitHandler}
      >
        Login
      </Button>
      <Button
        colorScheme="red"
        width={"100%"}
        marginTop={"15px"}
        // isLoading={loading}
        onClick={(e) => {
          setEmail("heyguest@example.com");
          setPassword("12345678");
        }}
      >
        Login as Guest
      </Button>
    </VStack>
  );
};

export default Login;
