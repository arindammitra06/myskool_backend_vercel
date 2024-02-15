import { Router } from "express";
import { transportControllerInstance } from '../controllers';


const TransportRouter = Router();
TransportRouter.post("/createTransportRoute", transportControllerInstance.createTransportRoute);
TransportRouter.get("/getAllTransportRoute/:campusId", transportControllerInstance.getAllTransportRoutes);
TransportRouter.get("/getTransportRouteById/:id/:campusId", transportControllerInstance.getTransportRouteById);
TransportRouter.put("/updateTransportRoute/:id/:campusId", transportControllerInstance.updateTransportRoute);
TransportRouter.delete("/deleteTransportRoute/:id/:campusId", transportControllerInstance.deleteTransportRoute);

export default TransportRouter;