import { Request, Response } from "express";
import { ApprovalStatus, Gender, ParentType, Permission, UserType } from '@prisma/client';
import generator from 'generate-password-ts';
import { addANotification, encrypt, generateIdsForParentAndStudent, getGenderByRelation, getPermissionByName } from "../../../../../../shared/helpers/utils/generic.utils";
import { prisma } from "../../../../../../shared/db-client";
import moment from "moment";
import { sendSms, sendEmail, sendAccountCreationEmail } from "../../../../../../shared/helpers/notifications/notifications";




export class ParentController {


  public async updateParent(req: Request, res: Response) {

    const parentDetails: any = req.body;

    let createdStaffObj;
    try {
      await prisma.$transaction(async (tx) => {
        if (parentDetails !== null && parentDetails.form.id !== null && parentDetails.form.id !== undefined) {
          createdStaffObj = await prisma.user.update({
            where: {
              id: parentDetails.form.id,
              campusId: Number(parentDetails.form.campusId)
            },
            data: {
              campusId: parentDetails.form.campusId,
              firstName: parentDetails.form.firstName,
              lastName: parentDetails.form.lastName,
              middleName: parentDetails.form.middleName,
              displayName: parentDetails.form.firstName + ' ' + parentDetails.form.middleName + ' ' + parentDetails.form.lastName,
              gender: parentDetails.form.gender,
              maritalStatus: parentDetails.form.maritalStatus,
              parentType: parentDetails.form.parentType,
              homeAddress: parentDetails.form.homeAddress,
              idProofPhoto: parentDetails.form.idProofPhoto,
              citizenship: parentDetails.form.citizenship,
              religion: parentDetails.form.religion,
              qualification: parentDetails.form.qualification,
              emergencyContact: parentDetails.form.emergencyContact,
              photo: parentDetails.photo,
              thumbnailUrl: parentDetails.thumbnailUrl,
              email: parentDetails.form.email,
              mobile: parentDetails.form.mobile,
              updated_by: parentDetails.updated_by,
              updated_at: new Date()
            },
          }).then(async (ceratedStaffResponse) => {
            return res.json({ status: true, data: createdStaffObj, message: 'Parent updated successfully' });
          });
        }
      });
    } catch (err) {
      console.log(err);
      return res.json({ status: false, data: null, message: 'Failed to update parent info. Try later.' });
    }
  }

  public async getAllParentsByCampus(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);

