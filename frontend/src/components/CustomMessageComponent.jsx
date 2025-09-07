import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatContext } from 'stream-chat-react';

const CustomMessageComponent = (props) => {
  const { message } = props;
  const navigate = useNavigate();
  // Get the current user's ID to differentiate messages
  const { client } = useChatContext();
  
  // Determine if the message is from the logged-in user
  const isMyMessage = message.user.id === client.userID;

  // Special rendering for video call links
  const renderVideoCallMessage = (text) => {
    const url = text.match(/(https?:\/\/[^\s]+)/g)?.[0];
    if (!url) return text;
    
    return (
      <div className="p-4 bg-blue-100 rounded-lg border border-blue-200">
        <p className="text-sm text-gray-700 mb-3">A video call has been started.</p>
        <button
          onClick={() => navigate(url.substring(url.indexOf('/call/')))}
          className="w-full btn btn-sm btn-primary"
        >
          🎥 Join Call
        </button>
      </div>
    );
  };

  // Determine message content
  const isVideoCall = message.text?.includes("/call/");
  const messageContent = isVideoCall
    ? renderVideoCallMessage(message.text)
    : <p className="text-sm">{message.text}</p>;

  // Format timestamp
  const messageTime = new Date(message.created_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  
  const user = message.user || {};
  const userName = user.name || user.id || "Unknown User";
  const userImage = user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}`;

  return (
    <div className={`p-2 flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-end gap-2 max-w-md ${isMyMessage ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className="avatar">
          <div className="w-6 rounded-full">
            <img src={userImage} alt={userName} />
          </div>
        </div>

        <div className="flex flex-col">
          <div 
            className={`px-4 py-2 rounded-lg ${
              isMyMessage 
                ? 'bg-blue-500 text-white rounded-br-none' 
                : 'bg-gray-200 text-gray-800 rounded-bl-none'
            }`}
          >
            {messageContent}
          </div>
          <span className={`text-xs opacity-50 mt-1 px-1 ${isMyMessage ? 'text-right' : 'text-left'}`}>
            {messageTime}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CustomMessageComponent;