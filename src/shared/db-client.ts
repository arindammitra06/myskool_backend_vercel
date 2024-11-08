import { PrismaClient } from "@prisma/client";
import moment from "moment";
import { monthsString } from "./helpers/utils/generic.utils";

export const prisma = new PrismaClient().$extends({
    result: {
      admissionRequestOrInquiries: {
        rowKey: {
          needs: { id: true },
          compute(adRq) {
            return adRq.id;  
          },
        },
      },
      mYAALInvoices: {
        paidOnProcessed: {
          needs: { paidOn: true },
          compute(inv) {
            return inv.paidOn!==null && inv.paidOn!==undefined ? moment.utc(inv.paidOn).format('DD-MM-YYYY') :'Not Paid';  
          },
        },
        yearAsString: {
          needs: { year: true },
          compute(inv) {
            return inv.year+'';  
          },
        },
        monthAsString: {
          needs: { month: true },
          compute(inv) {
            return monthsString[inv.month]+'';  
          },
        },
      },
      paySlip: {
        yearAsString: {
          needs: { year: true },
          compute(inv) {
            return inv.year+'';  
          },
        },
        monthAsString: {
          needs: { month: true },
          compute(inv) {
            return monthsString[inv.month]+'';  
          },
        },
      },
      user: {
        active_processed: {
          needs: { active: true },
          compute(user) {
            return user.active===1 ?'Yes': 'No';  
          },
        },
        rollNoProcessed: {
            needs: { rollNumber: true },
            compute(user) {
              return user.rollNumber+'';  
            },
          },
        dateOfBirthProcessed: {
          needs: { dateOfBirth: true },
          compute(user) {
            return moment.utc(user.dateOfBirth).format('DD-MM-YYYY');  
          },
        },
        
        admissionDateProcessed: {
          needs: { admissionDate: true },
          compute(user) {
            return moment.utc(user.admissionDate).format('DD-MM-YYYY');  
          },
        },

        joiningDateProcessed: {
          needs: { joiningDate: true },
          compute(user) {
            return moment.utc(user.joiningDate).format('DD-MM-YYYY');  
          },
        },
        created_at_processed: {
          needs: { created_at: true },
          compute(user) {//moment(new Date()).format('DD-MM-YYYY')
            return new Date(moment(user.created_at).format("DD-MM-YYYY HH:mm:ss"));  
          },
        },
        updated_at_processed: {
          needs: { updated_at: true },
          compute(user) {
            return new Date(moment(user.updated_at).format("DD-MM-YYYY HH:mm:ss"));  
          },
        },
        
      },
      permission: {
        isReadonly_processed: {
          needs: { isReadonly: true },
          compute(perm) {
            return perm.isReadonly===1 ?'Yes': 'No';  
          },
        },
      },
      holidays: {
        holidayStart_proccessed: {
          needs: { holidayStart: true },
          compute(user) {
            return moment(user.holidayStart).format('DD-MM-YYYY HH:mm');  
          },
        },
        holidayEnd_proccessed: {
          needs: { holidayEnd: true },
          compute(user) {
            return moment(user.holidayEnd).format('DD-MM-YYYY HH:mm');  
          },
        },
      },
      class: {
        // teacher: {
        //     needs: { teacherId: true },
        //     async compute(tchrId) {
              
        //       if(tchrId!==null && tchrId!==null && (tchrId.teacherId!==null || tchrId.teacherId<=0)){
        //         const user = await prisma.user.findUnique({
        //           where: {
        //             id: Number(tchrId.teacherId),
        //           },
        //         });
        //         return user;
        //       }
              
        //       return null;  
        //     },
        // },
        
        created_at_processed: {
          needs: { created_at: true },
          compute(tchr) {
            return new Date(moment(tchr.created_at).format("DD-MM-YYYY HH:mm:ss"));  
          },
        },
        updated_at_processed: {
          needs: { updated_at: true },
          compute(tchr) {
            return new Date(moment(tchr.updated_at).format("DD-MM-YYYY HH:mm:ss"));  
          },
        },
      },
      sMSHistory:{
        created_at_processed: {
          needs: { created_at: true },
          compute(data) {
            return moment.utc(data.created_at).format('DD-MM-YYYY');  
          },
        },
      },
      emailHistory:{
        created_at_processed: {
          needs: { created_at: true },
          compute(data) {
            return moment.utc(data.created_at).format('DD-MM-YYYY');  
          },
        },
      },
      dailyHomework:{
        homeworkDateProcessed: {
          needs: { homeworkDate: true },
          compute(data) {
            return moment.utc(data.homeworkDate).format('DD-MM-YYYY');  
          },
        },
      },
      attendance:{
        attendanceDateProcessed: {
          needs: { attendanceDate: true },
          compute(data) {
            return moment.utc(data.attendanceDate).format('DD-MM-YYYY');  
          },
        },
      }
    },
  });