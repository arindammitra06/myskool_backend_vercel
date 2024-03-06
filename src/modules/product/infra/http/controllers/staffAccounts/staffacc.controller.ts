import { Request, Response } from "express";
import { Gender, ParentType,  UserType } from '@prisma/client';
import generator from 'generate-password-ts';
import { encrypt, generateIdsForParentAndStudent } from "../../../../../../shared/helpers/utils/generic.utils";
import { prisma } from "../../../../../../shared/db-client";
import moment from "moment";




export class StaffAccountantController {


public async createStaff  (req: Request, res: Response)  {

  const staffDetails: any = req.body;
  const empType = String(req.params.empType);
  
  const password = generator.generate({
    length: 10,
    numbers: true,
    symbols: true
  });
  const encryptedPassword = encrypt(password);
  console.log(password);
 

  let latestUserID = await prisma.user.findFirst({
    orderBy: {
      id: 'desc',
    },
    take: 1,
  });

  const idCardID = generateIdsForParentAndStudent(latestUserID.id, 'EM');
  const emplID = 'EMP'+latestUserID.id;
  const middleName = staffDetails.form.middleName!==null && staffDetails.form.middleName!==undefined? staffDetails.form.middleName :'';
  const staff = {
    userType : empType==='staff' ? UserType.staff : UserType.accountant,
    firstName: staffDetails.form.firstName,
    middleName: staffDetails.form.middleName,
    lastName: staffDetails.form.lastName,
    displayName:staffDetails.form.firstName +' '+ middleName +' '+ staffDetails.form.lastName,
    citizenship: staffDetails.form.citizenship,
    gender: staffDetails.form.gender,
    dateOfBirth: staffDetails.form.dateOfBirth,
    photo: staffDetails.photo,
    thumbnailUrl: staffDetails.thumbnailUrl,
    homeAddress: staffDetails.form.homeAddress,
    joiningDate: staffDetails.form.joiningDate,
    religion:staffDetails.form.religion,
    profession:staffDetails.form.profession,
    email:staffDetails.form.email,
    mobile:staffDetails.form.mobile,
    whatsapp:staffDetails.form.whatsapp,
    empId:emplID,
    CNIC:staffDetails.form.idProofPhoto,
    idProofPhoto:staffDetails.form.idProofPhoto,
    designation:staffDetails.form.designation,
    qualification:staffDetails.form.qualification,
    fatherHusbandName:staffDetails.form.fatherHusbandName,
    maritalStatus:staffDetails.form.maritalStatus,
    salaryType:staffDetails.form.salaryType,
    active: 1,
    idCardNumber: idCardID,
    updated_by: staffDetails.updated_by,
    created_by: staffDetails.created_by,
    password:encryptedPassword,
    campusId :Number(staffDetails.form.campusId),
    colorName:'studifyblueprimary'
  };

  
  let createdStaffObj;

  //console.log(staffDetails)
  try {
    await prisma.$transaction(async (tx) => {

      if(staffDetails!==null && staffDetails.form.id!==null && staffDetails.form.id!==undefined){
        //console.log('update')
        
        createdStaffObj = await prisma.user.update({
          where: {
            id: staffDetails.form.id,
            campusId:Number(staffDetails.form.campusId)
          },
          data: {
            campusId: staffDetails.form.campusId,
            firstName: staffDetails.form.firstName,
            lastName: staffDetails.form.lastName,
            middleName: middleName,
            displayName:staffDetails.form.firstName +' '+ middleName +' '+ staffDetails.form.lastName,
            gender: staffDetails.form.gender,
            dateOfBirth: staffDetails.form.dateOfBirth,
            joiningDate: staffDetails.form.joiningDate,
            salaryType: staffDetails.form.salaryType,
            maritalStatus: staffDetails.form.maritalStatus,
            homeAddress: staffDetails.form.homeAddress,
            idProofPhoto: staffDetails.form.idProofPhoto,
            citizenship: staffDetails.form.citizenship,
            religion: staffDetails.form.religion,
            qualification: staffDetails.form.qualification,
            designation: staffDetails.form.designation,
            fatherHusbandName: staffDetails.form.fatherHusbandName,
            photo: staffDetails.photo,
            thumbnailUrl: staffDetails.thumbnailUrl,
            email: staffDetails.form.email,
            mobile: staffDetails.form.mobile,
            updated_by: staffDetails.form.updated_by,
          },
        }).then(async (ceratedStaffResponse)=>{
        
        
          if(ceratedStaffResponse!==null && ceratedStaffResponse!==undefined && ceratedStaffResponse.id!==null){
            // await prisma.monthlyFee.create({
            //   data: {
            //     userId : ceratedStudentResponse.id ,
            //     campusId :Number(studentWithParents.form.campusId) ,
            //     monthlyamount:studentWithParents.form.monthlyamount ,
            //     hasDiscount:studentWithParents.form.hasDiscount ,
            //     discountAmount:studentWithParents.form.discountAmount ,
            //     totalamount :studentWithParents.form.monthlyamount*12,
            //     active: 1,
            //     updated_by: studentWithParents.updated_by,
            //     created_by: studentWithParents.created_by,
            //   },
            // });
  
            // await prisma.admissionRecord.create({
            //   data: {
            //     userId : ceratedStudentResponse.id,
            //     campusId :Number(studentWithParents.form.campusId),
            //     admissionComments:studentWithParents.form.admissionComments,
            //     rollNumber:String(countOfStudentsInClassAndSection+1) as never,
            //     active: 1,
            //     updated_by: studentWithParents.updated_by,
            //     created_by: studentWithParents.created_by,
            //   },
            // });
            return res.json({ status: true,  data: createdStaffObj , message:'Employee updated successfully'});
          }else{
            return res.json({ status: false,  data: null , message:'Failed to update employee. Try later.' });
          }
        });

      }else{
        //console.log('create')
        createdStaffObj = await prisma.user.create({
          data: staff,
        }).then(async (ceratedStaffResponse)=>{
          
          
          if(ceratedStaffResponse!==null && ceratedStaffResponse!==undefined && ceratedStaffResponse.id!==null){
            const createUserPermission = await prisma.userPermission.create({
              data: {
                userId: Number(ceratedStaffResponse.id),
                permissionId: empType==='staff' ? Number(2) : Number(3) ,
                active: 1,
                campusId:Number(staffDetails.form.campusId),
                updated_at: new Date(),
                updated_by: Number(staffDetails.created_by),
                created_at: new Date(),
                created_by: Number(staffDetails.created_by)
              },
            });

            // await prisma.monthlyFee.create({
            //   data: {
            //     userId : ceratedStudentResponse.id ,
            //     campusId :Number(studentWithParents.form.campusId) ,
            //     monthlyamount:studentWithParents.form.monthlyamount ,
            //     hasDiscount:studentWithParents.form.hasDiscount ,
            //     discountAmount:studentWithParents.form.discountAmount ,
            //     totalamount :studentWithParents.form.monthlyamount*12,
            //     active: 1,
            //     updated_by: studentWithParents.updated_by,
            //     created_by: studentWithParents.created_by,
            //   },
            // });
  
            // await prisma.admissionRecord.create({
            //   data: {
            //     userId : ceratedStudentResponse.id,
            //     campusId :Number(studentWithParents.form.campusId),
            //     admissionComments:studentWithParents.form.admissionComments,
            //     rollNumber:String(countOfStudentsInClassAndSection+1) as never,
            //     active: 1,
            //     updated_by: studentWithParents.updated_by,
            //     created_by: studentWithParents.created_by,
            //   },
            // });
            return res.json({ status: true,  data: ceratedStaffResponse , message:'Employee added successfully'});
          }else{
            return res.json({ status: false,  data: null , message:'Failed to add employee. Try later.' });
          }
        });
      }
      
    });
  } catch (err) {
    console.log(err);
    return res.json({ status: false,  data: null , message:'Failed to add employee. Try later.' });
  }

}

public async getAllStaffAccByCampus  (req: Request, res: Response)  {
  const campusId = Number(req.params.campusId);
  const empType = String(req.params.empType);
  const students = await prisma.user.findMany({
    where: {
      campusId : Number(campusId),
      userType : empType==='staff' ? UserType.staff : UserType.accountant,
      active: 1
    },
    include: {
      campus : true,
    },
  });
  
  return res.json({ status: true,  data: students , message:'Employees retrieved successfully' });
}


public async getStaffAccById  (req: Request, res: Response)  {
  const id = Number(req.params.id);
  const campusId = Number(req.params.campusId);

  const classS = await prisma.user
  .findUnique({
    where: {
      id: Number(id),
      campusId : Number(campusId),
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
    },
  });


  if (!classS) {
    return res.json({ status: false,  data: classS , message:'Failed to fetch employee' });
  }

  return res.json({ status: true,  data: classS , message:'Fetched employee successfully' });
}

public async deleteStaffAcccountant  (req: Request, res: Response) {
  const id = Number(req.params.id);
  const campusId = Number(req.params.campusId);
  const userId = Number(req.params.userId);
  console.log('Indelete staff accountant : '+id);
  const user = await prisma.user.findUnique({
    where: {
      id: id,
      campusId:campusId
    },
  })

  if (!user) {
    return res.status(404).json({status: false,  data: null , message: `The employee with the id "${id}" not found.`})
  }

  const deletedUser = await prisma.user.update({
    where: {
      id: id,
      campusId:campusId
    },
    data:{
        active: 0,
        updated_by: userId,
        updated_at: new Date()
    }
    
  })

  return res.json({ status: true,  data: deletedUser , message: "The employee has been deleted successfully!" });
}


public async updateStudentStaff (req: Request, res: Response) {
  const id = Number(req.params.id);
  const campusId = Number(req.params.campusId);
  const input: any = req.body;
  console.log(input);

  const staffAcc = await prisma.user.findUnique({
    where: {
      id: id,
      campusId:campusId
    },
  })

  
  if (!staffAcc) {
    return res.json({ status: false,  data: staffAcc , message:'Failed to retrieve employee details' });
  }

  try {
    const updatedStaffAcc = await prisma.user.update({
      where: {
        id: id,
        campusId:campusId
      },
      data: input,
    })

    return res.json({ status: true,  data: updatedStaffAcc , message:'Updated employee details' });
  
} catch (error) {
    console.error(error);
    return res.json({ status: false,  data: null , message:'Failed to update employee' });
  }
}


}

