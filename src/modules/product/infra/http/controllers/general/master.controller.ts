import { Request, Response } from "express";
import { prisma } from "../../../../../../shared/db-client";
import { EmailTemplate, MessageType, TimeTable, UserType } from "@prisma/client";
import jwt from 'jsonwebtoken';
import {  getCurrencySymbol, processTimeTableJsonData } from "../../../../../../shared/helpers/utils/generic.utils";
import moment from "moment";
import { changeAccountResetStatus, getEmailTemplateByName, sendEmailCommon } from "../../../../../../shared/helpers/notifications/notifications";
import resetPasswordTemplate from "../../../../../../emails/reset-password";
import {v4 as uuidv4} from 'uuid';
const fs = require('fs');

export class MasterController {

//Get All Sesssions as SelectItem

public async getAllSessions  (req: Request, res: Response)  {
  const sessions = await prisma.sessions.findMany({
  });
  let sessionSelectItems = [];
    
  if(sessions!==null && sessions!==undefined && sessions.length>0){
    sessions.forEach(async (element) => {
      sessionSelectItems.push({label:element.session, value:element.id})
    });
  }
  return res.json({ status: true,  data: sessionSelectItems , message:'' });
}

//ID Card Images Folder

public async addImagesByType  (req: Request, res: Response)  {
    const settings: any = req.body;
    console.log(settings);
    try {  
      if(settings!==null && settings!==undefined && Array.isArray(settings)){
        settings.forEach(async (element) => {
            if(element!==null && element!==undefined && element.id!==null && element.id!==undefined){
              await prisma.defaultImageSetting.update({
                where: {
                  id: element.id,
                },
                data: {
                  campusId:element.campusId,
                  id:element.id,
                  front:element.front,
                  back:element.back,
                  type:element.type,
                  forUser:element.forUser,
                  updated_by:element.updated_by,
                  updated_at: new Date()
                },
              });
               
            }else{
              
              await prisma.defaultImageSetting.create({
              data: {
                campusId:element.campusId,
                front:element.front,
                back:element.back,
                type:element.type,
                forUser:element.forUser,
                created_by:element.created_by,
                updated_by:element.updated_by
              },
            });
              
            }
        });
          
      }
      return res.json({ data: null, status: true, message: 'Settings saved' });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message ,  status: true, data: null})
    }
}


public async getImagesByType  (req: Request, res: Response)  {
  const campusId = Number(req.params.campusId);
  const type = String(req.params.type);
  console.log(type);
  let settings = await prisma.defaultImageSetting.findMany({
    where: {
      campusId : Number(campusId),
      type: type,
    },
    include: {
      campus : true,

    },
  });

  
  return res.json({ status: true,  data: settings , message:'Settings fetched' });
}

//Online Meetings

public async getOnlineMeetings  (req: Request, res: Response)  {
  const campusId = Number(req.params.campusId);
  console.log(campusId+' campusId--- '+ campusId);
  
  let meeting = await prisma.onlineClasses.findMany({
    where: {
      campusId : Number(campusId),
      active: 1,
    },
    include: {
      campus : true,
      class:true,
      section:true
    },
  });

  
  return res.json({ status: true,  data: meeting , message:'Meetings fetched' });
}


public async saveOnlineMeeting  (req: Request, res: Response)  {
  const data: any = req.body;
  console.log(data);
  try {  
    const savedClass = await prisma.onlineClasses.create({
      data: data.form,
    });
    return res.json({ data: savedClass, status: true, message: 'Online Class saved' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message ,  status: true, data: null})
  }
}


public async generateOnlineToken  (req: Request, res: Response)  {
  const tokenData: any = req.body;
  
  if (!tokenData) {
    return res.status(400).json({ status: false,  data: null , message: 'Token data is required' });
  }

  const now = new Date()
  

  var privateKey = fs.readFileSync(process.env.JITSU_PRIVATE_KEY_PATH);
  
  const jwtToken = jwt.sign({
    aud: 'jitsi',
    context: {
      user: {
        id:tokenData.context.user.id,
        name:tokenData.context.user.name,
        avatar:tokenData.context.user.avatar,
        email: tokenData.context.user.email,
        moderator: tokenData.context.user.moderator,
      },
      features: {
        livestreaming: 'true',
        recording: 'true',
        transcription: 'true',
        "outbound-call": 'true'
      }
    },
    iss: 'chat',
    room: tokenData.context.room,
    sub: process.env.JITSU_APP_ID,
    exp: "2hr",
    nbf: (Math.round((new Date).getTime() / 1000) - 10)
  }, privateKey, { algorithm: 'RS256', header: { kid: process.env.JITSU_API_KEY } })


  console.log(jwtToken);


  return res.json({ status: true,  data: jwtToken , message:'' });
}

