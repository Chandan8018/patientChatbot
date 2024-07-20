import { useSelector } from "react-redux";
import useConversation from "../../zustand/useConversation";
import { useSocketContext } from "../../context/SocketContext";

const Conversation = ({ conversation, lastIdx, emoji }) => {
  const { currentUser } = useSelector((state) => state.user);
  const { selectedConversation, setSelectedConversation } = useConversation();
  const isSelected = selectedConversation?.id === conversation.id;
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(conversation._id);

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
