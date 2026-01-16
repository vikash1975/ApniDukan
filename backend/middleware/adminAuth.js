import jwt from 'jsonwebtoken';
export const adminAuth=async(req,res,next)=>{
    const token=req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(400).json({message:"No token"})
    }

    try {
        const decoded=jwt.verify(token,  process.env.JWT_SECRET || "secretkey");
        if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

        req.adminId = decoded.adminId;
        // Provide a light-weight `req.admin` object for controllers that expect it
        req.admin = { _id: decoded.adminId };
        next();

    } catch (error) {
        console.error('Admin auth error:', error.message);
        
         res.status(401).json({ message: "Invalid token" });
    }
}