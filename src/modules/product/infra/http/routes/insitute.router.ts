import { Router } from "express";
import { instituteControllerInstance } from '../controllers';

const InstituteCouter = Router();
InstituteCouter.post("/createInstitute", instituteControllerInstance.createInstitute);
InstituteCouter.get("/getAllInstitutes", instituteControllerInstance.getAllInstitutes);
InstituteCouter.get("/getInstituteById/:id", instituteControllerInstance.getInstituteById);
InstituteCouter.put("/updateInstitute/:id", instituteControllerInstance.updateInstitute);
InstituteCouter.delete("/deleteInstitute/:id", instituteControllerInstance.deleteInstitute);
InstituteCouter.post("/updateInstituteByFields", instituteControllerInstance.updateInstituteByFields);


export default InstituteCouter;