import { Request, Response } from "express";
import { prisma } from "../../../../../../shared/db-client";
import { TimeTable, UserType } from "@prisma/client";
import jwt from 'jsonwebtoken';
import { processTimeTableJsonData } from "../../../../../../shared/helpers/utils/generic.utils";
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
                desc:element.desc,
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
                desc:element.desc,
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
  console.log(' campusId--- '+ campusId+', classId--- '+ classId+', sectionId--- '+ sectionId);
  
  let timtables = await prisma.timeTable.findMany({
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
  
  if(timtables!==null && timtables!==undefined && timtables.length>0){
        let data = [];
        data.push(processTimeTableJsonData(timtables, 'Sunday'));
        data.push(processTimeTableJsonData(timtables, 'Monday'));
        data.push(processTimeTableJsonData(timtables, 'Tuesday'));
        data.push(processTimeTableJsonData(timtables, 'Wednesday'));
        data.push(processTimeTableJsonData(timtables, 'Thursday'));
        data.push(processTimeTableJsonData(timtables, 'Friday'));
        data.push(processTimeTableJsonData(timtables, 'Saturday'));
        console.log(data);
        return res.json({ status: true,  data: data , message:'Timetable fetched' });
   }
   const data= [ { name: "Sunday", events: [ ], },   { name: "Monday", events: [ ], },  { name: "Tuesday", events: [ ], },  { name: "Wednesday", events: [ ], }, 
                 { name: "Thursday", events: [ ], },  { name: "Friday", events: [ ], },   { name: "Saturday", events: [ ], }];


  return res.json({ status: true,  data: data , message:'No timetable found' });
}




public async saveTimeTable  (req: Request, res: Response)  {
  const timetable: any = req.body;
  console.log(timetable);
  try {  
    if(timetable!==null && timetable!==undefined && timetable.form!==null && timetable.form !==undefined &&
      timetable.form.events!==null && timetable.form.events !==undefined && Array.isArray(timetable.form.events) && timetable.form.events.length>0){
        console.log('Events Present');
        timetable.form.events.forEach(async (event) => {
          if(event!==null && event!==undefined ){
            console.log('Parsing event :---' +event.subjectValue);
            await prisma.timeTable.create({
              data: {
                classId:timetable.form.classId,
                sectionId:timetable.form.sectionId,
                campusId:timetable.form.campusId,
                subject:event.subjectValue,
                active:1,
                day:timetable.form.day,
                startTime: formatDateTime(event.startTime),
                endTime: formatDateTime(event.endTime),
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
    return res.json({ data: null, status: true, message: 'Saved' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message ,  status: true, data: null})
  }
}


}
function formatDateTime(startTime: any) {
 if(startTime!==null && startTime!==undefined){
  let splitTime = startTime.split(':');
  if(splitTime!==null && splitTime!==undefined && splitTime.length===2){
      
      return Number(splitTime[0])+''+Number(Number(splitTime[1])/60);
  }
 }
}

