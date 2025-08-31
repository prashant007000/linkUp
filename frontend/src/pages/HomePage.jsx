import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router-dom"; // Corrected import
import { CheckCircle, MapPin, Search, UserPlus, Users } from "lucide-react";
import { motion } from "framer-motion";

import FriendCard, { getLanguageFlag } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import { capitialize } from "../lib/utils";
import useAuthUser from "../hooks/useAuthUser";

const HomePage = () => {
  const queryClient = useQueryClient();
  const { authUser } = useAuthUser();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
    },
  });

  useEffect(() => {
    if (outgoingFriendReqs) {
      const outgoingIds = new Set(outgoingFriendReqs.map((req) => req.recipient._id));
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className='min-h-screen bg-base-200/50' data-theme='fantasy'>
      <div className='container mx-auto p-4 sm:p-6 lg:p-8 space-y-12'>
        {/* WELCOME HEADER */}
        <motion.div
          className='card bg-base-100 shadow-md p-6'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
            <div>
              <h1 className='text-3xl font-bold tracking-tight'>Welcome back, {authUser?.fullName.split(" ")[0]}!</h1>
              <p className='text-base-content/70 mt-1'>Ready to connect and learn today?</p>
            </div>
            <Link to='/notifications' className='btn btn-primary btn-outline'>
              <Users className='mr-2 size-4' />
              Friend Requests
            </Link>
          </div>
        </motion.div>

        {/* YOUR FRIENDS SECTION */}
        <motion.section initial='hidden' animate='visible' variants={containerVariants}>
          <motion.h2 variants={itemVariants} className='text-2xl font-bold tracking-tight mb-6'>
            Your Friends
          </motion.h2>

          {loadingFriends ? (
            <div className='flex justify-center py-12'>
              <span className='loading loading-spinner loading-lg' />
            </div>
          ) : friends.length === 0 ? (
            <NoFriendsFound />
          ) : (
            <motion.div
              className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              variants={containerVariants}
            >
              {friends.map((friend) => (
                <motion.div key={friend._id} variants={itemVariants}>
                  <FriendCard friend={friend} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.section>

        {/* MEET NEW LEARNERS SECTION */}
        <motion.section initial='hidden' animate='visible' variants={containerVariants}>
          <motion.div variants={itemVariants} className='mb-8'>
            <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>Meet New Learners</h2>
            <p className='text-base-content/70 mt-1'>
              Discover language exchange partners based on your profile.
            </p>
          </motion.div>

          {loadingUsers ? (
            <div className='flex justify-center py-12'>
              <span className='loading loading-spinner loading-lg' />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className='card bg-base-100 p-8 text-center shadow'>
                <Search className="mx-auto size-12 text-base-content/30 mb-4" />
              <h3 className='font-semibold text-lg mb-1'>No Recommendations Yet</h3>
              <p className='text-base-content/70'>Check back later for new language partners!</p>
            </div>
          ) : (
            <motion.div
              className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
              variants={containerVariants}
            >
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
                return (
                  <motion.div
                    key={user._id}
                    className='card bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden'
                    variants={itemVariants}
                  >
                    <div className='card-body p-5 space-y-3'>
                      <div className='flex items-center gap-4'>
                        <div className='avatar'>
                          <div className='w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2'>
                            <img src={user.profilePic} alt={user.fullName} />
                          </div>
                        </div>
                        <div className='flex-1'>
                          <h3 className='font-bold text-lg'>{user.fullName}</h3>
                          {user.location && (
                            <div className='flex items-center text-xs text-base-content/70 mt-1'>
                              <MapPin className='size-3 mr-1.5' />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      {user.bio && (
                        <p className='text-sm text-base-content/80 border-l-2 border-primary/20 pl-3'>
                          {user.bio}
                        </p>
                      )}

                      <div className='flex flex-wrap gap-2 text-xs'>
                        <span className='badge badge-primary badge-outline'>
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitialize(user.nativeLanguage)}
                        </span>
                        <span className='badge badge-secondary badge-outline'>
                          {getLanguageFlag(user.learningLanguage)}
                          Learning: {capitialize(user.learningLanguage)}
                        </span>
                      </div>

                      <div className='card-actions justify-end pt-2'>
                        <button
                          className={`btn btn-sm w-full ${
                            hasRequestBeenSent ? "btn-success btn-outline" : "btn-primary"
                          }`}
                          onClick={() => sendRequestMutation(user._id)}
                          disabled={hasRequestBeenSent || isPending}
                        >
                          {hasRequestBeenSent ? (
                            <>
                              <CheckCircle className='size-4 mr-2' />
                              Request Sent
                            </>
                          ) : (
                            <>
                              <UserPlus className='size-4 mr-2' />
                              Send Request
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </motion.section>
      </div>
    </div>
  );
};

export default HomePage;
