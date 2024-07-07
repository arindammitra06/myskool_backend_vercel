import { Request, Response } from "express";
import { prisma } from "../../../../../../shared/db-client";
import moment from "moment";
import { AbsenseStatus, AttendanceType, DayStatus, EntryStatus, UserType } from "@prisma/client";
import { Attendance, AttendanceSheetModel, AttendanceShort } from "../../../../../../shared/models/attendance.model";
import {v4 as uuidv4} from 'uuid';

export class AttendanceController {


  public async fetchAnyMonthAttendance  (req: Request, res: Response)  {
    const attendanceForm: any = req.body;
    console.log(attendanceForm);
    let attendanceRecordsFetched: AttendanceSheetModel[] = [];
    let monthRaw = Number(attendanceForm.month);
    let month = monthRaw+1;
    let userType = attendanceForm.userType;
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), monthRaw, 1);
    var lastDay = new Date(date.getFullYear(), month , 0);
    
    
    
    let daysInMonthNumber =  daysInMonth(month, date.getFullYear()) ;
    console.log('FirstDay:'+firstDay);
    console.log('LastDay:'+lastDay);
    console.log(' -- Days in this month '+month+'/'+date.getFullYear()+':-'+daysInMonthNumber);
    let studentsOrStaff;

    if(userType==='student'){
      studentsOrStaff = await prisma.user.findMany({
        where: {
          active: 1,
          campusId:attendanceForm.campusId,
          classId: attendanceForm.classId,
          sectionId: attendanceForm.sectionId,
          userType: {
            in: [UserType.student]
          }
        },
        include: {
          campus : true,
          class:true,
          section:true,
          Attendance:{
            where:{
              attendanceDate:{
                lte: lastDay,
                gte: firstDay,
              }
            }
          }
        },
      });
    }else{
      studentsOrStaff = await prisma.user.findMany({
        where: {
          active: 1,
          campusId:attendanceForm.campusId,
          userType: {
            in: [UserType.staff, UserType.accountant]
          }
        },
        include: {
          campus : true,
          Attendance:{
            where:{
              attendanceDate:{
                lte: lastDay,
                gte: firstDay,
              }
            }
          }
        },
      });
    }
    
    if(studentsOrStaff!==null && studentsOrStaff!==undefined && studentsOrStaff.length>0){
      for (const eachStudent of studentsOrStaff) {
        //console.log(eachStudent)
        console.log('~~~~~~~~~~~~~For user '+eachStudent.displayName+' ~~~~~~~~~~~~~~~~~~~')
        let attendanceFound = eachStudent.Attendance;
        let attendanceProcessed: AttendanceShort[] = [];
        if(daysInMonthNumber!==null && daysInMonthNumber!==undefined && daysInMonthNumber>0){
          for (let i = 1; i <= daysInMonthNumber; i++) {
            let dateToMatch = getDateForMatching(i, month, date.getFullYear());
            console.log('Matching date '+dateToMatch);

            if(attendanceFound!==null && attendanceFound!==undefined && attendanceFound.length>0){
              let daysAttendanceRecord = attendanceFound.filter(obj => {
                return obj.attendanceDateProcessed === dateToMatch
              });


              if(daysAttendanceRecord!==null && daysAttendanceRecord!==undefined && daysAttendanceRecord.length>0){
                //console.log(daysAttendanceRecord)
                attendanceProcessed.push({
                  attendanceStatus: daysAttendanceRecord[0].attendanceStatus,
                  entryStatus:daysAttendanceRecord[0].entryStatus,
                  dayStatus:daysAttendanceRecord[0].dayStatus,
                  day: i+'',
                })
              }else{
                //console.log('Attendance not found for date '+dateToMatch);
                attendanceProcessed.push({
                  attendanceStatus: AbsenseStatus['UnMarked'],
                  entryStatus:EntryStatus['UnMarked'],
                  dayStatus:DayStatus['FullDay'],
                  day: i+'',
                })
              }
            }else{
              attendanceProcessed.push({
                attendanceStatus: AbsenseStatus['UnMarked'],
                entryStatus:EntryStatus['UnMarked'],
                dayStatus:DayStatus['FullDay'],
                day: i+'',
              })
            }
          }
        }
        
        attendanceRecordsFetched.push({
          campus : attendanceForm.campusId,
          className: userType==='student' ? eachStudent.class.className:null,
          sectionName: userType==='student' ? eachStudent.section.sectionName:null,
          user: eachStudent,
          userType : eachStudent.userType,
          attendance: attendanceProcessed
        });
      }
    }
  
    //console.log('Printing full class attendance '+attendanceForm.attendanceDate);
    //console.log(attendanceRecordsFetched)
  
    return res.json({ status: true,  data: attendanceRecordsFetched, noOfDaysToConsider: daysInMonthNumber, message:'Attendance retrieved' });
  }


  public async fetchAttendanceForReports  (req: Request, res: Response)  {
    const attendanceForm: any = req.body;
    console.log(attendanceForm);
    let attendanceRecordsFetched: AttendanceSheetModel[] = [];
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let yesterday = new Date(Date.now() - (24 * 60 * 60 * 1000));
    const isMonthly = Boolean(attendanceForm.isMonthly);
    let todaysDate = date.getDate();
    let month = date.getMonth()+1;
    let year  =date.getFullYear();
    let userType = attendanceForm.userType;
    let daysInMonthNumber = isMonthly ? daysInMonth(month, year) : 1;
    console.log(todaysDate+' -- Days in this month '+month+'/'+year+':-'+daysInMonthNumber);


    //console.log(attendanceForm);
    let studentsOrStaff;
    if(userType==='student'){
      studentsOrStaff = await prisma.user.findMany({
        where: {
          active: 1,
          campusId:attendanceForm.campusId,
          classId: attendanceForm.classId,
          sectionId: attendanceForm.sectionId,
          userType: {
            in: userType==='student' ? [UserType.student] : [UserType.staff, UserType.accountant]
          }
        },
        include: {
          campus : true,
          class:true,
          section:true,
          Attendance:{
            where:{
              attendanceDate:{
                lte: date,
                gte: isMonthly ? firstDay : yesterday,
              }
            }
          }
        },
      });
    }else{
      studentsOrStaff = await prisma.user.findMany({
        where: {
          active: 1,
          campusId:attendanceForm.campusId,
          userType: {
            in: [UserType.staff, UserType.accountant]
          }
        },
        include: {
          campus : true,
          class:true,
          section:true,
          Attendance:{
            where:{
              attendanceDate:{
                lte: date,
                gte: isMonthly ? firstDay : yesterday,
              }
            }
          }
        },
      });
    }
    console.log(studentsOrStaff);
    if(studentsOrStaff!==null && studentsOrStaff!==undefined && studentsOrStaff.length>0){
      for (const eachStudent of studentsOrStaff) {
        //console.log(eachStudent)
        console.log('~~~~~~~~~~~~~For user '+eachStudent.displayName+' ~~~~~~~~~~~~~~~~~~~')
        let attendanceFound = eachStudent.Attendance;
        let attendanceProcessed: AttendanceShort[] = [];
        
        if(isMonthly){
          if(daysInMonthNumber!==null && daysInMonthNumber!==undefined && daysInMonthNumber>0){
            for (let i = 1; i <= daysInMonthNumber; i++) {
              let dateToMatch = getDateForMatching(i, month, year);
              
              if(attendanceFound!==null && attendanceFound!==undefined && attendanceFound.length>0){
                let daysAttendanceRecord = attendanceFound.filter(obj => {
                  return obj.attendanceDateProcessed === dateToMatch
                });


                if(daysAttendanceRecord!==null && daysAttendanceRecord!==undefined && daysAttendanceRecord.length>0){
                  //console.log(daysAttendanceRecord)
                  attendanceProcessed.push({
                    attendanceStatus: daysAttendanceRecord[0].attendanceStatus,
                    entryStatus:daysAttendanceRecord[0].entryStatus,
                    dayStatus:daysAttendanceRecord[0].dayStatus,
                    day: i+'',
                  })
                }else{
                  //console.log('Attendance not found for date '+dateToMatch);
                  attendanceProcessed.push({
                    attendanceStatus: AbsenseStatus['UnMarked'],
                    entryStatus:EntryStatus['UnMarked'],
                    dayStatus:DayStatus['FullDay'],
                    day: i+'',
                  })
                }
              }else{
                attendanceProcessed.push({
                  attendanceStatus: AbsenseStatus['UnMarked'],
                  entryStatus:EntryStatus['UnMarked'],
                  dayStatus:DayStatus['FullDay'],
                  day: i+'',
                })
              }
            }
          }
          
          attendanceRecordsFetched.push({
            campus : attendanceForm.campusId,
            className:userType==='student' ?  eachStudent.class.className : null,
            sectionName: userType==='student' ? eachStudent.section.sectionName : null,
            user: eachStudent,
            userType : eachStudent.userType,
            attendance: attendanceProcessed
          });
        }else{
          if(daysInMonthNumber!==null && daysInMonthNumber!==undefined && daysInMonthNumber>0){
            for (let i = 1; i <= daysInMonthNumber; i++) {
              let dateToMatch = getDateForMatching(todaysDate, month, year);
              console.log('dateToMatch '+dateToMatch)
              
              if(attendanceFound!==null && attendanceFound!==undefined && attendanceFound.length>0){
                let daysAttendanceRecord = attendanceFound.filter(obj => {
                  return obj.attendanceDateProcessed === dateToMatch
                });


                if(daysAttendanceRecord!==null && daysAttendanceRecord!==undefined && daysAttendanceRecord.length>0){
                  console.log(daysAttendanceRecord)
                  attendanceProcessed.push({
                    attendanceStatus: daysAttendanceRecord[0].attendanceStatus,
                    entryStatus:daysAttendanceRecord[0].entryStatus,
                    dayStatus:daysAttendanceRecord[0].dayStatus,
                    day: i+'',
                  })
                }else{
                  //console.log('Attendance not found for date '+dateToMatch);
                  attendanceProcessed.push({
                    attendanceStatus: AbsenseStatus['UnMarked'],
                    entryStatus:EntryStatus['UnMarked'],
                    dayStatus:DayStatus['FullDay'],
                    day: i+'',
                  })
                }
              }else{
                attendanceProcessed.push({
                  attendanceStatus: AbsenseStatus['UnMarked'],
                  entryStatus:EntryStatus['UnMarked'],
                  dayStatus:DayStatus['FullDay'],
                  day: i+'',
                })
              }
            }
          }
          
          attendanceRecordsFetched.push({
            campus : attendanceForm.campusId,
            className: userType==='student' ? eachStudent.class.className : null,
            sectionName: userType==='student' ? eachStudent.section.sectionName :null,
            user: eachStudent,
            userType : eachStudent.userType,
            attendance: attendanceProcessed
          });
        }
      }
    }
  
    //console.log('Printing full class attendance '+attendanceForm.attendanceDate);
    //console.log(attendanceRecordsFetched)
  
    return res.json({ status: true,  data: attendanceRecordsFetched, noOfDaysToConsider: daysInMonthNumber, message:'Attendance retrieved' });
  }

  public async fetchAttendanceFormStats  (req: Request, res: Response)  {
    const campusId = Number(req.params.campusId);
    const userType = String(req.params.userType);
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let yesterday = new Date(Date.now() - (24 * 60 * 60 * 1000));
  
    const monthLyPresentStudents = await prisma.attendance.findMany({
      where: {
        campusId : Number(campusId),
        userType: {
          in: userType=='student' ? [UserType.student] : [UserType.staff, UserType.accountant]
        },
        attendanceStatus:AbsenseStatus[AbsenseStatus.Present],
        attendanceDate:{
          lte: date,
          gte: firstDay,
        }
      },
      include:{
        user:true,
        class:true,
        section:true
      }
    });
    
    const todaysPresnt = await prisma.attendance.findMany({
      where: {
        campusId : Number(campusId),
        userType: {
          in: userType=='student' ? [UserType.student] : [UserType.staff, UserType.accountant]
        },
        attendanceStatus:AbsenseStatus[AbsenseStatus.Present],
        attendanceDate:{
          lte: date,
          gte: yesterday,
        }
      },
      include:{
        user:true,
        class:true,
        section:true
      }
    });
    
    const monthLyAbsentStudents = await prisma.attendance.findMany({
      where: {
        campusId : Number(campusId),
        userType: {
          in: userType=='student' ? [UserType.student] : [UserType.staff, UserType.accountant]
        },
        attendanceStatus:AbsenseStatus[AbsenseStatus.Absent],
        attendanceDate:{
          lte: date,
          gte: firstDay,
        }
      },
      include:{
        user:true,
        class:true,
        section:true
      }
    });
    
    const todaysAbsent = await prisma.attendance.findMany({
      where: {
        campusId : Number(campusId),
        userType: {
          in: userType=='student' ? [UserType.student] : [UserType.staff, UserType.accountant]
        },
        attendanceStatus:AbsenseStatus[AbsenseStatus.Absent],
        attendanceDate:{
          lte: date,
          gte: yesterday,
        }
      },
      include:{
        user:true,
        class:true,
        section:true
      }
    });
    
    const monthlyReport = await prisma.user.findMany({
      where: {
        active: 1,
        campusId:campusId,
        userType: {
          in: userType=='student' ? [UserType.student] : [UserType.staff, UserType.accountant]
        }
      },
      include: {
        campus : true,
        class:true,
        section:true,
        Attendance:{
          where:{
            attendanceDate:{
              lte: date,
              gte: firstDay,
            }
          }
        }
      },
    });
    
    let studentsOrStaffMonthlyReportData = [];
    if (monthlyReport !== null && monthlyReport !== undefined && monthlyReport.length > 0) {

      for (const eachStudent of monthlyReport) {
        let present = 0;
        let absent = 0;
        let late = 0;
        let leftEarly = 0;
        let leave = 0;
        let halfday = 0;
        if (eachStudent.Attendance !== null && eachStudent.Attendance !== undefined && eachStudent.Attendance.length > 0) {
          for (const attendance of eachStudent.Attendance) {

            //Checking attendance status
            if (attendance !== null && attendance !== undefined && attendance.attendanceStatus === AbsenseStatus.Present) {
              present = present + 1;
            } else if (attendance !== null && attendance !== undefined && attendance.attendanceStatus === AbsenseStatus.Absent) {
              absent = absent + 1;
            } else if (attendance !== null && attendance !== undefined && attendance.attendanceStatus === AbsenseStatus.Leave) {
              leave = leave + 1;
            }
            //checking halfday
            if (attendance !== null && attendance !== undefined && attendance.dayStatus === DayStatus.HalfDay) {
              halfday = halfday + 1;
            }
            //checking late
            if (attendance !== null && attendance !== undefined && attendance.entryStatus === EntryStatus.Late) {
              late = late + 1;
            } else if (attendance !== null && attendance !== undefined && attendance.entryStatus === EntryStatus.LeftEarly) {
              leftEarly = leftEarly + 1;
            }
          }
        }

        studentsOrStaffMonthlyReportData.push({
          user: eachStudent,
          present: present,
          absent: absent,
          late: late,
          leftEarly: leftEarly,
          leave: leave,
          halfday: halfday,
        });
      }
    }
    
    return res.json({ status: true,  
      data: {monthLyPresentStudents :monthLyPresentStudents, 
             todaysPresnt: todaysPresnt,
             monthLyAbsentStudents:monthLyAbsentStudents ,
             todaysAbsent: todaysAbsent,
             monthlyCountReport: studentsOrStaffMonthlyReportData} , 
        message:'Data fetched' });
  }
  

  

