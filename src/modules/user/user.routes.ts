import express, { Request, Response } from "express";
import { pool } from "../../config/db";
import { userControllers } from "./user.controller";

const router = express.Router();

// routes -> controller -> services

router.post('/', userControllers.createUser);
// we don't call function from the userControllers.createUser because those function does not return anything just send response

router.get('/', userControllers.getUser)

// get single user
router.get('/:id', userControllers.getSingleUser);

// update user
router.put('/:id', userControllers.updateUser)

// delete user
router.delete('/:id', userControllers.deleteUser)


export const userRoutes = router;