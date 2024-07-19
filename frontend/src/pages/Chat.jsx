import React from "react";
import MessageContainer from "../components/messages/MessageContainer";
import Sidebar from "../components/sidebar/Sidebar";

function Chat() {
  return (
    <div className='flex max-w-3xl mx-auto sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden dark:bg-[#38626f] bg-purple-500 bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-20 border border-gray-700 dark:border-gray-100 dark:backdrop-blur-xl dark:bg-opacity-40 dark:backdrop-filter my-6'>
      <Sidebar />
      <MessageContainer />
    </div>
  );
}

export default Chat;