//List of Values


public async getLOVByUniqueKey  (req: Request, res: Response)  {
  const campusId = Number(req.params.campusId);
  const uniqueKey = String(req.params.uniqueKey);
  console.log(uniqueKey);
  let lov = await prisma.listOfValues.findUnique({
    where: {
      campusId : Number(campusId),
      uniqueKey: uniqueKey,
      active: 1
    },
  });
  return res.json({ status: true,  data: lov , message:'' });
}


public async getLOVByGroupName  (req: Request, res: Response)  {
  const campusId = Number(req.params.campusId);
  const groupName = String(req.params.groupName);
  console.log(groupName);
  
  let lovs = await prisma.listOfValues.findMany({
    where: {
      campusId : Number(campusId),
      groupName: groupName,
      active: 1
    },
  });
  return res.json({ status: true,  data: lovs , message:'' });
}


public async createOrUpdateLovs  (req: Request, res: Response)  {
  const lovs: any = req.body;
  console.log(lovs);
  try {  
    if(lovs!==null && lovs!==undefined && Array.isArray(lovs)){
      
      lovs.forEach(async (element) => {
          if(element!==null && element!==undefined && element.id!==null && element.id!==undefined){
            
            await prisma.listOfValues.update({
              where: {
                id: element.id,
              },
              data: {
                campusId:element.campusId,
                id:element.id,
                groupName:element.groupName,
                uniqueKey:element.uniqueKey,
                shortName:element.shortName,
                longName:element.longName,
                description:element.desc,
                active:element.active,
                updated_by:element.updated_by,
                updated_at: new Date()
              },
            });
             
          }else{
            
            await prisma.listOfValues.create({
            data: {
                campusId:element.campusId,
                groupName:element.groupName,
                uniqueKey:element.uniqueKey,
                shortName:element.shortName,
                longName:element.longName,
                description:element.desc,
                active:element.active,
                updated_by:element.updated_by,
                updated_at: new Date(),
                created_by:element.created_by,
                created_at: new Date(),
            },
          });
            
          }
      });
        
    }
    return res.json({ data: null, status: true, message: 'Saved' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message ,  status: true, data: null})
  }
}

//Timetable
public async getTimeTable  (req: Request, res: Response)  {
  const campusId = Number(req.params.campusId);
  const classId = Number(req.params.classId);
  const sectionId = Number(req.params.sectionId);
  let data = [];

  //get Recurring timetable
  let timtables = await prisma.timeTable.findMany({
    where: {
      campusId : Number(campusId),
      classId : Number(classId),
      sectionId : Number(sectionId),
      active: 1,
      isRecurring: 1
    },
    include: {
      campus : true,
      class:true,
      section:true,
    },
  });
  
  if(timtables!==null && timtables!==undefined && timtables.length>0){
       
        timtables.forEach(async (eachItem) => {
          data.push({
                  title: eachItem.subject,
                  description: eachItem.id,
                  duration: eachItem.duration,
                  backgroundColor: eachItem.bgcolor,
                  textColor: 'white',
                  isRecurring: true,
                  rrule: {
                    freq: 'weekly',
                    interval: 1,
                    byweekday: [eachItem.day],
                    dtstart: moment(new Date())
                      .add(-2, "w")
                      .format("YYYY-MM-DD")
                      .concat("T"+eachItem.startTime),
                    until: moment(new Date()).add(12, "M").format("YYYY-MM-DD")
                  }
          });
        });
       
   }
 //END get Recurring timetable
 
 let adhoc = await prisma.timeTable.findMany({
  where: {
    campusId : Number(campusId),
    classId : Number(classId),
    sectionId : Number(sectionId),
    active: 1,
    isRecurring: 0,
  },
});
if(adhoc!==null && adhoc!==undefined && adhoc.length>0){
       
  adhoc.forEach(async (eachItem) => {
    data.push({
            title: eachItem.subject,
            description: eachItem.id,
            duration: eachItem.duration,
            backgroundColor: eachItem.bgcolor,
            textColor: 'white',
            start: eachItem.start,
            end: eachItem.end,
            isRecurring:false
    });
  });
 
}
  
  return res.json({ status: true,  data: data , message:'Calendar fetched' });
}




