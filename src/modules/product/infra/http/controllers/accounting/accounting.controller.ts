import { prisma } from "../../../../../../shared/db-client";
import { Request, Response } from "express";
import { FeeStatus, FeeType, ParentType, PaymentType, StudentFees, SubjectType, TransactionSource, TransactionType, User, UserType } from "@prisma/client";
import moment from "moment";
import { generateInvoiceNumber } from "../../../../../../shared/helpers/utils/generic.utils";


export class AccountingController {


  public async getAllInvoicesForStudent (req: Request, res: Response)  {
    const campusId = Number(req.params.campusId);
    const userId = Number(req.params.userId);
    
    const student = await prisma.user.findUnique({
      where: {
        id:Number(userId),
        campusId : Number(campusId)
      },
      include: {
        MYAALInvoices:{
          where:{
            feeType: FeeType.MONTHLY
          }
        },
        campus : true,
        class: true
      },
    });
    console.log(student)
    return res.json({ status: true,  data: student , message:'' });
  }

  
  public async getPrimaryParentsDropdown (req: Request, res: Response)  {
    const campusId = Number(req.params.campusId);
    const parents = await prisma.user.findMany({
      where: {
        campusId : Number(campusId),
        userType: UserType.parent,
        parentType: ParentType.Father
      },
    });
    let parentModel = [];
    if(parents!==null && parents!==undefined && parents.length>0){
      for(let i=0;i<parents.length;i++){
        parentModel.push({ value: parents[i].id+'', label: parents[i].displayName})
      }
    }
    return res.json({ status: true,  data: parentModel , message:'' });
  }
  

  public async cancelFeeInvoice (req: Request, res: Response)  {
    const campusId = Number(req.params.campusId);
    const id = Number(req.params.id);
    const currentUserId = Number(req.params.currentUserId);
    
    const invoice = await prisma.mYAALInvoices.findUnique({
      where: {
        campusId : Number(campusId),
        id:Number(id)
      },
    });
   
    if(!invoice){
      return res.json({ status: false,  data: null , message:'Invoice not found' });
    }
    let currentDues = invoice.amount - invoice.paidAmount;

    const updateInvoice = await prisma.mYAALInvoices.update({
      where: {
        id: id,
        campusId:campusId
      },
      data: {
        feeStatus: FeeStatus.Cancelled,
        updated_by: Number(currentUserId),
        updated_at: new Date()
      },
    });
    return res.json({ status: true,  data: null , message:'Invoice cancelled' });
  }

