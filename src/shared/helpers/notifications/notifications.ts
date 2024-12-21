import { EmailTemplate, Institute, SMSTemplate, User } from "@prisma/client";
import { EmailNotificationJson, NotificationModel, SendToAndFrom } from "./notification.model";
import moment from "moment";
import { prisma } from "../../db-client";
import accountCreationTemplate from "../../../emails/account-creation";
const SibApiV3Sdk = require('@getbrevo/brevo');

export async function sendSms(name: string, model: NotificationModel, phoneNumber:string[]) {
    let template: SMSTemplate = await getSmsTemplateByName(name);
    let currentInstitute = await getInstituteDetails();
    //console.log('Print Model')
    //console.log(model)
    if(template!==null && template!==undefined){
        let messageBody: string = template.body;
        messageBody = evaluateVariables(messageBody, template.keywords ,model);
        
        
        if(currentInstitute!==null  && currentInstitute!==undefined && 
            currentInstitute.allowSMS!==null && currentInstitute.allowSMS!==undefined && currentInstitute.allowSMS===1
            && currentInstitute.SMSApiKey!==null && currentInstitute.SMSApiKey!==undefined && currentInstitute.SMSApiKey!==''){
    
                                   let tosAsString = '';
                                   phoneNumber.forEach((eachTo: string) =>{
                                    tosAsString = tosAsString + eachTo+ ";"
                                   });

                                   await prisma.sMSHistory.create({
                                        data: {
                                            campusId:model.campusId,
                                            active:1,
                                            smsTemplateId: template.id,
                                            name:name,
                                            tos:tosAsString,
                                            body:messageBody,
                                            created_by:model.loggedInUserId,
                                            created_at: new Date(),
                                        },
                                      });
        }
    }
}




