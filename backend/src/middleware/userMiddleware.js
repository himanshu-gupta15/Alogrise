import jwt from "jsonwebtoken";
import User from "../models/user.js";
import redisClient from "../config/redis.js";

const userMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Token is not present");
    }

    const payload = jwt.verify(token, process.env.JWT_KEY);
    const { _id } = payload;

    if (!_id) {
      throw new Error("Invalid token");
    }

    const result = await User.findById(_id);
    if (!result) {
      throw new Error("User doesn't exist");
    }

    let isBlocked = 0;
    if (redisClient.isReady) {
      isBlocked = await redisClient.exists(`token:${token}`);
    }
    if (isBlocked) {
      throw new Error("Invalid token");
    }

    req.result = result;
    next();
  } catch (error) {
    res.status(401).send("Error: " + error.message);
  }
};

export { userMiddleware };
