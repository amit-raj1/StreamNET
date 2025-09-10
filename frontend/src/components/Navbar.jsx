import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, SearchIcon, ShipWheelIcon, X } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";
import { useEffect, useRef, useState } from "react";
import { searchUsers } from "../lib/api";

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
  }, [searchQuery]);

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
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
            {/* Search Button and Input */}
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
                      {searchResults.map((user) => (
                        <Link 
                          key={user._id} 
                          to={`/chat/${user._id}`}
                          className="flex items-center gap-2 p-2 hover:bg-base-300 rounded-lg"
                          onClick={() => {
                            setShowSearch(false);
                            setSearchQuery("");
                            setSearchResults([]);
                          }}
                        >
                          <div className="avatar">
                            <div className="w-8 rounded-full">
                              <img src={user.profilePic} alt={user.fullName} />
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{user.fullName}</p>
                            <p className="text-xs opacity-70">
                              {user.nativeLanguage} → {user.learningLanguage}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
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
            
            <Link to={"/notifications"}>
              <button className="btn btn-ghost btn-circle">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </Link>
          </div>

          {/* Theme Switcher */}
          <ThemeSelector />

          {/* Avatar */}
          <div className="avatar">
            <div className="w-9 rounded-full">
              <img
                src={authUser?.profilePic}
                alt="User Avatar"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

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