  public async markAsQuickPaid (req: Request, res: Response)  {
    const campusId = Number(req.params.campusId);
    const id = Number(req.params.id);
    const currentUserId = Number(req.params.currentUserId);
    const parentID = Number(req.params.parentID);
    
    

    const invoice = await prisma.mYAALInvoices.findUnique({
      where: {
        campusId : Number(campusId),
        id:Number(id)
      },
    });
   
    if(!invoice){
      return res.json({ status: false,  data: null , message:'Invoice not found' });
    }
    //calculations
    let cashAmount = 0 ;
    let walletBalanceAfterDeduction = 0 ;
    let paidAmountExisting  = 0;
    let currentDues = invoice.amount - invoice.paidAmount;
    
    if(invoice.paidAmount===null || invoice.paidAmount===undefined){
      paidAmountExisting = 0;
    }else{
      paidAmountExisting = invoice.paidAmount;
    }

    let totalPaid = paidAmountExisting + Number(currentDues);
    


   
    const updateInvoice = await prisma.mYAALInvoices.update({
      where: {
        id: id,
        campusId:campusId
      },
      data: {
        feeStatus: FeeStatus.Paid,
        paidOn: moment(new Date(), 'DD-MM-YYYY').toDate(),
        paidAmount: totalPaid,
        paymentType:PaymentType.Cash,
        updated_by: Number(currentUserId),
        updated_at: new Date()
      },
    });

    const parent = await prisma.user.findUnique({
      where: {
        campusId : Number(campusId),
        id:Number(parentID)
      },
      include:{
        FamilyCredit: true
      }
    });

    console.log(parent.FamilyCredit);

    if(parent!==null && parent!==undefined && parent.FamilyCredit!==null 
              &&  parent.FamilyCredit!==undefined &&  parent.FamilyCredit.length>0 &&  parent.FamilyCredit[0].availableCredit>0 ){
       
      let familyCreditAmt =  parent.FamilyCredit[0].availableCredit
      
      if(Number(familyCreditAmt) >= Number(currentDues)){
        cashAmount = 0;
        walletBalanceAfterDeduction =  Number(familyCreditAmt) - Number(currentDues);
        
        await prisma.transactions.create({
          data: {
            invoiceNumber: invoice.invoiceNumber,
            campusId:invoice.campusId,
            transactionType: TransactionType.Debit,
            source: TransactionSource.StudentFeePaymentUsingFamilyCredit,
            userId:invoice.userId,
            classId:invoice.classId,
            sectionId:invoice.sectionId,
            amount:Number(currentDues),
            paymentType:PaymentType.Wallet,
            created_by: Number(currentUserId),
            created_at: new Date(),
            familyCreditId:parent.FamilyCredit[0].id
          },
        });

        await prisma.transactions.create({
          data: {
            invoiceNumber: invoice.invoiceNumber,
            campusId:invoice.campusId,
            transactionType: TransactionType.Credit,
            source: TransactionSource.StudentFeePayment,
            userId:invoice.userId,
            classId:invoice.classId,
            sectionId:invoice.sectionId,
            amount:Number(currentDues),
            paymentType:PaymentType.Wallet,
            created_by: Number(currentUserId),
            created_at: new Date(),
            familyCreditId:parent.FamilyCredit[0].id
          },
        });


      }else{
        cashAmount = Number(currentDues) - Number(familyCreditAmt);
        walletBalanceAfterDeduction = 0;
        
        await prisma.transactions.create({
          data: {
            invoiceNumber: invoice.invoiceNumber,
            campusId:invoice.campusId,
            transactionType: TransactionType.Debit,
            source: TransactionSource.StudentFeePaymentUsingFamilyCredit,
            userId:invoice.userId,
            classId:invoice.classId,
            sectionId:invoice.sectionId,
            amount:Number(familyCreditAmt),
            paymentType:PaymentType.Wallet,
            created_by: Number(currentUserId),
            created_at: new Date(),
            familyCreditId:parent.FamilyCredit[0].id
          },
        });

        await prisma.transactions.create({
          data: {
            invoiceNumber: invoice.invoiceNumber,
            campusId:invoice.campusId,
            transactionType: TransactionType.Credit,
            source: TransactionSource.StudentFeePayment,
            userId:invoice.userId,
            classId:invoice.classId,
            sectionId:invoice.sectionId,
            amount:Number(familyCreditAmt),
            paymentType:PaymentType.Wallet,
            created_by: Number(currentUserId),
            created_at: new Date(),
            familyCreditId:parent.FamilyCredit[0].id
          },
        });
        
        await prisma.transactions.create({
          data: {
            invoiceNumber: invoice.invoiceNumber,
            campusId:invoice.campusId,
            transactionType: TransactionType.Credit,
            source: TransactionSource.StudentFeePayment,
            userId:invoice.userId,
            classId:invoice.classId,
            sectionId:invoice.sectionId,
            amount:Number(cashAmount),
            paymentType:PaymentType.Cash,
            created_by: Number(currentUserId),
            created_at: new Date(),
            familyCreditId:parent.FamilyCredit[0].id
          },
        });
      }
      
      await prisma.familyCredit.update({
        where: {
          campusId : invoice.campusId,
          id:Number(parent.FamilyCredit[0].id)
        },
        data: {
          availableCredit:Number(walletBalanceAfterDeduction),
          updated_by: Number(currentUserId),
          updated_at: new Date()
        },
      });

      

      console.log('cashAmount > '+cashAmount+' --- walletBalanceAfterDeduction >'+walletBalanceAfterDeduction);

    
    }else{
      await prisma.transactions.create({
        data: {
          invoiceNumber: invoice.invoiceNumber,
          campusId:invoice.campusId,
          transactionType: TransactionType.Credit,
          source: TransactionSource.StudentFeePayment,
          userId:invoice.userId,
          classId:invoice.classId,
          sectionId:invoice.sectionId,
          amount:Number(currentDues),
          paymentType:PaymentType.Cash,
          created_by: Number(currentUserId),
          created_at: new Date()
        },
      });
    }
    return res.json({ status: true,  data: null , message:'Invoice paid' });
  }


