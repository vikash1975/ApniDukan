import express from 'express';
import { loginAdmin, signupAdmin } from '../controllers/adminController.js';


 const adminRoutes=express.Router();

adminRoutes.post("/signup", signupAdmin);

adminRoutes.post("/login", loginAdmin);

export default adminRoutes;