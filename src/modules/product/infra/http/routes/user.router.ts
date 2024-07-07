import { Router } from "express";
import { userControllerInstance } from '../controllers';


const UserRouter = Router();

UserRouter.post("/createUser", userControllerInstance.createUser);
UserRouter.get("/fetchAllUsers/:campusId", userControllerInstance.fetchAllUsers);
UserRouter.get("/fetchAllActiveInactiveUsers/:campusId/:type/:empType", userControllerInstance.fetchAllActiveInactiveUsers);
UserRouter.get("/getUserById/:id", userControllerInstance.getUserById);
UserRouter.post("/loginUserByIdPassword", userControllerInstance.loginUserByIdPassword);
UserRouter.post("/resetMyPassword", userControllerInstance.resetMyPassword);
UserRouter.put("/updateUserById/:id", userControllerInstance.updateUser);
UserRouter.delete("/deleteUserById/:id", userControllerInstance.deleteUser);
UserRouter.post("/updateUserByFields", userControllerInstance.updateUserByFields);
UserRouter.post("/updateThemeAndPhoto", userControllerInstance.updateThemeAndPhoto);
UserRouter.get("/getActiveUsersByType/:campusId/:empType/:classId/:sectionId", userControllerInstance.getActiveUsersByType);
UserRouter.get("/getAllActiveMenus/:campusId", userControllerInstance.getAllActiveMenus);
UserRouter.get("/getAllMenusAsCreatersJSON/:campusId", userControllerInstance.getAllMenusAsCreatersJSON);
UserRouter.get("/getAllActivePermissions/:campusId", userControllerInstance.getAllActivePermissions);
UserRouter.post("/addUpdateRoles", userControllerInstance.addUpdateRoles);
UserRouter.get("/deleteUserRole/:id/:campusId", userControllerInstance.deleteUserRole);
UserRouter.post("/updateUserPermission", userControllerInstance.updateUserPermission);
UserRouter.get("/deactivateUser/:id/:campusId/:currentUserId", userControllerInstance.deactivateUser);


export default UserRouter;