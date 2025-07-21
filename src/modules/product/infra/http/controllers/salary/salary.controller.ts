import { Request, Response } from "express";
import { ApprovalStatus, FeeStatus, FeeType, PaymentType, PaySlip, SalaryPlan, SalaryPlanBreakup, TransactionSource, TransactionType, UserType } from '@prisma/client';
import { addANotification, calculateMonthlyTDS_NewRegime, generatePaySlipNumber, getARandomAlphanumericID, getBonusByEmployeeId, getCurrencySymbol, getFinancialYearIdByDate, getTdsDeductedTillNow, getTotalBonusPaidForEmployee } from "../../../../../../shared/helpers/utils/generic.utils";
import { prisma } from "../../../../../../shared/db-client";
import { v4 as uuidv4 } from 'uuid';
import { buildMessage, LOAN_REQUEST_CREATED, LOAN_REQUEST_STATUS } from "../../../../../../shared/constants/notification.constants";
import { sendPaymentViaRazorpayX } from "../../../../../../shared/services/razorpayXService";



export class SalaryController {

  public async getActiveSalaryPlansForDropdown(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const institute = await prisma.institute.findFirst();


    let salaryPlansDropdown = [];
    const salaryPlans = await prisma.salaryPlan.findMany({
      where: {
        campusId: campusId,
        active: 1
      },
      orderBy: {
        name: 'asc'
      }
    });
    if (salaryPlans !== null && salaryPlans !== undefined && salaryPlans.length > 0) {

      for (let i = 0; i < salaryPlans.length; i++) {
        salaryPlansDropdown.push({
          value: salaryPlans[i].id + '',
          label: salaryPlans[i].name
            + ' (Monthly: ' + getCurrencySymbol('en-US',
              institute !== null && institute !== undefined && institute.currency !== null && institute.currency !== undefined
                ? institute.currency : 'INR') + salaryPlans[i].monthlyInhand + ' )'
        });
      }
    }
    return res.json({ status: true, data: salaryPlansDropdown, message: '' });
  }


  public async getAllPaySlipsForEmployee(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const userId = Number(req.params.userId);

    const employees = await prisma.user.findUnique({
      where: {
        id: Number(userId),
        campusId: Number(campusId)
      },
      include: {
        PaySlip: {
          include: {
            financialYear: true,
            user: {
              include: {
                BankInformation: true,
                campus: true,
                EmployeeSalary: {
                  include: {
                    salaryPlan: {
                      include: {
                        SalaryPlanBreakup: true
                      }
                    }
                  }
                }
              }
            }
          },
          orderBy: {
            updated_at: 'desc',
          },
        },
        EmployeeSalary: {
          include: {
            salaryPlan: {
              include: {
                SalaryPlanBreakup: true
              }
            }
          }
        },
        campus: true,
        class: true
      },
    });

    return res.json({ status: true, data: employees, message: '' });
  }


  public async getAllUnpaidPayslipsForEmployee(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const userId = Number(req.params.userId);

    const employees = await prisma.user.findUnique({
      where: {
        id: Number(userId),
        campusId: Number(campusId)
      },
      include: {
        PaySlip: {
          where:{ 
            slipStatus: FeeStatus.Unpaid
          },
          include: {
            financialYear: true,
            user: {
              include: {
                campus: true,
                EmployeeSalary: {
                  include: {
                    salaryPlan: {
                      include: {
                        SalaryPlanBreakup: true
                      }
                    }
                  }
                }
              }
            }
          },
          orderBy: {
            updated_at: 'desc',
          },
        },
        EmployeeSalary: {
          include: {
            salaryPlan: {
              include: {
                SalaryPlanBreakup: true
              }
            }
          }
        },
        campus: true,
        class: true,
        BankInformation: true
      },
    });

    return res.json({ status: true, data: employees, message: employees.PaySlip!==null && employees.PaySlip!==undefined && employees.PaySlip.length>0 ? 'Unpaid Payslips fetched' : 'No Unpaid Payslips'});
  }

  public async getActiveSalaryPlans(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);

