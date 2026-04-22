import { InjectionMode, createContainer, asClass } from 'awilix';
import { ClassSectionController } from './academic/class-section.controller.js';
import { StudentController } from './academic/student.controller.js';
import { SubjectsController } from './academic/subjects.controller.js';
import { AccountingController } from './accounting/accounting.controller.js';
import { AttendanceController } from './attendance/attendance.controller.js';
import { UserController } from './auth/user.controller.js';
import { ExamController } from './exam/exam.controller.js';
import { ChatController } from './general/chat.controller.js';
import { MasterController } from './general/master.controller.js';
import { InstituteController } from './institute.controller.js';
import { ParentController } from './parent/parent.controller.js';
import { SalaryController } from './salary/salary.controller.js';
import { StaffAccountantController } from './staffAccounts/staffacc.controller.js';
import { TransportController } from './transport-route.controller.js';

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
  chatController: asClass(ChatController).proxy(),
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
export const chatControllerInstance = container.resolve<ChatController>('chatController');
export default container;
