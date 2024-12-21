import { InjectionMode, createContainer, asClass } from 'awilix';
import { UserController } from './auth/user.controller';
import { InstituteController } from './institute.controller';
import { TransportController } from './transport-route.controller';
import { ClassSectionController } from './academic/class-section.controller';
import { StudentController } from './academic/student.controller';
import { StaffAccountantController } from './staffAccounts/staffacc.controller';
import { MasterController } from './general/master.controller';
import { SubjectsController } from './academic/subjects.controller';
import { ParentController } from './parent/parent.controller';
import { AttendanceController } from './attendance/attendance.controller';
import { AccountingController } from './accounting/accounting.controller';
import { SalaryController } from './salary/salary.controller';
import { ExamController } from './exam/exam.controller';

const container = createContainer({
  injectionMode: InjectionMode.PROXY,
});

container.register({
  masterController: asClass(MasterController).proxy(),
  userController: asClass(UserController).proxy(),
  instituteController: asClass(InstituteController).proxy(),
  transportController: asClass(TransportController).proxy(),
  classSectionController: asClass(ClassSectionController).proxy(),
  studentController: asClass(StudentController).proxy(),
  staffAccController: asClass(StaffAccountantController).proxy(),
  parentController: asClass(ParentController).proxy(),
  subjectController: asClass(SubjectsController).proxy(),
  attendanceController: asClass(AttendanceController).proxy(),
  accountingController: asClass(AccountingController).proxy(),
  salaryController: asClass(SalaryController).proxy(),
  examController: asClass(ExamController).proxy(),
});

export const masterControllerInstance = container.resolve<MasterController>('masterController');
export const userControllerInstance = container.resolve<UserController>('userController');
export const instituteControllerInstance = container.resolve<InstituteController>('instituteController');
export const transportControllerInstance = container.resolve<TransportController>('transportController');
export const classSectionControllerInstance = container.resolve<ClassSectionController>('classSectionController');
export const studentControllerInstance = container.resolve<StudentController>('studentController');
export const staffAccControllerInstance = container.resolve<StaffAccountantController>('staffAccController');
export const parentControllerInstance = container.resolve<ParentController>('parentController');
export const subjectControllerInstance = container.resolve<SubjectsController>('subjectController');
export const attendanceControllerInstance = container.resolve<AttendanceController>('attendanceController');
export const accountingControllerInstance = container.resolve<AccountingController>('accountingController');
export const salaryControllerInstance = container.resolve<SalaryController>('salaryController');
export const examControllerInstance = container.resolve<ExamController>('examController');
export default container;
