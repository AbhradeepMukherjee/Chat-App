import {
  Box,
  Button,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Drawer,
  useDisclosure,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  DrawerHeader,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../userAvatar/UserListItem";
const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState("");

  const { user, setSelectedChat, chats, setChats } = ChatState();
  const {onClose, isOpen, onOpen} = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();
  const handleSearch = async () => {
    if(!search){
      toast({
        title: "Please enter something",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left"
      })
      return;
    }

    try{
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }, 
      };

      const {data} = await axios.get(`http://localhost:5000/api/user?search=${search}`, config);
 
      setLoading(false);
      setSearchResults(data);
    }catch(err){
      toast({
        title: "Error fetching the chats",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left"
      });
      return;
    }
  }

  const accessChat = async (userId) => {
    try{
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        }
      }

      const {data} = await axios.post('http://localhost:5000/api/chats', {userId}, config);

      if(!chats.find((c)=>c._id === data._id)) setChats([data, ...chats]);
      
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    }catch(err){

    }
  }

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to Chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work sans">
          ChattingWebApp
        </Text>

        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.image}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay/>
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>Search Users</DrawerHeader>
          <DrawerBody>
            <Box display='flex' paddingBottom={2}>
              <Input
                placeholder="Search by name or email"
                mr = {2}
                value = {search}
                onChange = {(e)=>setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading? (<ChatLoading/>): (
              searchResults?.map((user)=>
                <UserListItem
                  key = {user._id}
                  user = {user}
                  handleFunction = {()=>accessChat(user._id)}
                />
              )
            )}
            {loading && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
