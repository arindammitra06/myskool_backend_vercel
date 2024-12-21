import { Request, Response } from "express";
import { FeeStatus, FeeType, Gender, ParentType, Permission, UserType } from '@prisma/client';
import generator from 'generate-password-ts';
import { addANotification, encrypt, generateIdsForParentAndStudent, generateInvoiceNumber, getPermissionByName } from "../../../../../../shared/helpers/utils/generic.utils";
import { prisma } from "../../../../../../shared/db-client";
import moment from "moment";
import { sendAccountCreationEmail, sendEmail, sendSms } from "../../../../../../shared/helpers/notifications/notifications";
import { USER_CREATED, USER_DELETED, USER_UPDATED } from "../../../../../../shared/constants/notification.constants";


export class StudentController {


  public async createStudent(req: Request, res: Response) {

    const studentWithParents: any = req.body;
    const institute = await prisma.institute.findFirst();

    const password = generator.generate({
      length: 10,
      numbers: true,
      symbols: true
    });
    const encryptedPassword = encrypt(password);
    //console.log(password);
    let latestInvoiceObj = await prisma.mYAALInvoices.findFirst({
      orderBy: {
        id: 'desc',
      },
      take: 1,
    });
    let latestInvoiceID = latestInvoiceObj !== null && latestInvoiceObj !== undefined ? latestInvoiceObj.id : 0;
    const invoiceNumber = generateInvoiceNumber(latestInvoiceID + 1);


    const countOfStudentsInClassAndSection = await prisma.user.count({
      where: {
        classId: Number(studentWithParents.form.classId),
        sectionId: Number(studentWithParents.form.sectionId),
        campusId: Number(studentWithParents.form.campusId)
      },
    });

    let latestUserID = await prisma.user.findFirst({
      orderBy: {
        id: 'desc',
      },
      take: 1,
    });
    let parentPermission: Permission = await getPermissionByName('Parent');
    const studentID = generateIdsForParentAndStudent(latestUserID.id + 1, 'ST');
    const middleName = studentWithParents.form.middleName !== null && studentWithParents.form.middleName !== undefined ? studentWithParents.form.middleName : '';



    let createdStudentObj;


    try {
      await prisma.$transaction(async (tx) => {

        createdStudentObj = await prisma.user.create({
          data: {
            userType: UserType.student,
            firstName: studentWithParents.form.firstName,
            middleName: middleName,
            lastName: studentWithParents.form.lastName,
            displayName: studentWithParents.form.firstName + ' ' + middleName + ' ' + studentWithParents.form.lastName,
            citizenship: studentWithParents.form.citizenship,
            gender: studentWithParents.form.gender,
            dateOfBirth: moment(studentWithParents.form.dateOfBirth, 'DD-MM-YYYY').toDate(),
            placeOfBirth: studentWithParents.form.placeOfBirth,
            photo: studentWithParents.photo,
            thumbnailUrl: studentWithParents.thumbnailUrl,
            homeAddress: studentWithParents.form.homeAddress,
            routeId: studentWithParents.form.routeId !== null && studentWithParents.form.routeId !== undefined && studentWithParents.form.routeId !== '' ? Number(studentWithParents.form.routeId) : null as never,
            classId: Number(studentWithParents.form.classId),
            sectionId: Number(studentWithParents.form.sectionId),
            previousSchool: studentWithParents.form.previousSchool,
            admissionDate: moment(studentWithParents.form.admissionDate, 'DD-MM-YYYY').toDate(),
            active: 1,
            rollNumber: Number(countOfStudentsInClassAndSection + 1) as never,
            idCardNumber: studentID,
            updated_by: studentWithParents.updated_by,
            created_at: new Date(),
            updated_at: new Date(),
            created_by: studentWithParents.created_by,
            password: encryptedPassword,
            parentsNames: studentWithParents.form.fatherFullName + ' , ' + studentWithParents.form.motherFullName,
            campusId: Number(studentWithParents.form.campusId),
          },
        }).then(async (ceratedStudentResponse) => {


          if (ceratedStudentResponse !== null && ceratedStudentResponse !== undefined && ceratedStudentResponse.id !== null) {


            //create Student User Permission
            const createUserPermission = await prisma.userPermission.create({
              data: {
                userId: Number(ceratedStudentResponse.id),
                permissionId: Number(5),
                active: 1,
                campusId: Number(studentWithParents.form.campusId),
                updated_at: new Date(),
                updated_by: Number(studentWithParents.created_by),
                created_at: new Date(),
                created_by: Number(studentWithParents.created_by)
              },
            });

            //Send Email and SMS and notification
            //Add notification
            addANotification(Number(studentWithParents.form.campusId),
              Number(ceratedStudentResponse.id),
              Number(studentWithParents.created_by),
              USER_CREATED + ceratedStudentResponse.displayName);

            const newEntry = await prisma.user.findUnique({
              where: {
                id: Number(ceratedStudentResponse.id),
                campusId: Number(studentWithParents.form.campusId)
              },
              include: {
                class: true,
                section: true,
                campus: {
                  include: {
                    institute: {
                      include: {
                        session: true
                      }
                    }
                  }
                }
              }
            }).then((value) => {
              //console.log(value)
              sendSms('Admission SMS',
                {
                  student_name: value.displayName,
                  parent_1: value.parentsNames,
                  parent_1_phone: value.mobile,
                  parent_2: value.parentsNames,
                  parent_2_phone: value.mobile,
                  roll_no: value.rollNoProcessed,
                  student_id_card: value.idCardNumber,
                  institute_name: value.campus.institute.instituteName,
                  institute_campus: value.campus.campusName,
                  class_name: value.class.className,
                  section_name: value.section.sectionName,
                  session: value.campus.institute.session.session,

                  campusId: value.campus.id,
                  loggedInUserId: Number(studentWithParents.form.created_by),
                  studentOrTeacherId: null,
                  classId: value.class.id,
                  sectionId: value.section.id,
                },
                [
                  '+919836618119'
                ]);

              sendEmail('Admission Email',
                {
                  student_name: value.displayName,
                  parent_1: value.parentsNames,
                  parent_1_phone: value.mobile,
                  parent_2: value.parentsNames,
                  parent_2_phone: value.mobile,
                  roll_no: value.rollNoProcessed,
                  student_id_card: value.idCardNumber,
                  institute_name: value.campus.institute.instituteName,
                  institute_campus: value.campus.campusName,
                  class_name: value.class.className,
                  section_name: value.section.sectionName,
                  session: value.campus.institute.session.session,
                  campusId: value.campus.id,
                  loggedInUserId: Number(studentWithParents.form.created_by),
                  studentOrTeacherId: null,
                  classId: value.class.id,
                  sectionId: value.section.id,
                },
                [
                  {
                    name: studentWithParents.form.fatherFullName,
                    email: studentWithParents.form.fatherEmail
                  },
                  {
                    name: studentWithParents.form.motherFullName,
                    email: studentWithParents.form.motherEmail
                  }
                ]
              );
            });


            const fatherId = generateIdsForParentAndStudent(latestUserID.id + 2, 'P1');
            const motherId = generateIdsForParentAndStudent(latestUserID.id + 3, 'P2');



            //Create Parents and their relationship
            if (studentWithParents.form.createParentAccount === 1) {

              const parent1Present = await prisma.user.findFirst({
                where: {
                  CNIC: studentWithParents.form.fatherID,
                  campusId: Number(studentWithParents.form.campusId)
                },
              })
              if (parent1Present !== null && parent1Present !== undefined) {
                console.log('Parent 1 already exists --' + parent1Present.displayName + ', Hence mapping to student');
                await prisma.parentChildRelation.create({
                  data: {
                    parentId: parent1Present.id,
                    childrenId: ceratedStudentResponse.id,
                  },
                });
              } else {
                const parent1 = await prisma.user.create({
                  data: {
                    userType: UserType.parent,
                    firstName: studentWithParents.form.fatherFullName.split(' ').slice(0, -1).join(' '),
                    middleName: '',
                    lastName: studentWithParents.form.fatherFullName.split(' ').slice(-1).join(' '),
                    displayName: studentWithParents.form.fatherFullName,
                    citizenship: null,
                    gender: Gender.Male,
                    CNIC: studentWithParents.form.fatherID,
                    idProofPhoto: studentWithParents.form.fatherID,
                    religion: studentWithParents.form.fatherReligion,
                    profession: studentWithParents.form.fatherProfession,
                    email: studentWithParents.form.fatherEmail,
                    mobile: studentWithParents.form.fatherMobile,
                    whatsapp: studentWithParents.form.fatherWatsapp,
                    parentType: ParentType.Father,
                    idCardNumber: fatherId,
                    updated_by: studentWithParents.updated_by,
                    created_by: studentWithParents.created_by,
                    password: encryptedPassword,
                    campusId: Number(studentWithParents.form.campusId),
                    active: 1,
                  },
                });
                //create Parent 1 User Permission
                await prisma.userPermission.create({
                  data: {
                    userId: Number(parent1.id),
                    permissionId: parentPermission.id,
                    active: 1,
                    campusId: Number(studentWithParents.form.campusId),
                    updated_at: new Date(),
                    updated_by: Number(studentWithParents.created_by),
                    created_at: new Date(),
                    created_by: Number(studentWithParents.created_by)
                  },
                });
                await prisma.parentChildRelation.create({
                  data: {
                    parentId: parent1.id,
                    childrenId: ceratedStudentResponse.id,
                  },
                });

                //Create Parent 1 Family Credit
                await prisma.familyCredit.create({
                  data: {
                    userId: Number(parent1.id),
                    availableCredit: 0,
                    campusId: Number(studentWithParents.form.campusId),
                    updated_at: new Date(),
                    updated_by: Number(studentWithParents.created_by),
                    created_at: new Date(),
                    created_by: Number(studentWithParents.created_by)
                  },
                });

                // Send account creation email for parent 1
                sendAccountCreationEmail(
                  institute,
                  Number(studentWithParents.form.campusId),
                  parent1,
                  studentWithParents.created_by, parent1.idCardNumber, password);

                //Add notification
                addANotification(Number(studentWithParents.form.campusId),
                  Number(parent1.id),
                  Number(studentWithParents.created_by),
                  USER_CREATED + parent1.displayName);

              }



              const parent2Present = await prisma.user.findFirst({
                where: {
                  CNIC: studentWithParents.form.motherID,
                  campusId: Number(studentWithParents.form.campusId)
                },
              });


              if (parent2Present !== null && parent2Present !== undefined) {
                console.log('Parent 2 already exists --' + parent2Present.displayName + ', Hence mapping to student');

                await prisma.parentChildRelation.create({
                  data: {
                    parentId: parent2Present.id,
                    childrenId: ceratedStudentResponse.id,
                  },
                });
              } else {
                const parent2 = await prisma.user.create({
                  data: {
                    userType: UserType.parent,
                    firstName: studentWithParents.form.motherFullName.split(' ').slice(0, -1).join(' '),
                    middleName: '',
                    lastName: studentWithParents.form.motherFullName.split(' ').slice(-1).join(' '),
                    displayName: studentWithParents.form.motherFullName,
                    citizenship: null,
                    gender: Gender.Female,
                    CNIC: studentWithParents.form.motherID,
                    idProofPhoto: studentWithParents.form.motherID,
                    religion: studentWithParents.form.motherReligion,
                    profession: studentWithParents.form.motherProfession,
                    email: studentWithParents.form.motherEmail,
                    mobile: studentWithParents.form.motherMobile,
                    whatsapp: studentWithParents.form.motherWatsapp,
                    parentType: ParentType.Mother,
                    idCardNumber: motherId,
                    updated_by: studentWithParents.updated_by,
                    created_by: studentWithParents.created_by,
                    password: encryptedPassword,
                    campusId: Number(studentWithParents.form.campusId),
                    active: 1,
                  },
                });
                //create Parent 2 User Permission
                await prisma.userPermission.create({
                  data: {
                    userId: Number(parent2.id),
                    permissionId: parentPermission.id,
                    active: 1,
                    campusId: Number(studentWithParents.form.campusId),
                    updated_at: new Date(),
                    updated_by: Number(studentWithParents.created_by),
                    created_at: new Date(),
                    created_by: Number(studentWithParents.created_by)
                  },
                });
                await prisma.parentChildRelation.create({
                  data: {
                    parentId: parent2.id,
                    childrenId: ceratedStudentResponse.id,
                  },
                });

                // Send account creation email for parent 1
                sendAccountCreationEmail(
                  institute,
                  Number(studentWithParents.form.campusId),
                  parent2,
                  studentWithParents.created_by,
                  parent2.idCardNumber,
                  password);

                //Add notification
                addANotification(Number(studentWithParents.form.campusId),
                  Number(parent2.id),
                  Number(studentWithParents.created_by),
                  USER_CREATED + parent2.displayName);


              }

            }

            await prisma.studentFees.create({
              data: {
                userId: ceratedStudentResponse.id,
                campusId: Number(studentWithParents.form.campusId),
                feePlanId: Number(studentWithParents.form.feePlanId),
                active: 1,
                updated_by: studentWithParents.updated_by,
                updated_at: new Date(),
                created_by: studentWithParents.created_by,
                created_at: new Date()
              },
            });
            let feePlan = await prisma.feePlan.findUnique({
              where: {
                id: Number(studentWithParents.form.feePlanId)
              }
            });


            let futureMonth = moment(studentWithParents.form.admissionDate, 'DD-MM-YYYY').add(1, 'M');;


            await prisma.mYAALInvoices.create({
              data: {
                userId: ceratedStudentResponse.id,
                invoiceNumber: invoiceNumber,
                campusId: Number(studentWithParents.form.campusId),
                classId: Number(studentWithParents.form.classId),
                sectionId: Number(studentWithParents.form.sectionId),
                feeStatus: FeeStatus.Unpaid,
                feeType: FeeType.YEARLY,
                year: new Date().getFullYear(),
                month: new Date().getMonth(),
                dueDate: futureMonth.toDate(),
                amount: feePlan.yearlyAmt,
                updated_by: studentWithParents.updated_by,
                updated_at: new Date(),
                created_by: studentWithParents.created_by,
                created_at: new Date()
              },
            });

            await prisma.admissionRecord.create({
              data: {
                userId: ceratedStudentResponse.id,
                campusId: Number(studentWithParents.form.campusId),
                admissionComments: studentWithParents.form.admissionComments,
                rollNumber: String(countOfStudentsInClassAndSection + 1) as never,
                active: 1,
                ongoingSessionId: institute.sessionId,
                updated_by: studentWithParents.updated_by,
                created_by: studentWithParents.created_by,
              },
            });

          } else {
            return res.json({ status: false, data: null, message: 'Failed to add student. Try later.' });
          }
        });

      });





      return res.json({ status: true, data: createdStudentObj, message: 'Student added successfully' });

    } catch (err) {
      console.log(err);
      return res.json({ status: false, data: null, message: 'Failed to add student. Try later.' });
    }

  }


