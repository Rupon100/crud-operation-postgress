import { Request, Response } from "express";
import { pool } from "../../config/db";
import { userService } from "./user.service";


const createUser = async (req: Request, res: Response) => {
    try{
        const result = await userService.createUser(req.body);
        console.log(result.rows[0]);

        res.status(200).json({
            success: true,
            message: "data inserted successfully!",
            data: result.rows[0]
        })

    }catch(err: any){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const getUser = async(req: Request, res: Response) => {
    try{
        const result = await userService.getUser();
        res.status(200).json({
            success: true,
            message: "users retrieved successfully!",
            data: result.rows
        })
    }catch(err: any){
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
}

const getSingleUser = async(req: Request, res: Response) => {
    try{
        const result = await userService.getSingleUser(req.params.id!);

        if(result.rows.length === 0){
            res.status(404).json({
                success: false,
                message: `No user for ${req.params.id}`
            })
        }else{
            res.status(200).send({
                message: req.params,
                data: result.rows
            })
        }
    }catch(err: any){
        res.status(500).json({
            success: false,
            message: "server error",
            error: err.message 
        })
    }
}

const updateUser = async(req: Request, res: Response) => {
    const {name, email} = req.body;
    try{
        const result = await userService.updateUser(name, email, req.params.id!)

        if(result.rows.length === 0){
            res.status(404).json({
                success: false,
                message: `No user for ${req.params.id}`
            })
        }else{
            res.status(200).send({
                message: "User updated successfully!",
                data: result.rows
            })
        }
    }catch(err: any){
        res.status(500).json({
            success: false,
            message: "server error",
            error: err.message 
        })
    }
}

const deleteUser = async(req: Request, res: Response) => {
    try{
        const result = await userService.deleteUser(req.params.id!);

        console.log(result)

        if(result.rowCount === 0){
            res.status(404).json({
                success: false,
                message: `User deleted successfully!`
            })
        }else{
            res.status(200).send({
                message: req.params,
                data: "deleted successfully"
            })
        }
    }catch(err: any){
        res.status(500).json({
            success: false,
            message: "server error",
            error: err.message 
        })
    }
}

export const userControllers = {
    createUser,
    getUser,
    getSingleUser,
    updateUser,
    deleteUser,

}