public async saveTimeTable  (req: Request, res: Response)  {
  const timetable: any = req.body;
  console.log(timetable);
  

  try {  
    if(timetable!==null && timetable!==undefined && timetable.form!==null && timetable.form !==undefined &&
      timetable.events!==null && timetable.events !==undefined && Array.isArray(timetable.events) && timetable.events.length>0){
        console.log('Events Present');
        
        timetable.events.forEach(async (event) => {
          if(event!==null && event!==undefined ){
            console.log('Parsing event :---' +event.subjectValue);
            console.log(moment("2019-01-19 "+event.startTime, 'YYYY-MM-DD HH:mm'));
            console.log(moment("2019-01-19 "+event.endTime, 'YYYY-MM-DD HH:mm'))
            
            var duration = moment.duration(
                              moment("2019-01-19 "+event.endTime, 'YYYY-MM-DD HH:mm').diff(moment("2019-01-19 "+event.startTime, 'YYYY-MM-DD HH:mm')));
            
            const formatted = moment.utc(duration.asMilliseconds()).format('HH:mm');
            console.log('Formatted Time Duration:-'+formatted);
            
            await prisma.timeTable.create({
              data: {
                classId:timetable.form.classId,
                sectionId:timetable.form.sectionId,
                campusId:timetable.form.campusId,
                subject:event.subjectValue,
                active:1,
                day:timetable.form.day,
                startTime: event.startTime,
                endTime: event.endTime,
                duration: formatted,
                isRecurring: 1,
                bgcolor: event.color,
                color: event.color,
                created_by:timetable.form.created_by,
                created_at: new Date(),
                updated_by:timetable.form.updated_by,
                updated_at: new Date()
              },
            });
            console.log('Saved Event :---' +event.endTime);
          }
      });
        
    }
    return res.json({ data: null, status: true, message: 'Event added' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message ,  status: true, data: null})
  }
}


public async saveAdhocTimeTable  (req: Request, res: Response)  {
  const timetable: any = req.body;
  console.log(timetable.form.startDate);
  console.log(timetable.form.endDate);
  try {  
    if(timetable!==null && timetable!==undefined && timetable.form!==null && timetable.form !==undefined){
      await prisma.timeTable.create({
        data: {
          classId:timetable.form.classId,
          sectionId:timetable.form.sectionId,
          campusId:timetable.form.campusId,
          subject:timetable.form.event,
          active:1,
          day:'',
          duration: '',
          startTime:'',
          endTime:'',
          start: timetable.form.startDate,
          end: timetable.form.endDate,
          isRecurring: 0,
          bgcolor: timetable.form.color,
          color: timetable.form.color,
          created_by:timetable.form.created_by,
          created_at: new Date(),
          updated_by:timetable.form.updated_by,
          updated_at: new Date()
        },
      });

      if(timetable.form.addToLeave==='1'){
        await prisma.holidays.create({
          data: {
            classId:timetable.form.classId,
            sectionId:timetable.form.sectionId,
            campusId:timetable.form.campusId,
            name:timetable.form.event,
            active:1,
            holidayStart: timetable.form.startDate,
            holidayEnd: timetable.form.endDate,
            created_by:timetable.form.created_by,
            created_at: new Date(),
            updated_by:timetable.form.updated_by,
            updated_at: new Date()
          },
        });
      }
        
    }
    return res.json({ data: null, status: true, message: 'Event added' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message ,  status: true, data: null})
  }
}


