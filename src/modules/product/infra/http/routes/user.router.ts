import { Router } from "express";
import { userControllerInstance } from '../controllers';


const UserRouter = Router();

UserRouter.post("/createUser", userControllerInstance.createUser);
UserRouter.get("/getAllUsers", userControllerInstance.getAllUsers);
UserRouter.get("/getUserById/:id", userControllerInstance.getUserById);
UserRouter.post("/loginUserByIdPassword", userControllerInstance.loginUserByIdPassword);
UserRouter.put("/updateUserById/:id", userControllerInstance.updateUser);
UserRouter.delete("/deleteUserById/:id", userControllerInstance.deleteUser);

export default UserRouter;