import jwt from 'jsonwebtoken';

export const userAuth=async(req,res,next)=>{
    const authHeader=req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token=authHeader.split(" ")[1];

  try {
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    if(decoded.role!=="user"){
        return res.status(403).json({ message: "User access only" });
    }
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}