public async saveHoliday  (req: Request, res: Response)  {
  const timetable: any = req.body;
  console.log(timetable);
  try {  
    if(timetable!==null && timetable!==undefined && timetable.form!==null && timetable.form !==undefined){
      await prisma.timeTable.create({
        data: {
          classId:timetable.form.classId,
          sectionId:timetable.form.sectionId,
          campusId:timetable.form.campusId,
          subject:timetable.form.event,
          active:1,
          day:'',
          duration: '',
          startTime:'',
          endTime:'',
          start: timetable.form.startDate,
          end: timetable.form.endDate,
          isRecurring: 0,
          bgcolor: timetable.form.color,
          color: timetable.form.color,
          created_by:timetable.form.created_by,
          created_at: new Date(),
          updated_by:timetable.form.updated_by,
          updated_at: new Date()
        },
      });

      await prisma.holidays.create({
        data: {
          classId:timetable.form.classId,
          sectionId:timetable.form.sectionId,
          campusId:timetable.form.campusId,
          name:timetable.form.event,
          active:1,
          holidayStart: timetable.form.startDate,
          holidayEnd: timetable.form.endDate,
          created_by:timetable.form.created_by,
          created_at: new Date(),
          updated_by:timetable.form.updated_by,
          updated_at: new Date()
        },
      });
        
    }
    return res.json({ data: null, status: true, message: 'Event added' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message ,  status: true, data: null})
  }
}


public async deleteTimeTableEvent  (req: Request, res: Response)  {
  const campusId = Number(req.params.campusId);
  const id = Number(req.params.id);
  console.log(id);
  
  let lovs = await prisma.timeTable.delete({
    where: {
      campusId : Number(campusId),
      id: id,
    },
  });
  return res.json({ status: true,  data: null , message:'Refresh page to see change' });
}


public async getAllHolidays  (req: Request, res: Response)  {
  const campusId = Number(req.params.campusId);
  const classId = req.params.classId;
  const sectionId = req.params.sectionId;
  let holidays = [];

  if(classId!==null && sectionId!==null && classId!=='null' && sectionId!=='null'){
  console.log(' campusId--- '+ campusId+', classId--- '+ classId+', sectionId--- '+ sectionId);
  holidays = await prisma.holidays.findMany({
    where: {
      campusId : Number(campusId),
      classId : Number(classId),
      sectionId : Number(sectionId),
      active: 1,
    },
    include: {
      campus : true,
      class:true,
      section:true,
    },
  });
  }else{
    console.log('ALL VALUES NULL campusId--- '+ campusId+', classId--- '+ classId+', sectionId--- '+ sectionId);
    holidays = await prisma.holidays.findMany({
      where: {
        campusId : Number(campusId),
        active: 1,
      },
      include: {
        campus : true,
        class:true,
        section:true,
      },
    });
  }

  
  
  return res.json({ status: true,  data: holidays , message:'' });
}

public async deleteHoliday  (req: Request, res: Response)  {
  const campusId = Number(req.params.campusId);
  const id = Number(req.params.id);
  const userId = Number(req.params.currentUserId);
  console.log(id);
  
  await prisma.holidays.update({
    where: {
      id: id,
      campusId:campusId
    },
    data:{
      active: 0,
      updated_by: userId,
      updated_at: new Date()
    }
  });
  return res.json({ status: true,  data: null , message:'Refresh page to see change' });
}

public async getAllSMSTemplates  (req: Request, res: Response)  {
  const campusId = Number(req.params.campusId);

  const smsTemplates = await prisma.sMSTemplate.findMany({
    where: {
      campusId:campusId
    },
  });
  return res.json({ status: true,  data: smsTemplates , message:'Templates retrieved' });
}

public async saveSmsTemplates  (req: Request, res: Response)  {
  const smsTemplates: any = req.body;
  try {  
    if(smsTemplates!==null && smsTemplates!==undefined && smsTemplates.smsTemplates!==null && smsTemplates.smsTemplates !==undefined){
      
      smsTemplates.smsTemplates.forEach(async (element) => {
        await prisma.sMSTemplate.update({
          where: {
            id: element.id,
            campusId: element.campusId
          },
          data: {
            body:element.body,
            updated_by:element.updated_by,
            updated_at: new Date()
          },
        });
      }); 
    }
    return res.json({ data: null, status: true, message: 'SMS Templates updated' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message ,  status: true, data: null})
  }
}

public async getSmsTemplateByName  (name:string)  {
  let smsTemplate = await prisma.sMSTemplate.findMany({
    where: {
      name: name,
      active: 1
    },
  });
  return smsTemplate;
}

public async getAllEmailTemplates  (req: Request, res: Response)  {
  const campusId = Number(req.params.campusId);

  const emailTemplate = await prisma.emailTemplate.findMany({
    where: {
      campusId:campusId
    },
  });
  return res.json({ status: true,  data: emailTemplate , message:'Templates retrieved' });
}


