import { prisma } from "../../../../../../shared/db-client";
import { Request, Response } from "express";
import { FeeStatus, FeeType, ParentType, PaymentType, Prisma, SellProductDetails, StudentFees, SubjectType, TransactionSource, TransactionType, User, UserType } from "@prisma/client";
import moment from "moment";
import { addANotification, generateInvoiceNumber, generateProductIdNumber, generateSellingInvoiceNumber, getARandomAlphanumericID } from "../../../../../../shared/helpers/utils/generic.utils";
import { buildMessage, EXPENSE_ADDED, EXPENSE_TYPE_ADDED, EXPENSE_TYPE_UPDATED, EXPENSE_UPDATED, FAMILY_CREDIT_UPDATED, FEE_PLAN_UPDATED, INVOICE_CANCELLED, INVOICE_PAID, POINT_OF_SALE, PRODUCT_CATEGORY_ADDED, PRODUCT_CATEGORY_UPDATED } from "../../../../../../shared/constants/notification.constants";



export class AccountingController {


  public async getAllInvoicesForStudent(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const userId = Number(req.params.userId);

    const student = await prisma.user.findUnique({
      where: {
        id: Number(userId),
        campusId: Number(campusId)
      },
      include: {
        MYAALInvoices: {
          where: {
            feeType: FeeType.MONTHLY
          }
        },
        campus: true,
        class: true
      },
    });
    console.log(student)
    return res.json({ status: true, data: student, message: '' });
  }


  public async getPrimaryParentsDropdown(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const parents = await prisma.user.findMany({
      where: {
        campusId: Number(campusId),
        userType: UserType.parent,
        parentType: ParentType.Father
      },
      include: {
        children: {
          include: {
            children: {
              include: {
                class: true,
                section: true,
                campus: true,
                MYAALInvoices: true
              }
            }
          }
        }
      }
    });
    let parentModel = [];
    if (parents !== null && parents !== undefined && parents.length > 0) {
      for (let i = 0; i < parents.length; i++) {
        if (parents[i].children.length > 1) {
          parentModel.push({ value: parents[i].id + '', label: parents[i].displayName })
        }

      }
    }
    return res.json({ status: true, data: parentModel, message: '' });
  }


  public async cancelFeeInvoice(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const id = Number(req.params.id);
    const currentUserId = Number(req.params.currentUserId);

    const invoice = await prisma.mYAALInvoices.findUnique({
      where: {
        campusId: Number(campusId),
        id: Number(id)
      },
    });

    if (!invoice) {
      return res.json({ status: false, data: null, message: 'Invoice not found' });
    }
    let currentDues = Number(invoice.amount) - Number(invoice.paidAmount);

    const updateInvoice = await prisma.mYAALInvoices.update({
      where: {
        id: id,
        campusId: campusId
      },
      data: {
        feeStatus: FeeStatus.Cancelled,
        updated_by: Number(currentUserId),
        updated_at: new Date()
      },
    }).then(async (inv) => {
      const notifyingStaff = await prisma.user.findUnique({
        where: {
          active: 1,
          id: Number(currentUserId),
          campusId: Number(campusId)
        },
      }).then((res) => {
        addANotification(Number(campusId),
          Number(currentUserId),
          Number(currentUserId),
          buildMessage(INVOICE_CANCELLED, inv.invoiceNumber, res.displayName));
      });
    });

    return res.json({ status: true, data: null, message: 'Invoice cancelled' });
  }

  public async markAsQuickPaid(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const id = Number(req.params.id);
    const currentUserId = Number(req.params.currentUserId);
    const parentID = Number(req.params.parentID);



    const invoice = await prisma.mYAALInvoices.findUnique({
      where: {
        campusId: Number(campusId),
        id: Number(id)
      },
    });

    if (!invoice) {
      return res.json({ status: false, data: null, message: 'Invoice not found' });
    }


    //calculations
    let cashAmount = 0;
    let walletBalanceAfterDeduction = 0;
    let paidAmountExisting = Number(0.00);
    let currentDues = Number(invoice.amount) - Number(invoice.paidAmount);

    if (invoice.paidAmount === null || invoice.paidAmount === undefined) {
      paidAmountExisting = Number(0.00);
    } else {
      paidAmountExisting = invoice.paidAmount;
    }

    let totalPaid = Number(paidAmountExisting) + Number(currentDues);


    const paidDate = moment(new Date(), 'DD-MM-YYYY').toDate();

    const updateInvoice = await prisma.mYAALInvoices.update({
      where: {
        id: id,
        campusId: campusId
      },
      data: {
        feeStatus: FeeStatus.Paid,
        paidOn: paidDate,
        paidAmount: Number(totalPaid),
        paymentType: PaymentType.Cash,
        updated_by: Number(currentUserId),
        updated_at: new Date()
      },
    }).then(async (inv) => {
      const notifyingStaff = await prisma.user.findUnique({
        where: {
          active: 1,
          id: Number(currentUserId),
          campusId: Number(campusId)
        },
      }).then((res) => {
        addANotification(Number(campusId),
          Number(currentUserId),
          Number(currentUserId),
          buildMessage(INVOICE_PAID,
            inv.invoiceNumber,
            moment(paidDate).format('DD-MMM-YYYY HH:mm'),
            res.displayName,
            paidAmountExisting.toString()));
      });
    });

    const parent = await prisma.user.findUnique({
      where: {
        campusId: Number(campusId),
        id: Number(parentID)
      },
      include: {
        FamilyCredit: true
      }
    });

    console.log(parent.FamilyCredit);

    if (parent !== null && parent !== undefined && parent.FamilyCredit !== null
      && parent.FamilyCredit !== undefined && parent.FamilyCredit.length > 0 && parent.FamilyCredit[0].availableCredit > Number(0)) {

      let familyCreditAmt = parent.FamilyCredit[0].availableCredit

      if (Number(familyCreditAmt) >= Number(currentDues)) {
        cashAmount = 0;
        walletBalanceAfterDeduction = Number(familyCreditAmt) - Number(currentDues);

        await prisma.transactions.create({
          data: {
            invoiceNumber: invoice.invoiceNumber,
            campusId: invoice.campusId,
            transactionType: TransactionType.Debit,
            source: TransactionSource.StudentFeePaymentUsingFamilyCredit,
            userId: invoice.userId,
            amount: Number(currentDues),
            paymentType: PaymentType.Wallet,
            created_by: Number(currentUserId),
            created_at: new Date(),
            familyCreditId: parent.FamilyCredit[0].id
          },
        });

        await prisma.transactions.create({
          data: {
            invoiceNumber: invoice.invoiceNumber,
            campusId: invoice.campusId,
            transactionType: TransactionType.Credit,
            source: TransactionSource.StudentFeePayment,
            userId: invoice.userId,
            amount: Number(currentDues),
            paymentType: PaymentType.Wallet,
            created_by: Number(currentUserId),
            created_at: new Date(),
            familyCreditId: parent.FamilyCredit[0].id
          },
        });


      } else {
        cashAmount = Number(currentDues) - Number(familyCreditAmt);
        walletBalanceAfterDeduction = 0;

        await prisma.transactions.create({
          data: {
            invoiceNumber: invoice.invoiceNumber,
            campusId: invoice.campusId,
            transactionType: TransactionType.Debit,
            source: TransactionSource.StudentFeePaymentUsingFamilyCredit,
            userId: invoice.userId,
            amount: Number(familyCreditAmt),
            paymentType: PaymentType.Wallet,
            created_by: Number(currentUserId),
            created_at: new Date(),
            familyCreditId: parent.FamilyCredit[0].id
          },
        });

        await prisma.transactions.create({
          data: {
            invoiceNumber: invoice.invoiceNumber,
            campusId: invoice.campusId,
            transactionType: TransactionType.Credit,
            source: TransactionSource.StudentFeePayment,
            userId: invoice.userId,
            amount: Number(familyCreditAmt),
            paymentType: PaymentType.Wallet,
            created_by: Number(currentUserId),
            created_at: new Date(),
            familyCreditId: parent.FamilyCredit[0].id
          },
        });

        await prisma.transactions.create({
          data: {
            invoiceNumber: invoice.invoiceNumber,
            campusId: invoice.campusId,
            transactionType: TransactionType.Credit,
            source: TransactionSource.StudentFeePayment,
            userId: invoice.userId,
            amount: Number(cashAmount),
            paymentType: PaymentType.Cash,
            created_by: Number(currentUserId),
            created_at: new Date(),
            familyCreditId: parent.FamilyCredit[0].id
          },
        });
      }

      await prisma.familyCredit.update({
        where: {
          campusId: invoice.campusId,
          id: Number(parent.FamilyCredit[0].id)
        },
        data: {
          availableCredit: Number(walletBalanceAfterDeduction),
          updated_by: Number(currentUserId),
          updated_at: new Date()
        },
      });



      console.log('cashAmount > ' + cashAmount + ' --- walletBalanceAfterDeduction >' + walletBalanceAfterDeduction);


    } else {
      await prisma.transactions.create({
        data: {
          invoiceNumber: invoice.invoiceNumber,
          campusId: invoice.campusId,
          transactionType: TransactionType.Credit,
          source: TransactionSource.StudentFeePayment,
          userId: invoice.userId,
          amount: Number(currentDues),
          paymentType: PaymentType.Cash,
          created_by: Number(currentUserId),
          created_at: new Date()
        },
      });
    }
    return res.json({ status: true, data: null, message: 'Invoice paid' });
  }