  public async acceptPayment (req: Request, res: Response)  {
    const formData: any = req.body;
    console.log(formData)
    if(formData!==null && formData!==undefined && formData.form.invoiceId!==null && formData.form.invoiceId!==undefined){
        const invoice = await prisma.mYAALInvoices.findUnique({
          where: {
            campusId : Number(formData.form.campusId),
            id:Number(formData.form.invoiceId)
          },
        });
      
        if(!invoice){
          return res.json({ status: false,  data: null , message:'Invoice not found' });
        }
        //calculations
        let cashAmount = 0 ;
        let walletBalanceAfterDeduction = 0 ;
        let paidAmountExisting  = 0;
        
        if(invoice.paidAmount===null || invoice.paidAmount===undefined){
          paidAmountExisting = 0;
        }else{
          paidAmountExisting = invoice.paidAmount;
        }


        let totalPaid = paidAmountExisting + Number(formData.form.payingAmount);
        
        const updateInvoice = await prisma.mYAALInvoices.update({
          where: {
            campusId : Number(formData.form.campusId),
            id:Number(formData.form.invoiceId)
          },
          data: {
            feeStatus: invoice.amount === Number(totalPaid) ? FeeStatus.Paid : Number(totalPaid) < invoice.amount ? FeeStatus.Partial : FeeStatus.Paid ,
            paidOn: moment(new Date(), 'DD-MM-YYYY').toDate(),
            paymentType:PaymentType.Cash,
            paidAmount: Number(totalPaid),
            updated_by: Number(formData.form.currentUserId),
            updated_at: new Date()
          },
        });

        if(formData.form.familyCredit!==null && formData.form.familyCredit!==undefined && formData.form.familyCredit>0 ){
          
          if(Number(formData.form.familyCredit) >= Number(formData.form.payingAmount)){
            cashAmount = 0;
            walletBalanceAfterDeduction =  Number(formData.form.familyCredit) - Number(formData.form.payingAmount);
            
            await prisma.transactions.create({
              data: {
                invoiceNumber: invoice.invoiceNumber,
                campusId:invoice.campusId,
                transactionType: TransactionType.Debit,
                source: TransactionSource.StudentFeePaymentUsingFamilyCredit,
                userId:invoice.userId,
                classId:invoice.classId,
                sectionId:invoice.sectionId,
                amount:Number(formData.form.payingAmount),
                paymentType:PaymentType.Wallet,
                created_by: Number(formData.form.currentUserId),
                created_at: new Date(),
                familyCreditId:formData.form.familyCreditId
              },
            });

            await prisma.transactions.create({
              data: {
                invoiceNumber: invoice.invoiceNumber,
                campusId:invoice.campusId,
                transactionType: TransactionType.Credit,
                source: TransactionSource.StudentFeePayment,
                userId:invoice.userId,
                classId:invoice.classId,
                sectionId:invoice.sectionId,
                amount:Number(formData.form.payingAmount),
                paymentType:PaymentType.Wallet,
                created_by: Number(formData.form.currentUserId),
                created_at: new Date(),
                familyCreditId:formData.form.familyCreditId
              },
            });


          }else{
            cashAmount = Number(formData.form.payingAmount) - Number(formData.form.familyCredit);
            walletBalanceAfterDeduction = 0;
            
            await prisma.transactions.create({
              data: {
                invoiceNumber: invoice.invoiceNumber,
                campusId:invoice.campusId,
                transactionType: TransactionType.Debit,
                source: TransactionSource.StudentFeePaymentUsingFamilyCredit,
                userId:invoice.userId,
                classId:invoice.classId,
                sectionId:invoice.sectionId,
                amount:Number(formData.form.familyCredit),
                paymentType:PaymentType.Wallet,
                created_by: Number(formData.form.currentUserId),
                created_at: new Date(),
                familyCreditId:formData.form.familyCreditId
              },
            });

            await prisma.transactions.create({
              data: {
                invoiceNumber: invoice.invoiceNumber,
                campusId:invoice.campusId,
                transactionType: TransactionType.Credit,
                source: TransactionSource.StudentFeePayment,
                userId:invoice.userId,
                classId:invoice.classId,
                sectionId:invoice.sectionId,
                amount:Number(formData.form.familyCredit),
                paymentType:PaymentType.Wallet,
                created_by: Number(formData.form.currentUserId),
                created_at: new Date(),
                familyCreditId:formData.form.familyCreditId
              },
            });
            
            await prisma.transactions.create({
              data: {
                invoiceNumber: invoice.invoiceNumber,
                campusId:invoice.campusId,
                transactionType: TransactionType.Credit,
                source: TransactionSource.StudentFeePayment,
                userId:invoice.userId,
                classId:invoice.classId,
                sectionId:invoice.sectionId,
                amount:Number(cashAmount),
                paymentType:PaymentType.Cash,
                created_by: Number(formData.form.currentUserId),
                created_at: new Date(),
                familyCreditId:formData.form.familyCreditId
              },
            });
          }
          
          await prisma.familyCredit.update({
            where: {
              campusId : Number(formData.form.campusId),
              id:Number(formData.form.familyCreditId)
            },
            data: {
              availableCredit:Number(walletBalanceAfterDeduction),
              updated_by: Number(formData.form.currentUserId),
              updated_at: new Date()
            },
          });

          

          console.log('cashAmount > '+cashAmount+' --- walletBalanceAfterDeduction >'+walletBalanceAfterDeduction);

        
        }else{
          await prisma.transactions.create({
            data: {
              invoiceNumber: invoice.invoiceNumber,
              campusId:invoice.campusId,
              transactionType: TransactionType.Credit,
              source: TransactionSource.StudentFeePayment,
              userId:invoice.userId,
              classId:invoice.classId,
              sectionId:invoice.sectionId,
              amount:Number(formData.form.payingAmount),
              paymentType:PaymentType.Cash,
              created_by: Number(formData.form.currentUserId),
              created_at: new Date()
            },
          });
        }
        
        
        
        return res.json({ status: true,  data: null , message:'Payment recorded' });
    
      }else{
      return res.json({ status: false,  data: null , message:'Invoice not found' });
    }
  }

public async getStudentFeePaymentStatusForInvoiceGenerate  (req: Request, res: Response) {

    const formData: any = req.body;
    try {
      
      let lateFeeLov = await prisma.listOfValues.findUnique({
        where: {
          campusId : Number(formData.campusId),
          uniqueKey: 'InstituteCommonLateFee',
          active: 1
        },
      });


      const students = await prisma.user.findMany({
        where: {
          campusId : Number(formData.campusId),
          classId:  Number(formData.classId),
          sectionId: Number(formData.sectionId),
        },
        include: {
          campus : true,
          class: true,
          section:true,
          StudentFees:{
            where: {
              campusId : Number(formData.campusId),
              classId:  Number(formData.classId),
              sectionId: Number(formData.sectionId),
              active:1,
            },
            include:{
              feePlan: true,
            }
          },
          MYAALInvoices:{
            where: {
              campusId : Number(formData.campusId),
              classId:  Number(formData.classId),
              sectionId: Number(formData.sectionId),
            }
          },
        },
      });

      if(students!==null && students!==undefined && students.length>0){
        for(let i=0;i<students.length;i++){
          let yearlyDues = 0;
          let monthlyDues = 0;
          let adhocDues = 0;
          let lateDues = 0;

          let yearlyDuesAmt = 0;
          let monthlyDuesAmt = 0;
          let adhocDuesAmt = 0;
          let lateDuesAmt = 0;
         
          if(students[i].MYAALInvoices!==null && students[i].MYAALInvoices!==undefined && students[i].MYAALInvoices.length>0){
            for(let j=0;j<students[i].MYAALInvoices.length;j++){
              let invoice = students[i].MYAALInvoices[j];
              let dueAfterPayment = 0;
              
              if(invoice.feeStatus!==FeeStatus.Paid && invoice.feeStatus!==FeeStatus.Cancelled){
                dueAfterPayment = invoice.amount  - invoice.paidAmount;
              }


              if(invoice!==null && invoice!==undefined && (invoice.feeStatus===FeeStatus.Unpaid || invoice.feeStatus===FeeStatus.Partial)){
                if(invoice.feeType===FeeType.MONTHLY){
                  monthlyDues = monthlyDues+1;
                  monthlyDuesAmt  = monthlyDuesAmt+ dueAfterPayment;
                }else if(invoice.feeType===FeeType.YEARLY){
                  yearlyDues = yearlyDues+1;
                  yearlyDuesAmt  = yearlyDuesAmt+ dueAfterPayment;
                }else if(invoice.feeType===FeeType.ADHOC){
                  adhocDues = adhocDues+1;
                  adhocDuesAmt  = adhocDuesAmt+ dueAfterPayment;
                }
                //Change due amount here Here
                invoice.amount = dueAfterPayment;
                
                //add any late fees
                if(new Date()>invoice.dueDate){
                  lateDues = lateDues+1;
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

      return res.json({ status: true,  data: students , message:'Fees/Dues retrieved' });
      
    } catch (error) {
      console.error(error);
  
      return res.json({ status: false,  data: null , message:'Failed to create Class' });
    }
  }


public async getStudentFeePaymentStatus  (req: Request, res: Response) {

    const formData: any = req.body;
    try {
      
      let lateFeeLov = await prisma.listOfValues.findUnique({
        where: {
          campusId : Number(formData.campusId),
          uniqueKey: 'InstituteCommonLateFee',
          active: 1
        },
      });


      const currentStudent = await prisma.user.findUnique({
        where: {
          id: Number(formData.studentId),
          campusId : Number(formData.campusId),
          classId:  Number(formData.classId),
          sectionId: Number(formData.sectionId),
        },
        include: {
          campus : true,
          class: true,
          section:true,
          Transactions: true,
          StudentFees:{
            where: {
              campusId : Number(formData.campusId),
              classId:  Number(formData.classId),
              sectionId: Number(formData.sectionId),
              active:1,
            },
            include:{
              feePlan: true,
            }
          },
          FamilyCredit:{
            include: {
              transactions: true
            }
          },
          MYAALInvoices:{
            where: {
              campusId : Number(formData.campusId),
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

      if(currentStudent!==null && currentStudent!==undefined ){
        
        let totalDues = 0;
        let totalLateDues = 0;
         
          if(currentStudent.MYAALInvoices!==null && currentStudent.MYAALInvoices!==undefined && currentStudent.MYAALInvoices.length>0){
            
            for(let j=0;j<currentStudent.MYAALInvoices.length;j++){
              let invoice = currentStudent.MYAALInvoices[j];
              
              
              if(invoice!==null && invoice!==undefined){
                if(invoice.feeType===FeeType.MONTHLY){
                  currentStudent.MYAALInvoices[j]['rollNoProcessed'] = currentStudent.rollNoProcessed;
                  currentStudent.MYAALInvoices[j]['idCardNumber'] =currentStudent.idCardNumber;
                  currentStudent.MYAALInvoices[j]['displayName'] = currentStudent.displayName;
                  currentStudent.MYAALInvoices[j]['latefee'] = new Date()>invoice.dueDate ? Number(lateFeeLov.shortName) : 0;
                }else if(invoice.feeType===FeeType.YEARLY){
                  currentStudent.MYAALInvoices[j]['rollNoProcessed'] = currentStudent.rollNoProcessed;
                  currentStudent.MYAALInvoices[j]['idCardNumber'] =currentStudent.idCardNumber;
                  currentStudent.MYAALInvoices[j]['displayName'] = currentStudent.displayName;
                  currentStudent.MYAALInvoices[j]['latefee'] = new Date()>invoice.dueDate ? Number(lateFeeLov.shortName) : 0;
                }else if(invoice.feeType===FeeType.ADHOC){
                  currentStudent.MYAALInvoices[j]['rollNoProcessed'] = currentStudent.rollNoProcessed;
                  currentStudent.MYAALInvoices[j]['idCardNumber'] =currentStudent.idCardNumber;
                  currentStudent.MYAALInvoices[j]['displayName'] = currentStudent.displayName;
                  currentStudent.MYAALInvoices[j]['latefee'] = new Date()>invoice.dueDate ? Number(lateFeeLov.shortName) : 0;
                }else if(invoice.feeType===FeeType.LATE){
                  currentStudent.MYAALInvoices[j]['rollNoProcessed'] = currentStudent.rollNoProcessed;
                  currentStudent.MYAALInvoices[j]['idCardNumber'] =currentStudent.idCardNumber;
                  currentStudent.MYAALInvoices[j]['displayName'] = currentStudent.displayName;
                  currentStudent.MYAALInvoices[j]['latefee'] = new Date()>invoice.dueDate ? Number(lateFeeLov.shortName) : 0;
                }
                let dueAfterPayment = 0;
                let totalAmountBeforePayments = invoice.amount;
                
                if(invoice.feeStatus!==FeeStatus.Paid && invoice.feeStatus!==FeeStatus.Cancelled){
                  dueAfterPayment = invoice.amount  - invoice.paidAmount;
                }
                totalDues = totalDues+ dueAfterPayment;
                invoice.amount = dueAfterPayment;
                invoice['totalAmountBeforePayments'] = totalAmountBeforePayments;
                
                if(new Date()>invoice.dueDate){
                  totalLateDues = totalLateDues + Number(lateFeeLov.shortName);
                }
              }
            }
            //add totals to student
            currentStudent['totalDues'] = totalDues+'';
            currentStudent['totalLateDues'] = totalLateDues+'';
          }

          
          return res.json({ status: true,  data: currentStudent , message:'Fee details retrieved' });
      
      }else{
        return res.json({ status: false,  data: null , message:'Student not found' });
      }

      
    } catch (error) {
      console.error(error);
  
      return res.json({ status: false,  data: null , message:'Student not found' });
    }
  }


  public async getStudentCreditStatus  (req: Request, res: Response) {

    const formData: any = req.body;
    try {
      
      

      const currentStudent = await prisma.user.findUnique({
        where: {
          id: Number(formData.studentId),
          campusId : Number(formData.campusId),
          classId:  Number(formData.classId),
          sectionId: Number(formData.sectionId),
        },
        include: {
          campus : true,
          class: true,
          section:true,
          parent:{
            include: {
              parent:{
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

      if(currentStudent!==null && currentStudent!==undefined 
            && currentStudent.parent!==null &&  currentStudent.parent!==undefined && currentStudent.parent.length>0){
              let parent1 = currentStudent.parent[0].parent;
              if(parent1!==null && parent1!==undefined){
                return res.json({ status: true,  data: parent1 , message:'Parent info retrieved' });
              }else{
                return res.json({ status: false,  data: null , message:'Parent not found' });
              }
        
      
      }else{
        return res.json({ status: false,  data: null , message:'Student not found' });
      }

      
    } catch (error) {
      console.error(error);
  
      return res.json({ status: false,  data: null , message:'Student not found' });
    }
  }

  public async generateStudentFeesApiCall  (req: Request, res: Response) {

    const formData: any = req.body;
    console.log(formData);
    let studentsWithoutFeesOrDues = [];
    let invoicesGenerated = [];
    let singleInvoiceGenerate:boolean = false;
    
    let latestInvoiceObj= await prisma.mYAALInvoices.findFirst({
      orderBy: {
        id: 'desc',
      },
      take: 1,
    });
    let latestInvoiceID = latestInvoiceObj!==null && latestInvoiceObj!==undefined? latestInvoiceObj.id : 0;

    try {
      if(formData.students!==null && formData.students!==undefined && formData.students.length>0){
        for(let i=0;i<formData.students.length;i++){
          let studentEach: any = formData.students[i].original;
          
          if(studentEach!==null && studentEach!==undefined){
            console.log(studentEach);
            
            if(studentEach.StudentFees===null || studentEach.StudentFees===undefined 
                    || (studentEach.StudentFees!==null && studentEach.StudentFees!==undefined && studentEach.StudentFees.length===0)){
              studentsWithoutFeesOrDues.push(studentEach.displayName);
            
            }else if(studentEach.StudentFees!==null && studentEach.StudentFees!==undefined && studentEach.StudentFees.length>0){
              let activeStudentFeeObj  =  studentEach.StudentFees.filter( studentFee => studentFee.active === 1);
              
              if(activeStudentFeeObj!==null && activeStudentFeeObj!==undefined && activeStudentFeeObj.length===0){
                studentsWithoutFeesOrDues.push(studentEach.displayName);
              }else{
                  let feePlanActive = activeStudentFeeObj[0].feePlan;
                  invoicesGenerated.push(studentEach.displayName);
                  latestInvoiceID  = latestInvoiceID +1;
                  const invoiceNumber = generateInvoiceNumber(latestInvoiceID);

                  //Active Student fee present 
                  //Use this to generate the rest
                  if(formData.feeType==='MONTHLY'){
                      let futureMonthDueDate = moment(new Date(), 'DD-MM-YYYY').add(1, 'M');;
                      
                      await prisma.mYAALInvoices.create({
                        data: {
                          userId : studentEach.id ,
                          invoiceNumber: invoiceNumber,
                          campusId :Number(formData.campusId) ,
                          classId: Number(studentEach.class.id),
                          sectionId: Number(studentEach.section.id), 
                          feeStatus :FeeStatus.Unpaid,
                          feeType: FeeType.MONTHLY,
                          year:Number(formData.year),
                          month:Number(formData.month),
                          dueDate: futureMonthDueDate.toDate(),
                          amount :feePlanActive.monthlyAmt,
                          updated_by: formData.curretUserId,
                          updated_at: new Date(),
                          created_by: formData.curretUserId,
                          created_at: new Date()
                        },
                      });
                      singleInvoiceGenerate = true;
                  
                  
                    }else if(formData.feeType==='YEARLY'){
                      
                      let futureMonthDueDate = moment(new Date(), 'DD-MM-YYYY').add(1, 'M');; 
                      await prisma.mYAALInvoices.create({
                        data: {
                          userId : studentEach.id ,
                          invoiceNumber: invoiceNumber,
                          campusId :Number(formData.campusId) ,
                          classId: Number(studentEach.class.id),
                          sectionId: Number(studentEach.section.id), 
                          feeStatus :FeeStatus.Unpaid,
                          feeType: FeeType.YEARLY,
                          year:Number(formData.year),
                          month:Number(formData.month),
                          dueDate: futureMonthDueDate.toDate(),
                          amount :feePlanActive.yearlyAmt,
                          updated_by: formData.curretUserId,
                          updated_at: new Date(),
                          created_by: formData.curretUserId,
                          created_at: new Date()
                        },
                      });
                      singleInvoiceGenerate = true;
                  
                  }else if(formData.feeType==='ADHOC'){
                    let futureMonthDueDate = moment(new Date(), 'DD-MM-YYYY').add(1, 'M');;
                     
                    await prisma.mYAALInvoices.create({
                      data: {
                        userId : studentEach.id ,
                        invoiceNumber: invoiceNumber,
                        campusId :Number(formData.campusId) ,
                        classId: Number(studentEach.class.id),
                        sectionId: Number(studentEach.section.id), 
                        feeStatus :FeeStatus.Unpaid,
                        feeType: FeeType.ADHOC,
                        year:Number(formData.year),
                        month:Number(formData.month),
                        dueDate: futureMonthDueDate.toDate(),
                        amount :formData.adhocAmount,
                        updated_by: formData.curretUserId,
                        updated_at: new Date(),
                        created_by: formData.curretUserId,
                        created_at: new Date()
                      },
                    });
                    singleInvoiceGenerate = true;
                
                  }else if(formData.feeType==='LATE'){
                    let futureMonthDueDate = moment(new Date(), 'DD-MM-YYYY').add(1, 'M');;
                     
                    await prisma.mYAALInvoices.create({
                      data: {
                        userId : studentEach.id ,
                        invoiceNumber: invoiceNumber,
                        campusId :Number(formData.campusId) ,
                        classId: Number(studentEach.class.id),
                        sectionId: Number(studentEach.section.id), 
                        feeStatus :FeeStatus.Unpaid,
                        feeType: FeeType.LATE,
                        year:Number(formData.year),
                        month:Number(formData.month),
                        dueDate: futureMonthDueDate.toDate(),
                        amount :formData.adhocAmount,
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
      return res.json({ status: true,  data: null , message: studentsWithoutFeesOrDues.length>0 ? 'Request Submitted. Fee plan not found for '+errorJoined : 
        'Invoices generated for '+successJoined
       });
      
    } catch (error) {
      console.error(error);
  
      return res.json({ status: false,  data: null , message:'Some error occured. Try later.' });
    }
  }


  public async updateStudentFeePlan  (req: Request, res: Response) {

    const formData: any = req.body;
    console.log(formData);
    
    try {
      if(formData.studentId!==null && formData.studentId!==undefined && formData.feePlanId!==null && formData.feePlanId!==undefined){
        const existingstudentWithFees = await prisma.user.findUnique({
          where: {
            id: Number(formData.studentId),
            campusId: Number(formData.campusId)
          },
          include:{
            StudentFees:{
              where:{
                active:1
              }
            }
          }
        })
        if(existingstudentWithFees!==null && existingstudentWithFees!==undefined){
          if(existingstudentWithFees.StudentFees!==null && existingstudentWithFees.StudentFees!==undefined && existingstudentWithFees.StudentFees.length===1){
            await prisma.studentFees.update({
              where:{
                id:existingstudentWithFees.StudentFees[0].id,
                campusId:Number(formData.campusId)
              },
              data: {
                feePlanId: Number(formData.feePlanId) ,
                classId: Number(formData.classId),
                sectionId: Number(formData.sectionId),
                updated_by: Number(formData.currentUserId),
                updated_at: new Date(),
              },
            });
            
          } else if(existingstudentWithFees.StudentFees!==null && existingstudentWithFees.StudentFees!==undefined && existingstudentWithFees.StudentFees.length===0){
            await prisma.studentFees.create({
              data: {
                userId : Number(formData.studentId),
                campusId :Number(formData.campusId) ,
                feePlanId: Number(formData.feePlanId) ,
                active: 1,
                classId: Number(formData.classId),
                sectionId: Number(formData.sectionId),
                updated_by: Number(formData.currentUserId),
                updated_at: new Date(),
                created_by: Number(formData.currentUserId),
                created_at: new Date()
              },
            });
          } 
        }

      }
      
      return res.json({ status: true,  data: null , message: 'Fee Plan updated' });
      
    } catch (error) {
      console.error(error);
  
      return res.json({ status: false,  data: null , message:'Some error occured. Try later.' });
    }
  }

  public async acceptFamilyCredit (req: Request, res: Response)  {
    const formData: any = req.body;
    console.log(formData)
    if(formData!==null && formData!==undefined && formData.form.parentId!==null && formData.form.parentId!==undefined){
        
      if(formData.form.payingAmount!==null && formData.form.payingAmount!==undefined && formData.form.payingAmount>0){
          
          const parent = await prisma.user.findUnique({
            where: {
              campusId : Number(formData.form.campusId),
              id:Number(formData.form.parentId)
            },
            include: {
              FamilyCredit:{
                include: {
                  transactions: true
                }
              }
            }
          });
        
          if(!parent){
            return res.json({ status: false,  data: null , message:'Parent information not found' });
          }
          
          
          if(parent!==null && parent.FamilyCredit!==null && parent.FamilyCredit!==undefined && parent.FamilyCredit.length>0){
            
            let existingCredit = parent.FamilyCredit[0].availableCredit;
            let newCredit = existingCredit + Number(formData.form.payingAmount);

            await prisma.familyCredit.update({
              where:{
                  id:parent.FamilyCredit[0].id,
                  campusId: parent.FamilyCredit[0].campusId,
              },
              data: {
                availableCredit: newCredit,
                updated_by: Number(formData.form.currentUserId),
                updated_at: new Date()
              },
            });

            await prisma.transactions.create({
              data: {
                campusId:formData.form.campusId,
                transactionType: TransactionType.Credit,
                source: TransactionSource.FamilyCreditAdded,
                userId:formData.form.parentId,
                amount:Number(formData.form.payingAmount),
                paymentType:PaymentType.Cash,
                familyCreditId: parent.FamilyCredit[0].id,
                created_by: Number(formData.form.currentUserId),
                created_at: new Date()
              },
            });

          }else{
            const familyCredit = await prisma.familyCredit.create({
              data: {
                userId:formData.form.parentId,
                campusId:formData.form.campusId,
                availableCredit: formData.form.payingAmount,
                created_by: Number(formData.form.currentUserId),
                created_at: new Date(),
                updated_by: Number(formData.form.currentUserId),
                updated_at: new Date()
              },
            });
            await prisma.transactions.create({
              data: {
                campusId:formData.form.campusId,
                transactionType: TransactionType.Credit,
                source: TransactionSource.FamilyCreditAdded,
                userId:formData.form.parentId,
                amount:Number(formData.form.payingAmount),
                paymentType:PaymentType.Cash,
                familyCreditId: familyCredit.id,
                created_by: Number(formData.form.currentUserId),
                created_at: new Date()
              },
            });


          }

          
          

          return res.json({ status: true,  data: null , message:'Family Credit received' });
    


        }else{
          return res.json({ status: false,  data: null , message:'Invalid credit amount' });
        }
        
      }else{
      return res.json({ status: false,  data: null , message:'Parent information not found' });
    }
  }

  public async getFamilyFeesDuesByParentId  (req: Request, res: Response) {

    const formData: any = req.body;
    console.log(formData)
    let availableStudents = [];
    let parentObjToPass = {};
    let totalDues = 0;
    try {
      
      let parents = await prisma.user.findUnique({
        where: {
          campusId : Number(formData.campusId),
          id: Number(formData.parentId),
          active: 1
        },
        include:{
          children: {
            include:{
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
      if(parents!==null && parents!==undefined && parents.children!==null && parents.children!==undefined && parents.children.length>0){
        
        for(let i=0;i<parents.children.length;i++){
          let child = parents.children[i].children;
          if(child!==null && child!==undefined){
            let invoices = child.MYAALInvoices;
            let invoicesToPass = [];
            let totalUnPaidAmount = 0;
            let childObjToPass = {};
            if(invoices!==null && invoices!==undefined && invoices.length>0){

              for(let j=0;i<invoices.length;j++){
                if(invoices[j]!==null && invoices[j]!==undefined && (invoices[j].feeStatus=== FeeStatus.Partial || invoices[j].feeStatus=== FeeStatus.Unpaid)){
                  let unpaidAmt = (Number(invoices[j].amount) - Number(invoices[j].paidAmount));  
                  console.log('Unpaid Invoice -->'+ invoices[j].invoiceNumber +' For amount '+unpaidAmt);
                  totalUnPaidAmount = totalUnPaidAmount + unpaidAmt;
                  invoicesToPass.push(invoices[j]);
                }
              }
            }
            childObjToPass['totalDues'] =  totalUnPaidAmount;
            childObjToPass['name'] =  child.displayName;
            childObjToPass['id'] =  child.id;
            childObjToPass['class'] =  child.class.className;
            childObjToPass['section'] =  child.section.sectionName;
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
      return res.json({ status: true,  data: parentObjToPass , message:'Total Family Fee Calculated' });
      
    } catch (error) {
      console.error(error);
  
      return res.json({ status: false,  data: null , message:'Some error occured. Try again later' });
    }
  }

}
