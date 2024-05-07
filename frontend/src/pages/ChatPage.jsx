import { Box } from "@chakra-ui/layout";
import { ChatState } from "../context/ChatProvider.jsx";
import SideDrawer from "../components/miscellaneous/SideDrawer.jsx";
import MyChats from "../components/MyChats.jsx";
import ChatBox from "../components/ChatBox.jsx";
import { useState } from "react";
const Chatpage = () => {
  const {user} = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer/>}
      <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats fetchAgain={fetchAgain}/>}
        {user && <ChatBox/>}
      </Box>
    </div>
  );
};

export default Chatpage;