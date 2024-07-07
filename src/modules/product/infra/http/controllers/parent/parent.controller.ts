import { Request, Response } from "express";
import { Gender, ParentType,  UserType } from '@prisma/client';
import generator from 'generate-password-ts';
import { encrypt, generateIdsForParentAndStudent } from "../../../../../../shared/helpers/utils/generic.utils";
import { prisma } from "../../../../../../shared/db-client";
import moment from "moment";




export class ParentController {


public async updateParent  (req: Request, res: Response)  {

  const parentDetails: any = req.body;
  
  let createdStaffObj;

  try {
    await prisma.$transaction(async (tx) => {
      if(parentDetails!==null && parentDetails.form.id!==null && parentDetails.form.id!==undefined){
        createdStaffObj = await prisma.user.update({
          where: {
            id: parentDetails.form.id,
            campusId:Number(parentDetails.form.campusId)
          },
          data: {
            campusId: parentDetails.form.campusId,
            firstName: parentDetails.form.firstName,
            lastName: parentDetails.form.lastName,
            middleName: parentDetails.form.middleName,
            displayName:parentDetails.form.firstName +' '+ parentDetails.form.middleName +' '+ parentDetails.form.lastName,
            gender: parentDetails.form.gender,
            maritalStatus: parentDetails.form.maritalStatus,
            homeAddress: parentDetails.form.homeAddress,
            idProofPhoto: parentDetails.form.idProofPhoto,
            citizenship: parentDetails.form.citizenship,
            religion: parentDetails.form.religion,
            qualification: parentDetails.form.qualification,
            fatherHusbandName: parentDetails.form.fatherHusbandName,
            photo: parentDetails.photo,
            thumbnailUrl: parentDetails.thumbnailUrl,
            email: parentDetails.form.email,
            mobile: parentDetails.form.mobile,
            updated_by: parentDetails.updated_by,
            updated_at: new Date()
          },
        }).then(async (ceratedStaffResponse)=>{
            return res.json({ status: true,  data: createdStaffObj , message:'Parent updated successfully'});
        });
      }   
    });
  } catch (err) {
    console.log(err);
    return res.json({ status: false,  data: null , message:'Failed to update parent info. Try later.' });
  }
}

public async getAllParentsByCampus  (req: Request, res: Response)  {
  const campusId = Number(req.params.campusId);
  
  const parents = await prisma.user.findMany({
    where: {
      campusId : Number(campusId),
      userType : UserType.parent,
      active: 1
    },
    include: {
      campus : true,
      children: {
        include:{
          children: {
            include: {
              class: true,
              section: true,
              campus: true
            }
          }
        }
      }
    },
  });
  
  
  return res.json({ status: true,  data: parents , message:'Parents retrieved successfully' });
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

public async deleteParentAccount  (req: Request, res: Response) {
  const id = Number(req.params.id);
  const campusId = Number(req.params.campusId);
  const userId = Number(req.params.userId);
  console.log('In delete ParentAccount : '+id);
  const user = await prisma.user.findUnique({
    where: {
      id: id,
      campusId:campusId
    },
  })

  if (!user) {
    return res.status(404).json({status: false,  data: null , message: `Parent account with the id "${id}" not found.`})
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

  return res.json({ status: true,  data: deletedUser , message: "Parent account has been deleted successfully!" });
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

