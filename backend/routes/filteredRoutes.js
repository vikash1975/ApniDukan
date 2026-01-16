import express from 'express'
import { getFilteredProducts } from '../controllers/filteredController.js';

const filteredRoutes=express.Router();

filteredRoutes.get("/", getFilteredProducts);

export default filteredRoutes;