public async saveEmailTemplates  (req: Request, res: Response)  {
  const emailTemplates: any = req.body;
  try {  
    if(emailTemplates!==null && emailTemplates!==undefined && emailTemplates.emailtemplates!==null && emailTemplates.emailtemplates !==undefined){
      
     
      emailTemplates.emailtemplates.forEach(async (element:EmailTemplate) => {
        
        if(element.isEditable){
          await prisma.emailTemplate.update({
            where: {
              id: element.id,
              campusId: element.campusId
            },
            data: {
              body:element.body,
              subject: element.subject,
              updated_by:element.updated_by,
              updated_at: new Date()
            },
          });
        }
      }); 
    }
    return res.json({ data: null, status: true, message: 'Email Templates updated' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message ,  status: true, data: null})
  }
}

public async getEmailHistory  (req: Request, res: Response)  {
  const formvalues: any = req.body;
  console.log(formvalues)
  let history =[];
  try {  
    if(formvalues!==null && formvalues!==undefined ){
      
      history = await prisma.emailHistory.findMany({
        where: {
          campusId : Number(formvalues.form.campusId),
          created_at:{
            gte: moment(formvalues.form.startDate, 'DD-MM-YYYY').toDate(),
            lte: moment(formvalues.form.endDate, 'DD-MM-YYYY').toDate(),
          }
        },
      });
    }
    return res.json({ data: history, status: true, message: 'History fetched' });

  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message ,  status: true, data: null})
  }
}

public async getSmsHistory  (req: Request, res: Response)  {
  const formvalues: any = req.body;
  console.log(formvalues)
  let history =[];
  try {  
    if(formvalues!==null && formvalues!==undefined ){
      
      history = await prisma.sMSHistory.findMany({
        where: {
          campusId : Number(formvalues.form.campusId),
          created_at:{
            gte: moment(formvalues.form.startDate, 'DD-MM-YYYY').toDate(),
            lte: moment(formvalues.form.endDate, 'DD-MM-YYYY').toDate(),
          }
        },
      });
    }
    return res.json({ data: history, status: true, message: 'History fetched' });
  
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message ,  status: true, data: null})
  }
}

//Notice board
public async getNoticesByType  (req: Request, res: Response)  {
  const campusId = Number(req.params.campusId);
  const active = Number(req.params.active);
  const type = req.params.type;

  if(type==='ALL'){
    
    const notices = await prisma.noticeBoard.findMany({
      where: {
        campusId:campusId,
        active: Number(active)
      },
      include: {
        campus : true,
  
      },
    });
    return res.json({ status: true,  data: notices , message:'Notices retrieved' });
  
  }else{
    const notices = await prisma.noticeBoard.findMany({
      where: {
        campusId:campusId,
        active: Number(active),
        messageType: MessageType[type]
      },
      include: {
        campus : true,
  
      },
    });
    return res.json({ status: true,  data: notices , message:'Notices retrieved' });
  }
  
}

public async addANotice  (req: Request, res: Response)  {
  const noticeForm: any = req.body;
  try {  
    if(noticeForm!==null && noticeForm!==undefined){
      await prisma.noticeBoard.create({
        data: {
          campusId:noticeForm.form.campusId,
          active:1,
          name:noticeForm.form.name,
          message:noticeForm.form.message,
          messageType:noticeForm.form.messageType,
          created_by:noticeForm.form.created_by,
          created_at:new Date()
        },
      });
    }
    return res.json({ data: null, status: true, message: 'Noticeboard added' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message ,  status: true, data: null})
  }
}

public async changeNoticeStatus  (req: Request, res: Response)  {
  const noticeForm: any = req.body;
  
  try {  
    if(noticeForm!==null && noticeForm!==undefined){
      console.log(noticeForm);
      
      await prisma.noticeBoard.findUnique({
        where: {
          id: noticeForm.id,
          campusId:noticeForm.campusId,
        },
      }).then(async (existingData)=>{
        
        if(existingData!==null && existingData!==undefined){
          let isActive:number = existingData.active;
          console.log('Current Active Status : '+isActive);
          await prisma.noticeBoard.update({
            where: {
              id: noticeForm.id,
              campusId:noticeForm.campusId,
            },
            data: {
              active: isActive ===1 ? 0 : 1,
              created_by:Number(noticeForm.currentUserid),
              created_at: new Date()
            },
          });

          return res.json({ data: null, status: true, message: 'Noticeboard updated' });
        }
        
      });
      
    }
    
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message ,  status: true, data: null})
  }
}


