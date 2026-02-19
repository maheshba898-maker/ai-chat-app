// import express from "express";
// import bcrypt from "bcryptjs";
// import user from "../models/user.js";

// const router = express.Router();

// // Registe user
// router.post("/register",async(req,res)=>{
//     try{
//         const {name,email,password}=req.body;
//         const exist = await user.findOne({email});
//         if (exist) return res.status(400).json({message:"user already exists"});

//         const hashed = await bcrypt.hash(password,10);
//         const user = await user.create({name,email,password:hashed});
//         res.status(201).json({success:true,user});
//     }catch (error){
//         res.status(500).json({success:false,message:error.message});
//     }
// });

// // Login user
// router.post("/login",async(req,res)=>{
//     try{
//         const {eamil, password} = req.body;
//         const user = await user.findOne({email});
//         if(!user) return res.status(400).json({message:"user not found"});

//         const isMatch = await bcrypt.compare(password, user.password);
//         if(!isMatch) return res.status(400).json({message:"Invalid credentials"});

//         res.json({success:true,message:"Login Succcessful",user});
//     }catch(error){
//         res.status(500).json({success:false,message:error.message});
//     }
// });
// export default router;

import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.js"; // Capitalized model name
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();

// Register user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "user already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashed });

    res.status(201).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body; // fixed typo eamil->email

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "user not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.json({ success: true, message: "Login Successful", user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
