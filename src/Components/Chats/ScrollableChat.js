import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../../Config/ChatLogics";
import { ChatState } from "../../Context/chatProvider";
import { Avatar, Tooltip, Box } from "@chakra-ui/react";

const ScrollableChat = ({ message }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {message && message.length > 0 ? (
        message.map((m, i) => (
          <div style={{ display: "flex", marginBottom: "10px" }} key={m._id}>
            {m.sender._id !== user._id &&(isSameSender(message, m, i, user._id) || isLastMessage(message, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic || ""}  // Ensure pic exists or fall back to empty string
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0",
                marginLeft: isSameSenderMargin(message, m, i, user._id),
                marginTop: isSameUser(message, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                wordWrap: "break-word",  // Ensure long message break into next line
              }}
            >
              {m.content}
            </span>
          </div>
        ))
      ) : (
        <Box textAlign="center" py={4}>No messages yet</Box>
      )}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