public async fetchAttendance  (req: Request, res: Response)  {
  const attendanceForm: any = req.body;
  let attendanceRecordsFetched: Attendance[] = [];
  


  console.log(attendanceForm);
  let studentsOrStaff;
  if(attendanceForm.userType==='student'){
    studentsOrStaff = await prisma.user.findMany({
      where: {
        active: 1,
        campusId:attendanceForm.campusId,
        classId: attendanceForm.classId,
        sectionId: attendanceForm.sectionId,
        userType: UserType[attendanceForm.userType]
      },
      include: {
        campus : true,
        class:true,
        section:true
      },
    });
  }else{
    studentsOrStaff = await prisma.user.findMany({
      where: {
        active: 1,
        campusId:attendanceForm.campusId,
        userType: {
          in: [UserType.staff, UserType.accountant]
        }
      },
      include: {
        campus : true,
        class:true,
        section:true
      },
    });
  }

  
  if(studentsOrStaff!==null && studentsOrStaff!==undefined && studentsOrStaff.length>0){
    for (const eachStudent of studentsOrStaff) {
      console.log('-----fetching for student - ' + eachStudent.displayName);
      
      let result:any[];
      if(attendanceForm.userType==='student'){
        result= await prisma.$queryRaw`SELECT dh.*, DATE_FORMAT(dh.attendanceDate,'%d-%m-%Y') as attendanceDateProcessed 
        FROM myskool.Attendance dh
        LEFT JOIN myskool.Campus cam ON cam.id=dh.campusId
        LEFT JOIN myskool.Class cls ON cls.id=dh.classId
        LEFT JOIN myskool.Section sec ON sec.id=dh.sectionId 
        where dh.userId=${eachStudent.id} and dh.campusId=${attendanceForm.campusId} and dh.classId=${attendanceForm.classId} and dh.sectionId=${attendanceForm.sectionId}  
        and DATE_FORMAT(dh.attendanceDate,'%d-%m-%Y') =${attendanceForm.attendanceDate}  order by dh.created_at;;`
      }else{
        
        result = await prisma.$queryRaw`SELECT dh.*, DATE_FORMAT(dh.attendanceDate,'%d-%m-%Y') as attendanceDateProcessed 
        FROM myskool.Attendance dh
        where dh.userId=${eachStudent.id} and dh.campusId=${attendanceForm.campusId} 
        and DATE_FORMAT(dh.attendanceDate,'%d-%m-%Y') =${attendanceForm.attendanceDate} order by dh.created_at;`
      }
      
      
      let myuuid = uuidv4();
      
      if(result!==null && result!==undefined && result.length>0){
        console.log('Attendance FOUND for date '+attendanceForm.attendanceDate);
         
          if(result[0]!==null && result[0]!==undefined){
            attendanceRecordsFetched.push({
              id: result[0].id,
              key:myuuid,
              campusId: attendanceForm.campusId,
              classId: attendanceForm.userType==='student' ? attendanceForm.classId :'',
              className: attendanceForm.userType==='student' ? eachStudent.class.className : '',
              sectionId: attendanceForm.userType==='student' ?  attendanceForm.sectionId :'',
              sectionName: attendanceForm.userType==='student' ?  eachStudent.section.sectionName: '',
              userId: eachStudent.id,
              user: eachStudent,
              userType: eachStudent.userType,
              attendanceStatus: result[0].attendanceStatus,
              entryStatus:result[0].entryStatus,
              dayStatus:result[0].dayStatus,
              attendanceType: result[0].attendanceType,
              attendanceDate: result[0].attendanceDate,
              attendanceDateProcessed: result[0].attendanceDateProcessed,
              recordStartTime: result[0].recordStartTime,
              recordEndTime: result[0].recordEndTime,
              notes: result[0].notes,
              campus: eachStudent.campus,
              created_by: result[0].created_by,
              created_at: result[0].created_at
            })
          }
      }else{
        console.log('Attendance NOT FOUND for date '+attendanceForm.attendanceDate);
          
          attendanceRecordsFetched.push({
            id: null,
            key:myuuid,
            campusId: attendanceForm.campusId,
            classId: attendanceForm.userType==='student' ?attendanceForm.classId :'',
            className: attendanceForm.userType==='student' ?eachStudent.class.className:'',
            sectionId: attendanceForm.userType==='student' ?attendanceForm.sectionId:'',
            sectionName: attendanceForm.userType==='student' ?eachStudent.section.sectionName:'',
            userId: eachStudent.id,
            user: eachStudent,
            userType: eachStudent.userType,
            attendanceStatus: AbsenseStatus['UnMarked'],
            entryStatus:EntryStatus['OnTime'],
            dayStatus:DayStatus['FullDay'],
            attendanceType: AttendanceType['Manual'],
            attendanceDate: new Date(moment(attendanceForm.attendanceDate).format("DD-MM-YYYY HH:mm:ss")),
            attendanceDateProcessed: attendanceForm.attendanceDate,
            recordStartTime: '',
            recordEndTime: '',
            notes: '',
            campus: eachStudent.campus,
            created_by: null,
            created_at: null
          })
      }
    }
  }

  console.log('Printing full class attendance '+attendanceForm.attendanceDate);
  //console.log(attendanceRecordsFetched)

  return res.json({ status: true,  data: attendanceRecordsFetched , message:'Attendance retrieved' });
}

