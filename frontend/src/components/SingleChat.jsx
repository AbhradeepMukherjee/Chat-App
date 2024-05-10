import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;



const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();
  const [ messages, setMessages ] = useState([]);
  const [ socketConnected, setSocketConnected ] = useState(false);
  const [ typing, setTyping ] = useState(false);
  const [ isTyping, setIsTyping ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [ newMessage, setNewMessage ] = useState("");
  const toast = useToast();


  useEffect(()=>{
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", ()=>setSocketConnected(true));
    socket.on("typing", ()=>setIsTyping(true));
    socket.on("stop typing", ()=>setIsTyping(false));
  },[]);

  useEffect(()=>{
    fetchMessages();

    selectedChatCompare = selectedChat;
  },[selectedChat]);

  useEffect(()=>{
    socket.on("message received", (newMessageReceived)=>{
      if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id){
        if(!notification.includes(newMessageReceived)){
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      }else{
        setMessages([...messages, newMessageReceived]);
      }

    })
    
    if(!newMessage) socket.emit("stop typing", selectedChat._id);
  })
  
  const messageStyles = {
    display: "flexbox",
    flexDirection: "column",
    overflowY: "scroll",
    scrollbarWidth: "none"
  };

  const typingHandler = (e)=>{
    setNewMessage(e.target.value);
    if(!socketConnected) return;
    if(!typing){
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }


    let time = new Date();
    var timerLength = 3000;
    setTimeout(()=>{
      var timeNow = new Date().getTime();
      var timeDifference = timeNow - time;
      if(timeDifference >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);  
  };
  const fetchMessages = async()=>{
    if(!selectedChat) return;

    try{
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}` 
        },
      };
      setLoading(true);
      const {data} = await axios.get(`http://localhost:5000/api/messages/${selectedChat._id}`, config);

      setMessages(data);
      setLoading(false);
      
      socket.emit("join chat", selectedChat._id);
    }catch(e){
      toast({
        title: "Error Occured!",
        description: "Failed to send the Message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };


  

  const sendMessage = async(e)=>{
    if(e.key === "Enter" && newMessage){
      socket.emit("stop typing", selectedChat._id);
      try{
        const config = {
          headers: {
            "Content-type" : "application/json",
            Authorization: `Bearer ${user.token}` 
          },
        };
        setNewMessage("");
        const {data} = await axios.post("http://localhost:5000/api/messages", {
          content: newMessage,
          chatId: selectedChat._id
        }, config);
        
        
        setMessages([...messages, data]);

        socket.emit("new message", data);
      }catch(error){
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };
  return (
    <>
      {selectedChat ? (
        <>
            <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
            >
                <IconButton
                    display={{ base: "flex", md: "none" }}
                    icon={<ArrowBackIcon />}
                    onClick={() => setSelectedChat("")}
                />
                {!selectedChat.isGroupChat?(
                    <>
                        {getSender(user, selectedChat.users)}
                        <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                    </>
                ):<>
                    {selectedChat.chatName.toUpperCase()}
                    <UpdateGroupChatModal 
                        fetchAgain={fetchAgain}
                        setFetchAgain={setFetchAgain}
                        fetchMessages={fetchMessages}
                    />
                </>}
            </Text>
            <Box
                display="flex"
                flexDir="column"
                justifyContent="flex-end"
                padding={3}
                bg="#E8E8E8"
                width="100%"
                height="100%"
                borderRadius="lg"
                overflowY="hidden" 
            >
                {loading ? (
                    <Spinner
                        size="xl"
                        width={20}
                        height={20}
                        alignSelf="center"
                        margin="auto"
                    />
                ) : (
                    <div style={messageStyles}>
                      <ScrollableChat messages={messages}/>
                    </div>
                )}
                <FormControl
                  onKeyDown={sendMessage}
                  isRequired
                  mt={3}
                >
                  {isTyping?<Text as='i'>typing</Text>:<></>}
                  <Input
                    variant="filled"
                    bg="#E0E0E0"
                    placeholder="Enter a message..."
                    onChange={typingHandler}
                    value={newMessage}
                  />
                </FormControl>
            </Box>
        </>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
