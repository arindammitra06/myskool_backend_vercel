import { Router } from "express";
import { userControllerInstance } from '../controllers';


const UserRouter = Router();

UserRouter.post("/createUser", userControllerInstance.createUser);
UserRouter.get("/fetchAllUsers/:campusId", userControllerInstance.fetchAllUsers);
UserRouter.post("/fetchUserDropdownForSearch", userControllerInstance.fetchUserDropdownForSearch);
UserRouter.get("/fetchAllActiveInactiveUsers/:campusId/:type/:empType", userControllerInstance.fetchAllActiveInactiveUsers);
UserRouter.get("/getUserById/:id", userControllerInstance.getUserById);
UserRouter.post("/loginUserByIdPassword", userControllerInstance.loginUserByIdPassword);
UserRouter.post("/resetMyPassword", userControllerInstance.resetMyPassword);
UserRouter.put("/updateUserById/:id", userControllerInstance.updateUser);
UserRouter.delete("/deleteUserById/:id", userControllerInstance.deleteUser);
UserRouter.post("/updateUserByFields", userControllerInstance.updateUserByFields);
UserRouter.post("/updateBankInformation", userControllerInstance.updateBankInformation);
UserRouter.post("/updateLoggedInUserByFields", userControllerInstance.updateLoggedInUserByFields);
UserRouter.post("/updateThemeAndPhoto", userControllerInstance.updateThemeAndPhoto);
UserRouter.post("/updateInstituteDefaultTheme", userControllerInstance.updateInstituteDefaultTheme);
UserRouter.get("/getActiveUsersByType/:campusId/:empType/:classId/:sectionId", userControllerInstance.getActiveUsersByType);
UserRouter.get("/getAllActiveMenus/:campusId", userControllerInstance.getAllActiveMenus);
UserRouter.get("/getAllMenusAsCreatersJSON/:campusId", userControllerInstance.getAllMenusAsCreatersJSON);

UserRouter.get("/getAllAccesses/:campusId", userControllerInstance.getAllAccesses);

UserRouter.get("/getAllActivePermissions/:campusId", userControllerInstance.getAllActivePermissions);
UserRouter.post("/addUpdateRoles", userControllerInstance.addUpdateRoles);
UserRouter.get("/deleteUserRole/:id/:campusId/:currentUserId", userControllerInstance.deleteUserRole);
UserRouter.post("/updateUserPermission", userControllerInstance.updateUserPermission);
UserRouter.get("/deactivateUser/:id/:campusId/:currentUserId", userControllerInstance.deactivateUser);

UserRouter.get("/getUserOverviewById/:id/:usertype/:campusId", userControllerInstance.getUserOverviewById);
export default UserRouter;