  public async acceptPayment(req: Request, res: Response) {

    const formData: any = req.body;

    if (formData !== null && formData !== undefined && formData.form.invoiceId !== null && formData.form.invoiceId !== undefined) {
      const invoice = await prisma.mYAALInvoices.findUnique({
        where: {
          campusId: Number(formData.form.campusId),
          id: Number(formData.form.invoiceId)
        },
      });

      if (!invoice) {
        return res.json({ status: false, data: null, message: 'Invoice not found' });
      }
      //calculations
      let cashAmount = 0;
      let walletBalanceAfterDeduction = 0;
      let paidAmountExisting = 0;

      if (invoice.paidAmount === null || invoice.paidAmount === undefined) {
        paidAmountExisting = 0;
      } else {
        paidAmountExisting = Number(invoice.paidAmount);
      }


      let totalPaid = paidAmountExisting + Number(formData.form.payingAmount);
      let paidDate = moment(new Date(), 'DD-MM-YYYY').toDate();


      const updateInvoice = await prisma.mYAALInvoices.update({
        where: {
          campusId: Number(formData.form.campusId),
          id: Number(formData.form.invoiceId)
        },
        data: {
          feeStatus: invoice.amount === Number(totalPaid) ? FeeStatus.Paid : Number(totalPaid) < invoice.amount ? FeeStatus.Partial : FeeStatus.Paid,
          paidOn: paidDate,
          paymentType: PaymentType.Cash,
          paidAmount: Number(totalPaid),
          updated_by: Number(formData.form.currentUserId),
          updated_at: new Date()
        },
      }).then(async (res) => {

        await prisma.user.findUnique({
          where: {
            active: 1,
            id: Number(formData.form.currentUserId),
            campusId: Number(formData.form.campusId)
          },
        }).then((user) => {
          addANotification(Number(formData.form.campusId),
            Number(formData.form.currentUserId),
            Number(formData.form.currentUserId),
            buildMessage(INVOICE_PAID,
              res.invoiceNumber,
              moment(paidDate).format('DD-MMM-YYYY HH:mm'),
              user.displayName,
              paidAmountExisting.toString()));
        });
      });

      if (formData.form.familyCredit !== null && formData.form.familyCredit !== undefined && formData.form.familyCredit > 0) {

        if (Number(formData.form.familyCredit) >= Number(formData.form.payingAmount)) {
          cashAmount = 0;
          walletBalanceAfterDeduction = Number(formData.form.familyCredit) - Number(formData.form.payingAmount);

          await prisma.transactions.create({
            data: {
              invoiceNumber: invoice.invoiceNumber,
              campusId: invoice.campusId,
              transactionType: TransactionType.Debit,
              source: TransactionSource.StudentFeePaymentUsingFamilyCredit,
              userId: invoice.userId,
              amount: Number(formData.form.payingAmount),
              paymentType: PaymentType.Wallet,
              created_by: Number(formData.form.currentUserId),
              created_at: new Date(),
              familyCreditId: formData.form.familyCreditId
            },
          });

          await prisma.transactions.create({
            data: {
              invoiceNumber: invoice.invoiceNumber,
              campusId: invoice.campusId,
              transactionType: TransactionType.Credit,
              source: TransactionSource.StudentFeePayment,
              userId: invoice.userId,
              amount: Number(formData.form.payingAmount),
              paymentType: PaymentType.Wallet,
              created_by: Number(formData.form.currentUserId),
              created_at: new Date(),
              familyCreditId: formData.form.familyCreditId
            },
          });


        } else {
          cashAmount = Number(formData.form.payingAmount) - Number(formData.form.familyCredit);
          walletBalanceAfterDeduction = 0;

          await prisma.transactions.create({
            data: {
              invoiceNumber: invoice.invoiceNumber,
              campusId: invoice.campusId,
              transactionType: TransactionType.Debit,
              source: TransactionSource.StudentFeePaymentUsingFamilyCredit,
              userId: invoice.userId,
              amount: Number(formData.form.familyCredit),
              paymentType: PaymentType.Wallet,
              created_by: Number(formData.form.currentUserId),
              created_at: new Date(),
              familyCreditId: formData.form.familyCreditId
            },
          });

          await prisma.transactions.create({
            data: {
              invoiceNumber: invoice.invoiceNumber,
              campusId: invoice.campusId,
              transactionType: TransactionType.Credit,
              source: TransactionSource.StudentFeePayment,
              userId: invoice.userId,
              amount: Number(formData.form.familyCredit),
              paymentType: PaymentType.Wallet,
              created_by: Number(formData.form.currentUserId),
              created_at: new Date(),
              familyCreditId: formData.form.familyCreditId
            },
          });

          await prisma.transactions.create({
            data: {
              invoiceNumber: invoice.invoiceNumber,
              campusId: invoice.campusId,
              transactionType: TransactionType.Credit,
              source: TransactionSource.StudentFeePayment,
              userId: invoice.userId,
              amount: Number(cashAmount),
              paymentType: PaymentType.Cash,
              created_by: Number(formData.form.currentUserId),
              created_at: new Date(),
              familyCreditId: formData.form.familyCreditId
            },
          });
        }

        await prisma.familyCredit.update({
          where: {
            campusId: Number(formData.form.campusId),
            id: Number(formData.form.familyCreditId)
          },
          data: {
            availableCredit: Number(walletBalanceAfterDeduction),
            updated_by: Number(formData.form.currentUserId),
            updated_at: new Date()
          },
        });



        console.log('cashAmount > ' + cashAmount + ' --- walletBalanceAfterDeduction >' + walletBalanceAfterDeduction);


      } else {
        await prisma.transactions.create({
          data: {
            invoiceNumber: invoice.invoiceNumber,
            campusId: invoice.campusId,
            transactionType: TransactionType.Credit,
            source: TransactionSource.StudentFeePayment,
            userId: invoice.userId,
            amount: Number(formData.form.payingAmount),
            paymentType: PaymentType.Cash,
            created_by: Number(formData.form.currentUserId),
            created_at: new Date()
          },
        });
      }



      return res.json({ status: true, data: null, message: 'Payment recorded' });

    } else {
      return res.json({ status: false, data: null, message: 'Invoice not found' });
    }
  }

