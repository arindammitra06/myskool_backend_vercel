import { Request, Response } from "express";
import { prisma } from "../../../../../../shared/db-client";
import { EmailTemplate, FileType, Holidays, MessageType, TimeTable, User, UserType } from "@prisma/client";
import jwt from 'jsonwebtoken';
import { addANotification, buildTheme, getBlankMonthWiseHolidayList, getCurrencySymbol, getIsoDay, processTimeTableJsonData } from "../../../../../../shared/helpers/utils/generic.utils";
import moment from "moment";
import { changeAccountResetStatus, getEmailTemplateByName, sendEmailCommon } from "../../../../../../shared/helpers/notifications/notifications";
import resetPasswordTemplate from "../../../../../../emails/reset-password";
import { v4 as uuidv4 } from 'uuid';
import { buildMessage, LEAVE_REQUEST_APP_REJ, LEAVE_REQUESTED, PRODUCT_CATEGORY_ADDED, UPDATE_MASTER_NOTIFICATION, USER_CREATED } from "../../../../../../shared/constants/notification.constants";
const fs = require('fs');

export class MasterController {

  public async getAllThemes(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const userId = Number(req.params.userId);
    let themeItems = [];


    let themes = await prisma.theme.findMany({
      where: {
        campusId: Number(campusId),
        userId: userId,
        active: 1
      },
    });

    if (themes !== null && themes !== undefined && themes.length > 0) {
      themes.forEach(async (element) => {
        let newTheme = buildTheme(element);

        if (newTheme !== null && newTheme !== undefined) {
          themeItems.push({
            id: element.id,
            name: element.themeName,
            primary: element.primaryColor,
            header: element.header,
            leftmenu: element.leftmenu,
            background: element.backg,
            scheme: element.scheme,
            theme: newTheme,
            largerFont: element.fontSize !== 0 ? true : false,
            actionButton: element.actionGreenButton,
            secondaryButton: element.secondaryOrangeButton
          });
        }
      });
    }


    return res.json({ status: true, data: themeItems, message: '' });
  }

  public async saveATheme(req: Request, res: Response) {
    const themeData: any = req.body;
    console.log(themeData)
    if (themeData !== null && themeData !== undefined && themeData.form !== null && themeData.form !== undefined) {
      const theme = await prisma.theme.findFirst({
        where: {
          themeName: themeData.form.themeName.toUpperCase(),
          campusId: Number(themeData.campusId),
          userId: Number(themeData.userId),
        }
      });


      if (theme !== null && theme !== undefined) {
        //update theme
        console.log('Theme exists! updating theme');
        await prisma.theme.update({
          where: {
            id: theme.id,
            campusId: Number(themeData.campusId),
          },
          data: {
            scheme: themeData.form.lightOrDark,
            schemeColor: themeData.form.dark,
            fontFamily: themeData.form.fontFamily,
            fontSize: Number(themeData.form.fontSize),
            primaryColor: themeData.form.primaryColor,
            actionGreenButton: themeData.form.actionGreenButton,
            secondaryOrangeButton: themeData.form.secondaryOrangeButton,
            defaultRadius: themeData.form.defaultRadius,
            blue: themeData.form.blue,
            red: themeData.form.red,
            orange: themeData.form.orange,
            yellow: themeData.form.yellow,
            green: themeData.form.green,
            backg: themeData.form.backg,
            foreg: themeData.form.foreg,
            header: themeData.form.header,
            leftmenu: themeData.form.leftmenu,
            white: themeData.form.white,
            black: themeData.form.black,
            updated_at: new Date(),
            updated_by: themeData.userId
          },
        });
        return res.json({ status: true, data: null, message: 'Theme updated' });
      } else {
        //add theme
        console.log('Adding new theme');

        await prisma.theme.create({
          data: {
            campusId: Number(themeData.campusId),
            userId: Number(themeData.userId),
            themeName: themeData.form.themeName.toUpperCase(),
            active: 1,
            scheme: themeData.form.lightOrDark,
            schemeColor: themeData.form.dark,
            fontFamily: themeData.form.fontFamily,
            fontSize: Number(themeData.form.fontSize),
            primaryColor: themeData.form.primaryColor,
            actionGreenButton: themeData.form.actionGreenButton,
            secondaryOrangeButton: themeData.form.secondaryOrangeButton,
            defaultRadius: themeData.form.defaultRadius,
            blue: themeData.form.blue,
            red: themeData.form.red,
            orange: themeData.form.orange,
            yellow: themeData.form.yellow,
            green: themeData.form.green,
            backg: themeData.form.backg,
            foreg: themeData.form.foreg,
            header: themeData.form.header,
            leftmenu: themeData.form.leftmenu,
            white: themeData.form.white,
            black: themeData.form.black,
            created_at: new Date(),
            updated_at: new Date(),
            created_by: themeData.userId,
            updated_by: themeData.userId
          },
        });
        return res.json({ status: true, data: null, message: 'Theme saved' });
      }

    } else {
      return res.json({ status: false, data: null, message: 'Nothing to save' });
    }
  }


  //Get All Sesssions as SelectItem

  public async getAllSessions(req: Request, res: Response) {
    const sessions = await prisma.sessions.findMany({
    });
    let sessionSelectItems = [];

    if (sessions !== null && sessions !== undefined && sessions.length > 0) {
      sessions.forEach(async (element) => {
        sessionSelectItems.push({ label: element.session, value: element.id })
      });
    }
    return res.json({ status: true, data: sessionSelectItems, message: '' });
  }

  //ID Card Images Folder

