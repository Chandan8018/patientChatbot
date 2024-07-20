import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import io from "socket.io-client";
import notificationSound from "../assets/sounds/notification.mp3";
import { useSelector } from "react-redux";

const useListenMessages = () => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const { messages, setMessages } = useConversation();

  useEffect(() => {
    if (currentUser) {
      const socket = io("http://localhost:5173/", {
        query: {
          userId: currentUser.id,
        },
      });
      console.log(socket);
      setSocket(socket);

      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => socket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      newMessage.shouldShake = true;
      const sound = new Audio(notificationSound);
      sound.play();
      setMessages([...messages, newMessage]);
    });

    return () => socket?.off("newMessage");
  }, [socket, setMessages, messages]);
};
export default useListenMessages;
