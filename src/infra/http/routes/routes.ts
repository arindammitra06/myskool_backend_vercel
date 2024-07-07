import { Router } from 'express';

import DefaultRouter from '../../../modules/status/infra/http/routes/default.route';
import ClassSectionRouter from '../../../modules/product/infra/http/routes/class-section.router';
import InstituteCouter from '../../../modules/product/infra/http/routes/insitute.router';
import StudentRouter from '../../../modules/product/infra/http/routes/student.router';
import TransportRouter from '../../../modules/product/infra/http/routes/transport.route';
import UserRouter from '../../../modules/product/infra/http/routes/user.router';
import StaffAccRouter from '../../../modules/product/infra/http/routes/staffAcc.route';
import MasterRouter from '../../../modules/product/infra/http/routes/master.router';
import SubjectRouter from '../../../modules/product/infra/http/routes/subject.router';
import ParentRouter from '../../../modules/product/infra/http/routes/parent.route';
import AttendanceRouter from '../../../modules/product/infra/http/routes/attendance.router';
import AccountingRouter from '../../../modules/product/infra/http/routes/accounting.router';


const Routes = Router();
Routes.use('/', DefaultRouter);
Routes.use("/master", MasterRouter);
Routes.use("/user", UserRouter);
Routes.use("/institute", InstituteCouter);
Routes.use("/transportRoute", TransportRouter);
Routes.use("/class-sections", ClassSectionRouter);
Routes.use("/student", StudentRouter);
Routes.use("/staff-acc", StaffAccRouter);
Routes.use("/parent", ParentRouter);
Routes.use("/subjects", SubjectRouter);
Routes.use("/attendance", AttendanceRouter);
Routes.use("/accounting", AccountingRouter);
export default Routes;