  public async getStudentFeePaymentStatusForInvoiceGenerate(req: Request, res: Response) {

    const formData: any = req.body;
    try {

      let lateFeeLov = await prisma.listOfValues.findUnique({
        where: {
          campusId: Number(formData.campusId),
          uniqueKey: 'InstituteCommonLateFee',
          active: 1
        },
      });


      const students = await prisma.user.findMany({
        where: {
          campusId: Number(formData.campusId),
          classId: Number(formData.classId),
          sectionId: Number(formData.sectionId),
          active: 1
        },
        include: {
          campus: true,
          class: true,
          section: true,
          StudentFees: {
            where: {
              campusId: Number(formData.campusId),
              active: 1,
            },
            include: {
              feePlan: true,
            }
          },
          MYAALInvoices: {
            where: {
              campusId: Number(formData.campusId),
            }
          },
        },
      });

      if (students !== null && students !== undefined && students.length > 0) {
        for (let i = 0; i < students.length; i++) {
          let yearlyDues = 0;
          let monthlyDues = 0;
          let adhocDues = 0;
          let lateDues = 0;

          let yearlyDuesAmt = 0;
          let monthlyDuesAmt = 0;
          let adhocDuesAmt = 0;
          let lateDuesAmt = 0;

          if (students[i].MYAALInvoices !== null && students[i].MYAALInvoices !== undefined && students[i].MYAALInvoices.length > 0) {
            for (let j = 0; j < students[i].MYAALInvoices.length; j++) {
              let invoice = students[i].MYAALInvoices[j];
              let dueAfterPayment = 0;

              if (invoice.feeStatus !== FeeStatus.Paid && invoice.feeStatus !== FeeStatus.Cancelled) {
                dueAfterPayment = Number(invoice.amount) - Number(invoice.paidAmount);
              }


              if (invoice !== null && invoice !== undefined && (invoice.feeStatus === FeeStatus.Unpaid || invoice.feeStatus === FeeStatus.Partial)) {
                if (invoice.feeType === FeeType.MONTHLY) {
                  monthlyDues = monthlyDues + 1;
                  monthlyDuesAmt = monthlyDuesAmt + dueAfterPayment;
                } else if (invoice.feeType === FeeType.YEARLY) {
                  yearlyDues = yearlyDues + 1;
                  yearlyDuesAmt = yearlyDuesAmt + dueAfterPayment;
                } else if (invoice.feeType === FeeType.ADHOC) {
                  adhocDues = adhocDues + 1;
                  adhocDuesAmt = adhocDuesAmt + dueAfterPayment;
                }
                //Change due amount here Here
                invoice.amount = Number(dueAfterPayment);

                //add any late fees
                if (new Date() > invoice.dueDate) {
                  lateDues = lateDues + 1;
                  lateDuesAmt = lateDuesAmt + Number(lateFeeLov.shortName);
                }
              }

            }
          }

          //add to student
          students[i]['yearlyDues'] = yearlyDues;
          students[i]['monthlyDues'] = monthlyDues;
          students[i]['adhocDues'] = adhocDues;
          students[i]['lateDues'] = lateDues;

          students[i]['yearlyDuesAmt'] = yearlyDuesAmt;
          students[i]['monthlyDuesAmt'] = monthlyDuesAmt;
          students[i]['adhocDuesAmt'] = adhocDuesAmt;
          students[i]['lateDuesAmt'] = lateDuesAmt;
        }
      }

      return res.json({ status: true, data: students, message: 'Fees/Dues retrieved' });

    } catch (error) {
      console.error(error);

      return res.json({ status: false, data: null, message: 'Failed to create Class' });
    }
  }


  public async getStudentFeePaymentStatus(req: Request, res: Response) {

    const formData: any = req.body;
    try {

      let lateFeeLov = await prisma.listOfValues.findUnique({
        where: {
          campusId: Number(formData.campusId),
          uniqueKey: 'InstituteCommonLateFee',
          active: 1
        },
      });


      const currentStudent = await prisma.user.findUnique({
        where: {
          id: Number(formData.studentId),
          campusId: Number(formData.campusId),
          classId: Number(formData.classId),
          sectionId: Number(formData.sectionId),
        },
        include: {
          campus: true,
          class: true,
          section: true,
          Transactions: true,
          StudentFees: {
            where: {
              campusId: Number(formData.campusId),
              active: 1,
            },
            include: {
              feePlan: true,
            }
          },
          FamilyCredit: {
            include: {
              transactions: true
            }
          },
          MYAALInvoices: {
            where: {
              campusId: Number(formData.campusId),
            },
            orderBy: [
              {
                year: 'desc',
              },
              {
                month: 'desc',
              }
            ],
          },
        },
      });

      if (currentStudent !== null && currentStudent !== undefined) {

        let totalDues = 0;
        let totalLateDues = 0;

        if (currentStudent.MYAALInvoices !== null && currentStudent.MYAALInvoices !== undefined && currentStudent.MYAALInvoices.length > 0) {

          for (let j = 0; j < currentStudent.MYAALInvoices.length; j++) {
            let invoice = currentStudent.MYAALInvoices[j];


            if (invoice !== null && invoice !== undefined) {
              if (invoice.feeType === FeeType.MONTHLY) {
                currentStudent.MYAALInvoices[j]['rollNoProcessed'] = currentStudent.rollNoProcessed;
                currentStudent.MYAALInvoices[j]['idCardNumber'] = currentStudent.idCardNumber;
                currentStudent.MYAALInvoices[j]['displayName'] = currentStudent.displayName;
                currentStudent.MYAALInvoices[j]['latefee'] = new Date() > invoice.dueDate && invoice.feeStatus !== FeeStatus.Paid && invoice.feeStatus !== FeeStatus.Cancelled ? Number(lateFeeLov.shortName) : 0;
              } else if (invoice.feeType === FeeType.YEARLY) {
                currentStudent.MYAALInvoices[j]['rollNoProcessed'] = currentStudent.rollNoProcessed;
                currentStudent.MYAALInvoices[j]['idCardNumber'] = currentStudent.idCardNumber;
                currentStudent.MYAALInvoices[j]['displayName'] = currentStudent.displayName;
                currentStudent.MYAALInvoices[j]['latefee'] = new Date() > invoice.dueDate && invoice.feeStatus !== FeeStatus.Paid && invoice.feeStatus !== FeeStatus.Cancelled ? Number(lateFeeLov.shortName) : 0;
              } else if (invoice.feeType === FeeType.ADHOC) {
                currentStudent.MYAALInvoices[j]['rollNoProcessed'] = currentStudent.rollNoProcessed;
                currentStudent.MYAALInvoices[j]['idCardNumber'] = currentStudent.idCardNumber;
                currentStudent.MYAALInvoices[j]['displayName'] = currentStudent.displayName;
                currentStudent.MYAALInvoices[j]['latefee'] = new Date() > invoice.dueDate && invoice.feeStatus !== FeeStatus.Paid && invoice.feeStatus !== FeeStatus.Cancelled ? Number(lateFeeLov.shortName) : 0;
              } else if (invoice.feeType === FeeType.LATE) {
                currentStudent.MYAALInvoices[j]['rollNoProcessed'] = currentStudent.rollNoProcessed;
                currentStudent.MYAALInvoices[j]['idCardNumber'] = currentStudent.idCardNumber;
                currentStudent.MYAALInvoices[j]['displayName'] = currentStudent.displayName;
                currentStudent.MYAALInvoices[j]['latefee'] = new Date() > invoice.dueDate && invoice.feeStatus !== FeeStatus.Paid && invoice.feeStatus !== FeeStatus.Cancelled ? Number(lateFeeLov.shortName) : 0;
              }
              let dueAfterPayment = 0;
              let totalAmountBeforePayments = invoice.amount;

              if (invoice.feeStatus !== FeeStatus.Paid && invoice.feeStatus !== FeeStatus.Cancelled) {
                dueAfterPayment = Number(invoice.amount) - Number(invoice.paidAmount);
              }
              totalDues = totalDues + dueAfterPayment;
              invoice.amount = Number(dueAfterPayment);
              invoice['totalAmountBeforePayments'] = totalAmountBeforePayments;

              if (new Date() > invoice.dueDate && invoice.feeStatus !== FeeStatus.Paid && invoice.feeStatus !== FeeStatus.Cancelled) {
                totalLateDues = totalLateDues + Number(lateFeeLov.shortName);
              }
            }
          }
          //add totals to student
          currentStudent['totalDues'] = totalDues + '';
          currentStudent['totalLateDues'] = totalLateDues + '';
        }


        return res.json({ status: true, data: currentStudent, message: 'Fee details retrieved' });

      } else {
        return res.json({ status: false, data: null, message: 'Student not found' });
      }


    } catch (error) {
      console.error(error);

      return res.json({ status: false, data: null, message: 'Student not found' });
    }
  }


