import { InjectionMode, createContainer, asClass } from 'awilix';
import { UserController } from './auth/user.controller';
import { InstituteController } from './institute.controller';
import { TransportController } from './transport-route.controller';
import { ClassSectionController } from './academic/class-section.controller';
import { StudentController } from './academic/student.controller';
import { StaffAccountantController } from './staffAccounts/staffacc.controller';
import { MasterController } from './general/master.controller';
import { SubjectsController } from './academic/subjects.controller';

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
  subjectController: asClass(SubjectsController).proxy(),
});

export const masterControllerInstance = container.resolve<MasterController>('masterController');
export const userControllerInstance = container.resolve<UserController>('userController');
export const instituteControllerInstance = container.resolve<InstituteController>('instituteController');
export const transportControllerInstance = container.resolve<TransportController>('transportController');
export const classSectionControllerInstance = container.resolve<ClassSectionController>('classSectionController');
export const studentControllerInstance = container.resolve<StudentController>('studentController');
export const staffAccControllerInstance = container.resolve<StaffAccountantController>('staffAccController');
export const subjectControllerInstance = container.resolve<SubjectsController>('subjectController');


export default container;
