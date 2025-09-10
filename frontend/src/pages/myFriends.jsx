import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserFriends, unfriendUser } from "../lib/api";
import { getLanguageFlag } from "../components/FriendCard"; 
import { capitialize } from "../lib/utils";
import { Link } from "react-router-dom";

const MyFriends = () => {
  const queryClient = useQueryClient();

  // Fetch friends
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  // Unfriend mutation
  const { mutate: unfriendMutation, isPending } = useMutation({
    mutationFn: unfriendUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
    onError: (error) => {
      console.error("Error unfriending user:", error);
    },
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

              {/* Actions */}
              <div className="flex gap-2 w-full mt-4">
                {/* Message button */}
                <Link
                  to={`/chat/${friend._id}`}
                  className="btn btn-outline flex-1"
                >
                  Message
                </Link>

                {/* Unfriend button */}
                <button
                  className="btn btn-error flex-1"
                  disabled={isPending}
                  onClick={() => unfriendMutation(friend._id)}
                >
                  {isPending ? "Removing..." : "Unfriend"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyFriends;
