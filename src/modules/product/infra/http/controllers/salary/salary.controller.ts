import { Request, Response } from "express";
import { FeeStatus, FeeType, Gender, ParentType, PaymentType, Prisma, SalaryPlanBreakup, TransactionSource, TransactionType, UserType } from '@prisma/client';
import generator from 'generate-password-ts';
import { encrypt, generateIdsForParentAndStudent, generateInvoiceNumber, generatePaySlipNumber, getARandomAlphanumericID, getCurrencySymbol } from "../../../../../../shared/helpers/utils/generic.utils";
import { prisma } from "../../../../../../shared/db-client";
import moment from "moment";
import { sendAccountCreationEmail } from "../../../../../../shared/helpers/notifications/notifications";
import { v4 as uuidv4 } from 'uuid';



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
                ? institute.currency : 'INR') + salaryPlans[i].monthlySalary + ' )'
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
        class: true
      },
    });

    return res.json({ status: true, data: employees, message: '' });
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
        amount: 8000.00,
        type: "MONTHLY"
      },
      {
        id: uuidv4(),
        salaryPlanId: 0,
        isYearly: 0,
        campusId: campusId,
        breakupname: 'Additional',
        amount: 4000.00, 
        type: "YEARLY"
      },
      {
        id: uuidv4(),
        salaryPlanId: 0,
        isYearly: 1,
        campusId: campusId,
        breakupname: 'Yearly Travel Allowance',
        amount: 1000.00,
        type: "MONTHLY"
      },
      {
        id: uuidv4(),
        salaryPlanId: 0,
        isYearly: 1,
        campusId: campusId,
        breakupname: 'Yearly Bonus',
        amount: 1000.00,
        type: "YEARLY"
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


  public async addUpdateSalaryPlan(req: Request, res: Response) {
    const formData: any = req.body;

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
          let deductableMnthlyAmount = 0;

          //Update fee id
          if (formData.feeBreakUp !== null && formData.feeBreakUp !== undefined && formData.feeBreakUp.length > 0) {

            for (let i = 0; i < formData.feeBreakUp.length; i++) {
              let element: SalaryPlanBreakup = formData.feeBreakUp[i];

              if (element.type === 'YEARLY') {
                yearlyAmount = Number(yearlyAmount) + Number(element.amount);
              } else if (element.type === 'DEDUCTABLE') {
                deductableMnthlyAmount = Number(deductableMnthlyAmount) + Number(element.amount);
              } else if (element.type === 'MONTHLY') {
                monthlyAmount = Number(monthlyAmount) + Number(element.amount);
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

          let salaryPlan = await prisma.salaryPlan.update({
            where: {
              campusId: Number(formData.campusId),
              id: Number(formData.feeId),
            },
            data: {
              name: formData.feeName,
              monthlySalary: Number(monthlyAmount),
              yearlySalary: Number(yearlyAmount),
              monthlydeductables: Number(deductableMnthlyAmount),
              updated_by: formData.created_by,
              updated_at: new Date()
            },
          });

          return res.json({ data: null, status: true, message: 'Salary Plan updated' });
        } else {
          let monthlyAmount = 0;
          let yearlyAmount = 0;
          let deductableMnthlyAmount = 0;

          if (formData.feeBreakUp !== null && formData.feeBreakUp !== undefined && formData.feeBreakUp.length > 0) {
            for (let i = 0; i < formData.feeBreakUp.length; i++) {
              let element = formData.feeBreakUp[i];
              if (element.type === 'YEARLY') {
                yearlyAmount = Number(yearlyAmount) + Number(element.amount);
              } else if (element.type === 'DEDUCTABLE') {
                deductableMnthlyAmount = Number(deductableMnthlyAmount) + Number(element.amount);
              } else if (element.type === 'MONTHLY') {
                monthlyAmount = Number(monthlyAmount) + Number(element.amount);
              }
            }
          }

          let feePlan = await prisma.salaryPlan.create({
            data: {
              active: 1,
              campusId: Number(formData.campusId),
              name: formData.feeName,
              monthlySalary: Number(monthlyAmount),
              yearlySalary: Number(yearlyAmount),
              monthlydeductables: Number(deductableMnthlyAmount),
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
          EmployeeSalary: {
            where: {
              campusId: Number(formData.campusId),
              active: 1,
            },
            include: {
              salaryPlan: true,
            }
          },
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


  public async generateSalaryPayslipForEmployees(req: Request, res: Response) {

    const formData: any = req.body;
    let employeesWithoutSalaryPlanSelected = [];
    let paySlipIdsGenerated = [];
    let singleInvoiceGenerate: boolean = false;

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
          let employeeEach: any = formData.employees[i].original;

          if (employeeEach !== null && employeeEach !== undefined) {

            if (employeeEach.EmployeeSalary === null || employeeEach.EmployeeSalary === undefined
              || (employeeEach.EmployeeSalary !== null && employeeEach.EmployeeSalary !== undefined && employeeEach.EmployeeSalary.length === 0)) {
              employeesWithoutSalaryPlanSelected.push(employeeEach.displayName);

            } else if (employeeEach.EmployeeSalary !== null && employeeEach.EmployeeSalary !== undefined && employeeEach.EmployeeSalary.length > 0) {
              let activeStudentFeeObj = employeeEach.EmployeeSalary.filter(studentFee => studentFee.active === 1);

              if (activeStudentFeeObj !== null && activeStudentFeeObj !== undefined && activeStudentFeeObj.length === 0) {
                employeesWithoutSalaryPlanSelected.push(employeeEach.displayName);
              } else {
                let salaryPlanActive = activeStudentFeeObj[0].salaryPlan;
                paySlipIdsGenerated.push(employeeEach.displayName);
                latestPaySlipID = latestPaySlipID + 1;
                const paySlipNumber = generatePaySlipNumber(latestPaySlipID);

                //Active Student fee present 
                //Use this to generate the rest
                if (formData.salaryType === 'MONTHLY') {
                  let amt = Number(salaryPlanActive.monthlySalary) - Number(salaryPlanActive.monthlydeductables);
                 
                  await prisma.paySlip.create({
                    data: {
                      userId: employeeEach.id,
                      invoiceNumber: paySlipNumber,
                      campusId: Number(formData.campusId),
                      slipStatus: FeeStatus.Unpaid,
                      slipType: FeeType.MONTHLY,
                      year: Number(formData.year),
                      month: Number(formData.month),
                      amount:  Number(amt),
                      updated_by: formData.curretUserId,
                      updated_at: new Date(),
                      created_by: formData.curretUserId,
                      created_at: new Date()
                    },
                  });
                  singleInvoiceGenerate = true;


                } else if (formData.salaryType === 'YEARLY') {

                  await prisma.paySlip.create({
                    data: {
                      userId: employeeEach.id,
                      invoiceNumber: paySlipNumber,
                      campusId: Number(formData.campusId),
                      slipStatus: FeeStatus.Unpaid,
                      slipType: FeeType.YEARLY,
                      year: Number(formData.year),
                      month: Number(formData.month),
                      amount:  Number(salaryPlanActive.yearlySalary),
                      updated_by: formData.curretUserId,
                      updated_at: new Date(),
                      created_by: formData.curretUserId,
                      created_at: new Date()
                    },
                  });
                  singleInvoiceGenerate = true;

                } else if (formData.salaryType === 'ADHOC') {
                  await prisma.paySlip.create({
                    data: {
                      userId: employeeEach.id,
                      invoiceNumber: paySlipNumber,
                      campusId: Number(formData.campusId),
                      slipStatus: FeeStatus.Unpaid,
                      slipType: FeeType.ADHOC,
                      year: Number(formData.year),
                      month: Number(formData.month),
                      amount:  Number(formData.adhocAmount),
                      updated_by: formData.curretUserId,
                      updated_at: new Date(),
                      created_by: formData.curretUserId,
                      created_at: new Date()
                    },
                  });
                  singleInvoiceGenerate = true;

                }
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
}