//**This is strictly for manual Attencance. Not to be called during automated ID Card attendance */
//** distinguish start end time/half day full day etc logic */
public async updateAttendance  (req: Request, res: Response)  {
  const attendanceForm: any = req.body;
  console.log(attendanceForm);
  try {  
    if(attendanceForm!==null && attendanceForm!==undefined 
              && attendanceForm.form!==null && attendanceForm.form!==undefined && attendanceForm.form.length>0){
      
      let startTime = await prisma.listOfValues.findUnique({
        where: {
          campusId : Number(attendanceForm.campusId),
          uniqueKey: 'SessionTimeTableRange_StartTime',
          active: 1
        },
      });
      let endTime = await prisma.listOfValues.findUnique({
        where: {
          campusId : Number(attendanceForm.campusId),
          uniqueKey: 'SessionTimeTableRange_EndTime',
          active: 1
        },
      });

      let halfTime = await prisma.listOfValues.findUnique({
        where: {
          campusId : Number(attendanceForm.campusId),
          uniqueKey: 'SessionTimeTableRange_HalfTime',
          active: 1
        },
      });
      attendanceForm.form.forEach(async (element) => {
          if(element!==null && element!==undefined && element.id===null){
            //create new entry
            await prisma.attendance.create({
              data: {
                  campusId:element.campusId,
                  classId: element.userType==='student' ? element.classId : null,
                  sectionId: element.userType==='student' ? element.sectionId : null,
                  userId:Number(element.userId),
                  userType: UserType[element.userType],
                  attendanceDate: moment(element.attendanceDateProcessed, 'DD-MM-YYYY').toDate(),
                  attendanceType:AttendanceType[element.attendanceType],
                  attendanceStatus:AbsenseStatus[element.attendanceStatus],
                  entryStatus:EntryStatus[element.entryStatus],
                  dayStatus:DayStatus[element.dayStatus],
                  recordStartTime:startTime.shortName,
                  recordEndTime:element.dayStatus==='FullDay' ? endTime.shortName : halfTime.shortName,
                  notes:element.notes,
                  created_by:attendanceForm.currentUserId,
                  created_at: new Date(),
              },
            });
          }else{
              //only update few fields
              await prisma.attendance.update({
                where:{
                    id:element.id,
                    campusId:element.campusId,
                },
                data: {
                    attendanceType:AttendanceType[element.attendanceType],
                    attendanceStatus:AbsenseStatus[element.attendanceStatus],
                    entryStatus:EntryStatus[element.entryStatus],
                    dayStatus:DayStatus[element.dayStatus],
                    recordStartTime:startTime.shortName,
                    recordEndTime:element.dayStatus==='FullDay' ? endTime.shortName : halfTime.shortName,
                    notes:element.notes,
                    created_by:attendanceForm.currentUserId,
                    created_at: new Date(),
                },
              });
          }
      });
    }
    return res.json({ data: null, status: true, message: 'Attendance Taken' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message ,  status: true, data: null})
  }
}


}



function daysInMonth(month: number, year: number): any {
  return new Date(year, month, 0).getDate();
}

function getDateForMatching(i: number, month: number, year: number) {
  let date = i<10 ? '0'+i : i;
  let monthProc = month<10 ? '0'+month : month;
  return date+'-'+monthProc+'-'+year;
}

