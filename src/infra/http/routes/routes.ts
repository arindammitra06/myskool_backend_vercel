import { Router } from 'express';

import DefaultRouter from '../../../modules/status/infra/http/routes/default.route';
import ClassSectionRouter from '../../../modules/product/infra/http/routes/class-section.router';
import InstituteCouter from '../../../modules/product/infra/http/routes/insitute.router';
import StudentRouter from '../../../modules/product/infra/http/routes/student.router';
import TransportRouter from '../../../modules/product/infra/http/routes/transport.route';
import UserRouter from '../../../modules/product/infra/http/routes/user.router';

const Routes = Router();

Routes.use('/', DefaultRouter);
Routes.use("/user", UserRouter);
Routes.use("/institute", InstituteCouter);
Routes.use("/transportRoute", TransportRouter);
Routes.use("/class-sections", ClassSectionRouter);
Routes.use("/student", StudentRouter);


export default Routes;
