import { Request, Response } from "express";
import { ApprovalStatus, Gender, ParentType, UserType } from '@prisma/client';
import generator from 'generate-password-ts';
import { addANotification, encrypt, generateIdsForParentAndStudent } from "../../../../../../shared/helpers/utils/generic.utils";
import { prisma } from "../../../../../../shared/db-client";
import moment from "moment";
import { sendAccountCreationEmail } from "../../../../../../shared/helpers/notifications/notifications";
import { USER_UPDATED } from "../../../../../../shared/constants/notification.constants";




export class StaffAccountantController {


  public async createStaff(req: Request, res: Response) {

    const staffDetails: any = req.body;
    const empType = String(req.params.empType);
    const institute = await prisma.institute.findFirst();
    
    const password = generator.generate({
      length: 10,
      numbers: true,
      symbols: true
    });
    const encryptedPassword = encrypt(password);


    let latestUserID = await prisma.user.findFirst({
      orderBy: {
        id: 'desc',
      },
      take: 1,
    });

    const idCardID = generateIdsForParentAndStudent(latestUserID.id, 'EM');
    const emplID = 'EMP' + latestUserID.id;
    const middleName = staffDetails.form.middleName !== null && staffDetails.form.middleName !== undefined ? staffDetails.form.middleName : '';
    const staff = {
      userType: empType === 'staff' ? UserType.staff : UserType.accountant,
      firstName: staffDetails.form.firstName,
      middleName: staffDetails.form.middleName,
      lastName: staffDetails.form.lastName,
      displayName: staffDetails.form.firstName + ' ' + middleName + ' ' + staffDetails.form.lastName,
      citizenship: staffDetails.form.citizenship,
      gender: staffDetails.form.gender,
      dateOfBirth: moment(staffDetails.form.dateOfBirth, 'DD-MM-YYYY').toDate(),
      photo: staffDetails.photo,
      thumbnailUrl: staffDetails.thumbnailUrl,
      homeAddress: staffDetails.form.homeAddress,
      joiningDate: moment(staffDetails.form.joiningDate, 'DD-MM-YYYY').toDate(),
      religion: staffDetails.form.religion,
      profession: staffDetails.form.profession,
      email: staffDetails.form.email,
      mobile: staffDetails.form.mobile,
      whatsapp: staffDetails.form.whatsapp,
      empId: emplID,
      CNIC: staffDetails.form.idProofPhoto,
      idProofPhoto: staffDetails.form.idProofPhoto,
      designation: staffDetails.form.designation,
      qualification: staffDetails.form.qualification,
      fatherHusbandName: staffDetails.form.fatherHusbandName,
      maritalStatus: staffDetails.form.maritalStatus,
      salaryType: staffDetails.form.salaryType,
      active: 1,
      idCardNumber: idCardID,
      updated_by: staffDetails.updated_by,
      created_by: staffDetails.created_by,
      password: encryptedPassword,
      campusId: Number(staffDetails.form.campusId),
    };


    let createdStaffObj;

    //console.log(staffDetails)
    try {
      await prisma.$transaction(async (tx) => {

        if (staffDetails !== null && staffDetails.form.id !== null && staffDetails.form.id !== undefined) {
          //console.log('update')

          createdStaffObj = await prisma.user.update({
            where: {
              id: staffDetails.form.id,
              campusId: Number(staffDetails.form.campusId)
            },
            data: {
              campusId: staffDetails.form.campusId,
              firstName: staffDetails.form.firstName,
              lastName: staffDetails.form.lastName,
              middleName: middleName,
              displayName: staffDetails.form.firstName + ' ' + middleName + ' ' + staffDetails.form.lastName,
              gender: staffDetails.form.gender,
              dateOfBirth: moment(staffDetails.form.dateOfBirth, 'DD-MM-YYYY').toDate(),
              joiningDate: moment(staffDetails.form.joiningDate, 'DD-MM-YYYY').toDate(),
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
          }).then(async (ceratedStaffResponse) => {


            if (ceratedStaffResponse !== null && ceratedStaffResponse !== undefined && ceratedStaffResponse.id !== null) {
              return res.json({ status: true, data: createdStaffObj, message: 'Employee updated successfully' });
            } else {
              return res.json({ status: false, data: null, message: 'Failed to update employee. Try later.' });
            }
          });

        } else {
          //console.log('create')
          createdStaffObj = await prisma.user.create({
            data: staff,
          }).then(async (ceratedStaffResponse) => {


            if (ceratedStaffResponse !== null && ceratedStaffResponse !== undefined && ceratedStaffResponse.id !== null) {
              const createUserPermission = await prisma.userPermission.create({
                data: {
                  userId: Number(ceratedStaffResponse.id),
                  permissionId: empType === 'staff' ? Number(2) : Number(3),
                  active: 1,
                  campusId: Number(staffDetails.form.campusId),
                  updated_at: new Date(),
                  updated_by: Number(staffDetails.created_by),
                  created_at: new Date(),
                  created_by: Number(staffDetails.created_by)
                },
              });
              sendAccountCreationEmail(
                institute,
                Number(staffDetails.form.campusId),
                ceratedStaffResponse,
                staffDetails.created_by,
                ceratedStaffResponse.idCardNumber,
                password
              );

              return res.json({ status: true, data: ceratedStaffResponse, message: 'Employee added successfully' });
            } else {
              return res.json({ status: false, data: null, message: 'Failed to add employee. Try later.' });
            }
          });
        }

      });
    } catch (err) {
      console.log(err);
      return res.json({ status: false, data: null, message: 'Failed to add employee. Try later.' });
    }

  }

  public async getAllStaffAccByCampus(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const empType = String(req.params.empType);
    const students = await prisma.user.findMany({
      where: {
        campusId: Number(campusId),
        userType: {
          in: empType === 'staff' ? [UserType.staff, UserType.admin] : [UserType.accountant]
        },
        active: 1
      },
      include: {
        campus: true,
        EmployeeSalary: {
          include: {
            salaryPlan: true
          }
        }
      },
    });

    return res.json({ status: true, data: students, message: 'Employees retrieved successfully' });
  }


  public async getAllEmployeesForDropdown(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const active = Number(req.params.active);

    const employees = await prisma.user.findMany({
      where: {
        campusId: Number(campusId),
        active: Number(active),
        userType: {
          in: [UserType.accountant, UserType.admin, UserType.staff]
        }
      },
      include: {
        campus: true,
        BankInformation: true
      }
    });

    return res.json({ status: true, data: employees, message: '' });
  }

  public async getEmployeeLoanStatus(req: Request, res: Response) {

    const formData: any = req.body;

    try {

      const employee = await prisma.user.findUnique({
        where: {
          id: Number(formData.empId),
          campusId: Number(formData.campusId),
        },
        include: {
          campus: true,
          EmployeeSalary: true,
          LoanRequest:{
            where:{
              approvalStatus: ApprovalStatus.Pending
            }
          },
          EmployeeLoan: {
            include: {
              transactions: {
                orderBy:{
                  created_at: 'desc'
                }
              },
              LoanDetails: {
                orderBy:{
                  created_at: 'desc'
                }
              }
            }
          },
        },
      });
      
      if (employee !== null && employee !== undefined) {
        return res.json({ status: true, data: employee, message: 'Employee info retrieved' });
      } else {
        return res.json({ status: false, data: null, message: 'Employee not found' });
      }


    } catch (error) {
      console.error(error);

      return res.json({ status: false, data: null, message: 'Employee not found' });
    }
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

  public async deleteStaffAcccountant(req: Request, res: Response) {
    const id = Number(req.params.id);
    const campusId = Number(req.params.campusId);
    const userId = Number(req.params.userId);
    const user = await prisma.user.findUnique({
      where: {
        id: id,
        campusId: campusId
      },
    })

    if (!user) {
      return res.status(404).json({ status: false, data: null, message: `The employee with the id "${id}" not found.` })
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

    return res.json({ status: true, data: deletedUser, message: "The employee has been deleted successfully!" });
  }


  public async updateStaff(req: Request, res: Response) {
    const id = Number(req.params.id);
    const campusId = Number(req.params.campusId);
    const input: any = req.body;
    const staff = await prisma.user.findUnique({
      where: {
        id: id,
        campusId: campusId
      },
    })


    if (!staff) {
      return res.json({ status: false, data: staff, message: 'Failed to update user' });
    }

    try {
      const middleName = input.form.middleName !== null && input.form.middleName !== undefined ? input.form.middleName : '';


      const updatedStaff = await prisma.user.update({
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
          homeAddress: input.form.homeAddress,
          designation: input.form.designation,
          qualification: input.form.qualification,
          maritalStatus: input.form.maritalStatus,
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
        Number(updatedStaff.id),
        Number(input.updated_by),
        USER_UPDATED + updatedStaff.displayName);

      return res.json({ status: true, data: null, message: 'User updated successfully' });

    } catch (error) {
      console.error(error);
      return res.json({ status: false, data: staff, message: 'Failed to update user' });
    }
  }


}

