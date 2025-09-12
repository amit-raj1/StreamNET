import { Link, useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, SearchIcon, ShipWheelIcon, X, MessageCircle, UserPlusIcon, HomeIcon, EyeIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";
import { useEffect, useRef, useState, useMemo } from "react";
import { searchUsers, getUserFriends } from "../lib/api";
import { useQuery } from "@tanstack/react-query";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);

  const { logoutMutation, isPending } = useLogout();
  
  // Fetch user's friends to check chat permissions
  const { data: friends = [] } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });
  
  // Create a set of friend IDs for quick lookup
  const friendIds = useMemo(() => new Set(friends.map(friend => friend._id)), [friends]);
  
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.trim().length === 0) {
        setSearchResults([]);
        return;
      }
      
      setIsSearching(true);
      try {
        const results = await searchUsers(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error("Error searching users:", error);
      } finally {
        setIsSearching(false);
      }
    };
    
    const debounceTimeout = setTimeout(handleSearch, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, friendIds]);

  // Hide searchbar and notifications for admin users
  const isAdmin = authUser?.isAdmin || authUser?.isMasterAdmin;

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-40 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full">
          {/* LOGO - ONLY IN THE CHAT PAGE */}
          {isChatPage && (
            <div className="pl-5">
              <Link to="/" className="flex items-center gap-2.5">
                <ShipWheelIcon className="size-9 text-primary" />
                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                  streamNET
                </span>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            {/* Home Button */}
            <Link to="/">
              <button className="btn btn-ghost btn-circle">
                <HomeIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </Link>
            
            {/* Search Button and Input - only for non-admins */}
            {!isAdmin && (
              <div className="relative">
                {!showSearch ? (
                  <button 
                    className="btn btn-ghost btn-circle" 
                    onClick={() => setShowSearch(true)}
                  >
                    <SearchIcon className="h-6 w-6 text-base-content opacity-70" />
                  </button>
                ) : (
                  <div className="flex items-center bg-base-300 rounded-full pl-3 pr-1 py-1">
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search friends by name..."
                      className="bg-transparent border-none focus:outline-none w-48 text-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button 
                      className="btn btn-ghost btn-circle btn-sm" 
                      onClick={() => {
                        setShowSearch(false);
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                    >
                      <X className="h-4 w-4 text-base-content opacity-70" />
                    </button>
                  </div>
                )}
                
                {/* Search Results Dropdown */}
                {showSearch && searchResults.length > 0 && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-base-200 shadow-lg rounded-lg z-50 max-h-96 overflow-y-auto">
                    <div className="p-2">
                      <h3 className="text-sm font-semibold mb-2">Search Results</h3>
                      <div className="space-y-2">
                        {searchResults.map((user) => {
                          const isFriend = friendIds.has(user._id);
                          return (
                            <div 
                              key={user._id} 
                              className="flex items-center gap-2 p-2 rounded-lg hover:bg-base-300"
                            >
                              <div className="avatar">
                                <div className="w-8 rounded-full">
                                  <img src={user.profilePic} alt={user.fullName} />
                                </div>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{user.fullName}</p>
                                <p className="text-xs opacity-70">
                                  {user.nativeLanguage} → {user.learningLanguage}
                                </p>
                              </div>
                              <div className="flex gap-1">
                                {isFriend ? (
                                  <Link 
                                    to={`/chat/${user._id}`}
                                    className="btn btn-primary btn-xs"
                                    onClick={() => {
                                      setShowSearch(false);
                                      setSearchQuery("");
                                      setSearchResults([]);
                                    }}
                                  >
                                    <MessageCircle className="w-3 h-3 mr-1" />
                                    Chat
                                  </Link>
                                ) : (
                                  <>
                                    <Link 
                                      to="/friends"
                                      className="btn btn-outline btn-xs"
                                      onClick={() => {
                                        setShowSearch(false);
                                        setSearchQuery("");
                                        setSearchResults([]);
                                      }}
                                    >
                                      <UserPlusIcon className="w-3 h-3 mr-1" />
                                      Add
                                    </Link>
                                    <Link 
                                      to={`/profile/${user._id}`}
                                      className="btn btn-ghost btn-xs"
                                      onClick={() => {
                                        setShowSearch(false);
                                        setSearchQuery("");
                                        setSearchResults([]);
                                      }}
                                    >
                                      <EyeIcon className="w-3 h-3 mr-1" />
                                      View
                                    </Link>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {searchResults.length > 0 && !searchResults.some(user => friendIds.has(user._id)) && (
                        <div className="text-center py-3 text-sm text-warning">
                          <p>💡 You can only chat with friends!</p>
                          <p className="text-xs opacity-70 mt-1">Send friend requests to start chatting</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Loading Indicator */}
                {isSearching && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-base-200 shadow-lg rounded-lg z-50 p-4 text-center">
                    <span className="loading loading-spinner loading-sm"></span>
                    <span className="ml-2 text-sm">Searching...</span>
                  </div>
                )}
              </div>
            )}
            
            {/* Notification Bell - only for non-admins */}
            {!isAdmin && (
              <Link to="/notifications">
                <button className="btn btn-ghost btn-circle">
                  <BellIcon className="h-6 w-6 text-base-content opacity-70" />
                </button>
              </Link>
            )}
          </div>

          {/* Theme Switcher */}
          <ThemeSelector />

          {/* Avatar - Clickable to navigate to profile */}
          <Link to="/profile">
            <div className="avatar cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-9 rounded-full">
                <img
                  src={authUser?.profilePic}
                  alt="User Avatar"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </Link>

          {/* Logout button */}
          <button
            className="btn btn-ghost btn-circle"
            onClick={() => logoutMutation()}
            disabled={isPending}
          >
            <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