public async getActiveCampuses  (req: Request, res: Response)  {
  
  const campuses = await prisma.campus.findMany({
    include:{
      TransportRoutes:true,
      Class:true,
      Section:true,
      Subject:true,
      User:true,
    }
  });
  return res.json({ status: true,  data: campuses , message:'Campus details retrieved' });
}

public async addACampus  (req: Request, res: Response)  {
  const campusForm: any = req.body;
  try {  
    if(campusForm!==null && campusForm!==undefined){
      await prisma.campus.create({
        data: {
          active:1,
          campusName:campusForm.form.campusName,
          campusAddress:campusForm.form.campusAddress,
          campusPhone:campusForm.form.campusPhone,
          instituteId:campusForm.form.instituteId,
          created_by:campusForm.form.created_by,
          created_at:new Date(),
          updated_by:campusForm.form.created_by,
          updated_at:new Date()
        },
      });
    }
    return res.json({ data: null, status: true, message: 'Campus added' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message ,  status: true, data: null})
  }
}


public async changeCampusStatus  (req: Request, res: Response)  {
  const campusForm: any = req.body;
  
  try {  
    if(campusForm!==null && campusForm!==undefined){
      console.log(campusForm);
      
      await prisma.campus.findUnique({
        where: {
          id: campusForm.id,
        },
      }).then(async (existingData)=>{
        
        if(existingData!==null && existingData!==undefined){
          let isActive:number = existingData.active;
          console.log('Current Campus Active Status : '+isActive);
          
          await prisma.campus.update({
            where: {
              id: campusForm.id,
            },
            data: {
              active: isActive ===1 ? 0 : 1,
              updated_by:Number(campusForm.currentUserid),
              updated_at: new Date()
            },
          });

          return res.json({ data: null, status: true, message: 'Updated. Relogin to see changes.' });
        }
        
      });
      
    }
    
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message ,  status: true, data: null})
  }
}


public async fetchHomeworks  (req: Request, res: Response)  {
  const homeworkform: any = req.body;
  console.log(homeworkform);
  const result = await prisma.$queryRaw`SELECT dh.*,cam.campusName, cls.className, sec.sectionName , DATE_FORMAT(dh.homeworkDate,'%d-%m-%Y') as homeworkDateProcessed FROM myskool.DailyHomework dh
                                LEFT JOIN myskool.Campus cam ON cam.id=dh.campusId
                                LEFT JOIN myskool.Class cls ON cls.id=dh.classId
                                LEFT JOIN myskool.Section sec ON sec.id=dh.sectionId 
                               where 
                               dh.campusId=${homeworkform.campusId} and dh.classId=${homeworkform.classId} 
                               and dh.sectionId=${homeworkform.sectionId}  
                               and DATE_FORMAT(dh.homeworkDate,'%d-%m-%Y') =${homeworkform.homeworkDate};`

  
  
  
  //console.log(result);

  return res.json({ status: true,  data: result , message:'Homework details retrieved' });
}


public async addAHomework  (req: Request, res: Response)  {
  const homeworkform: any = req.body;
  try {  
    if(homeworkform!==null && homeworkform!==undefined){
      await prisma.dailyHomework.create({
        data: {
          active:1,
          campusId:homeworkform.form.campusId,
          classId:homeworkform.form.classId,
          sectionId:homeworkform.form.sectionId,
          homeworkDate:moment(homeworkform.form.homeworkDate, 'DD-MM-YYYY').toDate(),
          homeworkData:homeworkform.form.homeworkData,
          created_by:homeworkform.form.created_by,
          created_at:new Date(),
          updated_by:homeworkform.form.created_by,
          updated_at:new Date()
        },
      });
    }
    return res.json({ data: null, status: true, message: 'Homework added' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message ,  status: true, data: null})
  }
}



//generic emails

