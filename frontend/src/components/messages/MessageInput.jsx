import { FaArrowCircleUp } from "react-icons/fa";
import useConversation from "../../zustand/useConversation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [formData, setFormData] = useState({ message: "" });
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/messages/send/${selectedConversation.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: formData.message }),
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      } else {
        setFormData({ message: "" });
        setMessages([...messages, data]);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className='px-4 my-3' onSubmit={handleSubmit}>
      <div className='w-full relative'>
        <input
          type='text'
          className='border text-sm rounded-lg block w-full p-2.5 bg-gray-300 dark:bg-gray-700 border-gray-600 text-white'
          placeholder='Send a message'
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          value={formData.message}
        />
        <button
          type='submit'
          className='absolute inset-y-0 end-0 flex items-center pe-3'
          disabled={loading}
        >
          {loading ? (
            <div className='loading loading-spinner'></div>
          ) : (
            <FaArrowCircleUp className='h-6 w-6' />
          )}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
