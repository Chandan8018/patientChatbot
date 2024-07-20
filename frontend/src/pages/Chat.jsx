import React from "react";
import MessageContainer from "../components/messages/MessageContainer";
import Sidebar from "../components/sidebar/Sidebar";

function Chat() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 max-w-4xl mx-auto sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden dark:bg-[#38626f] bg-purple-500 bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-20 border border-gray-700 dark:border-gray-100 dark:backdrop-blur-xl dark:bg-opacity-40 dark:backdrop-filter my-6 '>
      <div className='col-span-1'>
        <Sidebar />
      </div>
      <div className='col-span-2'>
        <MessageContainer />
      </div>
    </div>
  );
}

export default Chat;
