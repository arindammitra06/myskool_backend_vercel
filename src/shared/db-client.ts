import { PrismaClient } from "@prisma/client";
import moment from "moment";

export const prisma = new PrismaClient().$extends({
    result: {

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
        created_at_processed: {
          needs: { created_at: true },
          compute(user) {
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
    },
  });