function evaluateVariables(messageBody: string,keywords: string,  model : NotificationModel): string {
    
    if(messageBody.includes('$next_line')){ 
        messageBody = messageBody.replaceAll("$next_line","<br/>");
    }


    if(keywords!==null && keywords!==undefined){
        let eachKeyWord = keywords.split("|");
        if(eachKeyWord!==null && eachKeyWord!==undefined && eachKeyWord.length>0){
            eachKeyWord.forEach((key: string) =>{
                switch(key) { 
                    //General
                    case '$current_date': { 
                        let formattedDate = (moment(new Date())).format('DD-MMM-YYYY HH:mm')
                        messageBody = messageBody.replaceAll("$current_date",formattedDate);
                        break; 
                    }
                    


                    //Student
                    case '$student_name': { 
                        if(model!==null && model!==undefined && model.student_name!==null && model.student_name!==undefined){
                            messageBody = messageBody.replaceAll("$student_name",model.student_name);
                        } 
                        break; 
                    } 
                    case '$roll_no': { 
                        if(model!==null && model!==undefined && model.roll_no!==null && model.roll_no!==undefined){
                            messageBody = messageBody.replaceAll("$roll_no",model.roll_no);
                        } 
                        break; 
                    } 
                    case '$student_id_card': { 
                        if(model!==null && model!==undefined && model.student_id_card!==null && model.student_id_card!==undefined){
                            messageBody = messageBody.replaceAll("$student_id_card",model.student_id_card);
                        } 
                        break; 
                    } 

                    case '$class_name': { 
                        if(model!==null && model!==undefined && model.class_name!==null && model.class_name!==undefined){
                            messageBody = messageBody.replaceAll("$class_name",model.class_name);
                        } 
                        break; 
                    } 
                    case '$section_name': { 
                        if(model!==null && model!==undefined && model.section_name!==null && model.section_name!==undefined){
                            messageBody = messageBody.replaceAll("$section_name",model.section_name);
                        } 
                        break; 
                    } 

                    //Session & Institute
                    case '$session': { 
                        if(model!==null && model!==undefined && model.session!==null && model.session!==undefined){
                            messageBody = messageBody.replaceAll("$session",model.session);
                        } 
                        break; 
                    } 

                    case '$institute_name': { 
                        if(model!==null && model!==undefined && model.institute_name!==null && model.institute_name!==undefined){
                            messageBody = messageBody.replaceAll("$institute_name",model.institute_name);
                        } 
                        break; 
                    } 

                    case '$institute_campus': { 
                        if(model!==null && model!==undefined && model.institute_campus!==null && model.institute_campus!==undefined){
                            messageBody = messageBody.replaceAll("$institute_campus",model.institute_campus);
                        } 
                        break; 
                    } 
                    //Parent
                    case '$parent_1': { 
                        if(model!==null && model!==undefined && model.parent_1!==null && model.parent_1!==undefined){
                            messageBody = messageBody.replaceAll("$parent_1",model.parent_1);
                        } 
                        break; 
                    } 
                    case '$parent_1_phone': { 
                        if(model!==null && model!==undefined && model.parent_1_phone!==null && model.parent_1_phone!==undefined){
                            messageBody = messageBody.replaceAll("$parent_1_phone",model.parent_1_phone);
                        } 
                        break; 
                    } 
                    case '$parent_2': { 
                        if(model!==null && model!==undefined && model.parent_2!==null && model.parent_2!==undefined){
                            messageBody = messageBody.replaceAll("$parent_2",model.parent_2);
                        } 
                        break; 
                    } 
                    case '$parent_2_phone': { 
                        if(model!==null && model!==undefined && model.parent_2_phone!==null && model.parent_2_phone!==undefined){
                            messageBody = messageBody.replaceAll("$parent_2_phone",model.parent_2_phone);
                        } 
                        break; 
                    } 
                    case '$admission_status': { 
                        if(model!==null && model!==undefined && model.admission_status!==null && model.admission_status!==undefined){
                            messageBody = messageBody.replaceAll("$admission_status",model.admission_status);
                        } 
                        break; 
                    } 

                    case '$extra_content': { 
                        if(model!==null && model!==undefined && model.extra_content!==null && model.extra_content!==undefined){
                            messageBody = messageBody.replaceAll("$extra_content",model.extra_content);
                        } 
                        break; 
                    } 
                    //diary
                    case '$diary': { 
                        if(model!==null && model!==undefined && model.diary!==null && model.diary!==undefined){
                            messageBody = messageBody.replaceAll("$diary",model.diary);
                        } 
                        break; 
                    } 

                    //Exam
                    case '$exam_name': { 
                        if(model!==null && model!==undefined && model.exam_name!==null && model.exam_name!==undefined){
                            messageBody = messageBody.replaceAll("$exam_name",model.exam_name);
                        } 
                        break; 
                    } 
                    case '$exam_percentage': { 
                        if(model!==null && model!==undefined && model.exam_percentage!==null && model.exam_percentage!==undefined){
                            messageBody = messageBody.replaceAll("$exam_percentage",model.exam_percentage);
                        } 
                        break; 
                    } 
                    //Attendance
                    case '$user_name': { 
                        if(model!==null && model!==undefined && model.user_name!==null && model.user_name!==undefined){
                            messageBody = messageBody.replaceAll("$user_name",model.user_name);
                        } 
                        break; 
                    }
                    case '$selected_day': { 
                        if(model!==null && model!==undefined && model.selected_day!==null && model.selected_day!==undefined){
                            messageBody = messageBody.replaceAll("$selected_day",model.selected_day);
                        } 
                        break; 
                    }

                    //Fees
                    case '$reminder_number': { 
                        if(model!==null && model!==undefined && model.reminder_number!==null && model.reminder_number!==undefined){
                            messageBody = messageBody.replaceAll("$reminder_number",model.reminder_number);
                        } 
                        break; 
                    } 
                    case '$student_fee': { 
                        if(model!==null && model!==undefined && model.student_fee!==null && model.student_fee!==undefined){
                            messageBody = messageBody.replaceAll("$student_fee",model.student_fee);
                        } 
                        break; 
                    } 
                    case '$student_amount_paid': { 
                        if(model!==null && model!==undefined && model.student_amount_paid!==null && model.student_amount_paid!==undefined){
                            messageBody = messageBody.replaceAll("$student_amount_paid",model.student_amount_paid);
                        } 
                        break; 
                    } 
                    case '$student_discount': { 
                        if(model!==null && model!==undefined && model.student_discount!==null && model.student_discount!==undefined){
                            messageBody = messageBody.replaceAll("$student_discount",model.student_discount);
                        } 
                        break; 
                    } 
                    case '$student_late_fees': { 
                        if(model!==null && model!==undefined && model.student_late_fees!==null && model.student_late_fees!==undefined){
                            messageBody = messageBody.replaceAll("$student_late_fees",model.student_late_fees);
                        } 
                        break; 
                    } 
                    case '$student_fee_received_by': { 
                        if(model!==null && model!==undefined && model.student_fee_received_by!==null && model.student_fee_received_by!==undefined){
                            messageBody = messageBody.replaceAll("$student_fee_received_by",model.student_fee_received_by);
                        } 
                        break; 
                    } 

                    //Student Leave
                    case '$student_leave_start': { 
                        if(model!==null && model!==undefined && model.student_leave_start!==null && model.student_leave_start!==undefined){
                            messageBody = messageBody.replaceAll("$student_leave_start",model.student_leave_start);
                        } 
                        break; 
                    }
                    
                    case '$student_leave_end': { 
                        if(model!==null && model!==undefined && model.student_leave_end!==null && model.student_leave_end!==undefined){
                            messageBody = messageBody.replaceAll("$student_leave_end",model.student_leave_end);
                        } 
                        break; 
                    }

                    case '$student_leave_status': { 
                        if(model!==null && model!==undefined && model.student_leave_status!==null && model.student_leave_status!==undefined){
                            messageBody = messageBody.replaceAll("$student_leave_status",model.student_leave_status);
                        } 
                        break; 
                    }

                    case '$student_leave_approved_by': { 
                        if(model!==null && model!==undefined && model.student_leave_approved_by!==null && model.student_leave_approved_by!==undefined){
                            messageBody = messageBody.replaceAll("$student_leave_approved_by",model.student_leave_approved_by);
                        } 
                        break; 
                    }
                    //Staff

                    case '$staff_name': { 
                        if(model!==null && model!==undefined && model.staff_name!==null && model.staff_name!==undefined){
                            messageBody = messageBody.replaceAll("$staff_name",model.staff_name);
                        } 
                        break; 
                    }

                    case '$staff_designation': { 
                        if(model!==null && model!==undefined && model.staff_designation!==null && model.staff_designation!==undefined){
                            messageBody = messageBody.replaceAll("$staff_designation",model.staff_designation);
                        } 
                        break; 
                    }

                    case '$salary_month': { 
                        if(model!==null && model!==undefined && model.salary_month!==null && model.salary_month!==undefined){
                            messageBody = messageBody.replaceAll("$salary_month",model.salary_month);
                        } 
                        break; 
                    }

                    case '$staff_payment_total': { 
                        if(model!==null && model!==undefined && model.staff_payment_total!==null && model.staff_payment_total!==undefined){
                            messageBody = messageBody.replaceAll("$staff_payment_total",model.staff_payment_total);
                        } 
                        break; 
                    }

                    case '$staff_present_days': { 
                        if(model!==null && model!==undefined && model.staff_present_days!==null && model.staff_present_days!==undefined){
                            messageBody = messageBody.replaceAll("$staff_present_days",model.staff_present_days);
                        } 
                        break; 
                    }
                    case '$staff_absent_days': { 
                        if(model!==null && model!==undefined && model.staff_absent_days!==null && model.staff_absent_days!==undefined){
                            messageBody = messageBody.replaceAll("$staff_absent_days",model.staff_absent_days);
                        } 
                        break; 
                    }
                 } 

            });
        }
    }
    


    

    return messageBody;
}

