import { useAuth, useUser } from "@clerk/clerk-expo";

export const usePostUserData = () => {
  const { isSignedIn } = useAuth()
  const { user } = useUser()

  const postUserData = async () => {
    if (!isSignedIn || !user?.id) {
      console.log("Auth state:", { isSignedIn, user, userId: user?.id });
      return;
    }

    try {
      const response = await fetch(
        "https://linkedin-voice-backend.vercel.app/api/postUserData",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        }
      );

      const result = await response.json();
      console.log("Response:", result);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return { postUserData };
};
