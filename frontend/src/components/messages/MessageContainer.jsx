import { useSelector } from "react-redux";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { useState } from "react";
import { Dropdown } from "flowbite-react";
import { Avatar } from "@mui/material";
import { IoIosMail } from "react-icons/io";
import { IoSettings } from "react-icons/io5";
import { MdChat } from "react-icons/md";
import { Link } from "react-router-dom";

const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const [profileDropdown, setProfileDropdown] = useState(false);

  return (
    <div className='md:min-w-[450px] flex flex-col'>
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          {/* Header */}
          <div className='bg-gray-400 dark:bg-slate-500 px-4 py-2 mb-2 flex justify-start items-center gap-2'>
            {selectedConversation && (
              <Dropdown
                arrowIcon={false}
                inline
                label={
                  <Avatar
                    alt={selectedConversation.username}
                    src={selectedConversation.profilePicture}
                    sx={{ width: 35, height: 35 }}
                  />
                }
              >
                <Dropdown.Header>
                  <div className='flex justify-start items-center gap-2'>
                    <span className='block text-md font-bold text-blue-500 truncate'>
                      Dr. {selectedConversation.fullName}
                    </span>
                  </div>
                  <span className='text-sm font-medium text-gray-500 dark:text-gray-400 truncate mt-2 flex justify-start items-center gap-1'>
                    <IoIosMail className='w-6 h-6 pt-1' />
                    {selectedConversation.email}
                  </span>
                </Dropdown.Header>

                <Dropdown.Item className='text-gray-700 font-bold'>
                  <MdChat className='w-5 h-5 mr-2' color='gray' />
                  Query with Doctors
                </Dropdown.Item>

                <Dropdown.Divider />

                <Dropdown.Item className='text-gray-700 font-bold'>
                  <IoSettings className='w-5 h-5 mr-2' color='gray' />
                  Setting
                </Dropdown.Item>
              </Dropdown>
            )}
            <span className='text-gray-900 font-bold'>
              Dr. {selectedConversation.fullName}
            </span>
          </div>
          <Messages />
          <MessageInput />
        </>
      )}
    </div>
  );
};

const NoChatSelected = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className='flex items-center justify-center w-full h-full'>
      <div className='px-4 text-center sm:text-lg md:text-xl text-gray-600 dark:text-gray-200 font-semibold flex flex-col items-center gap-2'>
        <p>Welcome 👋 {currentUser.fullName} ❄</p>
        <p>Select a doctor to start health inquiries</p>
        <TiMessages className='text-3xl md:text-6xl text-center' />
      </div>
    </div>
  );
};

export default MessageContainer;
