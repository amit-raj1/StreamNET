import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken, checkIfFriends, getUserById } from "../lib/api";

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

  // Get target user details
  const { data: targetUser } = useQuery({
    queryKey: ["user", targetUserId],
    queryFn: () => getUserById(targetUserId),
    enabled: !!targetUserId,
  });

  // Check if users are friends before allowing chat access
  const { data: friendshipStatus, isLoading: checkingFriendship } = useQuery({
    queryKey: ["checkFriends", targetUserId],
    queryFn: () => checkIfFriends(targetUserId),
    enabled: !!authUser && !!targetUserId && targetUserId !== authUser.id,
  });

  const { data: tokenData, isError: tokenError } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
    retry: 3,
  });

  useEffect(() => {
    // Check if users are friends before proceeding with chat initialization
    if (targetUserId && targetUserId !== authUser?.id && friendshipStatus?.isFriend === false) {
      setError("You can only chat with friends. Send a friend request first!");
      setLoading(false);
      return;
    }

    const initChat = async () => {
      if (!tokenData?.token || !authUser || !targetUser) {
        setLoading(false);
        return;
      }

      try {
        console.log("Initializing stream chat client...");
        console.log("Auth User:", authUser);
        console.log("Target User:", targetUser);
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

        // Create channel with proper naming - only show target user's name
        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
          name: targetUser.fullName, // Only show target user's name
          image: targetUser.profilePic, // Add target user's profile picture
          // Add custom data for better identification
          data: {
            targetUserId: targetUserId,
            targetUserName: targetUser.fullName,
            targetUserImage: targetUser.profilePic
          }
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
  }, [tokenData, authUser, targetUserId, targetUser, friendshipStatus?.isFriend, chatClient]);

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
  if (authLoading || loading || checkingFriendship) return <ChatLoader />;

  // Handle authentication
  if (!authUser) {
    navigate('/login');
    return null;
  }

  // Handle friendship check - prevent chat if not friends
  if (targetUserId && targetUserId !== authUser.id && friendshipStatus?.isFriend === false) {
    return (
      <div className="h-[93vh] bg-base-100 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-20 h-20 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H8m13-9.5V9a2 2 0 01-2 2H5a2 2 0 01-2-2V6.5A2.5 2.5 0 015.5 4h13A2.5 2.5 0 0121 6.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Friends Only Chat</h3>
          <p className="text-base-content/70 mb-4">
            You can only chat with users who are in your friends list. Send a friend request to start chatting!
          </p>
          <div className="space-x-3">
            <button onClick={() => navigate('/home')} className="btn btn-primary">
              Find Friends
            </button>
            <button onClick={() => navigate('/friends')} className="btn btn-outline">
              My Friends
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle token error
  if (tokenError) {
    return (
      <div className="h-[93vh] bg-base-100 flex items-center justify-center">
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
      <div className="h-[93vh] bg-base-100 flex items-center justify-center">
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
    <div className="h-[93vh] bg-base-100">
      <Chat client={chatClient} theme="messaging light">
        <Channel channel={channel}>
          <div className="w-full relative bg-base-100 h-full">
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