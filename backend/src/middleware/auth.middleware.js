import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    // 1. Get token from cookies
    const token = req.cookies.jwt;

    // 2. Check if token exists
    if (!token) {
      // Agar token nahi hai, to aage badhne ki zaroorat nahi
      return res.status(401).json({ error: "Unauthorized - No Token Provided" });
    }

    // 3. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // 4. Check if token verification failed
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }

    // 5. Find the user in the database (password field mat select karo)
    const user = await User.findById(decoded.userId).select("-password");

    // 6. Check if user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 7. Attach user to the request object
    req.user = user;
    next(); // Sab theek hai, ab agle function par jaao

  } catch (error) {
    // 8. Agar upar kahin bhi koi galti aayi, to use yahan pakdo
    console.error("Error in protectRoute middleware: ", error.message);
    // JWT errors often have specific names
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token signature' });
    }
    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token has expired' });
    }
    // General server error for other issues
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
