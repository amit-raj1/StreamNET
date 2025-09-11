import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateProfile, getUserById, sendFriendRequest, checkIfFriends } from "../lib/api";
import { CameraIcon, LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon, MessageCircle, UserPlus, ArrowLeft } from "lucide-react";
import { LANGUAGES } from "../constants";

const ProfilePage = () => {
  const { id: profileUserId } = useParams(); // Get user ID from URL params
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  
  // Determine if viewing own profile or someone else's
  const isOwnProfile = !profileUserId || profileUserId === authUser?._id;
  
  // Fetch target user data if viewing someone else's profile
  const { data: targetUser, isLoading: loadingUser } = useQuery({
    queryKey: ["user", profileUserId],
    queryFn: () => getUserById(profileUserId),
    enabled: !isOwnProfile && !!profileUserId,
  });
  
  // Check friendship status if viewing someone else's profile
  const { data: friendshipStatus } = useQuery({
    queryKey: ["checkFriends", profileUserId],
    queryFn: () => checkIfFriends(profileUserId),
    enabled: !isOwnProfile && !!profileUserId,
  });
  
  // Use appropriate user data
  const displayUser = isOwnProfile ? authUser : targetUser;
  
  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: updateProfileMutation, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const { mutate: sendFriendRequestMutation, isPending: sendingRequest } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      toast.success("Friend request sent successfully");
      queryClient.invalidateQueries({ queryKey: ["checkFriends", profileUserId] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send friend request");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    updateProfileMutation(formState);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1; // 1-100 included
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random profile picture generated!");
  };

  const handleSendFriendRequest = () => {
    if (profileUserId) {
      sendFriendRequestMutation(profileUserId);
    }
  };

  // Loading state for viewing other user's profile
  if (!isOwnProfile && loadingUser) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto">
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        </div>
      </div>
    );
  }

  // If viewing someone else's profile but user not found
  if (!isOwnProfile && !targetUser) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">User Not Found</h2>
            <p className="text-base-content/70 mb-4">The profile you're looking for doesn't exist.</p>
            <Link to="/" className="btn btn-primary">
              <ArrowLeft className="size-4 mr-2" />
              Go Back Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {!isOwnProfile && (
              <Link to="/" className="btn btn-ghost btn-circle">
                <ArrowLeft className="size-5" />
              </Link>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold">
              {isOwnProfile ? "Edit Your Profile" : `${displayUser?.fullName}'s Profile`}
            </h1>
          </div>
          
          {/* Action buttons for viewing other users */}
          {!isOwnProfile && (
            <div className="flex gap-2">
              {friendshipStatus?.isFriend ? (
                <Link to={`/chat/${profileUserId}`} className="btn btn-primary">
                  <MessageCircle className="size-4 mr-2" />
                  Message
                </Link>
              ) : (
                <button 
                  onClick={handleSendFriendRequest}
                  disabled={sendingRequest}
                  className="btn btn-outline"
                >
                  {sendingRequest ? (
                    <span className="loading loading-spinner loading-sm mr-2" />
                  ) : (
                    <UserPlus className="size-4 mr-2" />
                  )}
                  Send Friend Request
                </button>
              )}
            </div>
          )}
        </div>
        
        <div className="card bg-base-200 w-full max-w-3xl shadow-xl mx-auto">
          <div className="card-body p-6 sm:p-8">
            {isOwnProfile ? (
              // Edit form for own profile
              <form onSubmit={handleSubmit} className="space-y-6">
              {/* PROFILE PIC CONTAINER */}
              <div className="flex flex-col items-center justify-center space-y-4">
                {/* IMAGE PREVIEW */}
                <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                  {formState.profilePic ? (
                    <img
                      src={formState.profilePic}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <CameraIcon className="size-12 text-base-content opacity-40" />
                    </div>
                  )}
                </div>

                {/* Generate Random Avatar BTN */}
                <div className="flex items-center gap-2">
                  <button type="button" onClick={handleRandomAvatar} className="btn btn-accent">
                    <ShuffleIcon className="size-4 mr-2" />
                    Generate Random Avatar
                  </button>
                </div>
              </div>

              {/* FULL NAME */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formState.fullName}
                  onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                  className="input input-bordered w-full"
                  placeholder="Your full name"
                />
              </div>

              {/* BIO */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Bio</span>
                </label>
                <textarea
                  name="bio"
                  value={formState.bio}
                  onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                  className="textarea textarea-bordered h-24"
                  placeholder="Tell others about yourself and your language learning goals"
                />
              </div>

              {/* LANGUAGES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* NATIVE LANGUAGE */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Native Language</span>
                  </label>
                  <select
                    name="nativeLanguage"
                    value={formState.nativeLanguage}
                    onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                    className="select select-bordered w-full"
                  >
                    <option value="" disabled>
                      Select your native language
                    </option>
                    {LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* LEARNING LANGUAGE */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Learning Language</span>
                  </label>
                  <select
                    name="learningLanguage"
                    value={formState.learningLanguage}
                    onChange={(e) =>
                      setFormState({ ...formState, learningLanguage: e.target.value })
                    }
                    className="select select-bordered w-full"
                  >
                    <option value="" disabled>
                      Select language you're learning
                    </option>
                    {LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* LOCATION */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Location (Optional)</span>
                </label>
                <div className="input-group">
                  <span className="flex items-center justify-center px-4 bg-base-300 border border-r-0 border-base-300 rounded-l-md">
                    <MapPinIcon className="size-5 text-base-content opacity-70" />
                  </span>
                  <input
                    type="text"
                    name="location"
                    value={formState.location}
                    onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                    className="input input-bordered w-full rounded-l-none"
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <button className="btn btn-primary w-full" disabled={isPending} type="submit">
                {!isPending ? (
                  <>Update Profile</>
                ) : (
                  <>
                    <LoaderIcon className="animate-spin size-5 mr-2" />
                    Saving...
                  </>
                )}
              </button>
            </form>
            ) : (
              // View-only profile for other users
              <div className="space-y-6">
                {/* Profile Picture */}
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                    {displayUser?.profilePic ? (
                      <img
                        src={displayUser.profilePic}
                        alt={displayUser.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <CameraIcon className="size-12 text-base-content opacity-40" />
                      </div>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold">{displayUser?.fullName}</h2>
                </div>

                {/* Bio */}
                {displayUser?.bio && (
                  <div className="bg-base-100 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">About</h3>
                    <p className="text-base-content/80">{displayUser.bio}</p>
                  </div>
                )}

                {/* Languages */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayUser?.nativeLanguage && (
                    <div className="bg-base-100 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Native Language</h3>
                      <p className="text-lg">
                        {LANGUAGES.find(lang => lang.code === displayUser.nativeLanguage)?.flag}{" "}
                        {LANGUAGES.find(lang => lang.code === displayUser.nativeLanguage)?.name}
                      </p>
                    </div>
                  )}
                  
                  {displayUser?.learningLanguage && (
                    <div className="bg-base-100 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Learning Language</h3>
                      <p className="text-lg">
                        {LANGUAGES.find(lang => lang.code === displayUser.learningLanguage)?.flag}{" "}
                        {LANGUAGES.find(lang => lang.code === displayUser.learningLanguage)?.name}
                      </p>
                    </div>
                  )}
                </div>

                {/* Location */}
                {displayUser?.location && (
                  <div className="bg-base-100 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <MapPinIcon className="size-5" />
                      Location
                    </h3>
                    <p className="text-base-content/80">{displayUser.location}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;