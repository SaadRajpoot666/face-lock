import { useAuth } from "./context/UserContext";

export const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white">
      <div className="bg-[#0f0f0f] bg-opacity-60 backdrop-blur-lg rounded-xl p-10 border border-blue-500 text-center shadow-2xl">
        <h1 className="text-3xl font-bold text-blue-400 mb-4">
          Welcome, {user?.name}! 👋
        </h1>
        {user?.age && (
          <p className="text-lg text-gray-300 mb-4">
            Hmm... You look around <span className="text-blue-400 font-semibold">{user.age}</span> years old 😉
          </p>
        )}
        {user?.gender && (
          <p className="text-lg text-gray-300 mb-4">
            Gender:<span className="text-blue-400 font-semibold">{user.gender}</span> 
          </p>
        )}
        {user?.emotion && (
          <p className="text-lg text-gray-300 mb-4">
            Emotion:<span className="text-blue-400 font-semibold">{user.emotion}</span>
          </p>
        )}
        <button
          onClick={logout}
          className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};