async function getInstituteDetails(): Promise<Institute> {
    let institutes = await prisma.institute.findMany();
    if(institutes!==null && institutes!==undefined && institutes.length>0){
        return institutes[0];
    }else{
        return null;
    }
}

async function getSmsTemplateByName(name: string): Promise<SMSTemplate> {
    let smsTemplate = await prisma.sMSTemplate.findMany({
        where: {
          name: name,
          active: 1
        },
      });
    
    if(smsTemplate!==null && smsTemplate!==undefined && smsTemplate.length>0){
        return smsTemplate[0];
    }else{
        return null;
    }
}

export async function getEmailTemplateByName(name: string): Promise<EmailTemplate> {
    let emailTemplate = await prisma.emailTemplate.findMany({
        where: {
          name: name,
          active: 1
        },
      });
    
    if(emailTemplate!==null && emailTemplate!==undefined && emailTemplate.length>0){
        return emailTemplate[0];
    }else{
        return null;
    }
}

export async function sendEmail(name: string, model: NotificationModel,  tos: SendToAndFrom[]) {
    let template: EmailTemplate = await getEmailTemplateByName(name);
    let currentInstitute = await getInstituteDetails();

    if(template!==null && template!==undefined){
        let messageBody: string = template.body;
        let subject: string = template.subject;
        messageBody = evaluateVariables(messageBody, template.keywords ,model);
        subject = evaluateVariables(subject, template.keywords ,model);
        //send email common function
        sendEmailCommon(currentInstitute, subject, messageBody, tos, name, model.campusId, template.id, model.loggedInUserId);
    }
}


