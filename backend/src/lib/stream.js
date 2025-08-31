import { StreamChat } from "stream-chat";

// .env file se keys uthao (Naam theek kar diya hai)
const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

// Ab hum check karenge ki keys mili ya nahi. Agar nahi, to server start hi nahi hoga.
if (!apiKey || !apiSecret) {
  throw new Error("FATAL ERROR: Stream API key or Secret is missing from .env file");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUser(userData); // 'upsertUsers' ko 'upsertUser' kar diya for single user
    return userData;
  } catch (error) {
    console.error("Error upserting Stream user", error);
    // Error ko aage bhej do taaki controller use handle kar sake
    throw error;
  }
};

export const generateStreamToken = (userId) => {
  try {
    const userIdStr = userId.toString();
    return streamClient.createToken(userIdStr);
  } catch (error) {
    console.error("Error generating Stream token:", error);
    throw error;
  }
};
