import React, { useEffect, useRef } from "react";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../config/ChatLogics";
import { Avatar, Tooltip } from "@chakra-ui/react";
import { ChatState } from "../context/ChatProvider";
const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  console.log(messages);
  const messageEndRef = useRef(null); 
  useEffect(()=>{
    messageEndRef.current?.scrollIntoView();
  },[messages]);
  return (
    <>
      {messages &&
        messages.map((m, i) => {
          console.log(
            isSameSender(messages, m, i, user._id),
            " ",
            isLastMessage(messages, i, user._id)
          );
          return (
            <div style={{ display: "flex" }} key={m._id}>
              {(isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, i, user._id)) && (
                <Tooltip
                  label={m.sender.name}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={m.sender.name}
                    src={m.sender.image}
                  />
                </Tooltip>
              )}
              <span
                style={{
                  backgroundColor: `${
                    m.sender._id === user._id ? "#135D66" : "#496989"
                  }`,
                  color: "white",
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                }}
              >
                {m.content}
              </span>
              <div ref={messageEndRef}/>
            </div>
          );
        })}
    </>
  );
};

export default ScrollableChat;