public async resetPassword  (req: Request, res: Response)  {
  const resetpasswordform: any = req.body;
  try {  
    if(resetpasswordform!==null && resetpasswordform!==undefined && 
      resetpasswordform.user!==null && resetpasswordform.user!==undefined
      ){
      let template: EmailTemplate = await getEmailTemplateByName('Reset Password');
      let resetPasswordWebAppUrlFrontEnd = process.env.WEB_APP_URL+'reset-password';
      let templateHtml = resetPasswordTemplate;
      templateHtml  =templateHtml.replaceAll("$USERNAME", resetpasswordform.user.displayName);
      templateHtml  =templateHtml.replaceAll("$SCHOOLNAME", resetpasswordform.institute.instituteName);
      templateHtml  =templateHtml.replaceAll("$SCHOOLLOGO", resetpasswordform.institute.logo);
      templateHtml  =templateHtml.replaceAll("$CODE", resetpasswordform.otp);
      templateHtml  =templateHtml.replaceAll("$RESET_PASSWORD_URL", resetPasswordWebAppUrlFrontEnd);

      sendEmailCommon(resetpasswordform.institute,
                        'Reset Password Requested for '+resetpasswordform.user.displayName,
                        templateHtml,
                        [{ email:resetpasswordform.user.email, name:resetpasswordform.user.name, }],
                        template.name , resetpasswordform.campusId, 
                        template.id, 
                        resetpasswordform.currentUserid 
                     );
      changeAccountResetStatus(resetpasswordform.user, resetpasswordform.campusId, resetpasswordform.otp+'', true);
                        
    }
    return res.json({ data: null, status: true, message: 'Reset requested. Relogin to see changes.'});
  
  } catch (error) {
    console.error(error);   
    return res.status(400).json({ message: error.message ,  status: true, data: null})
  }
}



//Fee Plan
public async getActiveFeePlansForDropdown  (req: Request, res: Response)  {
    const campusId = Number(req.params.campusId);
    const institute = await prisma.institute.findFirst();


    let feePlansDropdown = [];
    const feePlans = await prisma.feePlan.findMany({
      where: {
        campusId:campusId,
        active:1
      },
      orderBy:{
        name: 'asc'
      }
    });
    if(feePlans!==null && feePlans!==undefined && feePlans.length>0){
      for(let i=0;i<feePlans.length;i++){
        feePlansDropdown.push({value: feePlans[i].id+'',  
                    label:feePlans[i].name+' (Monthly: '+getCurrencySymbol('en-US', institute!==null && institute!==undefined && institute.currency !==null && institute.currency !==undefined? institute.currency : 'INR')+feePlans[i].monthlyAmt+', Yearly: '+getCurrencySymbol('en-US', institute!==null && institute!==undefined && institute.currency !==null && institute.currency !==undefined? institute.currency : 'INR')+feePlans[i].yearlyAmt+' )'});
      }
    }
    return res.json({ status: true,  data: feePlansDropdown , message:'' });
  }

public async getActiveFeePlans  (req: Request, res: Response)  {
  const campusId = Number(req.params.campusId);
  
  const feePlans = await prisma.feePlan.findMany({
    where: {
      campusId:campusId,
    },
    include: {
      campus : true,
      FeePlanBreakup:{
        orderBy:{
          amount: 'desc',
        }
      },
    },
    orderBy:{
      updated_at: 'desc'
    }
  });
    return res.json({ status: true,  data: feePlans , message:'Fee Plans retrieved' });
  }

public async getFeePlanBreakup  (req: Request, res: Response)  {
  const campusId = Number(req.params.campusId);
  let myuuid = uuidv4();
  let blankFeeBreakup = [
    {
    id: uuidv4(),
    feePlanId : 0,
    campusId : campusId,
    isYearly:1,
    breakupname:'Admission Fee',
    amount:2500},
    {
    id: uuidv4(),
    feePlanId : 0,
    campusId : campusId,
    isYearly:1,
    breakupname:'Exam Fee',
    amount:500
    },
    {
    id: uuidv4(),
    feePlanId : 0,
    campusId : campusId,
    isYearly:1,
    breakupname:'Id Card Fee',
    amount:150
    },
    {
    id: uuidv4(),
    feePlanId : 0,
    campusId : campusId,
    isYearly:0,
    breakupname:'Monthly Fee',
    amount:500
    },

  ];

  return res.json({ status: true,  data: blankFeeBreakup , message:'' });
  }



