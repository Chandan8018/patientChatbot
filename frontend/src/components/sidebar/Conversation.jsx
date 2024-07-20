import io from "socket.io-client";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import useConversation from "../../zustand/useConversation";

const Conversation = ({ conversation, lastIdx, emoji }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const { selectedConversation, setSelectedConversation } = useConversation();
  const isSelected = selectedConversation?.id === conversation.id;
  const isOnline = onlineUsers.includes(conversation.id);

  // useEffect(() => {
  //   if (currentUser) {
  //     const socket = io("http://localhost:5173/", {
  //       query: {
  //         userId: currentUser.id,
  //       },
  //     });
  //     console.log(socket);
  //     setSocket(socket);

  //     socket.on("getOnlineUsers", (users) => {
  //       setOnlineUsers(users);
  //     });

  //     return () => socket.close();
  //   } else {
  //     if (socket) {
  //       socket.close();
  //       setSocket(null);
  //     }
  //   }
  // }, [currentUser]);

  return currentUser.isAdmin
    ? !conversation.isAdmin && (
        <>
          <div
            className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer
          ${isSelected ? "bg-sky-500" : ""}
        `}
            onClick={() => setSelectedConversation(conversation)}
          >
            <div className={`avatar ${isOnline ? "online" : ""}`}>
              <div className='w-12 rounded-full'>
                <img src={conversation.profilePicture} alt='user avatar' />
              </div>
            </div>

            <div className='flex flex-col flex-1'>
              <p className='font-semibold dark:text-gray-200 text-gray-800'>
                {conversation.fullName}
              </p>
            </div>
          </div>

          {!lastIdx && <div className='divider my-0 py-0 h-1' />}
        </>
      )
    : conversation.isAdmin && (
        <>
          <div
            className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer
          ${isSelected ? "bg-sky-500" : ""}
        `}
            onClick={() => setSelectedConversation(conversation)}
          >
            <div className={`avatar ${isOnline ? "online" : ""}`}>
              <div className='w-12 rounded-full'>
                <img src={conversation.profilePicture} alt='user avatar' />
              </div>
            </div>

            <div className='flex flex-col flex-1'>
              <div className='flex gap-3 justify-between'>
                <p className='font-semibold dark:text-gray-200 text-gray-800'>
                  {conversation.exp >= 5 ? "Professor." : "Dr."}{" "}
                  {conversation.fullName}
                </p>
                <span className='text-xl'>{emoji}</span>
              </div>
            </div>
          </div>

          {!lastIdx && <div className='divider my-0 py-0 h-1' />}
        </>
      );
};

export default Conversation;