    const salaryPlan = await prisma.salaryPlan.findMany({
      where: {
        campusId: campusId,
      },
      include: {
        campus: true,
        SalaryPlanBreakup: {
          orderBy: {
            amount: 'desc',
          }
        },
      },
      orderBy: {
        updated_at: 'desc'
      }
    });
    return res.json({ status: true, data: salaryPlan, message: 'Salary Plan retrieved' });
  }



  public async getSalaryPlanBreakup(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    let myuuid = uuidv4();
    let blankFeeBreakup = [
      {
        id: uuidv4(),
        salaryPlanId: 0,
        campusId: campusId,
        isYearly: 0,
        breakupname: 'Basic',
        amount: 400000.00,
        type: "MONTHLY"
      },
      {
        id: uuidv4(),
        salaryPlanId: 0,
        isYearly: 0,
        campusId: campusId,
        breakupname: 'HRA',
        amount: 200000.00,
        type: "MONTHLY"
      },
      {
        id: uuidv4(),
        salaryPlanId: 0,
        isYearly: 1,
        campusId: campusId,
        breakupname: 'Other Allowance',
        amount: 100000.00,
        type: "MONTHLY"
      },
      {
        id: uuidv4(),
        salaryPlanId: 0,
        isYearly: 1,
        campusId: campusId,
        breakupname: 'PF',
        amount: 96000.00,
        type: "MONTHLY"
      },
      {
        id: uuidv4(),
        salaryPlanId: 0,
        isYearly: 1,
        campusId: campusId,
        breakupname: 'Gratuity',
        amount: 19240.00,
        type: "MONTHLY"
      },
      {
        id: uuidv4(),
        salaryPlanId: 0,
        isYearly: 1,
        campusId: campusId,
        breakupname: 'Professional Tax',
        amount: 3000.00,
        type: "MONTHLY"
      },
    ];

    return res.json({ status: true, data: blankFeeBreakup, message: '' });
  }

  public async createLoanForEmployee(req: Request, res: Response) {
    const formData: any = req.body;
    console.log(formData)

    if (formData !== null && formData !== undefined && formData.form.employeeId !== null && formData.form.employeeId !== undefined) {

      if (formData.form.loanAmount !== null && formData.form.loanAmount !== undefined && formData.form.loanAmount > 0 &&
        formData.form.monthlyAmount !== null && formData.form.monthlyAmount !== undefined && formData.form.monthlyAmount > 0
      ) {

        const parent = await prisma.user.findUnique({
          where: {
            campusId: Number(formData.form.campusId),
            id: Number(formData.form.employeeId)
          },
          include: {
            EmployeeLoan: {
              include: {
                LoanDetails: true,
                transactions: true
              }
            }
          }
        });

        if (!parent) {
          return res.json({ status: false, data: null, message: 'Employee information not found' });
        }


        if (parent !== null && parent.EmployeeLoan !== null && parent.EmployeeLoan !== undefined && parent.EmployeeLoan.length > 0) {

          let exisitinTotalLoanAmt = parent.EmployeeLoan[0].totalLoan;
          let newTotalLoan = Number(exisitinTotalLoanAmt) + Number(formData.form.loanAmount);

          let exisitingRemainingAmt = parent.EmployeeLoan[0].remainingSum;
          let newRemainingAmt = Number(exisitingRemainingAmt) + Number(formData.form.loanAmount);


          await prisma.employeeLoan.update({
            where: {
              id: parent.EmployeeLoan[0].id,
              campusId: parent.EmployeeLoan[0].campusId,
            },
            data: {
              totalLoan: newTotalLoan,
              remainingSum: newRemainingAmt,
              monthlyAmt: formData.form.monthlyAmount,
              updated_by: Number(formData.form.currentUserId),
              updated_at: new Date()
            },
          });
          let loanDetailsInvoice = getARandomAlphanumericID();

          await prisma.loanDetails.create({
            data: {
              LoanId: loanDetailsInvoice,
              campusId: formData.form.campusId,
              employeeLoanId: parent.EmployeeLoan[0].id,
              amount: formData.form.loanAmount,
              status: 1,
              created_by: Number(formData.form.currentUserId),
              created_at: new Date(),
              updated_by: Number(formData.form.currentUserId),
              updated_at: new Date()
            },
          });

          await prisma.transactions.create({
            data: {
              campusId: formData.form.campusId,
              transactionType: TransactionType.Debit,
              source: TransactionSource.NewLoanToEmployee,
              userId: formData.form.employeeId,
              amount: Number(formData.form.loanAmount),
              paymentType: formData.form.paymentMode === 'Cash' ? PaymentType.Cash : formData.form.paymentMode === 'Online' ? PaymentType.Online : formData.form.paymentMode === 'Cheque' ? PaymentType.Cheque : PaymentType.Cash,
              employeeLoanId: parent.EmployeeLoan[0].id,
              invoiceNumber: loanDetailsInvoice,
              created_by: Number(formData.form.currentUserId),
              created_at: new Date()
            },
          });

        } else {
          console.log(parent.EmployeeLoan);

          const newLoan = await prisma.employeeLoan.create({
            data: {
              userId: formData.form.employeeId,
              loanAccountId: getARandomAlphanumericID(),
              campusId: formData.form.campusId,
              totalLoan: formData.form.loanAmount,
              monthlyAmt: formData.form.monthlyAmount,
              remainingSum: formData.form.loanAmount,
              status: 1,
              created_by: Number(formData.form.currentUserId),
              created_at: new Date(),
              updated_by: Number(formData.form.currentUserId),
              updated_at: new Date()
            },
          });
          let loadDetailsInvoice = getARandomAlphanumericID();
          await prisma.loanDetails.create({
            data: {
              LoanId: loadDetailsInvoice,
              campusId: formData.form.campusId,
              employeeLoanId: newLoan.id,
              amount: formData.form.loanAmount,
              status: 1,
              created_by: Number(formData.form.currentUserId),
              created_at: new Date(),
              updated_by: Number(formData.form.currentUserId),
              updated_at: new Date()
            },
          });
          await prisma.transactions.create({
            data: {
              campusId: formData.form.campusId,
              transactionType: TransactionType.Debit,
              source: TransactionSource.NewLoanToEmployee,
              userId: formData.form.employeeId,
              amount: Number(formData.form.loanAmount),
              paymentType: formData.form.paymentMode === 'Cash' ? PaymentType.Cash : formData.form.paymentMode === 'Online' ? PaymentType.Online : formData.form.paymentMode === 'Cheque' ? PaymentType.Cheque : PaymentType.Cash,
              employeeLoanId: newLoan.id,
              invoiceNumber: loadDetailsInvoice,
              created_by: Number(formData.form.currentUserId),
              created_at: new Date()
            },
          });
        }




        return res.json({ status: true, data: null, message: 'Loan sanctioned. Latest deductables to be applied during next payslip generation.' });



      } else {
        return res.json({ status: false, data: null, message: 'Invalid amounts entered' });
      }

    } else {
      return res.json({ status: false, data: null, message: 'Employee information not found' });
    }
  }


  public async approveRejectLoanRequest(req: Request, res: Response) {
    const leaveForm: any = req.body;
    console.log(leaveForm)

    if (leaveForm !== null && leaveForm !== undefined &&
      leaveForm.id !== null && leaveForm.id !== undefined) {

      const loanRequest = await prisma.loanRequest.update({
        where: {
          id: Number(leaveForm.id),
          campusId: Number(leaveForm.campusId),
        },
        data: {
          approvalStatus: ApprovalStatus.Approved,
          updated_at: new Date(),
          updated_by: leaveForm.updatedBy,
          approvalResponse: leaveForm.rejectApproveReason
        },
      });


      if (leaveForm.status !== null && leaveForm.status !== undefined && leaveForm.status === 'Approve') {
        //Approve


        if (Boolean(leaveForm.createLoan) && loanRequest !== null && loanRequest !== undefined) {
          const parent = await prisma.user.findUnique({
            where: {
              campusId: Number(leaveForm.campusId),
              id: Number(loanRequest.userId)
            },
            include: {
              EmployeeLoan: {
                include: {
                  LoanDetails: true,
                  transactions: true
                }
              }
            }
          });

          if (parent !== null && parent.EmployeeLoan !== null && parent.EmployeeLoan !== undefined && parent.EmployeeLoan.length > 0) {

            let exisitinTotalLoanAmt = parent.EmployeeLoan[0].totalLoan;
            let newTotalLoan = Number(exisitinTotalLoanAmt) + Number(loanRequest.totalLoan);

            let exisitingRemainingAmt = parent.EmployeeLoan[0].remainingSum;
            let newRemainingAmt = Number(exisitingRemainingAmt) + Number(loanRequest.totalLoan);


            await prisma.employeeLoan.update({
              where: {
                id: parent.EmployeeLoan[0].id,
                campusId: parent.EmployeeLoan[0].campusId,
              },
              data: {
                totalLoan: newTotalLoan,
                remainingSum: newRemainingAmt,
                monthlyAmt: loanRequest.monthlyAmt,
                updated_by: Number(leaveForm.updatedBy),
                updated_at: new Date()
              },
            });
            let loanDetailsInvoice = getARandomAlphanumericID();

            await prisma.loanDetails.create({
              data: {
                LoanId: loanDetailsInvoice,
                campusId: leaveForm.campusId,
                employeeLoanId: parent.EmployeeLoan[0].id,
                amount: loanRequest.totalLoan,
                status: 1,
                created_by: Number(leaveForm.updatedBy),
                created_at: new Date(),
                updated_by: Number(leaveForm.updatedBy),
                updated_at: new Date()
              },
            });

            await prisma.transactions.create({
              data: {
                campusId: leaveForm.campusId,
                transactionType: TransactionType.Debit,
                source: TransactionSource.NewLoanToEmployee,
                userId: loanRequest.userId,
                amount: Number(loanRequest.totalLoan),
                paymentType: PaymentType.Cash,
                employeeLoanId: parent.EmployeeLoan[0].id,
                invoiceNumber: loanDetailsInvoice,
                created_by: Number(leaveForm.updatedBy),
                created_at: new Date()
              },
            });

          } else {
            console.log(parent.EmployeeLoan);

            const newLoan = await prisma.employeeLoan.create({
              data: {
                userId: loanRequest.userId,
                loanAccountId: getARandomAlphanumericID(),
                campusId: Number(leaveForm.campusId),
                totalLoan: loanRequest.totalLoan,
                monthlyAmt: loanRequest.monthlyAmt,
                remainingSum: loanRequest.totalLoan,
                status: 1,
                created_by: Number(leaveForm.updatedBy),
                created_at: new Date(),
                updated_by: Number(leaveForm.updatedBy),
                updated_at: new Date()
              },
            });
            let loadDetailsInvoice = getARandomAlphanumericID();
            await prisma.loanDetails.create({
              data: {
                LoanId: loadDetailsInvoice,
                campusId: Number(leaveForm.campusId),
                employeeLoanId: newLoan.id,
                amount: loanRequest.totalLoan,
                status: 1,
                created_by: Number(leaveForm.updatedBy),
                created_at: new Date(),
                updated_by: Number(leaveForm.updatedBy),
                updated_at: new Date()
              },
            });
            await prisma.transactions.create({
              data: {
                campusId: Number(leaveForm.campusId),
                transactionType: TransactionType.Debit,
                source: TransactionSource.NewLoanToEmployee,
                userId: loanRequest.userId,
                amount: loanRequest.totalLoan,
                paymentType: PaymentType.Cash,
                employeeLoanId: newLoan.id,
                invoiceNumber: loadDetailsInvoice,
                created_by: Number(leaveForm.updatedBy),
                created_at: new Date()
              },
            });
          }

        }
      } else {
        //Reject or cancel
        await prisma.loanRequest.update({
          where: {
            id: Number(leaveForm.id),
            campusId: Number(leaveForm.campusId),
          },
          data: {
            approvalStatus: leaveForm.status === 'Reject' ? ApprovalStatus.Rejected : leaveForm.status === 'Cancel' ? ApprovalStatus.Cancelled : ApprovalStatus.Pending,
            updated_at: new Date(),
            updated_by: leaveForm.updatedBy,
            approvalResponse: leaveForm.rejectApproveReason
          },
        });
      }

      //Send notification
      //Add notification
      addANotification(Number(leaveForm.campusId),
        Number(loanRequest.created_by),
        Number(leaveForm.updatedBy),
        buildMessage(LOAN_REQUEST_STATUS,
          leaveForm.id + '',
          leaveForm.status === 'Approve' ? 'approved' : leaveForm.status === 'Reject' ? 'rejected' : 'cancelled',
          leaveForm.rejectApproveReason));

    } else {
      return res.json({ status: false, data: null, message: 'Loan Request is not found' });
    }



    return res.json({
      status: true, data: null,
      message: leaveForm.status === 'Approve' ? 'Loan Approved' : leaveForm.status === 'Reject' ? 'Loan Rejected' : 'Loan Cancelled'
    });
  }


  public async createLoanRequest(req: Request, res: Response) {

    const formData: any = req.body;

    try {

      const loanRequests = await prisma.loanRequest.create({
        data: {
          campusId: Number(formData.form.campusId),
          userId: Number(formData.form.employeeId),
          approvalStatus: ApprovalStatus.Pending,
          reason: formData.form.reason,
          totalLoan: Number(formData.form.loanAmount),
          monthlyAmt: Number(formData.form.monthlyAmount),
          created_by: Number(formData.form.currentUserId),
          updated_by: Number(formData.form.currentUserId),
          created_at: new Date(),
          updated_at: new Date()
        },
      });
      //Send notification
      //Add notification
      const accountants = await prisma.user.findMany({
        where: {
          active: 1,
          userType: UserType.accountant,
          campusId: Number(formData.form.campusId),
        },
      });
      if (accountants !== null && accountants !== undefined && accountants.length > 0) {
        accountants.forEach(async (eachUser: any) => {
          addANotification(Number(formData.form.campusId),
            Number(eachUser.id),
            Number(formData.form.currentUserId),
            buildMessage(LOAN_REQUEST_CREATED));
        });
      }

      //Add message for the user
      addANotification(Number(formData.form.campusId),
        Number(formData.form.employeeId),
        Number(formData.form.currentUserId),
        buildMessage(LOAN_REQUEST_CREATED));

      return res.json({ status: true, data: loanRequests, message: 'Loan Requests created' });


    } catch (error) {
      console.error(error);

      return res.json({ status: false, data: null, message: 'Error occured while creating loan requests' });
    }
  }


  public async getAllEmployeeLoanRequests(req: Request, res: Response) {

    const formData: any = req.body;
    try {

      const loanRequests = await prisma.loanRequest.findMany({
        where: {
          campusId: Number(formData.campusId),
        },
        include: {
          campus: true,
          user: true
        },
      });

      return res.json({ status: true, data: loanRequests, message: 'Loan Requests retrieved' });


    } catch (error) {
      console.error(error);

      return res.json({ status: false, data: null, message: 'Error occured while fetching loan requests' });
    }
  }

  public async addUpdateSalaryPlan(req: Request, res: Response) {
    const formData: any = req.body;
    console.log(formData);
    try {
      if (formData !== null && formData !== undefined) {
        if (formData.feeId !== null && formData.feeId !== undefined) {

          //delete existing fee breakups
          await prisma.salaryPlanBreakup.deleteMany({
            where: {
              campusId: Number(formData.campusId),
              salaryPlanId: Number(formData.feeId),
            }
          });
          let monthlyAmount = 0;
          let yearlyAmount = 0;
          let employegratuity = 0;
          let employerPf = 0;
          let employeePf = 0;
          let professionalTax = 0;

          //Update fee id
          if (formData.feeBreakUp !== null && formData.feeBreakUp !== undefined && formData.feeBreakUp.length > 0) {

            for (let i = 0; i < formData.feeBreakUp.length; i++) {
              let element: SalaryPlanBreakup = formData.feeBreakUp[i];
              yearlyAmount = Number(yearlyAmount) + Number(element.amount);

              if (element.breakupname === 'PF') {
                employeePf = Number(element.amount / 24);
                employerPf = Number(element.amount / 24);
                monthlyAmount = monthlyAmount + employeePf;
              } else if (element.breakupname === 'Gratuity') {
                employegratuity = Number(element.amount / 12);
              } else if (element.breakupname === 'Professional Tax') {
                professionalTax = Number(element.amount / 12);
              } else {
                monthlyAmount = Number(monthlyAmount) + Number(element.amount / 12);
              }


              await prisma.salaryPlanBreakup.create({
                data: {
                  salaryPlanId: Number(formData.feeId),
                  campusId: Number(formData.campusId),
                  type: element.type,
                  breakupname: String(element.breakupname),
                  amount: Number(element.amount),
                },
              });
            }
          }

          await prisma.salaryPlan.update({
            where: {
              campusId: Number(formData.campusId),
              id: Number(formData.feeId),
            },
            data: {
              name: formData.feeName,
              monthlyInhand: Number(monthlyAmount),
              yearlyPackage: Number(yearlyAmount),
              professionalTaxMonthly: Number(professionalTax),
              employeePFMonthly: Number(employeePf),
              employerPFMonthly: Number(employerPf),
              gratuityMonthly: Number(employegratuity),
              updated_by: formData.created_by,
              updated_at: new Date()
            },
          });

          return res.json({ data: null, status: true, message: 'Salary Plan updated' });



        } else {
          let monthlyAmount = 0;
          let yearlyAmount = 0;
          let employegratuity = 0;
          let employerPf = 0;
          let employeePf = 0;
          let professionalTax = 0;

          if (formData.feeBreakUp !== null && formData.feeBreakUp !== undefined && formData.feeBreakUp.length > 0) {
            for (let i = 0; i < formData.feeBreakUp.length; i++) {
              let element = formData.feeBreakUp[i];
              yearlyAmount = Number(yearlyAmount) + Number(element.amount);

              if (element.breakupname === 'PF') {
                employeePf = Number(element.amount / 24);
                employerPf = Number(element.amount / 24);
                monthlyAmount = monthlyAmount + employeePf;
              } else if (element.breakupname === 'Gratuity') {
                employegratuity = Number(element.amount / 12);
              } else if (element.breakupname === 'Professional Tax') {
                professionalTax = Number(element.amount / 12);
              } else {
                monthlyAmount = Number(monthlyAmount) + Number(element.amount / 12);
              }
            }
          }

          let feePlan = await prisma.salaryPlan.create({
            data: {
              active: 1,
              campusId: Number(formData.campusId),
              name: formData.feeName,
              monthlyInhand: Number(monthlyAmount),
              yearlyPackage: Number(yearlyAmount),
              professionalTaxMonthly: Number(professionalTax),
              employeePFMonthly: Number(employeePf),
              employerPFMonthly: Number(employerPf),
              gratuityMonthly: Number(employegratuity),
              created_by: formData.created_by,
              created_at: new Date(),
              updated_by: formData.created_by,
              updated_at: new Date()
            },
          });

          if (feePlan !== null && feePlan !== undefined && formData.feeBreakUp !== null && formData.feeBreakUp !== undefined && formData.feeBreakUp.length > 0) {
            for (let i = 0; i < formData.feeBreakUp.length; i++) {
              let element = formData.feeBreakUp[i];
              await prisma.salaryPlanBreakup.create({
                data: {
                  salaryPlanId: Number(feePlan.id),
                  campusId: Number(formData.campusId),
                  type: element.type,
                  breakupname: String(element.breakupname),
                  amount: Number(element.amount),
                },
              });

            }
          }

          return res.json({ data: null, status: true, message: 'Salary Plan added' });
        }
      }

    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message, status: true, data: null })
    }
  }

  public async changeSalaryPlanStatus(req: Request, res: Response) {
    const feeForm: any = req.body;

    try {
      if (feeForm !== null && feeForm !== undefined) {

        await prisma.salaryPlan.findUnique({
          where: {
            id: feeForm.id,
            campusId: feeForm.campusId,
          },
        }).then(async (existingData) => {

          if (existingData !== null && existingData !== undefined) {
            let isActive: number = existingData.active;

            await prisma.salaryPlan.update({
              where: {
                id: feeForm.id,
                campusId: feeForm.campusId,
              },
              data: {
                active: isActive === 1 ? 0 : 1,
                created_by: Number(feeForm.currentUserid),
                created_at: new Date()
              },
            });

            return res.json({ data: null, status: true, message: 'Salary Plan updated' });
          }

        });

      }

    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message, status: true, data: null })
    }
  }


  public async getEmployeesForSalaryGeneration(req: Request, res: Response) {
    const formData: any = req.body;

    try {

      const employees = await prisma.user.findMany({
        where: {
          campusId: Number(formData.campusId),
          active: 1,
          userType: { in: [UserType.accountant, UserType.staff, UserType.admin] }
        },
        include: {
          campus: true,
          BankInformation: true,
          EmployeeSalary: {
            where: {
              campusId: Number(formData.campusId),
              active: 1,
            },
            include: {
              salaryPlan: true,
            }
          },
          EmployeeLoan: true,
          PaySlip: {
            where: {
              campusId: Number(formData.campusId),
              month: Number(formData.month),
              year: Number(formData.year),
            }
          },
        },
      });

      return res.json({ status: true, data: employees, message: 'Employees retrieved' });

    } catch (error) {
      console.error(error);

      return res.json({ status: false, data: null, message: 'Failed to retrieve employees' });
    }
  }


  public async updateEmployeeSalaryPlan(req: Request, res: Response) {

    const formData: any = req.body;

    try {
      if (formData.employeeId !== null && formData.employeeId !== undefined && formData.salaryPlanId !== null && formData.salaryPlanId !== undefined) {

        const existingEmployyeeWithSalaryPlan = await prisma.user.findUnique({
          where: {
            id: Number(formData.employeeId),
            campusId: Number(formData.campusId)
          },
          include: {
            EmployeeSalary: {
              where: {
                active: 1
              }
            }
          }
        })

        if (existingEmployyeeWithSalaryPlan !== null && existingEmployyeeWithSalaryPlan !== undefined) {
          if (existingEmployyeeWithSalaryPlan.EmployeeSalary !== null
            && existingEmployyeeWithSalaryPlan.EmployeeSalary !== undefined && existingEmployyeeWithSalaryPlan.EmployeeSalary.length === 1) {

            await prisma.employeeSalary.update({
              where: {
                id: existingEmployyeeWithSalaryPlan.EmployeeSalary[0].id,
                campusId: Number(formData.campusId)
              },
              data: {
                salaryPlanId: Number(formData.salaryPlanId),
                updated_by: Number(formData.currentUserId),
                updated_at: new Date(),
              },
            });

          } else if (existingEmployyeeWithSalaryPlan.EmployeeSalary !== null
            && existingEmployyeeWithSalaryPlan.EmployeeSalary !== undefined
            && existingEmployyeeWithSalaryPlan.EmployeeSalary.length === 0) {

            await prisma.employeeSalary.create({
              data: {
                userId: Number(formData.employeeId),
                campusId: Number(formData.campusId),
                salaryPlanId: Number(formData.salaryPlanId),
                active: 1,
                updated_by: Number(formData.currentUserId),
                updated_at: new Date(),
                created_by: Number(formData.currentUserId),
                created_at: new Date()
              },
            });
          }
        }

      }

      return res.json({ status: true, data: null, message: 'Salary Package updated' });

    } catch (error) {
      console.error(error);

      return res.json({ status: false, data: null, message: 'Some error occured. Try later.' });
    }
  }


  public async deletePayslip(req: Request, res: Response) {
    const id = Number(req.params.id);
    const campusId = Number(req.params.campusId);
    const userId = Number(req.params.userId);
    console.log('In Payslip by ID : ' + id);

    const payslip = await prisma.paySlip.findUnique({
      where: {
        id: id,
        campusId: campusId
      },
    })

    if (!payslip) {
      return res.json({ status: false, data: payslip, message: 'Unable to find payslip' });
    }


    try {
      await prisma.paySlip.delete({
        where: {
          id: id,
          campusId: campusId
        },
      });

      await prisma.allBonusInfo.deleteMany({
        where: {
          paySlipId: id,
          campusId: campusId
        },
      });

      return res.json({ status: true, data: null, message: 'Payslip deleted with bonus record (if any)' });


    } catch (error) {
      console.error(error);
      return res.json({ status: false, data: null, message: error.message });
    }


  }



  public async generateSalaryPayslipForEmployees(req: Request, res: Response) {

    const formData: any = req.body;
    let employeesWithoutSalaryPlanSelected = [];
    let paySlipIdsGenerated = [];
    let singleInvoiceGenerate: boolean = false;
    //find the financial Year

    let financialYearId = await getFinancialYearIdByDate(Number(formData.year), Number(formData.month) + 1);

    let latestPaySlipObj = await prisma.paySlip.findFirst({
      orderBy: {
        id: 'desc',
      },
      take: 1,
    });
    let latestPaySlipID = latestPaySlipObj !== null && latestPaySlipObj !== undefined ? latestPaySlipObj.id : 0;

    try {
      if (formData.employees !== null && formData.employees !== undefined && formData.employees.length > 0) {

        for (let i = 0; i < formData.employees.length; i++) {
          let employeeEach: any = formData.employees[i];


          if (employeeEach !== null && employeeEach !== undefined) {

            if (employeeEach.EmployeeSalary === null || employeeEach.EmployeeSalary === undefined
              || (employeeEach.EmployeeSalary !== null && employeeEach.EmployeeSalary !== undefined && employeeEach.EmployeeSalary.length === 0)) {
              employeesWithoutSalaryPlanSelected.push(employeeEach.displayName);

            } else if (employeeEach.EmployeeSalary !== null && employeeEach.EmployeeSalary !== undefined && employeeEach.EmployeeSalary.length > 0) {
              let activeStudentFeeObj = employeeEach.EmployeeSalary.filter(studentFee => studentFee.active === 1);

              if (activeStudentFeeObj !== null && activeStudentFeeObj !== undefined && activeStudentFeeObj.length === 0) {
                employeesWithoutSalaryPlanSelected.push(employeeEach.displayName);
              } else {

                let bonus = getBonusByEmployeeId(employeeEach.id, formData.bonusValues);
                console.log('bonus: ', bonus)

                let salaryPlanActive: SalaryPlan = activeStudentFeeObj[0].salaryPlan;
                paySlipIdsGenerated.push(employeeEach.displayName);
                latestPaySlipID = latestPaySlipID + 1;

                const paySlipNumber = generatePaySlipNumber(latestPaySlipID);

                //Active Student fee present 
                //Use this to generate the rest

                let taxPaidTillDate = await getTdsDeductedTillNow(employeeEach.id, financialYearId);

                let totalBonusTillDate = await getTotalBonusPaidForEmployee(employeeEach.id, financialYearId);


                //get all deducatbles
                let emis = 0;
                if (employeeEach.EmployeeLoan !== null && employeeEach.EmployeeLoan !== undefined && employeeEach.EmployeeLoan.length > 0) {
                  if (employeeEach.EmployeeLoan[0].remainingSum > 0) {
                    emis = employeeEach.EmployeeLoan[0].remainingSum >= employeeEach.EmployeeLoan[0].monthlyAmt ? employeeEach.EmployeeLoan[0].monthlyAmt : employeeEach.EmployeeLoan[0].remainingSum;
                  }
                }
                console.log('emis :', emis);;
                console.log('taxPaidTillDate :', taxPaidTillDate);

                const payslipAmt = await calculateMonthlyTDS_NewRegime({
                  currentMonth: Number(formData.month) + 1,
                  monthlyInhand: salaryPlanActive.monthlyInhand,
                  bonusThisMonth: bonus,
                  expectedTotalBonus: totalBonusTillDate + bonus,
                  professionalTaxMonthly: salaryPlanActive.professionalTaxMonthly,
                  employeePFMonthly: salaryPlanActive.employeePFMonthly,
                  tdsPaidTillNow: taxPaidTillDate,
                  financialYear: financialYearId,
                });

                console.log(payslipAmt);

                const paySlipCreated = await prisma.paySlip.create({
                  data: {
                    userId: employeeEach.id,
                    invoiceNumber: paySlipNumber,
                    campusId: Number(formData.campusId),
                    slipStatus: FeeStatus.Unpaid,
                    slipType: FeeType.MONTHLY,
                    year: Number(formData.year),
                    month: Number(formData.month),
                    amount: Number(payslipAmt.netPay),
                    amountBeforeDeductables: Number(payslipAmt.amountBeforeDeductables),
                    professionalTaxMonthly: Number(salaryPlanActive.professionalTaxMonthly),
                    gratuityMonthly: Number(salaryPlanActive.gratuityMonthly),
                    employeePFMonthly: Number(salaryPlanActive.employeePFMonthly),
                    employerPFMonthly: Number(salaryPlanActive.employerPFMonthly),
                    emis: Number(emis),
                    tax: payslipAmt.tdsThisMonth,
                    bonus: Number(bonus),
                    updated_by: formData.curretUserId,
                    updated_at: new Date(),
                    created_by: formData.curretUserId,
                    created_at: new Date(),
                    financialYearId: financialYearId
                  },
                });

                //add to bonus if available
                if (bonus !== null && bonus !== undefined && Number(bonus) > 0) {
                  console.log('Saving bonus amount for future reconciliation: - ', bonus);

                  await prisma.allBonusInfo.create({
                    data: {
                      userId: employeeEach.id,
                      campusId: Number(formData.campusId),
                      financialYearId: Number(financialYearId),
                      paySlipId: paySlipCreated.id,
                      year: Number(formData.year),
                      month: Number(formData.month),
                      amount: Number(bonus),
                      created_by: formData.curretUserId,
                      created_at: new Date(),
                    },
                  });
                }
                singleInvoiceGenerate = true;

              }
            }
          }
        }
      } else {
        return res.json({ status: false, data: null, message: 'No employee selected.' });
      }

      const errorJoined = employeesWithoutSalaryPlanSelected.join(', ');
      const successJoined = paySlipIdsGenerated.join(', ');
      return res.json({
        status: employeesWithoutSalaryPlanSelected.length > 0 ? false : true, data: null,
        message: employeesWithoutSalaryPlanSelected.length > 0
          ? 'Salary plan not found for ' + errorJoined :
          'Pay Slip generated for ' + successJoined
      });

    } catch (error) {
      console.error(error);

      return res.json({ status: false, data: null, message: 'Some error occured. Try later.' });
    }
  }


  public async paySalaryToEmployees(req: Request, res: Response) {

    const formData: any = req.body;
    console.log(formData)
    let countOfInvoicesPaid = 0;
    let oneInvoicePaid = false;
    let employeesWithoutBankInfo = [];
    let employeesWithBankInfo = [];

    if (formData !== null && formData !== undefined && formData.employees !== null && formData.employees !== undefined && formData.employees.length > 0) {
      for (let i = 0; i < formData.employees.length; i++) {
        let employee = formData.employees[i];

        if (employee !== null && employee !== undefined && employee.id !== null && employee.id !== undefined
          && employee !== null && employee !== undefined && employee.BankInformation !== null && employee.BankInformation !== undefined && employee.BankInformation.length === 1) {
          employeesWithBankInfo.push(employee);
        } else {
          employeesWithoutBankInfo.push(employee);
        }
      }
    } else {
      return res.json({ status: false, data: null, message: 'No employee selected.' });
    }


    if (employeesWithoutBankInfo !== null && employeesWithoutBankInfo !== undefined && employeesWithoutBankInfo.length > 0) {
      return res.json({ status: false, data: null, message: 'Bank account not linked. Payment cancelled' });
    } else if (employeesWithBankInfo !== null && employeesWithBankInfo !== undefined && employeesWithBankInfo.length > 0) {

      console.log(employeesWithBankInfo);

      for (let k = 0; k < employeesWithBankInfo.length; k++) {
        let employee = employeesWithBankInfo[k];

        if (employee !== null && employee !== undefined && employee.id !== null && employee.id !== undefined
          && employee.PaySlip !== null && employee.PaySlip !== undefined && employee.PaySlip.length > 0) {
          console.log('Payslips found for employee')

          for (let j = 0; j < employee.PaySlip.length; j++) {
            let payslip: PaySlip = employee.PaySlip[j];

            if (payslip !== null && payslip !== undefined && payslip.slipStatus === 'Unpaid') {
              const result = await sendPaymentViaRazorpayX({
                accountNumber: employee.BankInformation[0].accountNo,
                ifscCode: employee.BankInformation[0].ifscCode,
                amount: payslip.amount,
                employeeName: employee.BankInformation[0].fullName,
                referenceId: `PAY-${employee.id}-${Date.now()}`,
                message: `Salary Payment for ${employee.BankInformation[0].fullName} for ${payslip.month}, ${payslip.year}`
              });

              if (result.success) {
                console.log('✅ Payment sent:', result.payoutId, result.status);
                oneInvoicePaid = true;
                countOfInvoicesPaid = countOfInvoicesPaid + 1;

                await prisma.paySlip.update({
                  where: {
                    id: payslip.id,
                    campusId: payslip.campusId,
                  },
                  data: {
                    slipStatus: FeeStatus.Paid,
                    updated_by: Number(formData.curretUserId),
                    updated_at: new Date()
                  },
                });
                await prisma.salaryPaymentRecord.create({
                  data: {
                    invoiceNumber: payslip.invoiceNumber,
                    paySlipId:payslip.id,
                    campusId: payslip.campusId,
                    paymentType: PaymentType.Online,
                    paidAmount:payslip.amount,
                    paidOn : new Date(),
                    vendor: "RazorPay",
                    referenceNo:result.payoutId,
                    created_by: Number(formData.curretUserId),
                    created_at: new Date(),
                    updated_by: Number(formData.curretUserId),
                    updated_at: new Date()
                  },
                });

                
              } else {
                console.log('❌ Payment failed:', 'result.message');
              }
            }

          }

        }
      }


      if (oneInvoicePaid) {
        return res.json({ status: false, data: null, message: countOfInvoicesPaid + ' invoice(s) Paid' });
      } else {
        return res.json({ status: false, data: null, message: 'No invoices paid.' });
      }

    }

  }


  public async payUnpaidSalariesInBulk(req: Request, res: Response) {

    const formData: any = req.body;
    let countOfInvoicesPaid = 0;
    let oneInvoicePaid = false;
    let employeesWithoutBankInfo = [];
    let employeesWithBankInfo = [];

    if (formData !== null && formData !== undefined && (formData.payslips === null && formData.payslips === undefined)
       || (formData.payslips !== null && formData.payslips !== undefined && formData.payslips.length === 0)) {
      return res.json({ status: false, data: null, message: 'No payslips selected.' });
    }


    if (formData !== null && formData !== undefined && (formData.employee === null && formData.employee === undefined)) {
      return res.json({ status: false, data: null, message: 'No employee selected.' });
    }

    if (formData.employee  !== null && formData.employee  !== undefined && 
          formData.employee.BankInformation !== null && formData.employee.BankInformation !== undefined && formData.employee.BankInformation.length === 1) {
          employeesWithBankInfo.push(formData.employee);
        } else {
          employeesWithoutBankInfo.push(formData.employee);
   }


    if (employeesWithoutBankInfo !== null && employeesWithoutBankInfo !== undefined && employeesWithoutBankInfo.length > 0) {
      return res.json({ status: false, data: null, message: 'Bank account not linked. Payment cancelled' });
    } else if (employeesWithBankInfo !== null && employeesWithBankInfo !== undefined && employeesWithBankInfo.length ===1) {

      let currentSelectedEmployee = employeesWithBankInfo[0];

      for (let k = 0; k < formData.payslips.length; k++) {
        let payslipSelected = formData.payslips[k];

        if (payslipSelected !== null && payslipSelected !== undefined && payslipSelected.id !== null && payslipSelected.id !== undefined) {
          
          if (payslipSelected.slipStatus === 'Unpaid') {
              const result = await sendPaymentViaRazorpayX({
                accountNumber: currentSelectedEmployee.BankInformation[0].accountNo,
                ifscCode: currentSelectedEmployee.BankInformation[0].ifscCode,
                amount: payslipSelected.amount,
                employeeName: currentSelectedEmployee.BankInformation[0].fullName,
                referenceId: `PAY-${currentSelectedEmployee.id}-${Date.now()}`,
                message: `Salary Payment for ${currentSelectedEmployee.BankInformation[0].fullName} for ${payslipSelected.month}, ${payslipSelected.year}`
              });

              if (result.success) {
                console.log('✅ Payment sent:', result.payoutId, result.status);
                oneInvoicePaid = true;
                countOfInvoicesPaid = countOfInvoicesPaid + 1;

                await prisma.paySlip.update({
                  where: {
                    id: payslipSelected.id,
                    campusId: payslipSelected.campusId,
                  },
                  data: {
                    slipStatus: FeeStatus.Paid,
                    updated_by: Number(formData.curretUserId),
                    updated_at: new Date()
                  },
                });
                await prisma.salaryPaymentRecord.create({
                  data: {
                    invoiceNumber: payslipSelected.invoiceNumber,
                    paySlipId:payslipSelected.id,
                    campusId: payslipSelected.campusId,
                    paymentType: PaymentType.Online,
                    paidAmount:payslipSelected.amount,
                    paidOn : new Date(),
                    vendor: "RazorPay",
                    referenceNo:result.payoutId,
                    created_by: Number(formData.curretUserId),
                    created_at: new Date(),
                    updated_by: Number(formData.curretUserId),
                    updated_at: new Date()
                  },
                });

                
              } else {
                console.log('❌ Payment failed:', 'result.message');
              }
            }

        }
      }


      if (oneInvoicePaid) {
        return res.json({ status: true, data: null, message: countOfInvoicesPaid + ' invoice(s) Paid' });
      } else {
        return res.json({ status: false, data: null, message: 'No invoices paid.' });
      }

    }

  }
}