  public async getStudentCreditStatus(req: Request, res: Response) {

    const formData: any = req.body;
    try {



      const currentStudent = await prisma.user.findUnique({
        where: {
          id: Number(formData.studentId),
          campusId: Number(formData.campusId),
          classId: Number(formData.classId),
          sectionId: Number(formData.sectionId),
        },
        include: {
          campus: true,
          class: true,
          section: true,
          parent: {
            include: {
              parent: {
                include: {
                  FamilyCredit: {
                    include: {
                      transactions: {
                        orderBy: {
                          id: 'desc',
                        },
                      }
                    }
                  }
                }
              }
            }
          }
        },
      });

      if (currentStudent !== null && currentStudent !== undefined
        && currentStudent.parent !== null && currentStudent.parent !== undefined && currentStudent.parent.length > 0) {
        let parent1 = currentStudent.parent[0].parent;
        if (parent1 !== null && parent1 !== undefined) {
          return res.json({ status: true, data: parent1, message: 'Parent info retrieved' });
        } else {
          return res.json({ status: false, data: null, message: 'Parent not found' });
        }


      } else {
        return res.json({ status: false, data: null, message: 'Student not found' });
      }


    } catch (error) {
      console.error(error);

      return res.json({ status: false, data: null, message: 'Student not found' });
    }
  }

