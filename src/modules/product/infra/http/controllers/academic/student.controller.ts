import { Request, Response } from "express";
import { FeeStatus, FeeType, Gender, ParentType,  Permission,  UserType } from '@prisma/client';
import generator from 'generate-password-ts';
import { encrypt, generateIdsForParentAndStudent, generateInvoiceNumber, getPermissionByName } from "../../../../../../shared/helpers/utils/generic.utils";
import { prisma } from "../../../../../../shared/db-client";
import moment from "moment";
import { sendAccountCreationEmail, sendEmail, sendSms } from "../../../../../../shared/helpers/notifications/notifications";


export class StudentController {


public async createStudent  (req: Request, res: Response)  {

  const studentWithParents: any = req.body;
  const institute = await prisma.institute.findFirst();
  
  const password = generator.generate({
    length: 10,
    numbers: true,
    symbols: true
  });
  const encryptedPassword = encrypt(password);
  //console.log(password);
  let latestInvoiceObj= await prisma.mYAALInvoices.findFirst({
    orderBy: {
      id: 'desc',
    },
    take: 1,
  });
  let latestInvoiceID = latestInvoiceObj!==null && latestInvoiceObj!==undefined? latestInvoiceObj.id : 0;
  const invoiceNumber = generateInvoiceNumber(latestInvoiceID+1);


  const countOfStudentsInClassAndSection = await prisma.user.count({
    where: {
      classId: Number(studentWithParents.form.classId),
      sectionId: Number(studentWithParents.form.sectionId),
      campusId:Number(studentWithParents.form.campusId)
    },
  });

  let latestUserID = await prisma.user.findFirst({
    orderBy: {
      id: 'desc',
    },
    take: 1,
  });
  let parentPermission:Permission = await getPermissionByName('Parent');
  const studentID = generateIdsForParentAndStudent(latestUserID.id + 1, 'ST');
  const middleName = studentWithParents.form.middleName!==null && studentWithParents.form.middleName!==undefined? studentWithParents.form.middleName :'';
  
  const student = {
    userType : UserType.student,
    firstName: studentWithParents.form.firstName,
    middleName: middleName,
    lastName: studentWithParents.form.lastName,
    displayName:studentWithParents.form.firstName +' '+middleName +' '+ studentWithParents.form.lastName,
    citizenship: studentWithParents.form.citizenship,
    gender: studentWithParents.form.gender,
    dateOfBirth: moment(studentWithParents.form.dateOfBirth, 'DD-MM-YYYY').toDate(),
    placeOfBirth: studentWithParents.form.placeOfBirth,
    photo: studentWithParents.photo,
    thumbnailUrl: studentWithParents.thumbnailUrl,
    homeAddress: studentWithParents.form.homeAddress,
    routeId: studentWithParents.form.routeId!==null && studentWithParents.form.routeId!==undefined && studentWithParents.form.routeId!=='' ? Number(studentWithParents.form.routeId) : null as never,
    classId: Number(studentWithParents.form.classId),
    sectionId: Number(studentWithParents.form.sectionId),
    previousSchool: studentWithParents.form.previousSchool,
    admissionDate: moment(studentWithParents.form.admissionDate, 'DD-MM-YYYY').toDate(),
    active: 1,
    rollNumber: Number(countOfStudentsInClassAndSection+1) as never,
    idCardNumber: studentID,
    updated_by: studentWithParents.updated_by,
    created_by: studentWithParents.created_by,
    password:encryptedPassword,
    parentsNames :studentWithParents.form.fatherFullName + ' , ' + studentWithParents.form.motherFullName,
    campusId :Number(studentWithParents.form.campusId),
    colorName:'studifyblueprimary'
  };

  
  let createdStudentObj;


  try {
    await prisma.$transaction(async (tx) => {

      createdStudentObj = await prisma.user.create({
        data: student,
      }).then(async (ceratedStudentResponse)=>{
        
        
        if(ceratedStudentResponse!==null && ceratedStudentResponse!==undefined && ceratedStudentResponse.id!==null){
          
          //create Student User Permission
          const createUserPermission = await prisma.userPermission.create({
            data: {
              userId: Number(ceratedStudentResponse.id),
              permissionId: Number(5) ,
              active: 1,
              campusId:Number(studentWithParents.form.campusId),
              updated_at: new Date(),
              updated_by: Number(studentWithParents.created_by),
              created_at: new Date(),
              created_by: Number(studentWithParents.created_by)
            },
          });
          
          //Send Email and SMS
          const newEntry = await prisma.user.findUnique({
            where: {
              id: Number(ceratedStudentResponse.id),
              campusId: Number(studentWithParents.form.campusId)
            },
            include:{
              class:true,
              section:true,
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
          }).then((value)=>{
            //console.log(value)
            sendSms('Admission SMS', 
                {
                  student_name: value.displayName,
                  parent_1:value.parentsNames,
                  parent_1_phone:value.mobile,
                  parent_2:value.parentsNames,
                  parent_2_phone:value.mobile,
                  roll_no:value.rollNoProcessed,
                  student_id_card:value.idCardNumber,
                  institute_name:value.campus.institute.instituteName,
                  institute_campus:value.campus.campusName,
                  class_name:value.class.className,
                  section_name:value.section.sectionName,
                  session:value.campus.institute.session.session,

                  campusId : value.campus.id,
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
                  parent_1:value.parentsNames,
                  parent_1_phone:value.mobile,
                  parent_2:value.parentsNames,
                  parent_2_phone:value.mobile,
                  roll_no:value.rollNoProcessed,
                  student_id_card:value.idCardNumber,
                  institute_name:value.campus.institute.instituteName,
                  institute_campus:value.campus.campusName,
                  class_name:value.class.className,
                  section_name:value.section.sectionName,
                  session:value.campus.institute.session.session,
                  campusId : value.campus.id,
                  loggedInUserId: Number(studentWithParents.form.created_by),
                  studentOrTeacherId: null,
                  classId: value.class.id,
                  sectionId: value.section.id,
                },
                [
                  {
                    name:studentWithParents.form.fatherFullName,
                    email:studentWithParents.form.fatherEmail
                  },
                  {
                    name:studentWithParents.form.motherFullName,
                    email:studentWithParents.form.motherEmail
                  }
                ]
              );
          });


         const fatherId = generateIdsForParentAndStudent(latestUserID.id+2, 'P1');
         const motherId = generateIdsForParentAndStudent(latestUserID.id+3, 'P2');
         
         

        //Create Parents and their relationship
          if(studentWithParents.form.createParentAccount===1){
            const parent1Present = await prisma.user.findFirst({
              where: {
                CNIC: studentWithParents.form.fatherID,
                campusId: Number(studentWithParents.form.campusId)
              },
            })
            if(parent1Present!==null && parent1Present!==undefined){
                console.log('Parent 1 already exists --'+parent1Present.displayName +', Hence mapping to student');
                await prisma.parentChildRelation.create({
                  data: {
                    parentId : parent1Present.id,
                    childrenId:ceratedStudentResponse.id,
                  },
                });
            }else{
              const parent1 = await prisma.user.create({
                data: {
                  userType : UserType.parent,
                  firstName: studentWithParents.form.fatherFullName.split(' ').slice(0, -1).join(' '),
                  middleName: '',
                  lastName: studentWithParents.form.fatherFullName.split(' ').slice(-1).join(' '),
                  displayName: studentWithParents.form.fatherFullName,
                  citizenship: null,
                  gender: Gender.Male,
                  CNIC:studentWithParents.form.fatherID,
                  idProofPhoto:studentWithParents.form.fatherID,
                  religion:studentWithParents.form.fatherReligion,
                  profession:studentWithParents.form.fatherProfession,
                  email:studentWithParents.form.fatherEmail,
                  mobile:studentWithParents.form.fatherMobile,
                  whatsapp:studentWithParents.form.fatherWatsapp,
                  parentType :ParentType.Father,
                  idCardNumber: fatherId,
                  updated_by: studentWithParents.updated_by,
                  created_by: studentWithParents.created_by,
                  password: encryptedPassword,
                  campusId :Number(studentWithParents.form.campusId),
                  active: 1,
                  colorName:'studifyblueprimary'
                },
              });
               //create Parent 1 User Permission
              await prisma.userPermission.create({
                  data: {
                    userId: Number(parent1.id),
                    permissionId: parentPermission.id ,
                    active: 1,
                    campusId:Number(studentWithParents.form.campusId),
                    updated_at: new Date(),
                    updated_by: Number(studentWithParents.created_by),
                    created_at: new Date(),
                    created_by: Number(studentWithParents.created_by)
                  },
              });
              await prisma.parentChildRelation.create({
                data: {
                  parentId : parent1.id,
                  childrenId:ceratedStudentResponse.id,
                },
              });
              
              //Create Parent 1 Family Credit
              await prisma.familyCredit.create({
                data: {
                  userId:Number(parent1.id),
                  availableCredit:0,
                  campusId:Number(studentWithParents.form.campusId),
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
                  studentWithParents.created_by,parent1.idCardNumber , password );

            }
           
            
            
            const parent2Present = await prisma.user.findFirst({
              where: {
                CNIC: studentWithParents.form.motherID,
                campusId: Number(studentWithParents.form.campusId)
              },
            });

            
            if(parent2Present!==null && parent2Present!==undefined){
              console.log('Parent 2 already exists --'+parent2Present.displayName +', Hence mapping to student');
                
              await prisma.parentChildRelation.create({
                data: {
                  parentId : parent2Present.id,
                  childrenId:ceratedStudentResponse.id,
                },
            });
            }else{
              const parent2 = await prisma.user.create({
                data: {
                  userType : UserType.parent,
                  firstName: studentWithParents.form.motherFullName.split(' ').slice(0, -1).join(' '),
                  middleName: '',
                  lastName: studentWithParents.form.motherFullName.split(' ').slice(-1).join(' '),
                  displayName: studentWithParents.form.motherFullName,
                  citizenship: null,
                  gender: Gender.Female,
                  CNIC:studentWithParents.form.motherID,
                  idProofPhoto:studentWithParents.form.motherID,
                  religion:studentWithParents.form.motherReligion,
                  profession:studentWithParents.form.motherProfession,
                  email:studentWithParents.form.motherEmail,
                  mobile:studentWithParents.form.motherMobile,
                  whatsapp:studentWithParents.form.motherWatsapp,
                  parentType :ParentType.Mother,
                  idCardNumber: motherId,
                  updated_by: studentWithParents.updated_by,
                  created_by: studentWithParents.created_by,
                  password: encryptedPassword,
                  campusId :Number(studentWithParents.form.campusId),
                  active: 1,
                  colorName:'studifyblueprimary'
                },
              });
              //create Parent 2 User Permission
              await prisma.userPermission.create({
                  data: {
                    userId: Number(parent2.id),
                    permissionId: parentPermission.id ,
                    active: 1,
                    campusId:Number(studentWithParents.form.campusId),
                    updated_at: new Date(),
                    updated_by: Number(studentWithParents.created_by),
                    created_at: new Date(),
                    created_by: Number(studentWithParents.created_by)
                  },
                });
              await prisma.parentChildRelation.create({
                  data: {
                    parentId : parent2.id,
                    childrenId:ceratedStudentResponse.id,
                  },
              });

              // Send account creation email for parent 1
              sendAccountCreationEmail(
                institute, 
                Number(studentWithParents.form.campusId), 
                parent2,
                studentWithParents.created_by,
                parent2.idCardNumber , 
                password );


            }
            
          }

          await prisma.studentFees.create({
            data: {
              userId : ceratedStudentResponse.id ,
              campusId :Number(studentWithParents.form.campusId) ,
              feePlanId: Number(studentWithParents.form.feePlanId) ,
              active: 1,
              classId: Number(studentWithParents.form.classId),
              sectionId: Number(studentWithParents.form.sectionId),
              updated_by: studentWithParents.updated_by,
              updated_at: new Date(),
              created_by: studentWithParents.created_by,
              created_at: new Date()
            },
          });
          let feePlan = await prisma.feePlan.findUnique({
            where:{
              id:Number(studentWithParents.form.feePlanId)
            }
          });


          let futureMonth = moment(studentWithParents.form.admissionDate, 'DD-MM-YYYY').add(1, 'M');;


          await prisma.mYAALInvoices.create({
            data: {
              userId : ceratedStudentResponse.id ,
              invoiceNumber: invoiceNumber,
              campusId :Number(studentWithParents.form.campusId) ,
              classId: Number(studentWithParents.form.classId),
              sectionId: Number(studentWithParents.form.sectionId), 
              feeStatus :FeeStatus.Unpaid,
              feeType: FeeType.YEARLY,
              year:new Date().getFullYear(),
              month:new Date().getMonth(),
              dueDate: futureMonth.toDate(),
              amount :feePlan.yearlyAmt,
              updated_by: studentWithParents.updated_by,
              updated_at: new Date(),
              created_by: studentWithParents.created_by,
              created_at: new Date()
            },
          });

          await prisma.admissionRecord.create({
            data: {
              userId : ceratedStudentResponse.id,
              campusId :Number(studentWithParents.form.campusId),
              admissionComments:studentWithParents.form.admissionComments,
              rollNumber:String(countOfStudentsInClassAndSection+1) as never,
              active: 1,
              updated_by: studentWithParents.updated_by,
              created_by: studentWithParents.created_by,
            },
          });

        }else{
          return res.json({ status: false,  data: null , message:'Failed to add student. Try later.' });
        }


      });

    });
    


    

    return res.json({ status: true,  data: createdStudentObj , message:'Student added successfully'});

  } catch (err) {
    console.log(err);
    return res.json({ status: false,  data: null , message:'Failed to add student. Try later.' });
  }

}

public async updateStudent (req: Request, res: Response)  {
  const id = Number(req.params.id);
  const campusId = Number(req.params.campusId);
  const input: any = req.body;

  const student = await prisma.user.findUnique({
    where: {
      id: id,
      campusId:campusId
    },
  })

  
  if (!student) {
    return res.json({ status: false,  data: student , message:'Failed to delete student' });
  }

  try {
    const updatedstudent = await prisma.user.update({
      where: {
        id: id,
        campusId:campusId
      },
      data: input,
    })


    return res.json({ status: true,  data: updatedstudent , message:'Updated Class successfully' });
  
} catch (error) {
    console.error(error);
    return res.json({ status: false,  data: student , message:'Failed to delete Class' });
  }
}

public async transferStudentCampus (req: Request, res: Response)  {
  const input: any = req.body;
  
  const student = await prisma.user.findUnique({
    where: {
      id: Number(input.form.id),
      campusId: Number(input.form.campusId)
    },
  })

  
  if (!student) {
    return res.json({ status: false,  data: student , message:'Failed to find student' });
  }

  try {
    const updatedstudent = await prisma.user.update({
      where: {
        id: Number(input.form.id),
        campusId:Number(input.form.campusId)
      },
      data: {
        campusId:Number(input.form.campusIdTo),
        classId:Number(input.form.classIdTo),
        sectionId:Number(input.form.sectionIdTo),
        updated_by: Number(input.form.updated_by),
        updated_at: new Date()
      },
    })


    return res.json({ status: true,  data: updatedstudent , message:'Student Transfer Successful' });
  
  } catch (error) {
    console.error(error);
    return res.json({ status: false,  data: student , message:'Failed to transfer student' });
  }
}



public async promoteStudent (req: Request, res: Response)  {
  const input: any = req.body;
  console.log(input)

  if(input.form.id!==null && input.form.id!==undefined){
    const student = await prisma.user.findUnique({
      where: {
        id: Number(input.form.id),
        campusId: Number(input.form.campusId)
      },
    })
  
    
    if (!student) {
      return res.json({ status: false,  data: student , message:'Failed to find student' });
    }
    try {
      const updatedstudent = await prisma.user.update({
        where: {
          id: Number(input.form.id),
          campusId:Number(input.form.campusId)
        },
        data: {
          classId:Number(input.form.classIdTo),
          sectionId:Number(input.form.sectionIdTo),
          updated_by: Number(input.form.updated_by),
          updated_at: new Date()
        },
      })
  
  
      return res.json({ status: true,  data: updatedstudent , message:'Student Promoted Successfully' });
    
    } catch (error) {
      console.error(error);
      return res.json({ status: false,  data: student , message:'Failed to promote student' });
    }
  }else{
    try {
      const updatedstudent = await prisma.user.updateMany({
        where: {
          active: 1,
          userType: UserType.student,
          campusId:Number(input.form.campusId),
          classId:Number(input.form.classId),
          sectionId:Number(input.form.sectionId),
        },
        data: {
          classId:Number(input.form.classIdTo),
          sectionId:Number(input.form.sectionIdTo),
          updated_by: Number(input.form.updated_by),
          updated_at: new Date()
        },
      })
  
  
      return res.json({ status: true,  data: null , message:'Students Promoted Successfully' });
    
    } catch (error) {
      console.error(error);
      return res.json({ status: false,  data: null , message:'Failed to promote student' });
    }
  }
  

  
}
public async deleteStudent (req: Request, res: Response) {
  const id = Number(req.params.id);
  const campusId = Number(req.params.campusId);

  const student = await prisma.user.findUnique({
    where: {
      id: Number(id),
      campusId:Number(campusId)
    },
  })

  if (!student) {
    return res.json({ status: false,  data: student , message:'Unable to find Student' });
  }

  await prisma.user.delete({
    where: {  
      id: id,
      campusId:campusId
    },
  })

  return res.json({ status: false,  data: null , message:'Deleted Student' });
}


public async getStudentBirthday (req: Request, res: Response) {
  const campusId = Number(req.params.campusId);
  let today = new Date(Date.now());
  let futureDate = new Date(Date.now() + (24 * 60 * 60 * 1000 * 7));


  let yesterday = new Date(Date.now() - (24 * 60 * 60 * 1000 * 1));
  let tomorrow = new Date(Date.now() + (24 * 60 * 60 * 1000 * 1));



  console.log('today '+today);
  console.log('minusDate '+futureDate)
  
  const result = await prisma.$queryRaw`SELECT us.id, us.displayName,us.gender,us.photo, us.thumbnailUrl,DATE_FORMAT(us.dateOfBirth,'%d-%m-%Y') as dob,us.idCardNumber, cl.className,sec.sectionName  FROM myskool.User us
  left join myskool.Class cl ON cl.id = us.classId
  left join myskool.Section sec ON sec.id = us.sectionId
  where us.campusId=1 and us.active=1
  and us.userType='student' and day(us.dateOfBirth) = day(curdate())
  and month(us.dateOfBirth) = month(curdate())`


  const studentsFutureBday =  await prisma.user.findMany({
    where: {
      campusId : Number(campusId),
      active: 1,
      userType: UserType.student,
      dateOfBirth:{
        lte: futureDate,
        gte: today,
      }
    },
    include: {
      campus : true,
      class: true,
      section:true
    },
  });
  

  return res.json({ status: true,  data: result, futureBday: studentsFutureBday , message:'' });
}

public async getStudentId  (req: Request, res: Response) {
  const id = Number(req.params.id);
  const campusId = Number(req.params.campusId);

  const student = await prisma.user
  .findUnique({
    where: {
      id: Number(id),
      campusId : Number(campusId)
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
      campus : true,
      class: true
    },
  });


  if (!student) {
    return res.json({ status: false,  data: student , message:'Failed to fetch student' });
  }

  return res.json({ status: true,  data: student , message:'Fetched student successfully' });
}


public async getAllStudents (req: Request, res: Response)  {
  const campusId = Number(req.params.campusId);

  const students = await prisma.user.findMany({
    where: {
      campusId : Number(campusId)
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
      campus : true,
      class: true
    },
  });

  return res.json({ status: true,  data: students , message:'Students loaded successfully' });
}

public async getAllStudentsByClassAndSection  (req: Request, res: Response)  {
  const campusId = Number(req.params.campusId);
  const classId = Number(req.params.classId);
  const sectionId = Number(req.params.sectionId);
  const active = Number(req.params.active);
  const students = await prisma.user.findMany({
    where: {
      campusId : Number(campusId),
      classId : Number(classId),
      sectionId : Number(sectionId),
      active: Number(active)
    },
    include: {
      parent: {
        include: {
          parent:true
        }
      },  
      children: {
        include: {
          children:true
        }
      },
      campus : true,
      class: true,
      section: true,
      StudentFees:{
        include:{
          feePlan: true
        },
        where:{
          active: 1,
          campusId: Number(campusId), 
        }
      },
      AdmissionRecord: true,
    },
  });
  return res.json({ status: true,  data: students , message:'Students loaded successfully' });
}

public async getAllAdmissionEnquiry  (req: Request, res: Response)  {
  const campusId = Number(req.params.campusId);
  const isFromApp = Number(req.params.isFromApp);
  console.log(isFromApp);
  const enquiry = await prisma.admissionRequestOrInquiries.findMany({
    where: {
      campusId : Number(campusId),
      active: 1,
      isFromApp: isFromApp
    },
    include: {
      campus : true,
      class: true,
    },
  });
  return res.json({ status: true,  data: enquiry , message:'Data fetched' });
}


public async createAdmissionInquiry  (req: Request, res: Response)  {

  const studentWithParents: any = req.body;
  const middleName = studentWithParents.form.middleName!==null && studentWithParents.form.middleName!==undefined? studentWithParents.form.middleName :'';
  
  let newInquiry;

  try {

    newInquiry = await prisma.admissionRequestOrInquiries.create({
      data: {
        isFromApp: studentWithParents.form.isFromApp===undefined ?  0 : 1,
        firstName: studentWithParents.form.firstName,
        middleName: middleName,
        lastName: studentWithParents.form.lastName,
        displayName:studentWithParents.form.firstName +' '+middleName +' '+ studentWithParents.form.lastName,
        gender: studentWithParents.form.gender,
        dateOfBirth: moment(studentWithParents.form.dateOfBirth, 'DD-MM-YYYY').toDate(),
        placeOfBirth: studentWithParents.form.placeOfBirth,
        location: studentWithParents.form.location,
        classId: Number(studentWithParents.form.classId),
        campusId :Number(studentWithParents.form.campusId),
        previousSchool: studentWithParents.form.previousSchool,
        admissionDate: moment(studentWithParents.form.admissionDate, 'DD-MM-YYYY').toDate(),
        parentFullName :studentWithParents.form.parentFullName,
        active: 1,  
        IDorCNIC : studentWithParents.form.IDorCNIC,
        email : studentWithParents.form.email,
        mobile : studentWithParents.form.mobile,
        comments : studentWithParents.form.comments,
        updated_by: Number(studentWithParents.form.updated_by),
        created_by: Number(studentWithParents.form.created_by),
        created_at: new Date(),
        updated_at: new Date()
      },
    });
    const newEntry = await prisma.admissionRequestOrInquiries.findUnique({
      where: {
        id: Number(newInquiry.id),
        campusId: Number(studentWithParents.form.campusId)
      },
      include:{
        class:true,
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
    }).then((value)=>{
      console.log(value)
      sendSms('Admission Enquiry', 
          {
            student_name: value.displayName,
            parent_1:value.parentFullName,
            parent_1_phone:value.mobile,
            parent_2:value.parentFullName,
            parent_2_phone:value.mobile,
            roll_no:'N/A',
            student_id_card:'N/A',
            institute_name:value.campus.institute.instituteName,
            institute_campus:value.campus.campusName,
            class_name:value.class.className,
            section_name:'Not Assigned',
            session:value.campus.institute.session.session,
            campusId : value.campus.id,
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
            parent_1:value.parentFullName,
            parent_1_phone:value.mobile,
            parent_2:value.parentFullName,
            parent_2_phone:value.mobile,
            roll_no:'N/A',
            student_id_card:'N/A',
            institute_name:value.campus.institute.instituteName,
            institute_campus:value.campus.campusName,
            class_name:value.class.className,
            section_name:'Not Assigned',
            session:value.campus.institute.session.session,
            campusId : value.campus.id,
            loggedInUserId: Number(studentWithParents.form.created_by),
            studentOrTeacherId: null,
            classId: value.class.id,
            sectionId: null,
          },
          [
            {
              name:value.parentFullName,
              email:studentWithParents.form.email
            }
          ]
        );
    })


    
    return res.json({ status: true,  data: newInquiry , message:'Enquiry added'});

  } catch (err) {
    console.log(err);
    return res.json({ status: false,  data: null , message:'Failed to add. Try later.' });
  }

}


public async approveAdmissionInquiry  (req: Request, res: Response)  {

  const studentWithParents: any = req.body;

  console.log(studentWithParents);
  
  if(studentWithParents!==null && studentWithParents!==undefined &&
             studentWithParents.form!==null && studentWithParents.form!==undefined 
                  && studentWithParents.form.status!==null && studentWithParents.form.status!==undefined && studentWithParents.form.status==='Approve'){
                    //Approve & Send message
                    
                    try {

                        const enquiry = await prisma.admissionRequestOrInquiries.findUnique({
                          where: {
                            id: studentWithParents.form.id,
                            campusId:studentWithParents.form.campusId
                          },
                        })
                      
                        if (!enquiry) {
                          return res.json({ status: false,  data: enquiry , message:'Unable to find request' });
                        }

                        try{
                          await prisma.admissionRequestOrInquiries.update({
                            where: {
                              id: studentWithParents.form.id,
                              campusId: studentWithParents.form.campusId
                            },
                            data:{
                              active: 1,
                              isApproved:'Yes',
                              updated_by: studentWithParents.form.userId,
                              updated_at: new Date()
                            }
                          }).then(async (admissionQuery)=>{
                            
                            const newEntry = await prisma.campus.findUnique({
                              where: {
                                id: Number(studentWithParents.form.campusId),
                              },
                              include:{
                                institute: {
                                  include: {
                                    session: true
                                  }
                                }
                              }
                            }).then((value)=>{
                                sendSms('Admission Enquiry Processed', 
                                    {
                                      student_name: admissionQuery.displayName,
                                      parent_1:admissionQuery.parentFullName,
                                      parent_1_phone:admissionQuery.mobile,
                                      parent_2:admissionQuery.parentFullName,
                                      parent_2_phone:admissionQuery.mobile,
                                      roll_no:'N/A',
                                      student_id_card:'N/A',
                                      institute_name:value.institute.instituteName,
                                      institute_campus:value.campusName,
                                      class_name:'N/A',
                                      section_name:'N/A',
                                      session:value.institute.session.session,
                                      campusId : value.id,
                                      loggedInUserId: Number(studentWithParents.form.created_by),
                                      studentOrTeacherId: null,
                                      classId: admissionQuery.id,
                                      sectionId: null,
                                      admission_status: 'APPROVED',
                                      extra_content: studentWithParents.form.content,
                                    },[
                                      '+919836618119'
                                    ]);
                      
                                sendEmail('Admission Enquiry Processed', 
                                    {
                                      student_name: admissionQuery.displayName,
                                      parent_1:admissionQuery.parentFullName,
                                      parent_1_phone:admissionQuery.mobile,
                                      parent_2:admissionQuery.parentFullName,
                                      parent_2_phone:admissionQuery.mobile,
                                      roll_no:'N/A',
                                      student_id_card:'N/A',
                                      institute_name:value.institute.instituteName,
                                      institute_campus:value.campusName,
                                      class_name:'N/A',
                                      section_name:'N/A',
                                      session:value.institute.session.session,
                                      campusId : value.id,
                                      loggedInUserId: Number(studentWithParents.form.created_by),
                                      studentOrTeacherId: null,
                                      classId: admissionQuery.id,
                                      sectionId: null,
                                      admission_status: 'APPROVED',
                                      extra_content: studentWithParents.form.content,
                                    },
                                    [
                                      {
                                        name:enquiry.displayName,
                                        email:enquiry.email
                                      }
                                    ]
                                  );
                              });
                          });
                          
                          return res.json({ status: true,  data: null , message:'Request Approved' });
                      
                      
                        } catch (error) {
                          console.error(error);
                          return res.json({ status: false,  data: null , message:error.message });
                        }

                      } catch (err) {
                        console.log(err);
                        return res.json({ status: false,  data: null , message:'Failed to update. Try later.' });
                      }


                  }else{
                    

                    //Send message only

                    const enquiry = await prisma.admissionRequestOrInquiries.findUnique({
                      where: {
                        id: studentWithParents.form.id,
                        campusId:studentWithParents.form.campusId
                      },
                    }).then(async (admissionQuery)=>{
        
                      const campusObj = await prisma.campus.findUnique({
                        where: {
                          id: Number(studentWithParents.form.campusId),
                        },
                        include:{
                          institute: {
                            include: {
                              session: true
                            }
                          }
                        }
                      }).then((value)=>{
                        console.log('Print Campus');
                        console.log(value);
                        
                          sendSms('Admission Enquiry Processed', 
                              {
                                student_name: admissionQuery.displayName,
                                parent_1:admissionQuery.parentFullName,
                                parent_1_phone:admissionQuery.mobile,
                                parent_2:admissionQuery.parentFullName,
                                parent_2_phone:admissionQuery.mobile,
                                roll_no:'N/A',
                                student_id_card:'N/A',
                                institute_name:value.institute.instituteName,
                                institute_campus:value.campusName,
                                class_name:'N/A',
                                section_name:'N/A',
                                session:value.institute.session.session,
                                campusId : value.id,
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
                                parent_1:admissionQuery.parentFullName,
                                parent_1_phone:admissionQuery.mobile,
                                parent_2:admissionQuery.parentFullName,
                                parent_2_phone:admissionQuery.mobile,
                                roll_no:'N/A',
                                student_id_card:'N/A',
                                institute_name:value.institute.instituteName,
                                institute_campus:value.campusName,
                                class_name:'N/A',
                                section_name:'N/A',
                                session:value.institute.session.session,
                                campusId : value.id,
                                loggedInUserId: Number(studentWithParents.form.created_by),
                                studentOrTeacherId: null,
                                classId: admissionQuery.id,
                                sectionId: null,
                                admission_status: 'PROCESSING',
                                extra_content: studentWithParents.form.content,
                              },
                              [
                                {
                                  name:admissionQuery.displayName,
                                  email:admissionQuery.email
                                }
                              ]
                            );
                        });
                    });
                    
                    return res.json({ status: true,  data: null , message:'Notification sent' });

                  }
}


public async deleteAdmissionEnquiry (req: Request, res: Response)  {
  const id = Number(req.params.id);
  const campusId = Number(req.params.campusId);
  const userId = Number(req.params.currentUserid);
  console.log('Delete Enquiry by ID : '+id);

  const enquiry = await prisma.admissionRequestOrInquiries.findUnique({
    where: {
      id: id,
      campusId:campusId
    },
  })

  if (!enquiry) {
    return res.json({ status: false,  data: enquiry , message:'Unable to find request' });
  }
  
  
  try{
    await prisma.admissionRequestOrInquiries.update({
      where: {
        id: id,
        campusId:campusId
      },
      data:{
        active: 0,
        isApproved:'No',
        updated_by: userId,
        updated_at: new Date()
      }
    }).then(async (admissionQuery)=>{
        
      const newEntry = await prisma.campus.findUnique({
        where: {
          id: Number(campusId),
        },
        include:{
          institute: {
            include: {
              session: true
            }
          }
        }
      }).then((value)=>{
          sendSms('Admission Enquiry Processed', 
              {
                student_name: admissionQuery.displayName,
                parent_1:admissionQuery.parentFullName,
                parent_1_phone:admissionQuery.mobile,
                parent_2:admissionQuery.parentFullName,
                parent_2_phone:admissionQuery.mobile,
                roll_no:'N/A',
                student_id_card:'N/A',
                institute_name:value.institute.instituteName,
                institute_campus:value.campusName,
                class_name:'N/A',
                section_name:'N/A',
                session:value.institute.session.session,
                campusId : value.id,
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
                parent_1:admissionQuery.parentFullName,
                parent_1_phone:admissionQuery.mobile,
                parent_2:admissionQuery.parentFullName,
                parent_2_phone:admissionQuery.mobile,
                roll_no:'N/A',
                student_id_card:'N/A',
                institute_name:value.institute.instituteName,
                institute_campus:value.campusName,
                class_name:'N/A',
                section_name:'N/A',
                session:value.institute.session.session,
                campusId : value.id,
                loggedInUserId: Number(userId),
                studentOrTeacherId: null,
                classId: null,
                sectionId: null,
                admission_status: 'REJECTED',
                extra_content: 'Please contact school for any queries/questions.',
              },
              [
                {
                  name:enquiry.displayName,
                  email:enquiry.email
                }
              ]
            );
        });
    });

    return res.json({ status: true,  data: null , message:'Request deleted' });


  } catch (error) {
    console.error(error);
    return res.json({ status: false,  data: null , message:error.message });
  }
  

}


public async fetchAdmissionFormStats  (req: Request, res: Response)  {
  const campusId = Number(req.params.campusId);
  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  let yesterday = new Date(Date.now() - (24 * 60 * 60 * 1000));

  const monthLyAdmission = await prisma.user.findMany({
    where: {
      campusId : Number(campusId),
      active: 1,
      userType: UserType.student,
      created_at:{
        lte: date,
        gte: firstDay,
      }
    },
    include: {
      campus : true,
      class: true,
    },
  });

  const todaysAdmission = await prisma.user.findMany({
    where: {
      campusId : Number(campusId),
      active: 1,
      userType: UserType.student,
      created_at:{
        lte: date,
        gte: yesterday,
      }
    },
    include: {
      campus : true,
      class: true,
    },
  });

  const totalActiveUsers = await prisma.user.findMany({
    where: {
      campusId : Number(campusId),
      active: 1,
      userType: UserType.student,
    },
    include: {
      campus : true,
      class: true,
    },
  });


  return res.json({ status: true,  data: {monthlyAdmission :monthLyAdmission, oneDayAdmission: todaysAdmission, totalActiveUsers: totalActiveUsers} , message:'Data fetched' });
}



}