  public async bulkLoadStudents(req: Request, res: Response) {
    const formContent: any = req.body;
    let existingStudents = [];
    const institute = await prisma.institute.findFirst();
    let parentPermission: Permission = await getPermissionByName('Parent');
    const password = generator.generate({
      length: 10,
      numbers: true,
      symbols: true
    });
    const encryptedPassword = encrypt(password);
    //console.log(password);
    let latestInvoiceObj = await prisma.mYAALInvoices.findFirst({
      orderBy: {
        id: 'desc',
      },
      take: 1,
    });


    try {
      if (formContent !== null && formContent !== undefined) {
        if (formContent.data !== null && formContent.data !== undefined && formContent.data.length > 0) {

          for (let i = 0; i < formContent.data.length; i++) {

            let classS = await prisma.class.findFirst({
              where: {
                campusId: formContent.data[i]['Campus Id'],
                className: formContent.data[i]['Class'],
              },
              take: 1,
            });

            let section = await prisma.section.findFirst({
              where: {
                campusId: formContent.data[i]['Campus Id'],
                sectionName: formContent.data[i]['Section'],
              },
              take: 1,
            });
            if (classS !== null && classS !== undefined && section !== null && section !== undefined) {
              let studentFound = await prisma.user.findFirst({
                where: {
                  firstName: formContent.data[i]['First Name'],
                  lastName: formContent.data[i]['Last Name'],
                  gender: formContent.data[i]['Gender'],
                  classId: classS.id,
                  sectionId: section.id
                },
                take: 1,
              });
              //Student Exists dont update

              if (studentFound !== null && studentFound !== undefined && studentFound.id !== null && studentFound.id !== undefined) {
                existingStudents.push(studentFound.displayName);
              } else {
                const countOfStudentsInClassAndSection = await prisma.user.count({
                  where: {
                    classId: Number(classS.id),
                    sectionId: Number(section.id),
                    campusId: Number(formContent.data[i]['Campus Id'])
                  },
                });
                let latestUserID = await prisma.user.findFirst({
                  orderBy: {
                    id: 'desc',
                  },
                  take: 1,
                });
                const studentID = generateIdsForParentAndStudent(latestUserID.id + 1, 'ST');

                await prisma.user.create({
                  data: {
                    userType: UserType.student,
                    campusId: Number(formContent.data[i]['Campus Id']),
                    firstName: formContent.data[i]['First Name'],
                    middleName: '',
                    lastName: formContent.data[i]['Last Name'],
                    displayName: formContent.data[i]['First Name'] + ' ' + formContent.data[i]['Last Name'],
                    gender: formContent.data[i]['Gender'],
                    dateOfBirth: moment(formContent.data[i]['DOB(DD/MM/YYYY)'], 'DD-MM-YYYY').toDate(),
                    placeOfBirth: formContent.data[i]['Place of Birth'],
                    homeAddress: formContent.data[i]['Address'],
                    classId: Number(classS.id),
                    sectionId: Number(section.id),
                    admissionDate: moment(formContent.data[i]['Admission Date(DD/MM/YYYY)'], 'DD-MM-YYYY').toDate(),
                    active: 1,
                    rollNumber: Number(countOfStudentsInClassAndSection + 1) as never,
                    idCardNumber: studentID,
                    updated_by: formContent.currentUserId,
                    created_at: new Date(),
                    updated_at: new Date(),
                    created_by: formContent.currentUserId,
                    password: encryptedPassword,
                    parentsNames: formContent.data[i]['Father Name'] + ' , ' + formContent.data[i]['Mother Name'],

                  },
                }).then(async (ceratedStudentResponse) => {


                  if (ceratedStudentResponse !== null && ceratedStudentResponse !== undefined && ceratedStudentResponse.id !== null) {


                    //create Student User Permission
                    const createUserPermission = await prisma.userPermission.create({
                      data: {
                        userId: Number(ceratedStudentResponse.id),
                        permissionId: Number(5),
                        active: 1,
                        campusId: Number(formContent.data[i]['Campus Id']),
                        updated_at: new Date(),
                        updated_by: Number(formContent.currentUserId),
                        created_at: new Date(),
                        created_by: Number(formContent.currentUserId)
                      },
                    });

                    //Send Email and SMS and notification
                    //Add notification
                    addANotification(Number(formContent.data[i]['Campus Id']),
                      Number(ceratedStudentResponse.id),
                      Number(formContent.currentUserId),
                      USER_CREATED + ceratedStudentResponse.displayName);

                    const newEntry = await prisma.user.findUnique({
                      where: {
                        id: Number(ceratedStudentResponse.id),
                        campusId: Number(formContent.data[i]['Campus Id'])
                      },
                      include: {
                        class: true,
                        section: true,
                        campus: {
                          include: {
                            institute: {
                              include: {
                                session: true
                              }
                            }
                          }
                        }
                      }
                    }).then((value) => {
                      //console.log(value)
                      sendSms('Admission SMS',
                        {
                          student_name: value.displayName,
                          parent_1: value.parentsNames,
                          parent_1_phone: value.mobile,
                          parent_2: value.parentsNames,
                          parent_2_phone: value.mobile,
                          roll_no: value.rollNoProcessed,
                          student_id_card: value.idCardNumber,
                          institute_name: value.campus.institute.instituteName,
                          institute_campus: value.campus.campusName,
                          class_name: value.class.className,
                          section_name: value.section.sectionName,
                          session: value.campus.institute.session.session,
                          campusId: value.campus.id,
                          loggedInUserId: Number(formContent.currentUserId),
                          studentOrTeacherId: null,
                          classId: value.class.id,
                          sectionId: value.section.id,
                        },
                        [
                          '+919836618119'
                        ]);

                      sendEmail('Admission Email',
                        {
                          student_name: value.displayName,
                          parent_1: value.parentsNames,
                          parent_1_phone: value.mobile,
                          parent_2: value.parentsNames,
                          parent_2_phone: value.mobile,
                          roll_no: value.rollNoProcessed,
                          student_id_card: value.idCardNumber,
                          institute_name: value.campus.institute.instituteName,
                          institute_campus: value.campus.campusName,
                          class_name: value.class.className,
                          section_name: value.section.sectionName,
                          session: value.campus.institute.session.session,
                          campusId: value.campus.id,
                          loggedInUserId: Number(formContent.currentUserId),
                          studentOrTeacherId: null,
                          classId: value.class.id,
                          sectionId: value.section.id,
                        },
                        [
                          {
                            name: formContent.data[i]['Father Name'],
                            email: formContent.data[i]['Father Email']
                          },
                          {
                            name: formContent.data[i]['Mother Name'],
                            email: formContent.data[i]['Mother Email']
                          }
                        ]
                      );
                    });


                    const fatherId = generateIdsForParentAndStudent(latestUserID.id + 2, 'P1');
                    const motherId = generateIdsForParentAndStudent(latestUserID.id + 3, 'P2');



                    //Create Parents and their relationship
                    const parent1Present = await prisma.user.findFirst({
                      where: {
                        CNIC: formContent.data[i]['Father Govt ID'],
                        campusId: Number(formContent.data[i]['Campus Id'])
                      },
                    })
                    if (parent1Present !== null && parent1Present !== undefined) {
                      console.log('Parent 1 already exists --' + parent1Present.displayName + ', Hence mapping to student');

                      await prisma.parentChildRelation.create({
                        data: {
                          parentId: parent1Present.id,
                          childrenId: ceratedStudentResponse.id,
                        },
                      });
                    } else {

                      const parent1 = await prisma.user.create({
                        data: {
                          userType: UserType.parent,
                          firstName: formContent.data[i]['Father Name'].split(' ').slice(0, -1).join(' '),
                          middleName: '',
                          lastName: formContent.data[i]['Father Name'].split(' ').slice(-1).join(' '),
                          displayName: formContent.data[i]['Father Name'],
                          citizenship: null,
                          gender: Gender.Male,
                          CNIC: formContent.data[i]['Father Govt ID'],
                          idProofPhoto: formContent.data[i]['Father Govt ID'],
                          email: formContent.data[i]['Father Email'],
                          mobile: formContent.data[i]['Father Mobile'] !== null && formContent.data[i]['Father Mobile'] !== undefined
                            && String(formContent.data[i]['Father Mobile']).startsWith('+') ? String(formContent.data[i]['Father Mobile']) : '+' + String(formContent.data[i]['Father Mobile']),
                          parentType: ParentType.Father,
                          idCardNumber: fatherId,
                          updated_by: formContent.currentUserId,
                          created_by: formContent.currentUserId,
                          password: encryptedPassword,
                          campusId: Number(formContent.data[i]['Campus Id']),
                          active: 1,
                        },
                      });
                      //create Parent 1 User Permission
                      await prisma.userPermission.create({
                        data: {
                          userId: Number(parent1.id),
                          permissionId: parentPermission.id,
                          active: 1,
                          campusId: Number(formContent.data[i]['Campus Id']),
                          updated_at: new Date(),
                          updated_by: Number(formContent.currentUserId),
                          created_at: new Date(),
                          created_by: Number(formContent.currentUserId)
                        },
                      });

                      await prisma.parentChildRelation.create({
                        data: {
                          parentId: parent1.id,
                          childrenId: ceratedStudentResponse.id,
                        },
                      });

                      //Create Parent 1 Family Credit
                      await prisma.familyCredit.create({
                        data: {
                          userId: Number(parent1.id),
                          availableCredit: 0,
                          campusId: Number(formContent.data[i]['Campus Id']),
                          updated_at: new Date(),
                          updated_by: Number(formContent.currentUserId),
                          created_at: new Date(),
                          created_by: Number(formContent.currentUserId)
                        },
                      });

                      // Send account creation email for parent 1
                      sendAccountCreationEmail(
                        institute,
                        Number(formContent.data[i]['Campus Id']),
                        parent1,
                        formContent.currentUserId,
                        parent1.idCardNumber,
                        password);

                      //Add notification
                      addANotification(Number(formContent.data[i]['Campus Id']),
                        Number(parent1.id),
                        Number(formContent.currentUserId),
                        USER_CREATED + parent1.displayName);

                    }



                    const parent2Present = await prisma.user.findFirst({
                      where: {
                        CNIC: formContent.data[i]['Mother Govt ID'],
                        campusId: Number(formContent.data[i]['Campus Id'])
                      },
                    });


                    if (parent2Present !== null && parent2Present !== undefined) {

                      console.log('Parent 2 already exists --' + parent2Present.displayName + ', Hence mapping to student');

                      await prisma.parentChildRelation.create({
                        data: {
                          parentId: parent2Present.id,
                          childrenId: ceratedStudentResponse.id,
                        },
                      });
                    } else {
                      const parent2 = await prisma.user.create({
                        data: {
                          userType: UserType.parent,
                          firstName: formContent.data[i]['Mother Name'].split(' ').slice(0, -1).join(' '),
                          middleName: '',
                          lastName: formContent.data[i]['Mother Name'].split(' ').slice(-1).join(' '),
                          displayName: formContent.data[i]['Mother Name'],
                          citizenship: null,
                          gender: Gender.Female,
                          CNIC: formContent.data[i]['Mother Govt ID'],
                          idProofPhoto: formContent.data[i]['Mother Govt ID'],
                          email: formContent.data[i]['Mother Email'],
                          mobile: formContent.data[i]['Mother Mobile'] !== null && formContent.data[i]['Mother Mobile'] !== undefined
                            && String(formContent.data[i]['Mother Mobile']).startsWith('+') ? String(formContent.data[i]['Mother Mobile']) : '+' + String(formContent.data[i]['Mother Mobile']),
                          parentType: ParentType.Mother,
                          idCardNumber: motherId,
                          updated_by: formContent.currentUserId,
                          created_by: formContent.currentUserId,
                          password: encryptedPassword,
                          campusId: Number(formContent.data[i]['Campus Id']),
                          active: 1,
                        },
                      });
                      //create Parent 2 User Permission
                      await prisma.userPermission.create({
                        data: {
                          userId: Number(parent2.id),
                          permissionId: parentPermission.id,
                          active: 1,
                          campusId: Number(formContent.data[i]['Campus Id']),
                          updated_at: new Date(),
                          updated_by: Number(formContent.currentUserId),
                          created_at: new Date(),
                          created_by: Number(formContent.currentUserId)
                        },
                      });
                      await prisma.parentChildRelation.create({
                        data: {
                          parentId: parent2.id,
                          childrenId: ceratedStudentResponse.id,
                        },
                      });

                      // Send account creation email for parent 1
                      sendAccountCreationEmail(
                        institute,
                        Number(formContent.data[i]['Campus Id']),
                        parent2,
                        formContent.currentUserId,
                        parent2.idCardNumber,
                        password);

                      //Add notification
                      addANotification(Number(formContent.data[i]['Campus Id']),
                        Number(parent2.id),
                        Number(formContent.currentUserId),
                        USER_CREATED + parent2.displayName);


                    }

                    await prisma.admissionRecord.create({
                      data: {
                        userId: ceratedStudentResponse.id,
                        campusId: Number(formContent.data[i]['Campus Id']),
                        admissionComments: 'Student Admitted as Bulk Import',
                        rollNumber: String(countOfStudentsInClassAndSection + 1) as never,
                        active: 1,
                        ongoingSessionId: institute.sessionId,
                        updated_by: formContent.currentUserId,
                        created_by: formContent.currentUserId,
                      },
                    });

                  } else {
                    return res.json({ status: false, data: null, message: 'Failed to add student. Try later.' });
                  }
                });
              }


            } else {
              return res.json({ data: null, status: false, message: `Class ${formContent.data[i]['Class']} or Section ${formContent.data[i]['Section']} not found. Please correct before uploading.` });
            }
          }
        } else {
          return res.json({ data: null, status: false, message: 'No data to upload' });
        }

      }
      return res.json({ data: null, status: true, message: 'Bulk Student Admission Completed' });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message, status: true, data: null })
    }
  }


  public async updateStudent(req: Request, res: Response) {
    const id = Number(req.params.id);
    const campusId = Number(req.params.campusId);
    const input: any = req.body;
    console.log(input)
    const student = await prisma.user.findUnique({
      where: {
        id: id,
        campusId: campusId
      },
    })


    if (!student) {
      return res.json({ status: false, data: student, message: 'Failed to update student' });
    }

    try {
      const middleName = input.form.middleName !== null && input.form.middleName !== undefined ? input.form.middleName : '';


      const updatedstudent = await prisma.user.update({
        where: {
          id: id,
          campusId: campusId
        },
        data: {
          firstName: input.form.firstName,
          middleName: input.form.middleName,
          lastName: input.form.lastName,
          displayName: input.form.firstName + ' ' + middleName + ' ' + input.form.lastName,
          gender: input.form.gender,
          dateOfBirth: moment(input.form.dateOfBirth, 'DD-MM-YYYY').toDate(),
          admissionDate: moment(input.form.admissionDate, 'DD-MM-YYYY').toDate(),
          homeAddress: input.form.homeAddress,
          idProofPhoto: input.form.idProofPhoto,
          citizenship: input.form.citizenship,
          religion: input.form.religion,
          emergencyContact: input.form.emergencyContact,
          email: input.form.email,
          mobile: input.form.mobile,
          photo: input.photo,
          thumbnailUrl: input.thumbnailUrl,
          updated_by: input.updated_by,
        },
      })
      //Add notification
      addANotification(Number(campusId),
        Number(updatedstudent.id),
        Number(input.updated_by),
        USER_UPDATED + updatedstudent.displayName);

      return res.json({ status: true, data: null, message: 'Student updated successfully' });

    } catch (error) {
      console.error(error);
      return res.json({ status: false, data: student, message: 'Failed to delete Class' });
    }
  }

  public async transferStudentCampus(req: Request, res: Response) {
    const input: any = req.body;
    const institute = await prisma.institute.findFirst({
      include: {
        session: true,
      }
    });


    const student = await prisma.user.findUnique({
      where: {
        id: Number(input.form.id),
        campusId: Number(input.form.campusId)
      },
    })


    if (!student) {
      return res.json({ status: false, data: student, message: 'Failed to find student' });
    }

    try {
      const updatedstudent = await prisma.user.update({
        where: {
          id: Number(input.form.id),
          campusId: Number(input.form.campusId)
        },
        data: {
          campusId: Number(input.form.campusIdTo),
          classId: Number(input.form.classIdTo),
          sectionId: Number(input.form.sectionIdTo),
          updated_by: Number(input.form.updated_by),
          updated_at: new Date()
        },
        include: {
          campus: true,
          class: true,
          section: true,
          parent: {
            include: {
              parent: true
            }
          },
        }
      }).then((studentNew) => {
        //Add notification
        addANotification(Number(input.form.campusIdTo),
          Number(studentNew.id),
          Number(input.form.updated_by),
          `Student ${studentNew.displayName} has been transferred to ${studentNew.campus.campusName}`);

        if (studentNew.parent !== null && studentNew.parent !== undefined && studentNew.parent.length > 0) {
          studentNew.parent.forEach((eachParent) => {
            
              addANotification(Number(input.form.campusIdTo), Number(eachParent.parentId), Number(input.form.updated_by),
              `Student ${studentNew.displayName} has been transferred to ${studentNew.campus.campusName}`);
              
              sendSms('Student Transfer Complete',
                {
                  campusId: Number(input.form.campusIdTo),
                  student_name: studentNew.displayName,
                  parent_1: eachParent.parent.displayName,
                  parent_1_phone: eachParent.parent.mobile,
                  parent_2: eachParent.parent.displayName,
                  parent_2_phone: eachParent.parent.mobile,
                  roll_no: studentNew.rollNoProcessed,
                  student_id_card: studentNew.idCardNumber,
                  institute_name: institute.instituteName,
                  institute_campus: studentNew.campus.campusName,
                  class_name: studentNew.class.className,
                  section_name: studentNew.section.sectionName,
                  session: institute.session.session,
                  loggedInUserId: Number(input.form.updated_by),
                  studentOrTeacherId: null,
                  classId: studentNew.class.id,
                  sectionId: studentNew.class.id,
                },
                [
                  eachParent.parent.mobile
                ]);

              sendEmail('Student Transfer Complete',
                {
                  campusId: Number(input.form.campusIdTo),
                  student_name: studentNew.displayName,
                  parent_1: eachParent.parent.displayName,
                  parent_1_phone: eachParent.parent.mobile,
                  parent_2: eachParent.parent.displayName,
                  parent_2_phone: eachParent.parent.mobile,
                  roll_no: studentNew.rollNoProcessed,
                  student_id_card: studentNew.idCardNumber,
                  institute_name: institute.instituteName,
                  institute_campus: studentNew.campus.campusName,
                  class_name: studentNew.class.className,
                  section_name: studentNew.section.sectionName,
                  session: institute.session.session,
                  loggedInUserId: Number(input.form.updated_by),
                  studentOrTeacherId: null,
                  classId: studentNew.class.id,
                  sectionId: studentNew.class.id,
                },
                [
                  {
                    name: eachParent.parent.displayName,
                    email: eachParent.parent.email
                  },
                ]
              );  
          });
        }

      });

      return res.json({ status: true, data: updatedstudent, message: 'Student Transfer Successful' });
    } catch (error) {
      console.error(error);
      return res.json({ status: false, data: student, message: 'Failed to transfer student' });
    }
  }



  public async promoteStudent(req: Request, res: Response) {
    const input: any = req.body;
    console.log(input)

    if (input.form.id !== null && input.form.id !== undefined) {
      const student = await prisma.user.findUnique({
        where: {
          id: Number(input.form.id),
          campusId: Number(input.form.campusId)
        },
      })


      if (!student) {
        return res.json({ status: false, data: student, message: 'Failed to find student' });
      }
      try {
        const updatedstudent = await prisma.user.update({
          where: {
            id: Number(input.form.id),
            campusId: Number(input.form.campusId)
          },
          data: {
            classId: Number(input.form.classIdTo),
            sectionId: Number(input.form.sectionIdTo),
            updated_by: Number(input.form.updated_by),
            updated_at: new Date()
          },
          include: {
            parent: true,
            class: true,
            section: true
          }
        }).then((studentNew) => {

          //Add notification
          addANotification(Number(input.form.campusId),
            Number(studentNew.id),
            Number(input.form.updated_by),
            `Student ${studentNew.displayName} has been promoted to Class ${studentNew.class.className}, Section ${studentNew.section.sectionName}`);

          if (studentNew.parent !== null && studentNew.parent !== undefined && studentNew.parent.length > 0) {
            studentNew.parent.forEach((eachParent: any) => {
              addANotification(Number(input.form.campusId),
                Number(eachParent.parentId),
                Number(input.form.updated_by),
                `Student ${studentNew.displayName} has been promoted to Class ${studentNew.class.className}, Section ${studentNew.section.sectionName}`);
            });
          }
        });
        return res.json({ status: true, data: updatedstudent, message: 'Student Promoted Successfully' });

      } catch (error) {
        console.error(error);
        return res.json({ status: false, data: student, message: 'Failed to promote student' });
      }
    } else {
      try {
        const studentsToPromote = await prisma.user.findMany({
          where: {
            active: 1,
            userType: UserType.student,
            campusId: Number(input.form.campusId),
            classId: Number(input.form.classId),
            sectionId: Number(input.form.sectionId),
          },
          include: {
            campus: true,
            class: true,
            section: true,
            parent: true
          },
        });

        if (studentsToPromote !== null && studentsToPromote !== undefined && studentsToPromote.length > 0) {
          studentsToPromote.forEach(async (eachStudent: any) => {

            await prisma.user.update({
              where: {
                id: eachStudent.id
              },
              data: {
                classId: Number(input.form.classIdTo),
                sectionId: Number(input.form.sectionIdTo),
                updated_by: Number(input.form.updated_by),
                updated_at: new Date()
              },
              include: {
                campus: true,
                class: true,
                section: true,
                parent: true
              }
            }).then((updatedStudent) => {
              //Add notification
              addANotification(Number(input.form.campusId),
                Number(updatedStudent.id),
                Number(input.form.updated_by),
                `Student ${updatedStudent.displayName} has been promoted to Class ${updatedStudent.class.className}, Section ${updatedStudent.section.sectionName}`);

              if (updatedStudent.parent !== null && updatedStudent.parent !== undefined && updatedStudent.parent.length > 0) {
                updatedStudent.parent.forEach((eachParent: any) => {
                  addANotification(Number(input.form.campusId),
                    Number(eachParent.parentId),
                    Number(input.form.updated_by),
                    `Student ${updatedStudent.displayName} has been promoted to Class ${updatedStudent.class.className}, Section ${updatedStudent.section.sectionName}`);
                });
              }
            });

          });
        }

        return res.json({ status: true, data: null, message: 'Students Promoted Successfully' });

      } catch (error) {
        console.error(error);
        return res.json({ status: false, data: null, message: 'Failed to promote student' });
      }
    }



  }
  public async deleteStudent(req: Request, res: Response) {
    const id = Number(req.params.id);
    const campusId = Number(req.params.campusId);

    const student = await prisma.user.findUnique({
      where: {
        id: Number(id),
        campusId: Number(campusId)
      },
    })

    if (!student) {
      return res.json({ status: false, data: student, message: 'Unable to find Student' });
    }

    await prisma.user.delete({
      where: {
        id: id,
        campusId: campusId
      },
    })

    return res.json({ status: false, data: null, message: 'Deleted Student' });
  }


  public async getStudentBirthday(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    let today = new Date(Date.now());
    let futureDate = new Date(Date.now() + (24 * 60 * 60 * 1000 * 7));


    let yesterday = new Date(Date.now() - (24 * 60 * 60 * 1000 * 1));
    let tomorrow = new Date(Date.now() + (24 * 60 * 60 * 1000 * 1));



    console.log('today ' + today);
    console.log('minusDate ' + futureDate)

    const result = await prisma.$queryRaw`SELECT us.id, us.displayName,us.gender,us.photo, us.thumbnailUrl,DATE_FORMAT(us.dateOfBirth,'%d-%m-%Y') as dob,us.idCardNumber, cl.className,sec.sectionName  FROM myskool.User us
  left join myskool.Class cl ON cl.id = us.classId
  left join myskool.Section sec ON sec.id = us.sectionId
  where us.campusId=1 and us.active=1
  and us.userType='student' and day(us.dateOfBirth) = day(curdate())
  and month(us.dateOfBirth) = month(curdate())`


    const studentsFutureBday = await prisma.user.findMany({
      where: {
        campusId: Number(campusId),
        active: 1,
        userType: UserType.student,
        dateOfBirth: {
          lte: futureDate,
          gte: today,
        }
      },
      include: {
        campus: true,
        class: true,
        section: true
      },
    });


    return res.json({ status: true, data: result, futureBday: studentsFutureBday, message: '' });
  }

  public async getStudentId(req: Request, res: Response) {
    const id = Number(req.params.id);
    const campusId = Number(req.params.campusId);

    const student = await prisma.user
      .findUnique({
        where: {
          id: Number(id),
          campusId: Number(campusId)
        },
        include: {
          userPermissions: {
            include: {
              permission: {
                include: {
                  MenuCategoryPermissions: {
                    include: {
                      menuCategory: true,
                    }
                  },
                  MenuItemPermissions: {
                    include: {
                      menuItem: true,
                    }
                  },
                },
              },
            }
          },
          campus: true,
          class: true
        },
      });


    if (!student) {
      return res.json({ status: false, data: student, message: 'Failed to fetch student' });
    }

    return res.json({ status: true, data: student, message: 'Fetched student successfully' });
  }


  public async getAllStudents(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);

    const students = await prisma.user.findMany({
      where: {
        campusId: Number(campusId)
      },
      include: {
        userPermissions: {
          include: {
            permission: {
              include: {
                MenuCategoryPermissions: {
                  include: {
                    menuCategory: true,
                  }
                },
                MenuItemPermissions: {
                  include: {
                    menuItem: true,
                  }
                },
              },
            },
          }
        },
        campus: true,
        class: true
      },
    });

    return res.json({ status: true, data: students, message: 'Students loaded successfully' });
  }

  public async getAllStudentsByClassAndSection(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const classId = Number(req.params.classId);
    const sectionId = Number(req.params.sectionId);
    const active = Number(req.params.active);
    const students = await prisma.user.findMany({
      where: {
        campusId: Number(campusId),
        classId: Number(classId),
        sectionId: Number(sectionId),
        active: Number(active)
      },
      include: {
        parent: {
          include: {
            parent: true
          }
        },
        children: {
          include: {
            children: true
          }
        },
        campus: true,
        class: true,
        section: true,
        StudentFees: {
          include: {
            feePlan: true
          },
          where: {
            active: 1,
            campusId: Number(campusId),
          }
        },
        AdmissionRecord: true,
      },
    });
    return res.json({ status: true, data: students, message: 'Students loaded successfully' });
  }

  public async getAllAdmissionEnquiry(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const isFromApp = Number(req.params.isFromApp);
    console.log(isFromApp);
    const enquiry = await prisma.admissionRequestOrInquiries.findMany({
      where: {
        campusId: Number(campusId),
        active: 1,
        isFromApp: isFromApp
      },
      include: {
        campus: true,
        class: true,
      },
    });
    return res.json({ status: true, data: enquiry, message: 'Data fetched' });
  }


  public async createAdmissionInquiry(req: Request, res: Response) {

    const studentWithParents: any = req.body;
    const middleName = studentWithParents.form.middleName !== null && studentWithParents.form.middleName !== undefined ? studentWithParents.form.middleName : '';

    let newInquiry;

    try {

      newInquiry = await prisma.admissionRequestOrInquiries.create({
        data: {
          isFromApp: studentWithParents.form.isFromApp === undefined ? 0 : 1,
          firstName: studentWithParents.form.firstName,
          middleName: middleName,
          lastName: studentWithParents.form.lastName,
          displayName: studentWithParents.form.firstName + ' ' + middleName + ' ' + studentWithParents.form.lastName,
          gender: studentWithParents.form.gender,
          dateOfBirth: moment(studentWithParents.form.dateOfBirth, 'DD-MM-YYYY').toDate(),
          placeOfBirth: studentWithParents.form.placeOfBirth,
          location: studentWithParents.form.location,
          classId: Number(studentWithParents.form.classId),
          campusId: Number(studentWithParents.form.campusId),
          previousSchool: studentWithParents.form.previousSchool,
          admissionDate: moment(studentWithParents.form.admissionDate, 'DD-MM-YYYY').toDate(),
          parentFullName: studentWithParents.form.parentFullName,
          active: 1,
          IDorCNIC: studentWithParents.form.IDorCNIC,
          email: studentWithParents.form.email,
          mobile: studentWithParents.form.mobile,
          comments: studentWithParents.form.comments,
          updated_by: Number(studentWithParents.form.updated_by),
          created_by: Number(studentWithParents.form.created_by),
          created_at: new Date(),
          updated_at: new Date()
        },
        include: {
          class: true,
          campus: {
            include: {
              institute: {
                include: {
                  session: true
                }
              }
            }
          }
        }
      }).then(async (value) => {

        const notifyingStaff = await prisma.user.findMany({
          where: {
            active: 1,
            userType: {
              in: [UserType.admin, UserType.staff, UserType.accountant,]
            },
            campusId: Number(studentWithParents.form.campusId)
          },
        });

        if (notifyingStaff !== null && notifyingStaff !== undefined && notifyingStaff.length > 0) {
          notifyingStaff.forEach(async (eachStaff: any) => {
            addANotification(Number(studentWithParents.form.campusId),
              Number(eachStaff.id),
              Number(studentWithParents.form.created_by),
              `A new admission enquiry has been created by ${value.parentFullName} for ${value.displayName} with id ${value.id}`);

          });
        }


        sendSms('Admission Enquiry',
          {
            student_name: value.displayName,
            parent_1: value.parentFullName,
            parent_1_phone: value.mobile,
            parent_2: value.parentFullName,
            parent_2_phone: value.mobile,
            roll_no: 'N/A',
            student_id_card: 'N/A',
            institute_name: value.campus.institute.instituteName,
            institute_campus: value.campus.campusName,
            class_name: value.class.className,
            section_name: 'Not Assigned',
            session: value.campus.institute.session.session,
            campusId: value.campus.id,
            loggedInUserId: Number(studentWithParents.form.created_by),
            studentOrTeacherId: null,
            classId: value.class.id,
            sectionId: null,
          },
          [
            '+919836618119'
          ]);

        sendEmail('Admission Enquiry',
          {
            student_name: value.displayName,
            parent_1: value.parentFullName,
            parent_1_phone: value.mobile,
            parent_2: value.parentFullName,
            parent_2_phone: value.mobile,
            roll_no: 'N/A',
            student_id_card: 'N/A',
            institute_name: value.campus.institute.instituteName,
            institute_campus: value.campus.campusName,
            class_name: value.class.className,
            section_name: 'Not Assigned',
            session: value.campus.institute.session.session,
            campusId: value.campus.id,
            loggedInUserId: Number(studentWithParents.form.created_by),
            studentOrTeacherId: null,
            classId: value.class.id,
            sectionId: null,
          },
          [
            {
              name: value.parentFullName,
              email: studentWithParents.form.email
            }
          ]
        );
      });



      return res.json({ status: true, data: newInquiry, message: 'Enquiry added' });

    } catch (err) {
      console.log(err);
      return res.json({ status: false, data: null, message: 'Failed to add. Try later.' });
    }

  }


  public async approveAdmissionInquiry(req: Request, res: Response) {

    const studentWithParents: any = req.body;

    console.log(studentWithParents);

    if (studentWithParents !== null && studentWithParents !== undefined &&
      studentWithParents.form !== null && studentWithParents.form !== undefined
      && studentWithParents.form.status !== null && studentWithParents.form.status !== undefined && studentWithParents.form.status === 'Approve') {
      //Approve & Send message

      try {

        const enquiry = await prisma.admissionRequestOrInquiries.findUnique({
          where: {
            id: studentWithParents.form.id,
            campusId: studentWithParents.form.campusId
          },
        })

        if (!enquiry) {
          return res.json({ status: false, data: enquiry, message: 'Unable to find request' });
        }

        try {
          await prisma.admissionRequestOrInquiries.update({
            where: {
              id: studentWithParents.form.id,
              campusId: studentWithParents.form.campusId
            },
            data: {
              active: 1,
              isApproved: 'Yes',
              updated_by: studentWithParents.form.userId,
              updated_at: new Date()
            }
          }).then(async (admissionQuery) => {

            const notifyingStaff = await prisma.user.findUnique({
              where: {
                active: 1,
                id: Number(studentWithParents.form.userId),
                campusId: Number(studentWithParents.form.campusId)
              },
            });

            addANotification(Number(studentWithParents.form.campusId),
              Number(notifyingStaff.id),
              Number(studentWithParents.form.created_by),
              `A new admission enquiry has been approved by ${notifyingStaff.displayName} for ${admissionQuery.displayName} with id ${admissionQuery.id}`);


            const newEntry = await prisma.campus.findUnique({
              where: {
                id: Number(studentWithParents.form.campusId),
              },
              include: {
                institute: {
                  include: {
                    session: true
                  }
                }
              }
            }).then((value) => {


              sendSms('Admission Enquiry Processed',
                {
                  student_name: admissionQuery.displayName,
                  parent_1: admissionQuery.parentFullName,
                  parent_1_phone: admissionQuery.mobile,
                  parent_2: admissionQuery.parentFullName,
                  parent_2_phone: admissionQuery.mobile,
                  roll_no: 'N/A',
                  student_id_card: 'N/A',
                  institute_name: value.institute.instituteName,
                  institute_campus: value.campusName,
                  class_name: 'N/A',
                  section_name: 'N/A',
                  session: value.institute.session.session,
                  campusId: value.id,
                  loggedInUserId: Number(studentWithParents.form.created_by),
                  studentOrTeacherId: null,
                  classId: admissionQuery.id,
                  sectionId: null,
                  admission_status: 'APPROVED',
                  extra_content: studentWithParents.form.content,
                }, [
                '+919836618119'
              ]);

              sendEmail('Admission Enquiry Processed',
                {
                  student_name: admissionQuery.displayName,
                  parent_1: admissionQuery.parentFullName,
                  parent_1_phone: admissionQuery.mobile,
                  parent_2: admissionQuery.parentFullName,
                  parent_2_phone: admissionQuery.mobile,
                  roll_no: 'N/A',
                  student_id_card: 'N/A',
                  institute_name: value.institute.instituteName,
                  institute_campus: value.campusName,
                  class_name: 'N/A',
                  section_name: 'N/A',
                  session: value.institute.session.session,
                  campusId: value.id,
                  loggedInUserId: Number(studentWithParents.form.created_by),
                  studentOrTeacherId: null,
                  classId: admissionQuery.id,
                  sectionId: null,
                  admission_status: 'APPROVED',
                  extra_content: studentWithParents.form.content,
                },
                [
                  {
                    name: enquiry.displayName,
                    email: enquiry.email
                  }
                ]
              );
            });
          });

          return res.json({ status: true, data: null, message: 'Request Approved' });


        } catch (error) {
          console.error(error);
          return res.json({ status: false, data: null, message: error.message });
        }

      } catch (err) {
        console.log(err);
        return res.json({ status: false, data: null, message: 'Failed to update. Try later.' });
      }


    } else {


      //Send message only

      const enquiry = await prisma.admissionRequestOrInquiries.findUnique({
        where: {
          id: studentWithParents.form.id,
          campusId: studentWithParents.form.campusId
        },
      }).then(async (admissionQuery) => {

        const notifyingStaff = await prisma.user.findUnique({
          where: {
            active: 1,
            id: Number(studentWithParents.form.userId),
            campusId: Number(studentWithParents.form.campusId)
          },
        });


        addANotification(Number(studentWithParents.form.campusId),
          Number(notifyingStaff.id),
          Number(studentWithParents.form.created_by),
          `A admission enquiry is being processed by ${notifyingStaff.displayName} for ${admissionQuery.displayName} with id ${admissionQuery.id}`);



        const campusObj = await prisma.campus.findUnique({
          where: {
            id: Number(studentWithParents.form.campusId),
          },
          include: {
            institute: {
              include: {
                session: true
              }
            }
          }
        }).then((value) => {
          console.log('Print Campus');
          console.log(value);

          sendSms('Admission Enquiry Processed',
            {
              student_name: admissionQuery.displayName,
              parent_1: admissionQuery.parentFullName,
              parent_1_phone: admissionQuery.mobile,
              parent_2: admissionQuery.parentFullName,
              parent_2_phone: admissionQuery.mobile,
              roll_no: 'N/A',
              student_id_card: 'N/A',
              institute_name: value.institute.instituteName,
              institute_campus: value.campusName,
              class_name: 'N/A',
              section_name: 'N/A',
              session: value.institute.session.session,
              campusId: value.id,
              loggedInUserId: Number(studentWithParents.form.created_by),
              studentOrTeacherId: null,
              classId: admissionQuery.id,
              sectionId: null,
              admission_status: 'PROCESSING',
              extra_content: studentWithParents.form.content,
            },
            [
              '+919836618119'
            ]);

          sendEmail('Admission Enquiry Processed',
            {
              student_name: admissionQuery.displayName,
              parent_1: admissionQuery.parentFullName,
              parent_1_phone: admissionQuery.mobile,
              parent_2: admissionQuery.parentFullName,
              parent_2_phone: admissionQuery.mobile,
              roll_no: 'N/A',
              student_id_card: 'N/A',
              institute_name: value.institute.instituteName,
              institute_campus: value.campusName,
              class_name: 'N/A',
              section_name: 'N/A',
              session: value.institute.session.session,
              campusId: value.id,
              loggedInUserId: Number(studentWithParents.form.created_by),
              studentOrTeacherId: null,
              classId: admissionQuery.id,
              sectionId: null,
              admission_status: 'PROCESSING',
              extra_content: studentWithParents.form.content,
            },
            [
              {
                name: admissionQuery.displayName,
                email: admissionQuery.email
              }
            ]
          );
        });
      });

      return res.json({ status: true, data: null, message: 'Notification sent' });

    }
  }


  public async deleteAdmissionEnquiry(req: Request, res: Response) {
    const id = Number(req.params.id);
    const campusId = Number(req.params.campusId);
    const userId = Number(req.params.currentUserid);
    console.log('Delete Enquiry by ID : ' + id);

    const enquiry = await prisma.admissionRequestOrInquiries.findUnique({
      where: {
        id: id,
        campusId: campusId
      },
    })

    if (!enquiry) {
      return res.json({ status: false, data: enquiry, message: 'Unable to find request' });
    }


    try {
      await prisma.admissionRequestOrInquiries.update({
        where: {
          id: id,
          campusId: campusId
        },
        data: {
          active: 0,
          isApproved: 'No',
          updated_by: userId,
          updated_at: new Date()
        }
      }).then(async (admissionQuery) => {

        const notifyingStaff = await prisma.user.findUnique({
          where: {
            active: 1,
            id: Number(userId),
            campusId: Number(campusId)
          },
        }).then((res) => {
          addANotification(Number(campusId),
            Number(userId),
            Number(userId),
            `A admission enquiry is rejected by ${res.displayName} for ${admissionQuery.displayName} with id ${admissionQuery.id}`);
        });


        const newEntry = await prisma.campus.findUnique({
          where: {
            id: Number(campusId),
          },
          include: {
            institute: {
              include: {
                session: true
              }
            }
          }
        }).then(async (value) => {


          sendSms('Admission Enquiry Processed',
            {
              student_name: admissionQuery.displayName,
              parent_1: admissionQuery.parentFullName,
              parent_1_phone: admissionQuery.mobile,
              parent_2: admissionQuery.parentFullName,
              parent_2_phone: admissionQuery.mobile,
              roll_no: 'N/A',
              student_id_card: 'N/A',
              institute_name: value.institute.instituteName,
              institute_campus: value.campusName,
              class_name: 'N/A',
              section_name: 'N/A',
              session: value.institute.session.session,
              campusId: value.id,
              loggedInUserId: Number(userId),
              studentOrTeacherId: null,
              classId: null,
              sectionId: null,
              admission_status: 'REJECTED',

            },
            [
              '+919836618119'
            ]);

          sendEmail('Admission Enquiry Processed',
            {
              student_name: admissionQuery.displayName,
              parent_1: admissionQuery.parentFullName,
              parent_1_phone: admissionQuery.mobile,
              parent_2: admissionQuery.parentFullName,
              parent_2_phone: admissionQuery.mobile,
              roll_no: 'N/A',
              student_id_card: 'N/A',
              institute_name: value.institute.instituteName,
              institute_campus: value.campusName,
              class_name: 'N/A',
              section_name: 'N/A',
              session: value.institute.session.session,
              campusId: value.id,
              loggedInUserId: Number(userId),
              studentOrTeacherId: null,
              classId: null,
              sectionId: null,
              admission_status: 'REJECTED',
              extra_content: 'Please contact school for any queries/questions.',
            },
            [
              {
                name: enquiry.displayName,
                email: enquiry.email
              }
            ]
          );
        });
      });

      return res.json({ status: true, data: null, message: 'Request deleted' });


    } catch (error) {
      console.error(error);
      return res.json({ status: false, data: null, message: error.message });
    }


  }


  public async fetchAdmissionFormStats(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let yesterday = new Date(Date.now() - (24 * 60 * 60 * 1000));

    const monthLyAdmission = await prisma.user.findMany({
      where: {
        campusId: Number(campusId),
        active: 1,
        userType: UserType.student,
        created_at: {
          lte: date,
          gte: firstDay,
        }
      },
      include: {
        campus: true,
        class: true,
      },
    });

    const todaysAdmission = await prisma.user.findMany({
      where: {
        campusId: Number(campusId),
        active: 1,
        userType: UserType.student,
        created_at: {
          lte: date,
          gte: yesterday,
        }
      },
      include: {
        campus: true,
        class: true,
      },
    });

    const totalActiveUsers = await prisma.user.findMany({
      where: {
        campusId: Number(campusId),
        active: 1,
        userType: UserType.student,
      },
      include: {
        campus: true,
        class: true,
      },
    });


    return res.json({ status: true, data: { monthlyAdmission: monthLyAdmission, oneDayAdmission: todaysAdmission, totalActiveUsers: totalActiveUsers }, message: 'Data fetched' });
  }

  public async getStudingRatingAndComments(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const classId = Number(req.params.classId);
    const sectionId = Number(req.params.sectionId);
    const userId = Number(req.params.userId);
    let ratingCalc = 0;

    const rating = await prisma.studentRatings.findMany({
      where: {
        campusId: Number(campusId),
        userId: userId,
        classId: Number(classId),
        sectionId: Number(sectionId),
      },
      orderBy: {
        updated_at: 'desc'
      },
      include: {
        ratingFromUser: true
      },
    });
    if (rating !== null && rating !== undefined && rating.length > 0) {
      let total = 0;
      rating.forEach((each: any) => {
        total = total + each.rating;
      });
      ratingCalc = total / (rating.length);
    }
    return res.json({ status: true, data: { rating: rating, ratingCalc: ratingCalc }, message: 'Ratings fetched' });
  }


  public async saveStudentRating(req: Request, res: Response) {
    const input: any = req.body;
    console.log(input)

    try {
      await prisma.studentRatings.findFirst({
        where: {
          campusId: Number(input.form.campusId),
          userId: Number(input.form.studentId),
          classId: Number(input.form.classId),
          sectionId: Number(input.form.sectionId),
          ratingFrom: Number(input.form.currentUserId),
        },
      }).then(async (rating) => {
        if (rating !== null && rating !== undefined) {

          await prisma.studentRatings.update({
            where: {
              id: rating.id,
              campusId: Number(input.form.campusId),
            },
            data: {
              rating: Number(input.form.rating),
              previousRating: rating.rating,
              previousComments: rating.comments,
              comments: input.form.comment,
              updated_by: Number(input.form.currentUserId),
              updated_at: new Date()
            },
          });
          return res.json({ status: true, data: null, message: 'Feedback updated' });
        } else {
          await prisma.studentRatings.create({
            data: {
              campusId: Number(input.form.campusId),
              userId: Number(input.form.studentId),
              classId: Number(input.form.classId),
              sectionId: Number(input.form.sectionId),
              ratingFrom: Number(input.form.currentUserId),
              rating: Number(input.form.rating),
              previousRating: 0,
              previousComments: '',
              comments: input.form.comment,
              created_by: Number(input.form.currentUserId),
              created_at: new Date(),
              updated_by: Number(input.form.currentUserId),
              updated_at: new Date()
            },
          });

          return res.json({ status: true, data: null, message: 'Feedback added' });
        }
      });




    } catch (error) {
      console.error(error);
      return res.json({ status: false, data: null, message: 'Failed to delete Class' });
    }
  }


  public async getStudentsByStudentPatialNameOrId(req: Request, res: Response) {

    const parentDetails: any = req.body;
    console.log(parentDetails);

    let students = [];
    let ids: any[] = [];
    let idsAsArray = [];
    try {

      if (parentDetails !== null && parentDetails !== undefined && parentDetails.id !== null && parentDetails.id !== undefined) {
        students = await prisma.user.findMany({
          where: {
            campusId: Number(parentDetails.campusId),
            userType: UserType.student,
            id: {
              in: [parentDetails.id]
            }
          },
          include: {
            campus: true,
            Attendance: {
              include: {
                class: true,
                section: true
              }
            },
            class: true,
            section: true,
            MYAALInvoices: {
              include: {
                class: true,
                section: true,
              }
            },
            Leaves: {
              include: {
                LeaveDates: true
              }
            },
            StudentFees: {
              include: {
                feePlan: true
              }
            },
            Result: {
              include: {
                exam: true,
                class: true,
                section: true,
                session: true,
                gradeDivision: true
              }
            }
          },
        });
      } else if (parentDetails !== null && parentDetails !== undefined && parentDetails.partialName !== null && parentDetails.partialName !== undefined) {
        ids = await prisma.$queryRawUnsafe(`SELECT id from myskool.User where UPPER(displayName) like ('%${parentDetails.partialName.toUpperCase()}%') and userType='student'`);
        console.log(ids);
        if (ids !== null && ids !== undefined && ids.length > 0) {
          console.log(ids);
          for (let i = 0; i < ids.length; i++) {
            idsAsArray.push(ids[i].id);
          }

          students = await prisma.user.findMany({
            where: {
              campusId: Number(parentDetails.campusId),
              userType: UserType.student,
              id: {
                in: idsAsArray
              }
            },
            include: {
              campus: true,
              Attendance: {
                include: {
                  class: true,
                  section: true
                }
              },
              class: true,
              section: true,
              MYAALInvoices: {
                include: {
                  class: true,
                  section: true,
                }
              },
              Leaves: {
                include: {
                  LeaveDates: true
                }
              },
              StudentFees: {
                include: {
                  feePlan: true
                }
              },
              Result: {
                include: {
                  exam: true,
                  class: true,
                  section: true,
                  session: true,
                  gradeDivision: true
                }
              }
            },
          });
        }

      }


      return res.json({ status: true, data: students, message: 'Search completed' });
    } catch (err) {
      console.log(err);
      return res.json({ status: false, data: null, message: 'Failed to fetch students. Try later.' });
    }
  }



}