public async addUpdateFeePlan  (req: Request, res: Response)  {
  const formData: any = req.body;
  console.log(formData)
  try {  
    if(formData!==null && formData!==undefined){
      if(formData.feeId!==null && formData.feeId!==undefined){
        //delete existing fee breakups
        await prisma.feePlanBreakup.deleteMany({
          where:{
            campusId:Number(formData.campusId),
            feePlanId: Number(formData.feeId),
          }
        });
        let monthlyAmount = 0;
        let yearlyAmount= 0;
      
        //Update fee id
        if(formData.feeBreakUp!==null && formData.feeBreakUp!==undefined && formData.feeBreakUp.length>0){
          
          for(let i=0; i< formData.feeBreakUp.length; i++){
            let element = formData.feeBreakUp[i];
            if(element.isYearly===1){
              yearlyAmount = Number(yearlyAmount)+Number(element.amount);
            }else{
              monthlyAmount = Number(monthlyAmount)+Number(element.amount);
            }
            await prisma.feePlanBreakup.create({
              data: {
                feePlanId: Number(formData.feeId),
                campusId:Number(formData.campusId),
                isYearly: Number(element.isYearly),
                breakupname: String(element.breakupname),
                amount: Number(element.amount),
              },
            });
          }
        }
        console.log('Updated yearlyAmount :'+yearlyAmount+' monthlyAmount: '+monthlyAmount)
            
        let feePlan = await prisma.feePlan.update({
          where:{
            campusId:Number(formData.campusId),
            id: Number(formData.feeId),
          },
          data: {
            name: formData.feeName,
            monthlyAmt: monthlyAmount,
            yearlyAmt: yearlyAmount,
            updated_by:formData.created_by,
            updated_at:new Date()
          },
        });

        return res.json({ data: null, status: true, message: 'Fee Plan updated' });
      }else{
          let monthlyAmount = 0;
          let yearlyAmount= 0;
        
          if(formData.feeBreakUp!==null && formData.feeBreakUp!==undefined && formData.feeBreakUp.length>0){
            for(let i=0; i< formData.feeBreakUp.length; i++){
              let element = formData.feeBreakUp[i];
              if(element.isYearly===1){
                yearlyAmount = Number(yearlyAmount)+Number(element.amount);
              }else{
                monthlyAmount = Number(monthlyAmount)+Number(element.amount);
              }
            }
            console.log('New yearlyAmount :'+yearlyAmount+' monthlyAmount: '+monthlyAmount)
          }
        
          let feePlan = await prisma.feePlan.create({
            data: {
              active:1,
              campusId:Number(formData.campusId),
              name: formData.feeName,
              monthlyAmt: monthlyAmount,
              yearlyAmt: yearlyAmount,
              created_by:formData.created_by,
              created_at:new Date(),
              updated_by:formData.created_by,
              updated_at:new Date()
            },
          });

          if(feePlan!==null && feePlan!==undefined && formData.feeBreakUp!==null && formData.feeBreakUp!==undefined && formData.feeBreakUp.length>0){
            for(let i=0; i< formData.feeBreakUp.length; i++){
              let element = formData.feeBreakUp[i];
              await prisma.feePlanBreakup.create({
                data: {
                  feePlanId: Number(feePlan.id),
                  campusId:Number(formData.campusId),
                  isYearly: Number(element.isYearly),
                  breakupname: String(element.breakupname),
                  amount: Number(element.amount),
                },
              });
              
            }
          }

          return res.json({ data: null, status: true, message: 'Fee Plan added' });
      }
    }
    
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message ,  status: true, data: null})
  }
}

public async changeFeePlanStatus  (req: Request, res: Response)  {
  const feeForm: any = req.body;
  
  try {  
    if(feeForm!==null && feeForm!==undefined){
      console.log(feeForm);
      
      await prisma.feePlan.findUnique({
        where: {
          id: feeForm.id,
          campusId:feeForm.campusId,
        },
      }).then(async (existingData)=>{
        
        if(existingData!==null && existingData!==undefined){
          let isActive:number = existingData.active;
          console.log('Current Active Status : '+isActive);
          
          await prisma.feePlan.update({
            where: {
              id: feeForm.id,
              campusId:feeForm.campusId,
            },
            data: {
              active: isActive ===1 ? 0 : 1,
              created_by:Number(feeForm.currentUserid),
              created_at: new Date()
            },
          });

          return res.json({ data: null, status: true, message: 'Fee Plan updated' });
        }
        
      });
      
    }
    
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message ,  status: true, data: null})
  }
}


}



