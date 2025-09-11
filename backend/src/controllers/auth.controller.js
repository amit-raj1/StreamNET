import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export async function signup(req, res) {
  const { email, password, fullName } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists, please use a diffrent one" });
    }

    const idx = Math.floor(Math.random() * 100) + 1; // generate a num between 1-100
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = await User.create({
      email,
      fullName,
      password,
      profilePic: randomAvatar,
    });

    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });
      console.log(`Stream user created for ${newUser.fullName}`);
    } catch (error) {
      console.log("Error creating Stream user:", error);
    }

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function createAdmin(req, res) {
  try {
    const { email, password, fullName, adminSecretKey } = req.body;

    // ALWAYS verify admin secret key - required for all admin creation (no exceptions)
    if (!adminSecretKey || adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({ 
        message: "Admin secret key is required for creating any admin account" 
      });
    }

    // Check if master admin already exists
    const existingMasterAdmin = await User.findOne({ isMasterAdmin: true });
    
    if (existingMasterAdmin) {
      // If master admin exists, only they can create new admins
      if (!req.user || !req.user.isMasterAdmin) {
        return res.status(403).json({ 
          message: "Only the master administrator can create new admin accounts" 
        });
      }
    }

    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    // Determine admin type:
    // - If no master admin exists, this becomes the master admin
    // - If master admin exists, this becomes a regular admin
    const shouldBeMaster = !existingMasterAdmin;

    const newAdmin = await User.create({
      email,
      fullName,
      password,
      profilePic: randomAvatar,
      isAdmin: true,
      isMasterAdmin: shouldBeMaster, // Only true if no master admin exists
      isOnboarded: true,
    });

    try {
      await upsertStreamUser({
        id: newAdmin._id.toString(),
        name: newAdmin.fullName,
        image: newAdmin.profilePic || "",
      });
      console.log(`Stream admin user created for ${newAdmin.fullName}`);
    } catch (error) {
      console.log("Error creating Stream admin user:", error);
    }

    const token = jwt.sign({ userId: newAdmin._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    res.status(201).json({ 
      success: true, 
      user: newAdmin,
      message: shouldBeMaster ? 
        "Master admin account created successfully" : 
        "Admin account created successfully"
    });
  } catch (error) {
    console.log("Error in createAdmin controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid email or password" });

    // --- Start Debugging Step ---
    // Log the secret key being used to SIGN the token
    console.log("Token SIGNED with secret:", process.env.JWT_SECRET_KEY);
    // --- End Debugging Step ---
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export function logout(req, res) {
  // Clear the cookie with all possible configurations for better cross-browser compatibility
  res.clearCookie("jwt", {
    path: "/",
    domain: process.env.NODE_ENV === "production" ? ".vercel.app" : undefined,
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  
  // Also clear cookie without domain for local environments
  res.clearCookie("jwt", {
    path: "/",
    httpOnly: true,
    sameSite: "None", 
    secure: true,
  });
  
  // Additional cookie clearing for different paths and domains
  res.clearCookie("jwt");
  
  res.status(200).json({ success: true, message: "Logout successful" });
}

export async function onboard(req, res) {
  try {
    const userId = req.user._id;

    const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;

    if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
      console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`);
    } catch (streamError) {
      console.log("Error updating Stream user during onboarding:", streamError.message);
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Onboarding error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