export async function sendAccountCreationEmail(currentInstitute: Institute,  
                        campusId: number, 
                        user:any,  
                        currentUserid: number,
                        userName: string, password:string) {

    if (currentInstitute !== null && currentInstitute !== undefined && 
            currentInstitute.allowEmail !== null && currentInstitute.allowEmail !== undefined && currentInstitute.allowEmail === 1
                && currentInstitute.emailApiKey !== null && currentInstitute.emailApiKey !== undefined && currentInstitute.emailApiKey !== '') {
        console.log('Print User details before sending Account Creation email');
        console.log(user);
        try{  
            let template: EmailTemplate = await getEmailTemplateByName('Profile Created');
            let appUrl = process.env.WEB_APP_URL;
            let appName = process.env.APP_NAME;
            let templateHtml = accountCreationTemplate;
            const randomNum = Math.random() * 9000
            let otp= Math.floor(1000 + randomNum);

            templateHtml  =templateHtml.replaceAll("$USERNAME", user.displayName);
            templateHtml  =templateHtml.replaceAll("$SCHOOLNAME", currentInstitute.instituteName);
            templateHtml  =templateHtml.replaceAll("$SCHOOLLOGO", currentInstitute.logo);
            templateHtml  =templateHtml.replaceAll("$SCHOOLADDRESS", currentInstitute.address);
            templateHtml  =templateHtml.replaceAll("$SCHOOLPHONE", currentInstitute.phone);
            templateHtml  =templateHtml.replaceAll("$APP_URL", appUrl);
            templateHtml  =templateHtml.replaceAll("$IDCARDNO", userName);
            templateHtml  =templateHtml.replaceAll("$PASSWORD", password);
            templateHtml  =templateHtml.replaceAll("$CODE", otp+'');
            templateHtml  =templateHtml.replaceAll("$APP_NAME", appName);
            sendEmailCommon(currentInstitute,
                'Profile Created for  '+user.displayName,
                templateHtml,
                [{ email: user.email, name: user.name, }],
                template.name , campusId, 
                template.id, 
                currentUserid
             );
             changeAccountResetStatus(user,campusId,  otp+'', true);

        } catch (error) {
            console.error(error);   
        }
    }
}

export async function changeAccountResetStatus(user:any, campusId:number, otp:string, doBlock: boolean) {
    if(doBlock){
        await prisma.user.update({
            where: {
              id: user.id,
              campusId:campusId
            },
            data: {
                resetPasswordFlag: 1,
                resetPasswordCode: otp
            },
          });
    }else{
        await prisma.user.update({
            where: {
              id: user.id,
              campusId:campusId
            },
            data: {
                resetPasswordFlag: 0,
                resetPasswordCode: null
            },
          });
    }
    
}


export function sendEmailCommon(currentInstitute: Institute, 
                                subject: string, 
                                messageBody: string, 
                                tos: SendToAndFrom[], 
                                templateName: string, 
                                campusId: number, 
                                templateId: number,
                                currentUserid: number) {
  
  if (currentInstitute !== null && currentInstitute !== undefined &&
        currentInstitute.allowEmail !== null && currentInstitute.allowEmail !== undefined && currentInstitute.allowEmail === 1
        && currentInstitute.emailApiKey !== null && currentInstitute.emailApiKey !== undefined && currentInstitute.emailApiKey !== '') {

        try{   
                    let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

                    let apiKey = apiInstance.authentications['apiKey'];
                    apiKey.apiKey = currentInstitute.emailApiKey;
                    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

                    sendSmtpEmail.subject = subject;
                    sendSmtpEmail.htmlContent = messageBody;
                    sendSmtpEmail.sender = {
                        name: currentInstitute.emailFromName,
                        email: currentInstitute.emailFromId,
                    };
                    console.log(apiKey)
                    //change this later on //TO DO
                    //REMOVE THE BELOW CODE AND REPLACE WITH NEXT LINE
                    //sendSmtpEmail.to = tos;
                    if(tos!==null && tos.length>0){
                        let dummytos= [];
                        for(let i = 0;i<tos.length;i++){
                            dummytos.push({name:tos[i].name,email: 'arindammitra06@gmail.com' })
                        }
                        sendSmtpEmail.to = dummytos;
                    }
                    //END change this later on //TO DO


                    apiInstance.sendTransacEmail(sendSmtpEmail).then(async function (data) {

                        //console.log('API called successfully. Returned data: ' + JSON.stringify(data));
                        let tosAsString = '';
                        tos.forEach((eachTo: SendToAndFrom) => {
                            tosAsString = tosAsString + eachTo.email + ";";
                        });
                        console.log('Sent email to :- ' + tosAsString);
                        
                        await prisma.emailHistory.create({
                            data: {
                                campusId: campusId,
                                active: 1,
                                emailTemplateId: templateId,
                                name: templateName,
                                tos: tosAsString,
                                subject: subject,
                                body: messageBody,
                                created_by:currentUserid,
                                created_at: new Date(),
                            },
                        });

                    }, function (error) {
                        console.error(error);
                    });

        } catch (error) {
             console.error(error);   
        }

    }
}