  public async addImagesByType(req: Request, res: Response) {
    const settings: any = req.body;
    console.log(settings);
    try {
      if (settings !== null && settings !== undefined && Array.isArray(settings)) {
        settings.forEach(async (element) => {
          if (element !== null && element !== undefined && element.id !== null && element.id !== undefined) {
            await prisma.defaultImageSetting.update({
              where: {
                id: element.id,
              },
              data: {
                campusId: element.campusId,
                id: element.id,
                front: element.front,
                back: element.back,
                type: element.type,
                forUser: element.forUser,
                updated_by: element.updated_by,
                updated_at: new Date()
              },
            });

          } else {

            await prisma.defaultImageSetting.create({
              data: {
                campusId: element.campusId,
                front: element.front,
                back: element.back,
                type: element.type,
                forUser: element.forUser,
                created_by: element.created_by,
                updated_by: element.updated_by
              },
            });

          }
        });

      }
      return res.json({ data: null, status: true, message: 'Settings saved' });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message, status: true, data: null })
    }
  }


  public async getImagesByType(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const type = String(req.params.type);
    console.log(type);
    let settings = await prisma.defaultImageSetting.findMany({
      where: {
        campusId: Number(campusId),
        type: type,
      },
      include: {
        campus: true,

      },
    });


    return res.json({ status: true, data: settings, message: 'Settings fetched' });
  }

  //Online Meetings

  public async getOnlineMeetings(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    console.log(campusId + ' campusId--- ' + campusId);

    let meeting = await prisma.onlineClasses.findMany({
      where: {
        campusId: Number(campusId),
        active: 1,
      },
      include: {
        campus: true,
        class: true,
        section: true
      },
    });


    return res.json({ status: true, data: meeting, message: 'Meetings fetched' });
  }


  public async getOnlineMeetingsByClassSection(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const classId = Number(req.params.classId);
    const sectionId = Number(req.params.sectionId);

    let meeting = await prisma.onlineClasses.findMany({
      where: {
        campusId: Number(campusId),
        classId: Number(classId),
        sectionId: Number(sectionId),
        active: 1,
      },
      include: {
        campus: true,
        class: true,
        section: true
      },
    });


    return res.json({ status: true, data: meeting, message: 'Meetings fetched' });
  }


  public async saveOnlineMeeting(req: Request, res: Response) {
    const data: any = req.body;
    console.log(data);
    try {
      const savedClass = await prisma.onlineClasses.create({
        data: data.form,
      });
      return res.json({ data: savedClass, status: true, message: 'Online Class saved' });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message, status: true, data: null })
    }
  }


  public async generateOnlineToken(req: Request, res: Response) {
    const tokenData: any = req.body;

    if (!tokenData) {
      return res.status(400).json({ status: false, data: null, message: 'Token data is required' });
    }

    const now = new Date()


    var privateKey = fs.readFileSync(process.env.JITSU_PRIVATE_KEY_PATH);

    const jwtToken = jwt.sign({
      aud: 'jitsi',
      context: {
        user: {
          id: tokenData.context.user.id,
          name: tokenData.context.user.name,
          avatar: tokenData.context.user.avatar,
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


    return res.json({ status: true, data: jwtToken, message: '' });
  }

  //List of Values


  public async getLOVByUniqueKey(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const uniqueKey = String(req.params.uniqueKey);
    console.log(uniqueKey);
    let lov = await prisma.listOfValues.findUnique({
      where: {
        campusId: Number(campusId),
        uniqueKey: uniqueKey,
        active: 1
      },
    });
    return res.json({ status: true, data: lov, message: '' });
  }


  public async getLOVByGroupName(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const groupName = String(req.params.groupName);
    console.log(groupName);

    let lovs = await prisma.listOfValues.findMany({
      where: {
        campusId: Number(campusId),
        groupName: groupName,
        active: 1
      },
    });
    return res.json({ status: true, data: lovs, message: '' });
  }


  public async createOrUpdateLovs(req: Request, res: Response) {
    const lovs: any = req.body;
    console.log(lovs);
    try {
      if (lovs !== null && lovs !== undefined && Array.isArray(lovs)) {

        lovs.forEach(async (element) => {
          if (element !== null && element !== undefined && element.id !== null && element.id !== undefined) {

            await prisma.listOfValues.update({
              where: {
                id: element.id,
              },
              data: {
                campusId: element.campusId,
                id: element.id,
                groupName: element.groupName,
                uniqueKey: element.uniqueKey,
                shortName: element.shortName,
                longName: element.longName,
                description: element.desc,
                active: element.active,
                updated_by: element.updated_by,
                updated_at: new Date()
              },
            });

          } else {

            await prisma.listOfValues.create({
              data: {
                campusId: element.campusId,
                groupName: element.groupName,
                uniqueKey: element.uniqueKey,
                shortName: element.shortName,
                longName: element.longName,
                description: element.desc,
                active: element.active,
                updated_by: element.updated_by,
                updated_at: new Date(),
                created_by: element.created_by,
                created_at: new Date(),
              },
            });

          }
        });

      }
      return res.json({ data: null, status: true, message: 'Saved' });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message, status: true, data: null })
    }
  }

  //Timetable
  public async getTimeTable(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const classId = Number(req.params.classId);
    const sectionId = Number(req.params.sectionId);
    const sessionId = Number(req.params.sessionId);
    let data = [];

    //get Recurring timetable
    let session = await prisma.sessions.findUnique({
      where: {
        id: sessionId
      },
      include: {
        campus: true,
      },
    });

    let timtables = await prisma.timeTable.findMany({
      where: {
        campusId: Number(campusId),
        classId: Number(classId),
        sectionId: Number(sectionId),
        ongoingSessionId: Number(sessionId),
        active: 1,
        isRecurring: 0
      },
      include: {
        campus: true,
        class: true,
        section: true,
      },
    });

    let Leavestimtables = await prisma.timeTable.findMany({
      where: {
        campusId: Number(campusId),
        classId: null,
        sectionId: null,
        ongoingSessionId: Number(sessionId),
        active: 1,
        isRecurring: 0
      },
      include: {
        campus: true,
        class: true,
        section: true,
      },
    });



    if (timtables !== null && timtables !== undefined && timtables.length > 0) {
      timtables.forEach(async (eachItem) => {
        data.push({
          title: eachItem.subject,
          description: eachItem.id,
          duration: eachItem.duration,
          backgroundColor: eachItem.bgcolor,
          textColor: 'white',
          start: eachItem.start,
          end: eachItem.end,
          isRecurring: false
        });
      });
    }

    if (Leavestimtables !== null && Leavestimtables !== undefined && Leavestimtables.length > 0) {
      Leavestimtables.forEach(async (eachItem) => {
        data.push({
          title: eachItem.subject,
          description: eachItem.id,
          duration: eachItem.duration,
          backgroundColor: eachItem.bgcolor,
          textColor: 'white',
          start: eachItem.start,
          end: eachItem.end,
          isRecurring: false
        });
      });
    }
    //END get Recurring timetable

    return res.json({ status: true, data: { data: data, session: session }, message: 'Calendar retrieved' });
  }




  public async saveTimeTable(req: Request, res: Response) {
    const timetable: any = req.body;

    try {
      if (timetable !== null && timetable !== undefined && timetable.form !== null && timetable.form !== undefined &&
        timetable.events !== null && timetable.events !== undefined && Array.isArray(timetable.events) && timetable.events.length > 0) {

        let session = await prisma.sessions.findUnique({
          where: {
            id: Number(timetable.form.sessionId)
          },
          include: {
            campus: true,
          },
        });
        if (session !== null && session !== undefined) {
          const startDate = new Date(session.startYear + '-' + session.startMonth + '-01');
          const endDate = new Date(session.endYear + '-' + (session.endMonth + 1) + '-01');
          const allDays = getAllDaysBetweenDates(startDate, endDate, getIsoDay(timetable.form.day));
          if (allDays !== null && allDays !== undefined && allDays.length > 0) {
            for (let i = 0; i < allDays.length; i++) {
              timetable.events.forEach(async (event) => {
                if (event !== null && event !== undefined) {
                  console.log('Parsing event :---' + event.subjectValue);
                  console.log(moment("2019-01-19 " + event.startTime, 'YYYY-MM-DD HH:mm'));
                  console.log(moment("2019-01-19 " + event.endTime, 'YYYY-MM-DD HH:mm'))

                  var duration = moment.duration(
                    moment("2019-01-19 " + event.endTime, 'YYYY-MM-DD HH:mm').diff(moment("2019-01-19 " + event.startTime, 'YYYY-MM-DD HH:mm')));

                  const formatted = moment.utc(duration.asMilliseconds()).format('HH:mm');
                  console.log('Formatted Time Duration:-' + formatted);
                  var startTimeAndDate = moment(allDays[i] + ' ' + event.startTime);
                  var endTimeAndDate = moment(allDays[i] + ' ' + event.endTime);

                  await prisma.timeTable.create({
                    data: {
                      classId: timetable.form.classId,
                      sectionId: timetable.form.sectionId,
                      campusId: timetable.form.campusId,
                      subject: event.subjectValue,
                      ongoingSessionId: timetable.form.sessionId,
                      active: 1,
                      day: timetable.form.day,
                      year: timetable.form.year,
                      start: startTimeAndDate.toISOString(),
                      end: endTimeAndDate.toISOString(),
                      startTime: event.startTime,
                      endTime: event.endTime,
                      duration: formatted,
                      isRecurring: 0,
                      bgcolor: event.color,
                      color: event.color,
                      created_by: timetable.form.created_by,
                      created_at: new Date(),
                      updated_by: timetable.form.updated_by,
                      updated_at: new Date()
                    },
                  });
                  console.log('Saved Event :---' + event.endTime);
                }
              });
            }
          }
        }
      }
      return res.json({ data: null, status: true, message: 'Event added' });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message, status: true, data: null })
    }
  }


  public async saveAdhocTimeTable(req: Request, res: Response) {
    const timetable: any = req.body;
    console.log(timetable.form.startDate);
    console.log(timetable.form.endDate);
    const year = moment(timetable.form.startDate).year();
    console.log(timetable);

    const institute = await prisma.institute.findFirst();

    try {
      if (timetable !== null && timetable !== undefined && timetable.form !== null && timetable.form !== undefined) {
        await prisma.timeTable.create({
          data: {
            classId: timetable.form.classId,
            sectionId: timetable.form.sectionId,
            campusId: timetable.form.campusId,
            subject: timetable.form.event,
            ongoingSessionId: timetable.form.sessionId,
            year: year + '',
            active: 1,
            day: '',
            duration: '',
            startTime: '',
            endTime: '',
            start: timetable.form.startDate,
            end: timetable.form.endDate,
            isRecurring: 0,
            bgcolor: timetable.form.color,
            color: timetable.form.color,
            created_by: timetable.form.created_by,
            created_at: new Date(),
            updated_by: timetable.form.updated_by,
            updated_at: new Date()
          },
        });

        if (timetable.form.addToLeave === '1') {
          await prisma.holidays.create({
            data: {
              classId: timetable.form.classId,
              sectionId: timetable.form.sectionId,
              campusId: timetable.form.campusId,
              name: timetable.form.event,
              ongoingSessionId: timetable.form.sessionId,
              active: 1,
              holidayStart: timetable.form.startDate,
              holidayEnd: timetable.form.endDate,
              created_by: timetable.form.created_by,
              created_at: new Date(),
              updated_by: timetable.form.updated_by,
              updated_at: new Date()
            },
          });
        }

      }
      return res.json({ data: null, status: true, message: 'Event added' });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message, status: true, data: null })
    }
  }


  public async saveHoliday(req: Request, res: Response) {
    const timetable: any = req.body;
    console.log(timetable);
    const institute = await prisma.institute.findFirst();

    try {
      if (timetable !== null && timetable !== undefined && timetable.form !== null && timetable.form !== undefined) {
        await prisma.timeTable.create({
          data: {
            classId: timetable.form.classId === null || (timetable.form.classId !== null && timetable.form.classId === '') ? null : timetable.form.classId,
            sectionId: timetable.form.sectionId === null || (timetable.form.sectionId !== null && timetable.form.sectionId === '') ? null : timetable.form.sectionId,
            year: timetable.form.year,
            campusId: timetable.form.campusId,
            subject: timetable.form.event,
            ongoingSessionId: timetable.form.sessionId,
            active: 1,
            day: '',
            duration: '',
            startTime: '',
            endTime: '',
            start: timetable.form.startDate,
            end: timetable.form.endDate,
            isRecurring: 0,
            bgcolor: timetable.form.color,
            color: timetable.form.color,
            created_by: timetable.form.created_by,
            created_at: new Date(),
            updated_by: timetable.form.updated_by,
            updated_at: new Date()
          },
        });

        await prisma.holidays.create({
          data: {
            classId: timetable.form.classId === null || (timetable.form.classId !== null && timetable.form.classId === '') ? null : timetable.form.classId,
            sectionId: timetable.form.sectionId === null || (timetable.form.sectionId !== null && timetable.form.sectionId === '') ? null : timetable.form.sectionId,
            ongoingSessionId: timetable.form.sessionId,
            campusId: timetable.form.campusId,
            name: timetable.form.event,
            active: 1,
            holidayStart: timetable.form.startDate,
            holidayEnd: timetable.form.endDate,
            created_by: timetable.form.created_by,
            created_at: new Date(),
            updated_by: timetable.form.updated_by,
            updated_at: new Date()
          },
        });

      }
      return res.json({ data: null, status: true, message: 'Event added' });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message, status: true, data: null })
    }
  }





  public async deleteTimeTableEvent(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const id = Number(req.params.id);
    console.log(id);

    let lovs = await prisma.timeTable.delete({
      where: {
        campusId: Number(campusId),
        id: id,
      },
    });
    return res.json({ status: true, data: null, message: 'Refresh page to see change' });
  }


  public async getAllHolidays(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const classId = req.params.classId;
    const sessionId = req.params.sessionId;
    const sectionId = req.params.sectionId;
    let holidays = [];
    let designatedholidaysToRender = getBlankMonthWiseHolidayList();
    console.log(req.params)


    let commonHolidays = await prisma.holidays.findMany({
      where: {
        campusId: Number(campusId),
        ongoingSessionId: Number(sessionId),
        classId: null,
        sectionId: null,
        active: 1,
      },
      include: {
        campus: true,
        class: true,
        section: true,
      },
    });
    holidays = holidays.concat(commonHolidays);

    if (classId !== null && sectionId !== null && classId !== '0' && sectionId !== '0') {

      let classholidays = await prisma.holidays.findMany({
        where: {
          campusId: Number(campusId),
          ongoingSessionId: Number(sessionId),
          classId: Number(classId),
          sectionId: Number(sectionId),
          active: 1,
        },
        include: {
          campus: true,
          class: true,
          section: true,
        },
      });
      holidays = holidays.concat(classholidays);
    }

    if (holidays !== null && holidays !== undefined && holidays.length > 0) {

      for (let i = 0; i < holidays.length; i++) {
        if (holidays[i].holidayStart !== null && holidays[i].holidayStart !== undefined) {
          let foundMonth: string = moment(holidays[i].holidayStart).format('MMMM');

          const thatsMonthData = designatedholidaysToRender.filter((month) => month.month === foundMonth);
          console.log(thatsMonthData);

          if (thatsMonthData !== null && thatsMonthData !== undefined && thatsMonthData.length === 1) {
            thatsMonthData[0].holidays.push(holidays[i].name + " (" + moment(holidays[i].holidayStart).format('DD/MM') + " )");
          }
        }
      }
    }
    return res.json({ status: true, data: { holidays: holidays, calenderRender: designatedholidaysToRender }, message: 'Holidays retrieved' });
  }




  public async deleteHoliday(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const id = Number(req.params.id);
    const userId = Number(req.params.currentUserId);
    console.log(id);

    await prisma.holidays.update({
      where: {
        id: id,
        campusId: campusId
      },
      data: {
        active: 0,
        updated_by: userId,
        updated_at: new Date()
      }
    });
    return res.json({ status: true, data: null, message: 'Deleted successfully' });
  }

  public async getAllSMSTemplates(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);

    const smsTemplates = await prisma.sMSTemplate.findMany({
      where: {
        campusId: campusId
      },
    });
    return res.json({ status: true, data: smsTemplates, message: 'Templates retrieved' });
  }

  public async saveSmsTemplates(req: Request, res: Response) {
    const smsTemplates: any = req.body;
    try {
      if (smsTemplates !== null && smsTemplates !== undefined && smsTemplates.smsTemplates !== null && smsTemplates.smsTemplates !== undefined) {

        smsTemplates.smsTemplates.forEach(async (element) => {
          await prisma.sMSTemplate.update({
            where: {
              id: element.id,
              campusId: element.campusId
            },
            data: {
              body: element.body,
              updated_by: element.updated_by,
              updated_at: new Date()
            },
          });
        });
      }
      return res.json({ data: null, status: true, message: 'SMS Templates updated' });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message, status: true, data: null })
    }
  }

  public async getSmsTemplateByName(name: string) {
    let smsTemplate = await prisma.sMSTemplate.findMany({
      where: {
        name: name,
        active: 1
      },
    });
    return smsTemplate;
  }

  public async getAllEmailTemplates(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);

    const emailTemplate = await prisma.emailTemplate.findMany({
      where: {
        campusId: campusId
      },
    });
    return res.json({ status: true, data: emailTemplate, message: 'Templates retrieved' });
  }


  public async saveEmailTemplates(req: Request, res: Response) {
    const emailTemplates: any = req.body;
    try {
      if (emailTemplates !== null && emailTemplates !== undefined && emailTemplates.emailtemplates !== null && emailTemplates.emailtemplates !== undefined) {


        emailTemplates.emailtemplates.forEach(async (element: EmailTemplate) => {

          if (element.isEditable) {
            await prisma.emailTemplate.update({
              where: {
                id: element.id,
                campusId: element.campusId
              },
              data: {
                body: element.body,
                subject: element.subject,
                updated_by: element.updated_by,
                updated_at: new Date()
              },
            });
          }
        });
      }
      return res.json({ data: null, status: true, message: 'Email Templates updated' });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message, status: true, data: null })
    }
  }

  public async getEmailHistory(req: Request, res: Response) {
    const formvalues: any = req.body;
    console.log(formvalues)
    let history = [];
    try {
      if (formvalues !== null && formvalues !== undefined) {

        history = await prisma.emailHistory.findMany({
          where: {
            campusId: Number(formvalues.form.campusId),
            created_at: {
              gte: moment(formvalues.form.startDate, 'DD-MM-YYYY').toDate(),
              lte: moment(formvalues.form.endDate, 'DD-MM-YYYY').toDate(),
            }
          },
        });
      }
      return res.json({ data: history, status: true, message: 'History fetched' });

    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message, status: true, data: null })
    }
  }

  public async getSmsHistory(req: Request, res: Response) {
    const formvalues: any = req.body;
    console.log(formvalues)
    let history = [];
    try {
      if (formvalues !== null && formvalues !== undefined) {

        history = await prisma.sMSHistory.findMany({
          where: {
            campusId: Number(formvalues.form.campusId),
            created_at: {
              gte: moment(formvalues.form.startDate, 'DD-MM-YYYY').toDate(),
              lte: moment(formvalues.form.endDate, 'DD-MM-YYYY').toDate(),
            }
          },
        });
      }
      return res.json({ data: history, status: true, message: 'History fetched' });

    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message, status: true, data: null })
    }
  }

  //Notice board
  public async getNoticesByType(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const active = Number(req.params.active);
    const type = req.params.type;

    if (type === 'ALL') {

      const notices = await prisma.noticeBoard.findMany({
        where: {
          campusId: campusId,
          active: Number(active)
        },
        include: {
          campus: true,

        },
      });
      return res.json({ status: true, data: notices, message: 'Notices retrieved' });

    } else {
      const notices = await prisma.noticeBoard.findMany({
        where: {
          campusId: campusId,
          active: Number(active),
          messageType: MessageType[type]
        },
        include: {
          campus: true,

        },
      });
      return res.json({ status: true, data: notices, message: 'Notices retrieved' });
    }

  }

  public async addANotice(req: Request, res: Response) {
    const noticeForm: any = req.body;
    try {
      if (noticeForm !== null && noticeForm !== undefined) {
        await prisma.noticeBoard.create({
          data: {
            campusId: noticeForm.form.campusId,
            active: 1,
            name: noticeForm.form.name,
            message: noticeForm.form.message,
            messageType: noticeForm.form.messageType,
            created_by: noticeForm.form.created_by,
            created_at: new Date()
          },
        });
      }
      return res.json({ data: null, status: true, message: 'Noticeboard added' });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message, status: true, data: null })
    }
  }

  public async changeNoticeStatus(req: Request, res: Response) {
    const noticeForm: any = req.body;

    try {
      if (noticeForm !== null && noticeForm !== undefined) {
        console.log(noticeForm);

        await prisma.noticeBoard.findUnique({
          where: {
            id: noticeForm.id,
            campusId: noticeForm.campusId,
          },
        }).then(async (existingData) => {

          if (existingData !== null && existingData !== undefined) {
            let isActive: number = existingData.active;
            console.log('Current Active Status : ' + isActive);
            await prisma.noticeBoard.update({
              where: {
                id: noticeForm.id,
                campusId: noticeForm.campusId,
              },
              data: {
                active: isActive === 1 ? 0 : 1,
                created_by: Number(noticeForm.currentUserid),
                created_at: new Date()
              },
            });

            return res.json({ data: null, status: true, message: 'Noticeboard updated' });
          }

        });

      }

    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message, status: true, data: null })
    }
  }


  public async getActiveCampuses(req: Request, res: Response) {

    const campuses = await prisma.campus.findMany({
      include: {
        TransportRoutes: true,
        Class: true,
        Section: true,
        Subject: true,
        User: true,
      }
    });
    return res.json({ status: true, data: campuses, message: 'Campus details retrieved' });
  }


  public async getStudyMaterials(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);

    const studyMaterials = await prisma.studyMaterial.findMany({
      where: {
        campusId: Number(campusId),
      },
      include: {
        campus: true,
        class: true,
        section: true,
        subject: true
      }
    });
    return res.json({ status: true, data: studyMaterials, message: 'Study Materials retrieved' });
  }

  public async getStudyMaterialsByClassSection(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const classId = Number(req.params.classId);
    const sectionId = Number(req.params.sectionId);

    const studyMaterials = await prisma.studyMaterial.findMany({
      where: {
        campusId: Number(campusId),
        classId: Number(classId),
        sectionId: Number(sectionId),
      },
      include: {
        campus: true,
        class: true,
        section: true,
        subject: true
      }
    });
    return res.json({ status: true, data: studyMaterials, message: 'Study Materials retrieved' });
  }


  public async changeStudyMaterialStatus(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const id = Number(req.params.id);
    const userId = Number(req.params.currentUserId);

    await prisma.studyMaterial.update({
      where: {
        id: id,
        campusId: campusId
      },
      data: {
        active: 0,
        updated_by: userId,
        updated_at: new Date()
      }
    });
    return res.json({ status: true, data: null, message: 'Updated successfully' });
  }

  public async deleteStudyMaterial(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const id = Number(req.params.id);

    await prisma.studyMaterial.delete({
      where: {
        id: id,
        campusId: campusId
      },
    });
    return res.json({ status: true, data: null, message: 'Deleted successfully' });
  }

  public async addUpdateStudyMaterial(req: Request, res: Response) {
    const studyMaterialForm: any = req.body;

    try {
      if (studyMaterialForm !== null && studyMaterialForm !== undefined && studyMaterialForm.form.id !== null && studyMaterialForm.form.id !== undefined) {
        await prisma.studyMaterial.update({
          where: {
            id: Number(studyMaterialForm.form.id),
            campusId: Number(studyMaterialForm.form.campusId),
          },
          data: {
            campusId: Number(studyMaterialForm.form.campusId),
            classId: Number(studyMaterialForm.form.classId),
            sectionId: Number(studyMaterialForm.form.sectionId),
            subjectId: Number(studyMaterialForm.form.subjectId),
            active: 1,
            title: studyMaterialForm.form.title,
            url: studyMaterialForm.form.url,
            description: studyMaterialForm.form.description,
            fileType: FileType[studyMaterialForm.form.fileType],
            created_by: studyMaterialForm.form.created_by,
            created_at: new Date(),
            updated_by: studyMaterialForm.form.created_by,
            updated_at: new Date()
          },
        });

        return res.json({ data: null, status: true, message: 'Study Material updated' });
      } else {
        await prisma.studyMaterial.create({
          data: {
            campusId: Number(studyMaterialForm.form.campusId),
            classId: Number(studyMaterialForm.form.classId),
            sectionId: Number(studyMaterialForm.form.sectionId),
            subjectId: Number(studyMaterialForm.form.subjectId),
            active: 1,
            title: studyMaterialForm.form.title,
            url: studyMaterialForm.form.url,
            description: studyMaterialForm.form.description,
            fileType: FileType[studyMaterialForm.form.fileType],
            created_by: studyMaterialForm.form.created_by,
            created_at: new Date(),
            updated_by: studyMaterialForm.form.created_by,
            updated_at: new Date()
          },
        });

        return res.json({ data: null, status: true, message: 'Study Material added' });
      }


    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message, status: true, data: null })
    }
  }



  public async addACampus(req: Request, res: Response) {
    const campusForm: any = req.body;
    try {
      if (campusForm !== null && campusForm !== undefined) {
        await prisma.campus.create({
          data: {
            active: 1,
            campusName: campusForm.form.campusName,
            campusAddress: campusForm.form.campusAddress,
            campusPhone: campusForm.form.campusPhone,
            instituteId: campusForm.form.instituteId,
            created_by: campusForm.form.created_by,
            created_at: new Date(),
            updated_by: campusForm.form.created_by,
            updated_at: new Date()
          },
        });
      }
      return res.json({ data: null, status: true, message: 'Campus added' });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message, status: true, data: null })
    }
  }


  public async changeCampusStatus(req: Request, res: Response) {
    const campusForm: any = req.body;

    try {
      if (campusForm !== null && campusForm !== undefined) {
        console.log(campusForm);

        await prisma.campus.findUnique({
          where: {
            id: campusForm.id,
          },
        }).then(async (existingData) => {

          if (existingData !== null && existingData !== undefined) {
            let isActive: number = existingData.active;
            console.log('Current Campus Active Status : ' + isActive);

            await prisma.campus.update({
              where: {
                id: campusForm.id,
              },
              data: {
                active: isActive === 1 ? 0 : 1,
                updated_by: Number(campusForm.currentUserid),
                updated_at: new Date()
              },
            });

            return res.json({ data: null, status: true, message: 'Updated. Relogin to see changes.' });
          }

        });

      }

    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message, status: true, data: null })
    }
  }


  public async fetchHomeworks(req: Request, res: Response) {
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

    return res.json({ status: true, data: result, message: 'Homework details retrieved' });
  }


  public async addAHomework(req: Request, res: Response) {
    const homeworkform: any = req.body;
    try {
      if (homeworkform !== null && homeworkform !== undefined) {
        await prisma.dailyHomework.create({
          data: {
            active: 1,
            campusId: homeworkform.form.campusId,
            classId: homeworkform.form.classId,
            sectionId: homeworkform.form.sectionId,
            homeworkDate: moment(homeworkform.form.homeworkDate, 'DD-MM-YYYY').toDate(),
            homeworkData: homeworkform.form.homeworkData,
            created_by: homeworkform.form.created_by,
            created_at: new Date(),
            updated_by: homeworkform.form.created_by,
            updated_at: new Date()
          },
        });
      }
      return res.json({ data: null, status: true, message: 'Homework added' });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message, status: true, data: null })
    }
  }



  //generic emails

  public async resetPassword(req: Request, res: Response) {
    const resetpasswordform: any = req.body;
    try {
      if (resetpasswordform !== null && resetpasswordform !== undefined &&
        resetpasswordform.user !== null && resetpasswordform.user !== undefined
      ) {

        let template: EmailTemplate = await getEmailTemplateByName('Reset Password');
        let resetPasswordWebAppUrlFrontEnd = process.env.WEB_APP_URL + 'reset-password';
        let templateHtml = resetPasswordTemplate;
        templateHtml = templateHtml.replaceAll("$USERNAME", resetpasswordform.user.displayName);
        templateHtml = templateHtml.replaceAll("$SCHOOLNAME", resetpasswordform.institute.instituteName);
        templateHtml = templateHtml.replaceAll("$SCHOOLLOGO", resetpasswordform.institute.logo);
        templateHtml = templateHtml.replaceAll("$CODE", resetpasswordform.otp);
        templateHtml = templateHtml.replaceAll("$RESET_PASSWORD_URL", resetPasswordWebAppUrlFrontEnd);

        console.log(resetpasswordform.otp);
        console.log(resetPasswordWebAppUrlFrontEnd);


        sendEmailCommon(resetpasswordform.institute,
          'Reset Password Requested for ' + resetpasswordform.user.displayName,
          templateHtml,
          [{ email: resetpasswordform.user.email, name: resetpasswordform.user.name, }],
          template.name, resetpasswordform.campusId,
          template.id,
          resetpasswordform.currentUserid
        );
        changeAccountResetStatus(resetpasswordform.user, resetpasswordform.campusId, resetpasswordform.otp + '', true);

      }
      return res.json({ data: null, status: true, message: 'Reset requested. Relogin to see changes.' });

    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message, status: true, data: null })
    }
  }



  //Fee Plan
  public async getActiveFeePlansForDropdown(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const institute = await prisma.institute.findFirst();


    let feePlansDropdown = [];
    const feePlans = await prisma.feePlan.findMany({
      where: {
        campusId: campusId,
        active: 1
      },
      orderBy: {
        name: 'asc'
      }
    });
    if (feePlans !== null && feePlans !== undefined && feePlans.length > 0) {
      for (let i = 0; i < feePlans.length; i++) {
        feePlansDropdown.push({
          value: feePlans[i].id + '',
          label: feePlans[i].name + ' (Monthly: ' + getCurrencySymbol('en-US', institute !== null && institute !== undefined && institute.currency !== null && institute.currency !== undefined ? institute.currency : 'INR') + feePlans[i].monthlyAmt + ', Yearly: ' + getCurrencySymbol('en-US', institute !== null && institute !== undefined && institute.currency !== null && institute.currency !== undefined ? institute.currency : 'INR') + feePlans[i].yearlyAmt + ' )'
        });
      }
    }
    return res.json({ status: true, data: feePlansDropdown, message: '' });
  }

  public async getActiveFeePlans(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);

    const feePlans = await prisma.feePlan.findMany({
      where: {
        campusId: campusId,
      },
      include: {
        campus: true,
        FeePlanBreakup: {
          orderBy: {
            amount: 'desc',
          }
        },
      },
      orderBy: {
        updated_at: 'desc'
      }
    });
    return res.json({ status: true, data: feePlans, message: 'Fee Plans retrieved' });
  }

  public async getFeePlanBreakup(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    let myuuid = uuidv4();
    let blankFeeBreakup = [
      {
        id: uuidv4(),
        feePlanId: 0,
        campusId: campusId,
        isYearly: 1,
        breakupname: 'Admission Fee',
        amount: 2500
      },
      {
        id: uuidv4(),
        feePlanId: 0,
        campusId: campusId,
        isYearly: 1,
        breakupname: 'Exam Fee',
        amount: 500
      },
      {
        id: uuidv4(),
        feePlanId: 0,
        campusId: campusId,
        isYearly: 1,
        breakupname: 'Id Card Fee',
        amount: 150
      },
      {
        id: uuidv4(),
        feePlanId: 0,
        campusId: campusId,
        isYearly: 0,
        breakupname: 'Monthly Fee',
        amount: 500
      },

    ];

    return res.json({ status: true, data: blankFeeBreakup, message: '' });
  }



  public async addUpdateFeePlan(req: Request, res: Response) {
    const formData: any = req.body;
    console.log(formData)
    try {
      if (formData !== null && formData !== undefined) {
        if (formData.feeId !== null && formData.feeId !== undefined) {
          //delete existing fee breakups
          await prisma.feePlanBreakup.deleteMany({
            where: {
              campusId: Number(formData.campusId),
              feePlanId: Number(formData.feeId),
            }
          });
          let monthlyAmount = 0;
          let yearlyAmount = 0;

          //Update fee id
          if (formData.feeBreakUp !== null && formData.feeBreakUp !== undefined && formData.feeBreakUp.length > 0) {

            for (let i = 0; i < formData.feeBreakUp.length; i++) {
              let element = formData.feeBreakUp[i];
              if (element.isYearly === 1) {
                yearlyAmount = Number(yearlyAmount) + Number(element.amount);
              } else {
                monthlyAmount = Number(monthlyAmount) + Number(element.amount);
              }
              await prisma.feePlanBreakup.create({
                data: {
                  feePlanId: Number(formData.feeId),
                  campusId: Number(formData.campusId),
                  isYearly: Number(element.isYearly),
                  breakupname: String(element.breakupname),
                  amount: Number(element.amount),
                },
              });
            }
          }
          console.log('Updated yearlyAmount :' + yearlyAmount + ' monthlyAmount: ' + monthlyAmount)

          let feePlan = await prisma.feePlan.update({
            where: {
              campusId: Number(formData.campusId),
              id: Number(formData.feeId),
            },
            data: {
              name: formData.feeName,
              monthlyAmt: monthlyAmount,
              yearlyAmt: yearlyAmount,
              updated_by: formData.created_by,
              updated_at: new Date()
            },
          });

          return res.json({ data: null, status: true, message: 'Fee Plan updated' });
        } else {
          let monthlyAmount = 0;
          let yearlyAmount = 0;

          if (formData.feeBreakUp !== null && formData.feeBreakUp !== undefined && formData.feeBreakUp.length > 0) {
            for (let i = 0; i < formData.feeBreakUp.length; i++) {
              let element = formData.feeBreakUp[i];
              if (element.isYearly === 1) {
                yearlyAmount = Number(yearlyAmount) + Number(element.amount);
              } else {
                monthlyAmount = Number(monthlyAmount) + Number(element.amount);
              }
            }
            console.log('New yearlyAmount :' + yearlyAmount + ' monthlyAmount: ' + monthlyAmount)
          }

          let feePlan = await prisma.feePlan.create({
            data: {
              active: 1,
              campusId: Number(formData.campusId),
              name: formData.feeName,
              monthlyAmt: monthlyAmount,
              yearlyAmt: yearlyAmount,
              created_by: formData.created_by,
              created_at: new Date(),
              updated_by: formData.created_by,
              updated_at: new Date()
            },
          });

          if (feePlan !== null && feePlan !== undefined && formData.feeBreakUp !== null && formData.feeBreakUp !== undefined && formData.feeBreakUp.length > 0) {
            for (let i = 0; i < formData.feeBreakUp.length; i++) {
              let element = formData.feeBreakUp[i];
              await prisma.feePlanBreakup.create({
                data: {
                  feePlanId: Number(feePlan.id),
                  campusId: Number(formData.campusId),
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
      return res.status(400).json({ message: error.message, status: true, data: null })
    }
  }

  public async changeFeePlanStatus(req: Request, res: Response) {
    const feeForm: any = req.body;

    try {
      if (feeForm !== null && feeForm !== undefined) {
        console.log(feeForm);

        await prisma.feePlan.findUnique({
          where: {
            id: feeForm.id,
            campusId: feeForm.campusId,
          },
        }).then(async (existingData) => {

          if (existingData !== null && existingData !== undefined) {
            let isActive: number = existingData.active;
            console.log('Current Active Status : ' + isActive);

            await prisma.feePlan.update({
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

            return res.json({ data: null, status: true, message: 'Fee Plan updated' });
          }

        });

      }

    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message, status: true, data: null })
    }
  }

  //Leaves
  public async getAllLeavesForApproval(req: Request, res: Response) {
    const leaveForm: any = req.body;

    let leaves = await prisma.leaves.findMany({
      where: {
        campusId: Number(leaveForm.form.campusId),
        isApproved: Number(leaveForm.form.isApproved),
        userType: {
          in: leaveForm.form.userType === 'student' ? [UserType.student] : [UserType.staff, UserType.accountant, UserType.admin]
        },
      },
      include: {
        campus: true,
        LeaveDates: {
          orderBy: [
            {
              date: 'asc',
            },
          ],
        },
        user: true
      },
    });


    return res.json({ status: true, data: leaves, message: 'Leaves retrieved' });
  }

  public async approveRejectRequest(req: Request, res: Response) {
    const leaveForm: any = req.body;
    console.log(leaveForm)

    let leaves = await prisma.leaves.update({
      where: {
        id: Number(leaveForm.id),
        campusId: Number(leaveForm.campusId),
      },
      data: {
        isApproved: leaveForm.status === 'Approve' ? 1 : leaveForm.status === 'Reject' ? 2 : 0,
        updated_at: new Date(),
        updated_by: leaveForm.updatedBy,
        rejectApproveReason: leaveForm.rejectApproveReason
      },
    });
    //Add notification
    addANotification(Number(leaveForm.campusId),
      Number(leaves.created_by),
      Number(leaveForm.updatedBy),
      buildMessage(LEAVE_REQUEST_APP_REJ,
        leaves.id + '',
        leaveForm.status,
        leaveForm.rejectApproveReason));

    return res.json({ status: true, data: leaves, message: leaveForm.status === 'Approve' ? 'Leave Request Approved' : 'Leave Request Rejected' });
  }


  public async getLeavesByUser(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const userId = Number(req.params.userId);

    let leaves = await prisma.leaves.findMany({
      where: {
        campusId: Number(campusId),
        userId: Number(userId),
      },
      include: {
        campus: true,
        LeaveDates: {
          orderBy: [
            {
              date: 'asc',
            },
          ],
        },
        user: true
      },
    });


    return res.json({ status: true, data: leaves, message: 'Leaves retrieved' });
  }

  public async addUpdateLeaves(req: Request, res: Response) {
    const leaveForm: any = req.body;

    try {
      if (leaveForm !== null && leaveForm !== undefined
        && leaveForm.form !== null && leaveForm.form !== undefined) {
        if (leaveForm.leaveDates.length > 0) {
          leaveForm.leaveDates.filter((item, index) => leaveForm.leaveDates.indexOf(item) === index);
          console.log(leaveForm.leaveDates)
          if (leaveForm.form.id !== null && leaveForm.form.id !== undefined) {

            await prisma.leaves.update({
              where: {
                id: leaveForm.form.id,
                campusId: leaveForm.form.campusId,
              },
              data: {
                reason: leaveForm.form.reason,
                updated_by: leaveForm.form.created_by,
                updated_at: new Date()
              },
            }).then(async (leaveReq) => {
              console.log(leaveReq)
              await prisma.leaveDates.deleteMany({
                where: {
                  leaveId: leaveForm.form.id,
                  campusId: leaveForm.form.campusId,
                },
              }).then(async (isDeleted) => {
                for (let i = 0; i < leaveForm.leaveDates.length; i++) {
                  console.log(leaveForm.leaveDates[i])
                  await prisma.leaveDates.create({
                    data: {
                      campusId: leaveForm.form.campusId,
                      leaveId: leaveReq.id,
                      date: leaveForm.leaveDates[i],
                    },
                  })
                }
              })
            });
          } else {
            await prisma.leaves.create({
              data: {
                campusId: leaveForm.form.campusId,
                userId: leaveForm.form.userId,
                userType: leaveForm.form.userType,
                isApproved: 0,
                reason: leaveForm.form.reason,
                created_by: leaveForm.form.created_by,
                created_at: new Date(),
                updated_by: leaveForm.form.created_by,
                updated_at: new Date()
              },
            }).then(async (leaveReq) => {
              leaveForm.leaveDates.forEach(async (date) => {
                await prisma.leaveDates.create({
                  data: {
                    campusId: leaveForm.form.campusId,
                    leaveId: leaveReq.id,
                    date: date,
                  },
                })
              });

              const admins = await prisma.user.findMany({
                where: {
                  active: 1,
                  userType: UserType.admin,
                  campusId: Number(leaveForm.form.campusId),
                },
              });
              if (admins !== null && admins !== undefined && admins.length > 0) {
                admins.forEach(async (eachUser: any) => {
                  addANotification(Number(leaveForm.form.campusId),
                    Number(eachUser.id),
                    Number(leaveForm.form.created_by),
                    buildMessage(LEAVE_REQUESTED, leaveReq.id + '', leaveForm.form.reason));
                });
              }
            });
          }
        } else {
          return res.status(400).json({ message: 'Please select dates', status: false, data: null })
        }
      }
      return res.json({ data: null, status: true, message: 'Leave Request saved' });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message, status: true, data: null })
    }
  }


  //Notifications
  public async getUserNotificationsAndEmails(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const userId = Number(req.params.userId);
    let emailsObj = [];


    let notificationsForUser = await prisma.notifications.findMany({
      where: {
        campusId: Number(campusId),
        userId: Number(userId),
      },
      orderBy: {
        id: 'desc',
      },
      include: {
        campus: true,
        user: true,
        createdbyuser: true
      },
    });

    //get emails
    await prisma.user.findUnique({
      where: {
        campusId: Number(campusId),
        id: Number(userId),
      },
    }).then(async (user: User) => {

      if (user !== null && user !== undefined && user.email !== null && user.email !== undefined) {

        emailsObj = await prisma.emailHistory.findMany({
          where: { tos: user.email + ';' },
          orderBy: {
            created_at: "desc"
          }
        });
      }

    });


    return res.json({ status: true, data: { data: notificationsForUser, emailsObj: emailsObj }, message: 'Notifications retrieved' });
  }
  public async getAllNotifications(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);

    let notificationsForThisSession = await prisma.notifications.findMany({
      where: {
        campusId: Number(campusId),
      },
      orderBy: {
        id: 'desc',
      },
      include: {
        campus: true,
        user: true,
        createdbyuser: true
      },
    });


    return res.json({ status: true, data: notificationsForThisSession, message: 'Notifications retrieved' });
  }

  public async updateMasterNotification(req: Request, res: Response) {
    const form: any = req.body;
    console.log(form)

    let notification = await prisma.notifications.update({
      where: {
        id: Number(form.id),
        campusId: Number(form.campusId),
      },
      data: {
        message: form.message,
        created_at: new Date()
      },
    });
    //Add notification
    // addANotification(Number(form.campusId),
    //                   Number(notification.created_by),
    //                   Number(form.updatedBy),
    //                   buildMessage(UPDATE_MASTER_NOTIFICATION,
    //                     notification.id+''));

    return res.json({ status: true, data: null, message: 'Notification #' + notification.id + ' updated' });
  }

  public async deleteNotification(req: Request, res: Response) {
    const id = Number(req.params.id);
    const campusId = Number(req.params.campusId);

    let notificationsForThisSession = await prisma.notifications.delete({
      where: {
        id: Number(id),
        campusId: Number(campusId),
      },
    });


    return res.json({ status: true, data: notificationsForThisSession, message: 'Notifications deleted' });
  }
}



function getAllDaysBetweenDates(startDate: Date, endDate: Date, day: number) {
  const wednesdays = [];
  let currentDate = moment(startDate);

  while (currentDate.isSameOrBefore(endDate)) {
    if (currentDate.isoWeekday() === day) { // 3 represents Wednesday
      const formattedDate = currentDate.format('YYYY-MM-DD')
      wednesdays.push(formattedDate);
    }
    currentDate.add(1, 'day');
  }

  return wednesdays;
}

