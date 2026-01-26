
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";




export const signupAdmin = async (req, res) => {
  try {
    const { name, email, password, adminSecret } = req.body;

    if (!name || !email || !password || !adminSecret) {
      return res.status(401).json({ message: "All fields are required" });
    }

    console.log("ENV SECRET:", process.env.ADMIN_SECRET);
    console.log("BODY SECRET:", adminSecret);

    if (adminSecret.trim() !== process.env.ADMIN_SECRET.trim()) {
      return res.status(402).json({ message: "Invalid Admin secret" });
    }

    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      return res.status(403).json({ message: "Admin already exists" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(405).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role: "admin"
    });

    const token = jwt.sign(
      { adminId: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "Admin registered successfully",
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name
      }
    });

  } catch (error) {
    console.log("Admin signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



export const loginAdmin=async(req,res)=>{
  try {
    const {email ,password}=req.body;
    if(!email || !password){
      return res.status(400).json({message:"All fields required"})
    }

    const admin=await Admin.findOne({email});
    if(!admin){
      return res.status(401).json({message:"Invalid Credentials"})
    }

    const matchPass=await bcrypt.compare(password,admin.password);
    if(!matchPass){
      return res.status(401).json({message:"Invalid Credentials"});
    }

    const token=jwt.sign(
      {adminId:admin._id,role:"admin"},
     process.env.JWT_SECRET || "secretkey",
      {expiresIn:"1d"}
    )

    res.status(200).json({message:"Login Successfully",token})
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}