  public async generateStudentFeesApiCall(req: Request, res: Response) {

    const formData: any = req.body;
    console.log(formData);
    let studentsWithoutFeesOrDues = [];
    let invoicesGenerated = [];
    let singleInvoiceGenerate: boolean = false;

    let latestInvoiceObj = await prisma.mYAALInvoices.findFirst({
      orderBy: {
        id: 'desc',
      },
      take: 1,
    });
    let latestInvoiceID = latestInvoiceObj !== null && latestInvoiceObj !== undefined ? latestInvoiceObj.id : 0;

    try {
      if (formData.students !== null && formData.students !== undefined && formData.students.length > 0) {
        for (let i = 0; i < formData.students.length; i++) {
          let studentEach: any = formData.students[i].original;

          if (studentEach !== null && studentEach !== undefined) {
            console.log(studentEach);

            if (studentEach.StudentFees === null || studentEach.StudentFees === undefined
              || (studentEach.StudentFees !== null && studentEach.StudentFees !== undefined && studentEach.StudentFees.length === 0)) {
              studentsWithoutFeesOrDues.push(studentEach.displayName);

            } else if (studentEach.StudentFees !== null && studentEach.StudentFees !== undefined && studentEach.StudentFees.length > 0) {
              let activeStudentFeeObj = studentEach.StudentFees.filter(studentFee => studentFee.active === 1);

              if (activeStudentFeeObj !== null && activeStudentFeeObj !== undefined && activeStudentFeeObj.length === 0) {
                studentsWithoutFeesOrDues.push(studentEach.displayName);
              } else {
                let feePlanActive = activeStudentFeeObj[0].feePlan;
                invoicesGenerated.push(studentEach.displayName);
                latestInvoiceID = latestInvoiceID + 1;
                const invoiceNumber = generateInvoiceNumber(latestInvoiceID);

                //Active Student fee present 
                //Use this to generate the rest
                if (formData.feeType === 'MONTHLY') {
                  let futureMonthDueDate = moment(new Date(), 'DD-MM-YYYY').add(1, 'M');;

                  await prisma.mYAALInvoices.create({
                    data: {
                      userId: studentEach.id,
                      invoiceNumber: invoiceNumber,
                      campusId: Number(formData.campusId),
                      feeStatus: FeeStatus.Unpaid,
                      feeType: FeeType.MONTHLY,
                      year: Number(formData.year),
                      month: Number(formData.month),
                      dueDate: futureMonthDueDate.toDate(),
                      amount: Number(feePlanActive.monthlyAmt),
                      updated_by: formData.curretUserId,
                      updated_at: new Date(),
                      created_by: formData.curretUserId,
                      created_at: new Date()
                    },
                  });
                  singleInvoiceGenerate = true;


                } else if (formData.feeType === 'YEARLY') {

                  let futureMonthDueDate = moment(new Date(), 'DD-MM-YYYY').add(1, 'M');;
                  await prisma.mYAALInvoices.create({
                    data: {
                      userId: studentEach.id,
                      invoiceNumber: invoiceNumber,
                      campusId: Number(formData.campusId),
                      feeStatus: FeeStatus.Unpaid,
                      feeType: FeeType.YEARLY,
                      year: Number(formData.year),
                      month: Number(formData.month),
                      dueDate: futureMonthDueDate.toDate(),
                      amount: Number(feePlanActive.yearlyAmt),
                      updated_by: formData.curretUserId,
                      updated_at: new Date(),
                      created_by: formData.curretUserId,
                      created_at: new Date()
                    },
                  });
                  singleInvoiceGenerate = true;

                } else if (formData.feeType === 'ADHOC') {
                  let futureMonthDueDate = moment(new Date(), 'DD-MM-YYYY').add(1, 'M');;

                  await prisma.mYAALInvoices.create({
                    data: {
                      userId: studentEach.id,
                      invoiceNumber: invoiceNumber,
                      campusId: Number(formData.campusId),
                      feeStatus: FeeStatus.Unpaid,
                      feeType: FeeType.ADHOC,
                      year: Number(formData.year),
                      month: Number(formData.month),
                      dueDate: futureMonthDueDate.toDate(),
                      amount: Number(formData.adhocAmount),
                      updated_by: formData.curretUserId,
                      updated_at: new Date(),
                      created_by: formData.curretUserId,
                      created_at: new Date()
                    },
                  });
                  singleInvoiceGenerate = true;

                } else if (formData.feeType === 'LATE') {
                  let futureMonthDueDate = moment(new Date(), 'DD-MM-YYYY').add(1, 'M');;

                  await prisma.mYAALInvoices.create({
                    data: {
                      userId: studentEach.id,
                      invoiceNumber: invoiceNumber,
                      campusId: Number(formData.campusId),
                      feeStatus: FeeStatus.Unpaid,
                      feeType: FeeType.LATE,
                      year: Number(formData.year),
                      month: Number(formData.month),
                      dueDate: futureMonthDueDate.toDate(),
                      amount: Number(formData.adhocAmount),
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
      }

      const errorJoined = studentsWithoutFeesOrDues.join(', ');
      const successJoined = invoicesGenerated.join(', ');
      return res.json({
        status: true, data: null, message: studentsWithoutFeesOrDues.length > 0 ? 'Request Submitted. Fee plan not found for ' + errorJoined :
          'Invoices generated for ' + successJoined
      });

    } catch (error) {
      console.error(error);

      return res.json({ status: false, data: null, message: 'Some error occured. Try later.' });
    }
  }


  public async updateStudentFeePlan(req: Request, res: Response) {

    const formData: any = req.body;
    console.log(formData);

    try {
      if (formData.studentId !== null && formData.studentId !== undefined && formData.feePlanId !== null && formData.feePlanId !== undefined) {
        const existingstudentWithFees = await prisma.user.findUnique({
          where: {
            id: Number(formData.studentId),
            campusId: Number(formData.campusId)
          },
          include: {
            StudentFees: {
              where: {
                active: 1
              }
            }
          }
        })
        if (existingstudentWithFees !== null && existingstudentWithFees !== undefined) {
          let feePlan;


          if (existingstudentWithFees.StudentFees !== null && existingstudentWithFees.StudentFees !== undefined && existingstudentWithFees.StudentFees.length === 1) {
            await prisma.studentFees.update({
              where: {
                id: existingstudentWithFees.StudentFees[0].id,
                campusId: Number(formData.campusId)
              },
              data: {
                feePlanId: Number(formData.feePlanId),
                updated_by: Number(formData.currentUserId),
                updated_at: new Date(),
              },
            });

          } else if (existingstudentWithFees.StudentFees !== null && existingstudentWithFees.StudentFees !== undefined && existingstudentWithFees.StudentFees.length === 0) {
            await prisma.studentFees.create({
              data: {
                userId: Number(formData.studentId),
                campusId: Number(formData.campusId),
                feePlanId: Number(formData.feePlanId),
                active: 1,
                updated_by: Number(formData.currentUserId),
                updated_at: new Date(),
                created_by: Number(formData.currentUserId),
                created_at: new Date()
              },
            });
          }

          await prisma.user.findUnique({
            where: {
              active: 1,
              id: Number(formData.currentUserId),
              campusId: Number(formData.campusId)
            },
          }).then(async (res) => {
            await prisma.user.findUnique({
              where: {
                active: 1,
                id: Number(formData.studentId),
                campusId: Number(formData.campusId)
              },
            }).then((student) => {

              addANotification(Number(formData.campusId),
                Number(formData.currentUserId),
                Number(formData.currentUserId),
                buildMessage(FEE_PLAN_UPDATED, student.displayName, res.displayName, moment(new Date()).format('DD-MMM-YYYY HH:mm')));
            });
          });

        }

      }

      return res.json({ status: true, data: null, message: 'Fee Plan updated' });

    } catch (error) {
      console.error(error);

      return res.json({ status: false, data: null, message: 'Some error occured. Try later.' });
    }
  }

  public async acceptFamilyCredit(req: Request, res: Response) {
    const formData: any = req.body;

    if (formData !== null && formData !== undefined && formData.form.parentId !== null && formData.form.parentId !== undefined) {

      if (formData.form.payingAmount !== null && formData.form.payingAmount !== undefined && formData.form.payingAmount > 0) {

        const parent = await prisma.user.findUnique({
          where: {
            campusId: Number(formData.form.campusId),
            id: Number(formData.form.parentId)
          },
          include: {
            FamilyCredit: {
              include: {
                transactions: true
              }
            }
          }
        });

        if (!parent) {
          return res.json({ status: false, data: null, message: 'Parent information not found' });
        }


        if (parent !== null && parent.FamilyCredit !== null && parent.FamilyCredit !== undefined && parent.FamilyCredit.length > 0) {

          let existingCredit = parent.FamilyCredit[0].availableCredit;
          let newCredit = Number(existingCredit) + Number(formData.form.payingAmount);

          await prisma.familyCredit.update({
            where: {
              id: parent.FamilyCredit[0].id,
              campusId: parent.FamilyCredit[0].campusId,
            },
            data: {
              availableCredit: Number(newCredit),
              updated_by: Number(formData.form.currentUserId),
              updated_at: new Date()
            },
          });

          await prisma.transactions.create({
            data: {
              campusId: formData.form.campusId,
              transactionType: TransactionType.Credit,
              source: TransactionSource.FamilyCreditAdded,
              userId: formData.form.parentId,
              amount: Number(formData.form.payingAmount),
              paymentType: PaymentType.Cash,
              familyCreditId: parent.FamilyCredit[0].id,
              created_by: Number(formData.form.currentUserId),
              created_at: new Date()
            },
          });

        } else {
          const familyCredit = await prisma.familyCredit.create({
            data: {
              userId: formData.form.parentId,
              campusId: formData.form.campusId,
              availableCredit: Number(formData.form.payingAmount),
              created_by: Number(formData.form.currentUserId),
              created_at: new Date(),
              updated_by: Number(formData.form.currentUserId),
              updated_at: new Date()
            },
          });
          await prisma.transactions.create({
            data: {
              campusId: formData.form.campusId,
              transactionType: TransactionType.Credit,
              source: TransactionSource.FamilyCreditAdded,
              userId: formData.form.parentId,
              amount: Number(formData.form.payingAmount),
              paymentType: PaymentType.Cash,
              familyCreditId: familyCredit.id,
              created_by: Number(formData.form.currentUserId),
              created_at: new Date()
            },
          });


        }

        await prisma.user.findUnique({
          where: {
            active: 1,
            id: Number(formData.form.currentUserId),
            campusId: Number(formData.form.campusId)
          },
        }).then(async (res) => {
          addANotification(Number(formData.form.campusId),
            Number(formData.form.currentUserId),
            Number(formData.form.currentUserId),
            buildMessage(FAMILY_CREDIT_UPDATED, parent.displayName, moment(new Date()).format('DD-MMM-YYYY HH:mm')));

          addANotification(Number(formData.form.campusId),
            Number(parent.id),
            Number(formData.form.currentUserId),
            buildMessage(FAMILY_CREDIT_UPDATED, parent.displayName, moment(new Date()).format('DD-MMM-YYYY HH:mm')));
        });


        return res.json({ status: true, data: null, message: 'Family Credit received' });



      } else {
        return res.json({ status: false, data: null, message: 'Invalid credit amount' });
      }

    } else {
      return res.json({ status: false, data: null, message: 'Parent information not found' });
    }
  }

  public async getFamilyFeesDuesByParentId(req: Request, res: Response) {

    const formData: any = req.body;
    console.log(formData)
    let availableStudents = [];
    let parentObjToPass = {};
    let totalDues = 0;
    try {

      let parents = await prisma.user.findUnique({
        where: {
          campusId: Number(formData.campusId),
          id: Number(formData.parentId),
          active: 1
        },
        include: {
          children: {
            include: {
              children: {
                include: {
                  class: true,
                  section: true,
                  campus: true,
                  MYAALInvoices: true
                }
              }
            }
          }
        }
      });

      if (parents !== null && parents !== undefined && parents.children !== null && parents.children !== undefined && parents.children.length > 0) {

        for (let i = 0; i < parents.children.length; i++) {
          let child = parents.children[i].children;
          if (child !== null && child !== undefined) {
            let invoices = child.MYAALInvoices;
            let invoicesToPass = [];
            let totalUnPaidAmount = 0;
            let childObjToPass = {};
            if (invoices !== null && invoices !== undefined && invoices.length > 0) {

              for (let j = 0; j < invoices.length; j++) {
                if (invoices[j] !== null && invoices[j] !== undefined && (invoices[j].feeStatus === FeeStatus.Partial || invoices[j].feeStatus === FeeStatus.Unpaid)) {
                  let unpaidAmt = (Number(invoices[j].amount) - Number(invoices[j].paidAmount));
                  console.log('Unpaid Invoice -->' + invoices[j].invoiceNumber + ' For amount ' + unpaidAmt);
                  totalUnPaidAmount = totalUnPaidAmount + unpaidAmt;
                  invoicesToPass.push(invoices[j]);
                }
              }
            }
            childObjToPass['totalDues'] = totalUnPaidAmount;
            childObjToPass['name'] = child.displayName;
            childObjToPass['id'] = child.id;
            childObjToPass['class'] = child.class.className;
            childObjToPass['section'] = child.section.sectionName;
            totalDues = totalDues + totalUnPaidAmount;
            availableStudents.push(childObjToPass);
          }

        }
        parentObjToPass['parentName'] = parents.displayName;
        parentObjToPass['parentId'] = parents.id;
        parentObjToPass['child'] = availableStudents;
        parentObjToPass['totalParentDues'] = totalDues;
      }
      console.log(parentObjToPass)
      return res.json({ status: true, data: parentObjToPass, message: 'Total Family Fee Calculated' });

    } catch (error) {
      console.error(error);

      return res.json({ status: false, data: null, message: 'Some error occured. Try again later' });
    }
  }


  //Stock & Inventory

  public async getActiveCategories(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const categories = await prisma.stockCategory.findMany({
      include: {
        campus: true,
        StockProduct: true
      },
      where: {
        campusId: Number(campusId)
      }
    });
    return res.json({ status: true, data: categories, message: 'Categories retrieved' });
  }

  public async addACategory(req: Request, res: Response) {
    const categoryForm: any = req.body;
    try {
      if (categoryForm !== null && categoryForm !== undefined) {
        await prisma.stockCategory.create({
          data: {
            active: 1,
            campusId: categoryForm.form.campusId,
            categoryName: categoryForm.form.categoryName,
            description: categoryForm.form.description,
            created_by: categoryForm.form.created_by,
            created_at: new Date(),
            updated_by: categoryForm.form.created_by,
            updated_at: new Date()
          },
        }).then(async (res) => {


          await prisma.user.findUnique({
            where: {
              active: 1,
              id: Number(categoryForm.form.created_by),
              campusId: Number(categoryForm.form.campusId)
            },
          }).then(async (res) => {
            const admins = await prisma.user.findMany({
              where: {
                active: 1,
                userType: UserType.admin,
                campusId: Number(categoryForm.form.campusId),
              },
            });
            if (admins !== null && admins !== undefined && admins.length > 0) {
              admins.forEach(async (eachUser: any) => {
                addANotification(Number(categoryForm.form.campusId),
                  Number(eachUser.id),
                  Number(categoryForm.form.created_by),
                  buildMessage(PRODUCT_CATEGORY_ADDED, categoryForm.form.categoryName, res.displayName));
              });
            }
          });


        });
      }
      return res.json({ data: null, status: true, message: 'Product Category added' });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message, status: true, data: null })
    }
  }

  public async getStockOverview(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const yesterday = moment().subtract(1, 'day');
    let overviewDate = {};

    const activeCategories = await prisma.stockCategory.findMany({
      where: {
        campusId: campusId,
        active: 1
      },
    });
    overviewDate["activeCategories"] = activeCategories;
    console.log('activeCategories ' + activeCategories.length);

    const activeProducts = await prisma.stockProduct.findMany({
      where: {
        campusId: campusId,
        active: 1
      },
    });
    console.log('activeProducts ' + activeProducts.length);
    overviewDate["activeProducts"] = activeProducts;

    const outOfStockProducts = await prisma.stockProduct.findMany({
      where: {
        campusId: campusId,
        active: 1,
        stock: 0
      },
    });
    console.log('outOfStockProducts ' + outOfStockProducts.length);
    overviewDate["outOfStockProducts"] = outOfStockProducts;

    const lowStockProducts = await prisma.stockProduct.findMany({
      where: {
        campusId: campusId,
        active: 1,
        stock: {
          lt: 10
        }
      },
    });
    console.log('lowStockProducts ' + lowStockProducts.length);
    overviewDate["lowStockProducts"] = lowStockProducts;


    const salesToday = await prisma.sellProductDetails.findMany({
      where: {
        campusId: campusId,
        active: 1,
        created_at: {
          gt: yesterday.toDate()
        }
      },
    });
    console.log('salesToday ' + salesToday.length);
    overviewDate["salesToday"] = salesToday;

    const salesThisMonth = await prisma.$queryRaw`SELECT us.*, sp.productName,sp.productCode,sp.purchasePrice  FROM myskool.SellProductDetails us
    LEFT JOIN StockProduct sp ON sp.id = us.productId
    where us.campusId=1 and us.active=1
    and month(us.created_at) = month(curdate())`
    console.log(salesThisMonth);
    overviewDate["salesThisMonth"] = salesThisMonth;


    return res.json({ status: true, data: overviewDate, message: 'Stock Reports retrieved' });
  }


  public async changeCategoryStatus(req: Request, res: Response) {
    const categoryForm: any = req.body;

    try {
      if (categoryForm !== null && categoryForm !== undefined) {

        await prisma.stockCategory.findUnique({
          where: {
            id: categoryForm.id,
            campusId: categoryForm.campusId,
          },
        }).then(async (existingData) => {

          if (existingData !== null && existingData !== undefined) {
            let isActive: number = existingData.active;
            console.log('Current Active Status : ' + isActive);

            await prisma.stockCategory.update({
              where: {
                id: categoryForm.id,
                campusId: categoryForm.campusId,
              },
              data: {
                active: isActive === 1 ? 0 : 1,
                updated_by: Number(categoryForm.currentUserid),
                updated_at: new Date()
              },
            }).then(async (category) => {


              await prisma.user.findUnique({
                where: {
                  active: 1,
                  id: Number(categoryForm.currentUserid),
                  campusId: Number(categoryForm.campusId)
                },
              }).then(async (res) => {
                const admins = await prisma.user.findMany({
                  where: {
                    active: 1,
                    userType: UserType.admin,
                    campusId: Number(categoryForm.campusId),
                  },
                });
                if (admins !== null && admins !== undefined && admins.length > 0) {
                  admins.forEach(async (eachUser: any) => {
                    addANotification(Number(categoryForm.campusId),
                      Number(eachUser.id),
                      Number(categoryForm.currentUserid),
                      buildMessage(PRODUCT_CATEGORY_UPDATED, category.categoryName, res.displayName));
                  });
                }
              });


            });

            return res.json({ data: null, status: true, message: 'Category updated' });
          }

        });

      }

    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message, status: true, data: null })
    }
  }

  public async getAllActiveProducts(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);

    const products = await prisma.stockProduct.findMany({
      include: {
        campus: true,
        category: true,
      },
      where: {
        campusId: Number(campusId)
      }
    });
    return res.json({ status: true, data: products, message: 'Products retrieved' });
  }

  public async getAllActiveProductsForSelling(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const products = await prisma.stockProduct.findMany({
      where: {
        campusId: Number(campusId),
        active: 1,
        stock: {
          gte: 1,
        }
      },
      include: {
        campus: true,
        category: true,
      }
    });
    return res.json({ status: true, data: products, message: '' });
  }

  public async getLatestSellRecords(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const sellRecords = await prisma.sellDetails.findMany({

      where: {
        active: 1,
        campusId: Number(campusId)
      },
      orderBy: {
        id: 'desc',
      },
      take: 10,
      include: {
        campus: true,
        products: {
          include: {
            product: true
          }
        },
        transactions: true
      }
    });
    return res.json({ status: true, data: sellRecords, message: '' });
  }

  public async addProduct(req: Request, res: Response) {
    const productForm: any = req.body;
    console.log(productForm)
    try {
      if (productForm !== null && productForm !== undefined) {
        if (productForm.form.id !== null && productForm.form.id !== undefined) {
          //update
          await prisma.stockProduct.update({
            where: {
              id: Number(productForm.form.id),
              campusId: Number(productForm.form.campusId),
            },
            data: {
              productName: productForm.form.productName,
              productCode: productForm.form.productCode,
              purchasePrice: Number(productForm.form.purchasePrice),
              categoryId: productForm.form.categoryId,
              sellPrice: Number(productForm.form.sellPrice),
              stock: Number(productForm.form.stock),
              updated_by: productForm.form.created_by,
              updated_at: new Date()
            },
          });
        } else {
          //add
          let appProdId = generateProductIdNumber(5)

          await prisma.stockProduct.create({
            data: {
              active: 1,
              campusId: Number(productForm.form.campusId),
              productName: productForm.form.productName,
              productCode: productForm.form.productCode,
              appUniqueCode: appProdId,
              categoryId: productForm.form.categoryId,
              purchasePrice: Number(productForm.form.purchasePrice),
              sellPrice: Number(productForm.form.sellPrice),
              stock: Number(productForm.form.stock),
              created_by: productForm.form.created_by,
              created_at: new Date(),
              updated_by: productForm.form.created_by,
              updated_at: new Date()
            },
          });
        }

      }
      return res.json({ data: null, status: true, message: 'Product added' });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message, status: true, data: null })
    }
  }

  public async bulkLoadProduct(req: Request, res: Response) {
    const productForm: any = req.body;
    
    try {
      if (productForm !== null && productForm !== undefined) {
        if (productForm.data!== null && productForm.data !== undefined && productForm.data.length>0) {
          
          for(let i= 0;i <productForm.data.length; i++){
            let productFound = await prisma.stockProduct.findFirst({
              where:{
                productCode:productForm.data[i]['Product Code']
              },
              take: 1,
            });
            //Product Exists just Update stock & prices
            if(productFound!==null && productFound!==undefined &&  productFound.id!==null && productFound.id!==undefined){
              let stock = productFound.stock + Number(productForm.data[i].Stock);
              
              
              await prisma.stockProduct.update({
                where: {
                  id: Number(productFound.id),
                  campusId: Number(productFound.campusId),
                },
                data: {
                  purchasePrice: Number(productForm.data[i]['Purchase Price']),
                  sellPrice: Number(productForm.data[i]['Sell Price']),
                  stock: Number(stock),
                  updated_by: productForm.currentUserId,
                  updated_at: new Date()
                },
              });
            }else{
              let appProdId = generateProductIdNumber(5);

              await prisma.stockProduct.create({
                data: {
                  active: 1,
                  campusId: Number(productForm.data[i]['Campus Id']),
                  productName: productForm.data[i]['Product Name'],
                  productCode: productForm.data[i]['Product Code'],
                  appUniqueCode: appProdId,
                  categoryId: Number(productForm.data[i]['Category Id']),
                  purchasePrice: Number(productForm.data[i]['Purchase Price']),
                  sellPrice: Number(productForm.data[i]['Sell Price']),
                  stock: Number(productForm.data[i].Stock),
                  created_by: productForm.currentUserId,
                  created_at: new Date(),
                  updated_by: productForm.currentUserId,
                  updated_at: new Date()
                },
              });
            }
          }
        } else {
          return res.json({ data: null, status: false, message: 'No data to upload' });
        }

      }
      return res.json({ data: null, status: true, message: 'Bulk Product data loaded' });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message, status: true, data: null })
    }
  }

  public async deleteProduct(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const id = Number(req.params.id);
    const userId = Number(req.params.userId);
    console.log(req.params)
    await prisma.stockProduct.delete({
      where: {
        id: id,
        campusId: campusId
      }
    });
    return res.json({ status: true, data: null, message: 'Product deleted successfully' });
  }

  public async changeProductStatus(req: Request, res: Response) {
    const productForm: any = req.body;

    try {
      if (productForm !== null && productForm !== undefined) {
        console.log(productForm);

        await prisma.stockProduct.findUnique({
          where: {
            id: productForm.id,
            campusId: productForm.campusId,
          },
        }).then(async (existingData) => {

          if (existingData !== null && existingData !== undefined) {
            let isActive: number = existingData.active;
            console.log('Current Active Status : ' + isActive);

            await prisma.stockProduct.update({
              where: {
                id: productForm.id,
                campusId: productForm.campusId,
              },
              data: {
                active: isActive === 1 ? 0 : 1,
                updated_by: Number(productForm.currentUserid),
                updated_at: new Date()
              },
            });

            return res.json({ data: null, status: true, message: 'Product updated' });
          }

        });

      }

    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message, status: true, data: null })
    }
  }


  public async recordACashPayment(req: Request, res: Response) {
    const cartItemsForm: any = req.body;

    try {
      if (cartItemsForm !== null && cartItemsForm !== undefined) {

        if (cartItemsForm.cartItems !== null && cartItemsForm.cartItems !== undefined && cartItemsForm.cartItems.length > 0) {
          let totalIncome = 0;
          let totalQuantity = 0;
          let sellProducts = [];

          for (let i = 0; i < cartItemsForm.cartItems.length; i++) {
            totalIncome = totalIncome + cartItemsForm.cartItems[i].total;
            totalQuantity = totalQuantity + cartItemsForm.cartItems[i].quantity;

            await prisma.stockProduct.update({
              where: {
                id: Number(cartItemsForm.cartItems[i].id),
                campusId: Number(cartItemsForm.campusId),
              },
              data: {
                stock: { decrement: cartItemsForm.cartItems[i].quantity },
                updated_by: cartItemsForm.currentUserid,
                updated_at: new Date()
              },
            });

            sellProducts.push({
              campusId: Number(cartItemsForm.campusId),
              active: 1,
              productId: Number(cartItemsForm.cartItems[i].id),
              sellPrice: cartItemsForm.cartItems[i].price,
              quantity: cartItemsForm.cartItems[i].quantity,
              totalSellPrice: cartItemsForm.cartItems[i].total,
              updated_by: cartItemsForm.currentUserid,
              updated_at: new Date(),
              created_by: cartItemsForm.currentUserid,
              created_at: new Date()
            });

          }






          //create seller invoice
          if (sellProducts !== null && sellProducts !== undefined && sellProducts.length > 0) {

            console.log('Total no of items being sold:' + sellProducts.length)

            let latestInvoiceObj = await prisma.sellDetails.findFirst({
              orderBy: {
                id: 'desc',
              },
              take: 1,
            });

            let latestInvoiceID = latestInvoiceObj !== null && latestInvoiceObj !== undefined ? latestInvoiceObj.id : 0;
            const invoiceNumber = generateSellingInvoiceNumber(latestInvoiceID);
            console.log('Selling Invoice No: ' + invoiceNumber);

            await prisma.sellDetails.create({
              data: {
                campusId: Number(cartItemsForm.campusId),
                active: 1,
                invoiceNumber: invoiceNumber,
                combinedSellPrice: totalIncome,
                totalQuantity: totalQuantity,
                updated_by: cartItemsForm.currentUserid,
                updated_at: new Date(),
                created_by: cartItemsForm.currentUserid,
                created_at: new Date()
              },
            }).then(async (sellRecord) => {

              //add sell records products
              sellProducts.forEach(async (eachItem: any) => {
                await prisma.sellProductDetails.create({
                  data: {
                    campusId: Number(cartItemsForm.campusId),
                    active: 1,
                    sellDetailsId: sellRecord.id,
                    productId: Number(eachItem.productId),
                    sellPrice: eachItem.sellPrice,
                    quantity: eachItem.quantity,
                    totalSellPrice: eachItem.totalSellPrice,
                    updated_by: cartItemsForm.currentUserid,
                    updated_at: new Date(),
                    created_by: cartItemsForm.currentUserid,
                    created_at: new Date()
                  },
                })
              });

              await prisma.transactions.create({
                data: {
                  invoiceNumber: invoiceNumber,
                  campusId: Number(cartItemsForm.campusId),
                  transactionType: TransactionType.Credit,
                  source: TransactionSource.SellProductsFromInventory,
                  userId: Number(cartItemsForm.currentUserid),
                  amount: Number(totalIncome),
                  paymentType: PaymentType.Cash,
                  created_by: Number(cartItemsForm.currentUserid),
                  created_at: new Date(),
                  sellDetailsId: sellRecord.id
                },
              });

              await prisma.user.findUnique({
                where: {
                  active: 1,
                  id: Number(cartItemsForm.currentUserid),
                  campusId: Number(cartItemsForm.campusId)
                },
              }).then((res) => {
                addANotification(Number(cartItemsForm.campusId),
                  Number(cartItemsForm.currentUserid),
                  Number(cartItemsForm.currentUserid),
                  buildMessage(POINT_OF_SALE, totalQuantity + '', res.displayName, invoiceNumber));
              });
            })


          }
        } else {
          return res.json({ data: null, status: false, message: 'No items in the cart' });
        }
      }
      return res.json({ data: null, status: true, message: 'Cash payment recorded' });

    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message, status: true, data: null })
    }
  }

  //Expenses
  public async getActiveExpenseTypes(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);

    const types = await prisma.expenseType.findMany({
      include: {
        campus: true,
        Expense: true
      },
      where: {
        campusId: Number(campusId)
      }
    });
    return res.json({ status: true, data: types, message: 'Expense Types retrieved' });
  }

  public async getExpenseTypeModel(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    let model = [];
    const types = await prisma.expenseType.findMany({
      where: {
        campusId: Number(campusId)
      }
    });
    types.forEach(async (eachType: any) => {
      model.push({ label: eachType.typeName, value: eachType.id })
    });
    return res.json({ status: true, data: model, message: '' });
  }

  public async changeExpenseTypeStatus(req: Request, res: Response) {
    const typeForm: any = req.body;

    try {
      if (typeForm !== null && typeForm !== undefined) {

        await prisma.expenseType.findUnique({
          where: {
            id: typeForm.id,
            campusId: typeForm.campusId,
          },
        }).then(async (existingData) => {

          if (existingData !== null && existingData !== undefined) {
            let isActive: number = existingData.active;
            console.log('Current Active Status : ' + isActive);

            await prisma.expenseType.update({
              where: {
                id: typeForm.id,
                campusId: typeForm.campusId,
              },
              data: {
                active: isActive === 1 ? 0 : 1,
                updated_by: Number(typeForm.currentUserid),
                updated_at: new Date()
              },
            }).then(async (category) => {


              await prisma.user.findUnique({
                where: {
                  active: 1,
                  id: Number(typeForm.currentUserid),
                  campusId: Number(typeForm.campusId)
                },
              }).then(async (res) => {
                const admins = await prisma.user.findMany({
                  where: {
                    active: 1,
                    userType: UserType.admin,
                    campusId: Number(typeForm.campusId),
                  },
                });
                if (admins !== null && admins !== undefined && admins.length > 0) {
                  admins.forEach(async (eachUser: any) => {
                    addANotification(Number(typeForm.campusId),
                      Number(eachUser.id),
                      Number(typeForm.currentUserid),
                      buildMessage(EXPENSE_TYPE_UPDATED, category.typeName, res.displayName));
                  });
                }
              });


            });

            return res.json({ data: null, status: true, message: 'Type updated' });
          }

        });

      }

    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message, status: true, data: null })
    }
  }

  public async addAExpenseType(req: Request, res: Response) {
    const typeForm: any = req.body;
    try {
      if (typeForm !== null && typeForm !== undefined) {
        await prisma.expenseType.create({
          data: {
            active: 1,
            campusId: typeForm.form.campusId,
            typeName: typeForm.form.typeName,
            description: typeForm.form.description,
            created_by: typeForm.form.created_by,
            created_at: new Date(),
            updated_by: typeForm.form.created_by,
            updated_at: new Date()
          },
        }).then(async (res) => {


          await prisma.user.findUnique({
            where: {
              active: 1,
              id: Number(typeForm.form.created_by),
              campusId: Number(typeForm.form.campusId)
            },
          }).then(async (res) => {
            const admins = await prisma.user.findMany({
              where: {
                active: 1,
                userType: UserType.admin,
                campusId: Number(typeForm.form.campusId),
              },
            });
            if (admins !== null && admins !== undefined && admins.length > 0) {
              admins.forEach(async (eachUser: any) => {
                addANotification(Number(typeForm.form.campusId),
                  Number(eachUser.id),
                  Number(typeForm.form.created_by),
                  buildMessage(EXPENSE_TYPE_ADDED, typeForm.form.typeName, res.displayName));
              });
            }
          });


        });
      }
      return res.json({ data: null, status: true, message: 'Expense Type added' });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message, status: true, data: null })
    }
  }

  public async getLatestExpenses(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const types = await prisma.expense.findMany({
      include: {
        campus: true,
        type: true
      },
      where: {
        campusId: Number(campusId)
      },
      take: 50,
      orderBy: {
        created_at: 'desc'
      }
    });
    return res.json({ status: true, data: types, message: 'Expenses retrieved' });
  }


  public async addAExpense(req: Request, res: Response) {
    const typeForm: any = req.body;
    console.log(typeForm)
    try {
      if (typeForm !== null && typeForm !== undefined) {
        if (typeForm.form.id !== null && typeForm.form.id !== undefined) {

          await prisma.expense.update({
            where: {
              id: typeForm.form.id,
              campusId: typeForm.form.campusId,
            },
            data: {
              title: typeForm.form.title,
              description: typeForm.form.description,
              typeId: typeForm.form.typeId,
              amount: typeForm.form.amount,
              expenseMethod: typeForm.form.expenseMethod,
              updated_by: typeForm.form.created_by,
              updated_at: new Date()
            },
          }).then(async (res) => {

            await prisma.transactions.deleteMany({
              where: {
                expenseId: res.id,
                campusId: Number(typeForm.form.campusId)
              },
            }).then(async (resDel) => {
              await prisma.transactions.create({
                data: {
                  campusId: Number(typeForm.form.campusId),
                  transactionType: TransactionType.Debit,
                  source: TransactionSource.OtherExpenses,
                  amount: Number(typeForm.form.amount),
                  paymentType: typeForm.form.expenseMethod,
                  created_by: Number(typeForm.form.created_by),
                  created_at: new Date(),
                  expenseId: res.id
                },
              });
            });


            await prisma.user.findUnique({
              where: {
                active: 1,
                id: Number(typeForm.form.created_by),
                campusId: Number(typeForm.form.campusId)
              },
            }).then(async (res) => {
              const admins = await prisma.user.findMany({
                where: {
                  active: 1,
                  userType: UserType.admin,
                  campusId: Number(typeForm.form.campusId),
                },
              });
              if (admins !== null && admins !== undefined && admins.length > 0) {
                admins.forEach(async (eachUser: any) => {
                  addANotification(Number(typeForm.form.campusId),
                    Number(eachUser.id),
                    Number(typeForm.form.created_by),
                    buildMessage(EXPENSE_UPDATED, typeForm.form.typeName, res.displayName));
                });
              }
            });
          });

        } else {
          await prisma.expense.create({
            data: {
              campusId: typeForm.form.campusId,
              title: typeForm.form.title,
              description: typeForm.form.description,
              typeId: typeForm.form.typeId,
              amount: typeForm.form.amount,
              expenseMethod: typeForm.form.expenseMethod,
              created_by: typeForm.form.created_by,
              created_at: new Date(),
              updated_by: typeForm.form.created_by,
              updated_at: new Date()
            },
          }).then(async (res) => {
            await prisma.transactions.create({
              data: {
                campusId: Number(typeForm.form.campusId),
                transactionType: TransactionType.Debit,
                source: TransactionSource.OtherExpenses,
                amount: Number(typeForm.form.amount),
                paymentType: typeForm.form.expenseMethod,
                created_by: Number(typeForm.form.created_by),
                created_at: new Date(),
                expenseId: res.id
              },
            });

            await prisma.user.findUnique({
              where: {
                active: 1,
                id: Number(typeForm.form.created_by),
                campusId: Number(typeForm.form.campusId)
              },
            }).then(async (res) => {
              const admins = await prisma.user.findMany({
                where: {
                  active: 1,
                  userType: UserType.admin,
                  campusId: Number(typeForm.form.campusId),
                },
              });
              if (admins !== null && admins !== undefined && admins.length > 0) {
                admins.forEach(async (eachUser: any) => {
                  addANotification(Number(typeForm.form.campusId),
                    Number(eachUser.id),
                    Number(typeForm.form.created_by),
                    buildMessage(EXPENSE_ADDED, typeForm.form.typeName, res.displayName));
                });
              }
            });
          });
        }

      }
      return res.json({ data: null, status: true, message: 'Expense added' });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message, status: true, data: null })
    }
  }

  public async deleteExpense(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const id = Number(req.params.id);
    const userId = Number(req.params.userId);

    await prisma.expense.findUnique({
      where: {
        id: id,
        campusId: campusId
      }
    }).then(async (expense) => {

      //add notification
      await prisma.user.findUnique({
        where: {
          active: 1,
          id: Number(userId),
          campusId: Number(campusId)
        },
      }).then(async (creator) => {
        const admins = await prisma.user.findMany({
          where: {
            active: 1,
            userType: UserType.admin,
            campusId: Number(campusId),
          },
        });
        if (admins !== null && admins !== undefined && admins.length > 0) {
          admins.forEach(async (eachUser: any) => {
            addANotification(Number(campusId),
              Number(eachUser.id),
              Number(creator.id),
              buildMessage(EXPENSE_TYPE_ADDED, expense.title, creator.displayName));
          });
        }
      });
      //end add notification

      //Delete transaction

      await prisma.transactions.deleteMany({
        where: {
          expenseId: id,
          campusId: campusId
        }
      })
      //End Delete transaction

      //Delete expense 
      await prisma.expense.delete({
        where: {
          id: id,
          campusId: campusId
        }
      })
      //End of Delete expense 
    });;
    return res.json({ status: true, data: null, message: 'Expense deleted successfully' });
  }

}
