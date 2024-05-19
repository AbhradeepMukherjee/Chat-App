import React from "react";
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);
    const toast = useToast();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [confirmpassword, setConfirmpassword] = useState("");
    const [password, setPassword] = useState("");
    const [image, setimage] = useState("");
    const [imageLoading, setimageLoading] = useState(false);
    const submitHandler = async () => {
        setimageLoading(true);
        if (!name || !email || !password || !confirmpassword) {
          toast({
            title: "Please Fill all the Fields",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setimageLoading(false);
          return;
        }
        if (password !== confirmpassword) {
          toast({
            title: "Passwords Do Not Match",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          return;
        }
        
        try {
          const config = {
            headers: {
              "Content-type": "application/json",
            },
          };
          const { data } = await axios.post(
            "http://localhost:5000/api/user",
            {
              name,
              email,
              password,
              image,
            },
            config
          );

          toast({
            title: "Registration Successful",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          localStorage.setItem("userInfo", JSON.stringify(data));
          setimageLoading(false);
          navigate("/chats")
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setimageLoading(false);
        }
      };
    
      const postDetails = (image) => {
        setimageLoading(true);
        if (image === undefined) {
          toast({
            title: "Please Select an Image!",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          return;
        }
        
        if (image.type === "image/jpeg" || image.type === "image/png") {
          const data = new FormData();
          data.append("file", image);
          data.append("upload_preset", "chatting-webapp");
          data.append("cloud_name", "djxtxnp3i");
          fetch("https://api.cloudinary.com/v1_1/djxtxnp3i/image/upload", {
            method: "post",
            body: data,
          })
            .then((res) => res.json())
            .then((data) => {
              setimage(data.url.toString());
              
              setimageLoading(false);
            })
            .catch((err) => {
              console.log(err);
              setimageLoading(false);
            });
        } else {
          toast({
            title: "Please Select an Image!",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setimageLoading(false);
          return;
        }
      };
    
      return (
        <VStack spacing="5px">
          <FormControl id="first-name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              placeholder="Enter Your Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </FormControl>
          <FormControl id="email" isRequired>
            <FormLabel>Email Address</FormLabel>
            <Input
              type="email"
              placeholder="Enter Your Email Address"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup size="md">
              <Input
                type={show ? "text" : "password"}
                placeholder="Enter Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup size="md">
              <Input
                type={show ? "text" : "password"}
                placeholder="Confirm password"
                onChange={(e) => setConfirmpassword(e.target.value)}
                value={confirmpassword}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl id="image">
            <FormLabel>Upload Your Image</FormLabel>
            <Input
              type="file"
              p={1.5}
              accept="image/*"
            //   onChange={(e) => postDetails(e.target.files[0])}
            />
          </FormControl>
          <Button
            colorScheme="blue"
            width="100%"
            style={{ marginTop: 15 }}
            onClick={submitHandler}
            isLoading={imageLoading}
          >
            Sign Up
          </Button>
        </VStack>
      );
    };
    
    export default Signup;