    const parents = await prisma.user.findMany({
      where: {
        campusId: Number(campusId),
        userType: UserType.parent,
        active: 1
      },
      include: {
        campus: true,
        children: {
          include: {
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


    return res.json({ status: true, data: parents, message: 'Parents retrieved successfully' });
  }


  public async getStaffAccById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const campusId = Number(req.params.campusId);

    const classS = await prisma.user
      .findUnique({
        where: {
          id: Number(id),
          campusId: Number(campusId),
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
        },
      });


    if (!classS) {
      return res.json({ status: false, data: classS, message: 'Failed to fetch employee' });
    }

    return res.json({ status: true, data: classS, message: 'Fetched employee successfully' });
  }

  public async deleteParentAccount(req: Request, res: Response) {
    const id = Number(req.params.id);
    const campusId = Number(req.params.campusId);
    const userId = Number(req.params.userId);
    console.log('In delete ParentAccount : ' + id);
    const user = await prisma.user.findUnique({
      where: {
        id: id,
        campusId: campusId
      },
    })

    if (!user) {
      return res.status(404).json({ status: false, data: null, message: `Parent account with the id "${id}" not found.` })
    }

    const deletedUser = await prisma.user.update({
      where: {
        id: id,
        campusId: campusId
      },
      data: {
        active: 0,
        updated_by: userId,
        updated_at: new Date()
      }

    })

    return res.json({ status: true, data: deletedUser, message: "Parent account has been deleted successfully!" });
  }

  public async getAllParentsByStudentPatialName(req: Request, res: Response) {

    const parentDetails: any = req.body;

    let parentsFound = [];
    let ids: any[] = [];
    let idsAsArray = [];
    try {
      console.log(`SELECT id from myskool.User where UPPER(displayName) like ('%${parentDetails.partialName.toUpperCase()}%') and userType='student' and active=1`)
      ids = await prisma.$queryRawUnsafe(`SELECT id from myskool.User where UPPER(displayName) like ('%${parentDetails.partialName.toUpperCase()}%') and userType='student' and active=1`);


      if (ids !== null && ids !== undefined && ids.length > 0) {
        for (let i = 0; i < ids.length; i++) {
          idsAsArray.push(ids[i].id);
        }


        if (idsAsArray !== null && idsAsArray !== undefined && idsAsArray.length > 0) {
          let childrens = await prisma.user.findMany({
            where: {
              campusId: Number(parentDetails.campusId),
              userType: UserType.student,
              active: 1,
              id: {
                in: idsAsArray
              }
            },
            include: {
              campus: true,
              parent: {
                include: {
                  parent: {
                    include: {
                      campus: true,
                      children: {
                        include: {
                          children: {
                            include: {
                              class: true,
                              section: true,
                              campus: true
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
          });
          if (childrens !== null && childrens !== undefined && childrens.length > 0) {
            for (let j = 0; j < childrens.length; j++) {
              if (childrens[j] !== null && childrens[j] !== undefined && childrens[j].parent.length > 0) {
                for (let k = 0; k < childrens[j].parent.length; k++) {
                  if (childrens[j].parent[k].parent.active === 1) {
                    parentsFound.push(childrens[j].parent[k].parent);
                  }
                }
              }

            }
          }
        }
      }

      return res.json({ status: true, data: parentsFound, message: 'Search completed' });
    } catch (err) {
      console.log(err);
      return res.json({ status: false, data: null, message: 'Failed to update parent info. Try later.' });
    }
  }

  public async fetchParentAccountRequests(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);

    const enquiry = await prisma.requestParentAccount.findMany({
      where: {
        campusId: Number(campusId),
        approvalStatus: ApprovalStatus.Pending,
      },
      include: {
        campus: true,
        student: {
          include:{
            class: true,
            section: true
          }
        }
      },
    });
    return res.json({ status: true, data: enquiry, message: 'Account Requests fetched' });
  }


  public async requestParentAccount(req: Request, res: Response) {

    const parentDetails: any = req.body;
    console.log(parentDetails);
    
    try {
      if(parentDetails!==null && parentDetails!==undefined && parentDetails.form!==null 
        && parentDetails.form!==undefined  && parentDetails.form.studentIdCardNumber!==null && parentDetails.form.studentIdCardNumber!==undefined 
      ){
        let studentsWithParents = await prisma.user.findMany({
          where: {
            idCardNumber: parentDetails.form.studentIdCardNumber,
            userType: UserType.student,
            active: 1,
          },
          include: {
            campus: true,
            parent: {
              include: {
                parent: true
              }
            }
          },
        });
        
        if(studentsWithParents!==null && studentsWithParents!==undefined && studentsWithParents.length>0){
          if(studentsWithParents.length===1){
            
            if(studentsWithParents[0]!==null && studentsWithParents[0]!==undefined 
                  && studentsWithParents[0].parent!==null && studentsWithParents[0].parent!==undefined && studentsWithParents[0].parent.length>0){
                    
                    for(let i = 0; i<studentsWithParents[0].parent.length; i++){
                      
                      if(studentsWithParents[0].parent[i]!==null && studentsWithParents[0].parent[i]!==undefined && 
                        studentsWithParents[0].parent[i].parent!==null && studentsWithParents[0].parent[i].parent!==undefined
                        && studentsWithParents[0].parent[i].parent.parentType.toString()===parentDetails.form.relationship
                      ){
                        return res.json({ status: false,
                                          data: null, 
                                          message: 'Parent Account with relationship '+ parentDetails.form.relationship+' already exists. Please try resetting password if you are facing issues with login.'});
                      
                      }else if(studentsWithParents[0].parent[i]!==null && studentsWithParents[0].parent[i]!==undefined && 
                        studentsWithParents[0].parent[i].parent!==null && studentsWithParents[0].parent[i].parent!==undefined
                        && studentsWithParents[0].parent[i].parent.CNIC.toUpperCase()===parentDetails.form.parentGovtId.toUpperCase()
                      ){
                        return res.json({ status: false,
                                          data: null, 
                                          message: 'Parent Account with relationship '+ studentsWithParents[0].parent[i].parent.parentType.toString()+' already created with Govt ID - '+parentDetails.form.parentGovtId+'. Please create account with different Govt ID.'});
                      }
                    }
            }

            //till here means parent doesnt exist
            console.log('Add parent request');
            await prisma.requestParentAccount.create({
              data: {
                campusId: studentsWithParents[0].campusId,
                studentId: studentsWithParents[0].id,
                parentFullname: parentDetails.form.parentFullName,
                parentEmailId: parentDetails.form.parentEmailId,
                parentMobile: parentDetails.form.parentMobile,
                parentGovtId: parentDetails.form.parentGovtId,
                parentType: parentDetails.form.relationship,
                approvalStatus: ApprovalStatus.Pending,
                reason: '',
                created_by: 1,
                created_at: new Date(),
                updated_by: 1,
                updated_at:new Date(),
              },
            });
            return res.json({ status: true, data: null, message: 'Request has been submitted' });

          }else{
            return res.json({ status: false, data: null, message: 'More than one student found with ID Card # '+parentDetails.form.studentIdCardNumber });
          }
          
        }else{
          return res.json({ status: false, data: null, message: 'Failed to find the student with ID Card # '+parentDetails.form.studentIdCardNumber });
        }
      }

    } catch (err) {
      console.log(err);
      return res.json({ status: false, data: null, message: 'Failed to save the request. Try later.' });
    }
  }

  public async approveRejectParentrequest(req: Request, res: Response) {
  
      const studentWithParents: any = req.body;
      console.log(studentWithParents);
      const password = generator.generate({
        length: 10,
        numbers: true,
        symbols: true
      });
      const encryptedPassword = encrypt(password);

      if (studentWithParents !== null && studentWithParents !== undefined &&
        studentWithParents.form !== null && studentWithParents.form !== undefined
        && studentWithParents.form.status !== null && studentWithParents.form.status !== undefined 
              && studentWithParents.form.id !==null && studentWithParents.form.id !==undefined) {
        //Approve & Send message
  
        try {
  
          const enquiry = await prisma.requestParentAccount.findUnique({
            where: {
              id: studentWithParents.form.id,
              campusId: studentWithParents.form.campusId
            },
          })
  
          if (!enquiry) {
            return res.json({ status: false, data: enquiry, message: 'Unable to find request' });
          }
  
          try {
            if(studentWithParents.form.status==='approved'){
              
              await prisma.requestParentAccount.update({
                where: {
                  id: studentWithParents.form.id,
                  campusId: studentWithParents.form.campusId
                },
                data: {
                  approvalStatus: ApprovalStatus.Approved,
                  updated_by: studentWithParents.form.created_by,
                  updated_at: new Date()
                }
              }).then(async (parentEnQuery) => {
    
              let latestUserID = await prisma.user.findFirst({
                  orderBy: {
                    id: 'desc',
                  },
                  take: 1,
                });
                let parentPermission: Permission = await getPermissionByName('Parent');
                const fatherId = generateIdsForParentAndStudent(latestUserID.id + 1, 'P1');

                await prisma.user.create({
                  data: {
                    userType: UserType.parent,
                    firstName: parentEnQuery.parentFullname.split(' ').slice(0, -1).join(' '),
                    middleName: '',
                    lastName: parentEnQuery.parentFullname.split(' ').slice(-1).join(' '),
                    displayName: parentEnQuery.parentFullname,
                    citizenship: null,
                    gender: Gender[getGenderByRelation(parentEnQuery.parentType)],
                    CNIC: parentEnQuery.parentGovtId,
                    idProofPhoto: parentEnQuery.parentGovtId,
                    religion: null,
                    profession: null,
                    email: parentEnQuery.parentEmailId,
                    mobile: parentEnQuery.parentMobile,
                    whatsapp: parentEnQuery.parentMobile,
                    parentType: parentEnQuery.parentType,
                    idCardNumber: fatherId,
                    updated_by: studentWithParents.form.created_by,
                    created_by: studentWithParents.form.created_by,
                    password: encryptedPassword,
                    campusId: Number(studentWithParents.form.campusId),
                    active: 1,
                  },
                }).then(async (parentCreated)=>{
                      const institute = await prisma.institute.findFirst();

                      //create Parent 1 User Permission
                      await prisma.userPermission.create({
                        data: {
                          userId: Number(parentCreated.id),
                          permissionId: parentPermission.id,
                          active: 1,
                          campusId: Number(studentWithParents.form.campusId),
                          updated_at: new Date(),
                          updated_by: Number(studentWithParents.form.created_by),
                          created_at: new Date(),
                          created_by: Number(studentWithParents.form.created_by)
                        },
                      });
                      await prisma.parentChildRelation.create({
                        data: {
                          parentId: parentCreated.id,
                          childrenId: enquiry.studentId,
                        },
                      });
                      
                      sendAccountCreationEmail(
                        institute,
                        Number(studentWithParents.form.campusId),
                        parentCreated,
                        studentWithParents.created_by, parentCreated.idCardNumber, password);


                      addANotification(Number(studentWithParents.form.campusId),
                      Number(parentCreated.id),
                      Number(studentWithParents.form.created_by),
                      `Account creation request has been approved for ${parentCreated.displayName} with ID Card # ${parentCreated.idCardNumber}`);

                      sendSms('Account Creation Request Processed',
                        {
                          user_name: parentCreated.displayName,
                          approval_status: studentWithParents.form.status,
                          campusId: studentWithParents.form.campusId,
                          loggedInUserId: Number(studentWithParents.form.created_by),
                        }, [
                          parentCreated.mobile
                      ]);
        
                      sendEmail('Account Creation Request Processed',
                        {
                          user_name: parentCreated.displayName,
                          approval_status: studentWithParents.form.status,
                          campusId: studentWithParents.form.campusId,
                          loggedInUserId: Number(studentWithParents.form.created_by),
                        },
                        [
                          {
                            name: parentCreated.displayName,
                            email: parentCreated.email
                          }
                        ]
                      );
                });
              });
    
            }else{
              await prisma.requestParentAccount.update({
                where: {
                  id: studentWithParents.form.id,
                  campusId: studentWithParents.form.campusId
                },
                data: {
                  approvalStatus: ApprovalStatus.Rejected,
                  updated_by: studentWithParents.form.created_by,
                  updated_at: new Date()
                }
              }).then(async (parentEnQuery) => {
                sendSms('Account Creation Request Processed',
                  {
                    user_name: parentEnQuery.parentFullname,
                    approval_status: studentWithParents.form.status,
                    campusId: studentWithParents.form.campusId,
                    loggedInUserId: Number(studentWithParents.form.created_by),
                  }, [
                    parentEnQuery.parentMobile
                ]);
  
                sendEmail('Account Creation Request Processed',
                  {
                    user_name: parentEnQuery.parentFullname,
                    approval_status: studentWithParents.form.status,
                    campusId: studentWithParents.form.campusId,
                    loggedInUserId: Number(studentWithParents.form.created_by),
                  },
                  [
                    {
                      name: parentEnQuery.parentFullname,
                      email: parentEnQuery.parentEmailId
                    }
                  ]
                );
              });
            }
            
            return res.json({ status: true, data: null, message: 'Request has been '+studentWithParents.form.status });
          
          } catch (error) {
            console.error(error);
            return res.json({ status: false, data: null, message: error.message });
          }
  
        } catch (err) {
          console.log(err);
          return res.json({ status: false, data: null, message: 'Failed to update. Try later.' });
        }
      } 
    }

}

