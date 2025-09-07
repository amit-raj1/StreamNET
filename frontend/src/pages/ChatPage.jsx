import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";
import CustomMessageComponent from "../components/CustomMessageComponent";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
console.log("Stream API Key:", STREAM_API_KEY);

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const navigate = useNavigate();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { authUser, isLoading: authLoading } = useAuthUser();

  const { data: tokenData, isError: tokenError } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
    retry: 3,
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) {
        setLoading(false);
        return;
      }

      try {
        console.log("Initializing stream chat client...");
        console.log("Auth User:", authUser);
        console.log("Token Data:", tokenData);

        // Create a new client instance or use existing
        let client = chatClient;
        if (!client) {
          client = StreamChat.getInstance(STREAM_API_KEY);
        }

        // Check if already connected
        if (!client.userID) {
          await client.connectUser(
            {
              id: authUser._id,
              name: authUser.fullName,
              image: authUser.profilePic,
            },
            tokenData.token
          );
        }

        console.log("Connected as user:", client.user);

        const channelId = [authUser._id, targetUserId].sort().join("-");
        console.log("Channel ID:", channelId);

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
          name: `Chat between ${authUser.fullName} and ${targetUserId}`,
        });

        await currChannel.watch();
        console.log("MESSAGES IN CLIENT STATE:", currChannel.state.messages);
        console.log("Channel members:", currChannel.state.members);

        setChatClient(client);
        setChannel(currChannel);
        setError(null);
      } catch (error) {
        console.error("Error initializing chat:", error);
        setError(error.message);
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initChat();

    // Cleanup function
    return () => {
      if (chatClient && chatClient.userID) {
        console.log("Disconnecting chat client...");
        // Don't disconnect here as it might be used elsewhere
        // chatClient.disconnectUser();
      }
    };
  }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = async () => {
    if (!channel) {
      toast.error("Channel not ready. Please try again.");
      return;
    }

    try {
      const callUrl = `${window.location.origin}/call/${channel.id}`;
      
      await channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
        type: 'regular',
      });

      toast.success("Video call link sent successfully!");
      
      // Navigate to the call page
      navigate(`/call/${channel.id}`);
    } catch (error) {
      console.error("Error sending video call message:", error);
      toast.error("Failed to send video call link. Please try again.");
    }
  };

  // Handle loading states
  if (authLoading || loading) return <ChatLoader />;

  // Handle authentication
  if (!authUser) {
    navigate('/login');
    return null;
  }

  // Handle token error
  if (tokenError) {
    return (
      <div className="h-[93vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to get chat token</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Handle chat initialization error
  if (error) {
    return (
      <div className="h-[93vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Chat Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Handle missing client or channel
  if (!chatClient || !channel) {
    return <ChatLoader />;
  }

  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList 
               
                messageActions={['react', 'reply', 'edit', 'delete']}
              />
              <MessageInput 
                focus 
                grow 
                maxRows={3}
                placeholder="Type a message..."
              />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;