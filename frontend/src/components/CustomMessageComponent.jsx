import React from 'react';
import { useNavigate } from 'react-router-dom';

const CustomMessageComponent = (props) => {
  const navigate = useNavigate();
  
  // Debug what we're receiving
  console.log('CustomMessageComponent received:', props);
  
  // Skip rendering if we don't have a valid message object
  if (!props) {
    return <div className="p-2 text-sm text-gray-500">Loading message...</div>;
  }
  
  // Stream Chat passes the message differently depending on context
  // First check if it's in the standard format from MessageList
  const message = props.message || props;
  
  // Additional debug to see the exact message structure
  console.log('Message object being used:', message);

  // Function to handle click on video call links
  const handleMessageClick = (event) => {
    const target = event.target;
    
    // Check if the clicked element is a link
    if (target.tagName === 'A') {
      const href = target.getAttribute('href');
      
      // Check if it's a video call link
      if (href && href.includes('/call/')) {
        event.preventDefault();
        
        // Extract the call ID from the URL
        const callId = href.split('/call/')[1];
        
        // Navigate to the call page
        navigate(`/call/${callId}`);
      }
    }
  };

  // Function to convert URLs to clickable links
  const renderMessageText = (text) => {
    if (!text) return '';
    
    // Regular expression to find URLs in text
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    
    // Split the text by URLs and create an array of text and link elements
    const parts = text.split(urlRegex);
    const matches = text.match(urlRegex) || [];
    
    return parts.map((part, index) => {
      // If this part is a URL, render it as a link
      if (matches.includes(part)) {
        return (
          <a 
            key={index} 
            href={part} 
            className="text-primary underline"
            target="_blank" 
            rel="noopener noreferrer"
          >
            {part}
          </a>
        );
      }
      // Otherwise, render it as text
      return part;
    });
  };

  // Get user data safely from the message object
  const userName = message.user?.name || message.user?.id || 'Unknown User';
  const userImage = message.user?.image || 'https://via.placeholder.com/40';
  const messageTime = message.created_at ? 
    new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
    '';

  return (
    <div 
      className="p-2 hover:bg-base-200 rounded-lg transition-colors"
      onClick={handleMessageClick}
    >
      <div className="flex items-start gap-3">
        <div className="avatar">
          <div className="w-8 rounded-full">
            <img 
              src={userImage} 
              alt={userName} 
            />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">
              {userName}
            </span>
            <span className="text-xs opacity-50">
              {messageTime}
            </span>
          </div>
          
          <div className="mt-1 text-sm">
            {renderMessageText(message.text || '')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomMessageComponent;