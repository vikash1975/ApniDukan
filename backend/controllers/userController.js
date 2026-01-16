import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';


export const signup=async(req,res)=>{
    try {
        const {name,email,password}=req.body;
        if(!name || !email || !password){
            return res.status(401).json({message:"All fields are required"})
        }

        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(401).json({message:"User already exists"})
        }
         const hashPassword=await bcrypt.hash(password,10); 

        const user=await User.create({name,email,password:hashPassword});

        res.status(200).json({message:"SignUp Successfully", user});
    } catch (error) {
        console.error('User signup error:', error.message);
        res.status(500).json({message:"server error"})
        
    }
}



export const login=async(req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(401).json({message:"All fields required"});
        }

        const user = await User.findOne({ email });

        if(!user){
            return res.status(401).json({message:"Invalid Credentials"})
        }

        const matchPass=await bcrypt.compare(password,user.password);
        if(!matchPass){
            return res.status(401).json({message:"Invalid Credentials"})
        }

        const token=jwt.sign(
           {userId:user._id,role:"user"},
           process.env.JWT_SECRET || "secretkey",
           {expiresIn:"1d"}
        )
        res.status(200).json({message:"Login Successfully", token})
    } catch (error) {
          console.error('User login error:', error.message);
        res.status(401).json({message:"server error"})
      
    }
}