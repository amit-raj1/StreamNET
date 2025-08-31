import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";
import { getLanguageFlag } from "../components/FriendCard"; 
import { capitialize } from "../lib/utils";

const MyFriends = () => {
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  if (loadingFriends) {
    return (
      <div className="flex justify-center py-12">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">No Friends Yet</h2>
        <p className="opacity-70">Start connecting with learners to see them here!</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-8">Your Friends</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {friends.map((friend) => (
          <div
            key={friend._id}
            className="card bg-base-200 shadow-md hover:shadow-lg transition-all duration-300"
          >
            <div className="card-body items-center text-center">
              {/* Avatar */}
              <div className="avatar mb-4">
                <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={friend.profilePic} alt={friend.fullName} />
                </div>
              </div>

              {/* Name */}
              <h3 className="font-semibold text-lg">{friend.fullName}</h3>

              {/* Languages */}
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                <span className="badge badge-secondary">
                  {getLanguageFlag(friend.nativeLanguage)}
                  Native: {capitialize(friend.nativeLanguage)}
                </span>
                <span className="badge badge-outline">
                  {getLanguageFlag(friend.learningLanguage)}
                  Learning: {capitialize(friend.learningLanguage)}
                </span>
              </div>

              {/* Message button */}
              <button className="btn btn-outline w-full mt-4">Message</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyFriends;
