import { Request, Response } from "express";
import { Gender, ParentType, Prisma, PrismaClient, UserType } from '@prisma/client';
import generator from 'generate-password-ts';
import { encrypt, generateIdsForParentAndStudent } from "../../../../../../shared/helpers/utils/generic.utils";


const prisma = new PrismaClient()

export class StudentController {


public async createStudent  (req: Request, res: Response)  {

  const studentWithParents: any = req.body;
  //console.log(studentWithParents);
  
  const password = generator.generate({
    length: 10,
    numbers: true,
    symbols: true
  });
  const encryptedPassword = encrypt(password);
  
  const countOfStudentsInClassAndSection = await prisma.user.count({
    where: {
      classId: Number(studentWithParents.form.classId),
      sectionId: Number(studentWithParents.form.sectionId),
      campusId:Number(studentWithParents.form.campusId)
    },
  });
  console.log(countOfStudentsInClassAndSection);

  const student = {
    userType : UserType.student,
    firstName: studentWithParents.form.firstName,
    middleName: studentWithParents.form.middleName,
    lastName: studentWithParents.form.lastName,
    displayName:studentWithParents.form.firstName +' '+studentWithParents.form.middleName +' '+ studentWithParents.form.lastName,
    citizenship: studentWithParents.form.citizenship,
    gender: studentWithParents.form.gender,
    dateOfBirth: studentWithParents.form.dateOfBirth,
    placeOfBirth: studentWithParents.form.placeOfBirth,
    photo: studentWithParents.photo,
    thumbnailUrl: studentWithParents.thumbnailUrl,
    homeAddress: studentWithParents.form.homeAddress,
    routeId: studentWithParents.form.routeId!=='' ? Number(studentWithParents.form.routeId) : null as never,
    classId: Number(studentWithParents.form.classId),
    sectionId: Number(studentWithParents.form.sectionId),
    previousSchool: studentWithParents.form.previousSchool,
    admissionDate: studentWithParents.form.admissionDate,
    active: 1,
    rollNumber: Number(countOfStudentsInClassAndSection+1) as never,
    idCardNumber: null,
    updated_by: studentWithParents.updated_by,
    created_by: studentWithParents.created_by,
    password:encryptedPassword,
    campusId :Number(studentWithParents.form.campusId)
  };

  let createdStudentObj;


  try {
    await prisma.$transaction(async (tx) => {

      createdStudentObj = await prisma.user.create({
        data: student,
      }).then(async (ceratedStudentResponse)=>{
        
        
        if(ceratedStudentResponse!==null && ceratedStudentResponse!==undefined && ceratedStudentResponse.id!==null){
         const studentID = generateIdsForParentAndStudent(ceratedStudentResponse.id+1, 'ST');
         const fatherId = generateIdsForParentAndStudent(ceratedStudentResponse.id+2, 'P1');
         const  motherId = generateIdsForParentAndStudent(ceratedStudentResponse.id+3, 'P2');
         
         await prisma.user.update({
          where: {
            id: ceratedStudentResponse.id,
          },
          data: {
            idCardNumber: studentID,
          },
        })


        //Create Parents and their relationship
          if(studentWithParents.form.createParentAccount===1){
    
            const createFather = await prisma.user.create({
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
                childId: ceratedStudentResponse.id,
                active: 1,
              },
            });
      
            const createMother = await prisma.user.create({
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
                childId: ceratedStudentResponse.id,
                active: 1,
              },
            });

            const MonthlyFeeRecord = await prisma.monthlyFee.create({
              data: {
                userId : ceratedStudentResponse.id ,
                campusId :Number(studentWithParents.form.campusId) ,
                monthlyamount:studentWithParents.form.monthlyamount ,
                hasDiscount:studentWithParents.form.hasDiscount ,
                discountAmount:studentWithParents.form.discountAmount ,
                totalamount :studentWithParents.form.monthlyamount*12,
                active: 1,
                updated_by: studentWithParents.updated_by,
                created_by: studentWithParents.created_by,
              },
            });

            const admissionRecord = await prisma.admissionRecord.create({
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
      
          }
        }else{
          return res.json({ status: false,  data: null , message:'Failed to create student. Try later.' });
        }


      });

      


    });
    


    

    return res.json({ status: true,  data: createdStudentObj , message:'Student created successfully'});

  } catch (err) {
    console.log(err);
    return res.json({ status: false,  data: null , message:'Failed to create student. Try later.' });
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

public async deleteStudent (req: Request, res: Response) {
  const id = Number(req.params.id);
  const campusId = Number(req.params.campusId);

  const student = await prisma.user.findUnique({
    where: {
      id: id,
      campusId:campusId
    },
  })

  if (!student) {
    return res.json({ status: false,  data: student , message:'Unable to find Student' });
  }

  const deletedStudent= await prisma.user.delete({
    where: {
      id: id,
      campusId:campusId
    },
  })

  return res.json({ status: false,  data: null , message:'Deleted Student' });
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

  const students = await prisma.user.findMany({
    where: {
      campusId : Number(campusId),
      classId : Number(classId),
      sectionId : Number(sectionId)
    },
    include: {
      parents: true,  
      campus : true,
      class: true
    },
  });

  return res.json({ status: true,  data: students , message:'Students loaded successfully' });
}
}