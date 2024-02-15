import { InjectionMode, createContainer, asClass } from 'awilix';
import { UserController } from './auth/user.controller';
import { InstituteController } from './institute.controller';
import { TransportController } from './transport-route.controller';
import { ClassSectionController } from './academic/class-section.controller';
import { StudentController } from './academic/student.controller';

const container = createContainer({
  injectionMode: InjectionMode.PROXY,
});

container.register({
  userController: asClass(UserController).proxy(),
  instituteController: asClass(InstituteController).proxy(),
  transportController: asClass(TransportController).proxy(),
  classSectionController: asClass(ClassSectionController).proxy(),
  studentController: asClass(StudentController).proxy(),
});

export const userControllerInstance = container.resolve<UserController>('userController');
export const instituteControllerInstance = container.resolve<InstituteController>('instituteController');
export const transportControllerInstance = container.resolve<TransportController>('transportController');
export const classSectionControllerInstance = container.resolve<ClassSectionController>('classSectionController');
export const studentControllerInstance = container.resolve<StudentController>('studentController');

export default container;
