import { ExamType } from "@prisma/client";
import { prisma } from "../../../../../../shared/db-client";
import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import moment from "moment";
import { addANotification, getUniqueValues } from "../../../../../../shared/helpers/utils/generic.utils";
import { buildMessage, EXAM_RESULT_DECLARED, NEW_HOMEWORK_ADDED } from "../../../../../../shared/constants/notification.constants";
import { sendSms, sendEmail } from "../../../../../../shared/helpers/notifications/notifications";


export class ExamController {
  
  public async getAllGrades(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const grades = await prisma.grade.findMany({
      include: {
        _count: true,
        GradeDivisions: true,
        Exam:true
      },
      where:{
        campusId: Number(campusId)
      }
    });
    return res.json({ status: true, data: grades, message: 'Grades retrieved' });
  }

  public async getAllGradesLookup(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const grades = await prisma.grade.findMany({
      where:{
        campusId: Number(campusId)
      }
    });
    let gradeLookupItems = [];
    if (grades !== null && grades !== undefined && grades.length > 0) {
      grades.forEach(async (element) => {
        gradeLookupItems.push({ label: element.gradeName, value: element.id })
      });
    }

    return res.json({ status: true, data: gradeLookupItems, message: '' });
  }

  public async getDivisions(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    console.log(req.params);
    
    let myuuid = uuidv4();
    
    let blankDivisions = [
      {
        id: uuidv4(),
        gradeId: 0,
        campusId: campusId,
        gradeName: 'A+',
        from: 89,
        to: 100,
      },
      {
        id: uuidv4(),
        gradeId: 0,
        campusId: campusId,
        gradeName: 'A',
        from: 79,
        to: 90,
      },
      {
        id: uuidv4(),
        gradeId: 0,
        campusId: campusId,
        gradeName: 'B',
        from: 69,
        to: 80,
      },
      {
        id: uuidv4(),
        gradeId: 0,
        campusId: campusId,
        gradeName: 'C',
        from: 59,
        to: 70,
      },
      {
        id: uuidv4(),
        gradeId: 0,
        campusId: campusId,
        gradeName: 'D',
        from: 29,
        to: 60,
      },
      {
        id: uuidv4(),
        gradeId: 0,
        campusId: campusId,
        gradeName: 'F',
        from: -1,
        to: 30,
      },
    ];

    return res.json({ status: true, data: blankDivisions, message: '' });
  }

  public async addUpdateGradeDivisions(req: Request, res: Response) {
    const formData: any = req.body;
    console.log(formData)
    try {
      if (formData !== null && formData !== undefined) {
        if (formData.gradeId !== null && formData.gradeId !== undefined) {
          
          
          if (formData.gradeDivision !== null && formData.gradeDivision !== undefined && formData.gradeDivision.length > 0) {
            //delete existing divisions
            await prisma.gradeDivisions.deleteMany({
              where: {
                campusId: Number(formData.campusId),
                gradeId: Number(formData.gradeId),
              }
            });

            let grade = await prisma.grade.update({
              where:{
                  id: Number(formData.gradeId),
                  campusId: Number(formData.campusId),
              },
              data: {
                gradeName: formData.gradeName,
                description: formData.description,
                updated_by: formData.created_by,
                updated_at: new Date()
              },
            });

            for (let i = 0; i < formData.gradeDivision.length; i++) {
              let element = formData.gradeDivision[i];
              await prisma.gradeDivisions.create({
                data: {
                  gradeId: Number(grade.id),
                  campusId: Number(formData.campusId),
                  gradeName: element.gradeName,
                  from: Number(element.from),
                  to: Number(element.to),
                },
              });
            }

          }else{
            return res.json({ data: null, status: false, message: 'Failed to save. Grade Divisions missing' });
          }
          
          return res.json({ data: null, status: true, message: 'Fee Plan updated' });
        } else {
          
          if (formData.gradeDivision !== null && formData.gradeDivision !== undefined && formData.gradeDivision.length > 0) {
            
            let grade = await prisma.grade.create({
              data: {
                campusId: Number(formData.campusId),
                gradeName: formData.gradeName,
                description: formData.description,
                created_by: formData.created_by,
                created_at: new Date(),
                updated_by: formData.created_by,
                updated_at: new Date()
              },
            });

            for (let i = 0; i < formData.gradeDivision.length; i++) {
              let element = formData.gradeDivision[i];
              await prisma.gradeDivisions.create({
                data: {
                  gradeId: Number(grade.id),
                  campusId: Number(formData.campusId),
                  gradeName: element.gradeName,
                  from: Number(element.from),
                  to: Number(element.to),
                },
              });
            }


          }else{
            return res.json({ data: null, status: false, message: 'Failed to save. Grade Divisions missing' });
          }

          return res.json({ data: null, status: true, message: 'Fee Plan added' });
        }
      }

    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message, status: true, data: null })
    }
  }


  public async deleteGrade(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const id = Number(req.params.id);
    const userId = Number(req.params.userId);
    
    await prisma.gradeDivisions.deleteMany({
      where: {
        gradeId: id,
        campusId: campusId
      }
    });
    
    await prisma.grade.delete({
      where: {
        id: id,
        campusId: campusId
      }
    });
    
    return res.json({ status: true, data: null, message: 'Grade & divisions deleted successfully' });
  }


  public async getAllExams(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const sessionId = Number(req.params.sessionId);
    const examType = req.params.examType;

    const exams = await prisma.exam.findMany({
      include: {
        _count: true,
        session: true,
        grade: true,
        Result: true,
        SubjectMarksTimeTable:true
      },
      where:{
        campusId: Number(campusId),
        sessionId: Number(sessionId),
        type: ExamType[examType]
      },
    
    });
    console.log(exams)
    return res.json({ status: true, data: exams, message: 'Exams retrieved' });
  }



  public async addEditExam(req: Request, res: Response) {
    const formData: any = req.body.form;
    console.log(formData)
    try {
      if (formData !== null && formData !== undefined) {
        if (formData.id !== undefined && formData.id !== null) {
          let exam = await prisma.exam.update({
            where:{
                id: Number(formData.id),
                campusId: Number(formData.campusId),
            },
            data: {
              examName: formData.examName,
              description: formData.description,
              gradeId: formData.gradeId,
              type: ExamType[ formData.examType],
              updated_by: formData.userId,
              updated_at: new Date()
            },
          });
          
          return res.json({ data: null, status: true, message: 'Exam updated' });
        } else {
          let exam = await prisma.exam.create({
            data: {
              campusId: Number(formData.campusId),
              sessionId: Number(formData.sessionId),
              examName: formData.examName,
              description: formData.description,
              gradeId:  Number(formData.gradeId),
              type: ExamType[ formData.examType],
              created_by: Number(formData.userId),
              created_at: new Date(),
              updated_by:  Number(formData.userId),
              updated_at: new Date()
            },
          });

          return res.json({ data: null, status: true, message: 'Exam added' });
        }
      }

    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message, status: true, data: null })
    }
  }

  public async deleteExam(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const id = Number(req.params.id);
    const userId = Number(req.params.userId);
    
    await prisma.exam.delete({
      where: {
        id: Number(id),
        campusId: Number(campusId)
      }
    });
    
    return res.json({ status: true, data: null, message: 'Exam deleted successfully' });
  }

  public async deleteExamTimetable(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const id = Number(req.params.id);
    const userId = Number(req.params.userId);
    
    await prisma.subjectMarksTimeTable.delete({
      where: {
        id: Number(id),
        campusId: Number(campusId)
      }
    });
    
    return res.json({ status: true, data: null, message: 'Record deleted successfully' });
  }

  public async getAllExamsLookup(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const sessionId = Number(req.params.sessionId);
    
    const exams = await prisma.exam.findMany({
      where:{
        campusId: Number(campusId),
        sessionId: Number(sessionId)
      }
    });
    let examsLookupItems = [];
    
    if (exams !== null && exams !== undefined && exams.length > 0) {
      exams.forEach(async (element) => {
        examsLookupItems.push({ label: element.examName+' ('+element.type+')', value: element.id })
      });
    }

    return res.json({ status: true, data: examsLookupItems, message: '' });
  }


  public async getAllExamsTimetable(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const sessionId = Number(req.params.sessionId);
    const examId =  Number(req.params.examId);
    const classId = Number(req.params.classId);
    const sectionId = Number(req.params.sectionId);
    let isResultGenerated = false;
    let distinctSubjects;
    let distinctStudents;
    let examClassSection = {};
    let tabulationReport = [];
    let attendanceReport = [];
    let studentsAdmitCard = [];
    
    const resultGenerated = await prisma.result.findMany({
      where:{
        campusId: Number(campusId),
        sessionId: Number(sessionId),
        examId: Number(examId),
        classId: Number(classId),
        sectionId: Number(sectionId),
      },
    });

    if(resultGenerated!==null && resultGenerated!==undefined && resultGenerated.length>0){
      isResultGenerated=true;
    }

    const examsTimetable = await prisma.subjectMarksTimeTable.findMany({
      include: {
        session: true,
        gradeDivision: true,
        exam: true,
        subject: true,
        class: true,
        section: true,
        user: true
      },
      where:{
        campusId: Number(campusId),
        sessionId: Number(sessionId),
        examId: Number(examId),
        classId: Number(classId),
        sectionId: Number(sectionId),
      },
    
    });
    if(examsTimetable!==null && examsTimetable!==undefined && examsTimetable.length>0){
      distinctStudents = getUniqueValues(examsTimetable, 'user','displayName');
      distinctSubjects = getUniqueValues(examsTimetable, 'subject', 'subjectName');
    }
    
    const examDetails = await prisma.exam.findUnique({
      where:{
        campusId: Number(campusId),
        id: Number(examId)
      },
    });
    const classDetails = await prisma.class.findUnique({
      where:{
        campusId: Number(campusId),
        id: Number(classId)
      },
    });
    const sectionDetails = await prisma.section.findUnique({
      where:{
        campusId: Number(campusId),
        id: Number(sectionId)
      },
    });

    //console.log(distinctStudents);
    //console.log(distinctSubjects);
    if(examDetails!==null && examDetails!==undefined 
      && classDetails!==null && classDetails!==undefined 
        && sectionDetails!==null && sectionDetails!==undefined){
          examClassSection["examName"] = examDetails.examName;
          examClassSection["className"] = classDetails.className;
          examClassSection["sectionName"] = sectionDetails.sectionName;
    }


    if(examsTimetable!==null && examsTimetable!==undefined && examsTimetable.length>0 &&
        distinctStudents!==null && distinctStudents!==undefined && distinctStudents.length>0 
          && distinctSubjects!==null && distinctSubjects!==undefined && distinctSubjects.length>0 ){
        
        for(let i=0;i<distinctStudents.length;i++){
          let stud = {};
          let attdnc = {};
          stud["name"] = distinctStudents[i].value;
          attdnc["name"] = distinctStudents[i].value;
          
          const student = await prisma.user.findUnique({
            where:{
              campusId: Number(campusId),
              id: Number(distinctStudents[i].id)
            },
            include:{
              section:true,
              class: true
            }
          });

          studentsAdmitCard.push(student);

          let subjectsForEach = [];
          let subjectsForAttendance = [];
          let total = 0;
          let totalObtained = 0;

          for(let j=0;j<distinctSubjects.length;j++){
            
            const record = examsTimetable.find((p) => p.subjectId === distinctSubjects[j].id && p.userId === distinctStudents[i].id);

            if (record) {
              console.log(record.user.displayName+' - '+record.subject.subjectName); 
              total = total + record.total;
              totalObtained = totalObtained + record.obtained;
              let isFailed = record.obtained < record.failMarks ? true : false;
              subjectsForAttendance.push({'subject':record.subject.subjectName,'date':record.examDate });
              subjectsForEach.push({'subject':record.subject.subjectName,'obtained':record.obtained ,'isFailed':isFailed});
            } else {
              console.log("Record not found");
              subjectsForAttendance.push({'subject':distinctSubjects[j].value,'date':' ' });
              subjectsForEach.push({'subject':distinctSubjects[j].value,'obtained':' ' ,'isFailed' : true})
            }

          }
          attdnc["attendance"] = subjectsForAttendance;
          stud["marks"] = subjectsForEach;
          stud["total"] = total;
          stud["totalObtained"] = totalObtained;
          tabulationReport.push(stud);
          attendanceReport.push(attdnc);
        }

    }

    return res.json({ status: true, 
      data: {
        'timetable': examsTimetable, 
        'isResultGenerated': isResultGenerated,
        'tabulation': tabulationReport, 
        'attendance': attendanceReport, 
        'examClassSection':examClassSection, 
        'studentsAdmitCard':studentsAdmitCard}, 
      message: 'Records retrieved' });
  }

  

  public async getAllExamsToEntryMarks(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const sessionId = Number(req.params.sessionId);
    const examId =  Number(req.params.examId);
    const classId = Number(req.params.classId);
    const sectionId = Number(req.params.sectionId);
    const subjectId = Number(req.params.subjectId);
    
    const examsTimetable = await prisma.subjectMarksTimeTable.findMany({
      include: {
        session: true,
        gradeDivision: true,
        exam: true,
        subject: true,
        class: true,
        section: true,
        user: true
      },
      where:{
        campusId: Number(campusId),
        sessionId: Number(sessionId),
        examId: Number(examId),
        classId: Number(classId),
        sectionId: Number(sectionId),
        subjectId: Number(subjectId)
      },
    
    });
    //console.log(examsTimetable)
    return res.json({ status: true, data: examsTimetable, message: 'Details retrieved' });
  }



  public async addUpdateExamTimetable(req: Request, res: Response) {
    const formData: any = req.body.form;
    const subjects: any = req.body.subject;
    console.log(req.body);

    
    try {
      if (formData !== null && formData !== undefined) {
        let existingTimetable = await prisma.subjectMarksTimeTable.findMany({
          where:{
            campusId: Number(formData.campusId),
            classId: Number(formData.classId),
            sectionId: Number(formData.sectionId),
            examId:  Number(formData.examId),
            sessionId: Number(formData.sessionId),
          }
        });

        if(existingTimetable!==null && existingTimetable!==undefined && existingTimetable.length>0){
          return res.json({ data: null, status: false, message: 'Exam already assigned to this Session & Class or Section. Please delete existing entries to add new' });
        }


        await prisma.user.findMany({
          where: {
            campusId: Number(formData.campusId),
            classId: Number(formData.classId),
            sectionId: Number(formData.sectionId),
            active:1
          },
        }).then(async (students) => {
            if(students!==null && students!==undefined && students.length>0){
              
            
                if(subjects!==null && subjects!==undefined && subjects.length>0){
                  for(let j = 0; j<subjects.length;j++){
                    
                    let eachSubject = subjects[j];
                    
                    for(let st = 0; st< students.length;st++){
                      let eachStudent = students[st];
                        //Now add each student & subject entry
                        await prisma.subjectMarksTimeTable.create({
                          data: {
                            campusId: Number(formData.campusId),
                            sessionId: Number(formData.sessionId),
                            examId:  Number(formData.examId),
                            classId:  Number(formData.classId),
                            sectionId:  Number(formData.sectionId),
                            userId:  Number(eachStudent.id),
                            subjectId:  Number(eachSubject.id),
                            location:eachSubject.location,
                            obtained: 0,
                            examDate:moment(eachSubject.date).toDate(),
                            startTime: eachSubject.start,
                            endTime: eachSubject.end,
                            created_by:formData.userId,
                            created_at: new Date(),
                            updated_by: formData.userId,
                            updated_at: new Date()
                          },
                        });
                    }
                    
                  }
                }
            }else{
              return res.json({ data: null, status: false, message: 'No students in selected class/section' });
            }
        })
       

        return res.json({ data: null, status: true, message: 'Timetable added' });
      }

    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message, status: true, data: null })
    }
  }


  public async saveExamMarks(req: Request, res: Response) {
    const formData: any = req.body.form;
    const details: any = req.body.details;
    console.log(formData)
    try {
      if (formData !== null && formData !== undefined && details !== null && details !== undefined && details.length>0) {
        
        for(let i=0;i<details.length;i++){
          let detailsRecord = details[i];
          await prisma.subjectMarksTimeTable.update({
            where:{
                id: Number(detailsRecord.id),
                campusId: Number(detailsRecord.campusId),
            },
            data: {
              total: Number(detailsRecord.total),
              failMarks: Number(detailsRecord.failMarks),
              obtained: Number(detailsRecord.obtained),
              gradeDivisionId:Number(detailsRecord.gradeDivisionId),
              remarks: detailsRecord.remarks,
              updated_by: formData.userId,
              updated_at: new Date()
            },
          });
        }
        
          return res.json({ data: null, status: true, message: 'Marks updated' });
        }else{
          return res.json({ data: null, status: true, message: 'No records found' });
        }

    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message, status: true, data: null })
    }
  }

  public async getExamById(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const sessionId = Number(req.params.sessionId);
    const id = Number(req.params.id);

    const grade = await prisma.exam.findUnique({
      select:{
        grade: {
          include: {
            GradeDivisions: true
          }
        },
      },
      where:{
        campusId: Number(campusId),
        sessionId: Number(sessionId),
        id: Number(id)
      },
    
    });
    console.log(grade)
    return res.json({ status: true, data: grade, message: 'Grade retrieved' });
  }



  public async getExamTabulationSheet(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const sessionId = Number(req.params.sessionId);
    const examId =  Number(req.params.examId);
    const classId = Number(req.params.classId);
    const sectionId = Number(req.params.sectionId);

    const examsTimetable = await prisma.subjectMarksTimeTable.findMany({
      include: {
        session: true,
        gradeDivision: true,
        exam: true,
        subject: true,
        class: true,
        section: true,
        user: true
      },
      where:{
        campusId: Number(campusId),
        sessionId: Number(sessionId),
        examId: Number(examId),
        classId: Number(classId),
        sectionId: Number(sectionId),
      },
    
    });
    console.log(examsTimetable)
    return res.json({ status: true, data: examsTimetable, message: 'Records retrieved' });
  }


  public async generateResult(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const sessionId = Number(req.params.sessionId);
    const examId =  Number(req.params.examId);
    const classId = Number(req.params.classId);
    const sectionId = Number(req.params.sectionId);
    const userId = Number(req.params.userId);


    console.log(req.params);


    let distinctSubjects;
    let distinctStudents;
    let examClassSection = {};
    let resultsWithRank = [];
    let resultsWithAtleastOneFailed = [];
    let gradeDivisions = [];


    const examsTimetable = await prisma.subjectMarksTimeTable.findMany({
      include: {
        session: true,
        gradeDivision: true,
        exam: true,
        subject: true,
        class: true,
        section: true,
        user: true
      },
      where:{
        campusId: Number(campusId),
        sessionId: Number(sessionId),
        examId: Number(examId),
        classId: Number(classId),
        sectionId: Number(sectionId),
      },
    
    });
    const examDetails = await prisma.exam.findUnique({
      include:{
        grade: {
          include:{
            GradeDivisions: true
          }
        }
      },
      where:{
        campusId: Number(campusId),
        id: Number(examId)
      },
    });

    if(examDetails!==null && examDetails!==undefined && examDetails.grade!==null && examDetails.grade!==undefined
      && examDetails.grade.GradeDivisions!==null && examDetails.grade.GradeDivisions!==undefined && examDetails.grade.GradeDivisions.length>0
    ){
      gradeDivisions = examDetails.grade.GradeDivisions;
    }

    if(examsTimetable!==null && examsTimetable!==undefined && examsTimetable.length>0){
      distinctStudents = getUniqueValues(examsTimetable, 'user','displayName');
      distinctSubjects = getUniqueValues(examsTimetable, 'subject', 'subjectName');
    }
    
   


    if(examsTimetable!==null && examsTimetable!==undefined && examsTimetable.length>0 &&
        distinctStudents!==null && distinctStudents!==undefined && distinctStudents.length>0 
          && distinctSubjects!==null && distinctSubjects!==undefined && distinctSubjects.length>0 ){
        
        for(let i=0;i<distinctStudents.length;i++){
          let stud = {};
          stud["userId"] = distinctStudents[i].id; 
          let subjectsForEach = [];
          let total = 0;
          let totalObtained = 0;
          let totalFailMarks = 0;
          let failedEvenOne = false;
          let message='';

          for(let j=0;j<distinctSubjects.length;j++){
            
            const record = examsTimetable.find((p) => p.subjectId === distinctSubjects[j].id && p.userId === distinctStudents[i].id);

            if (record) {
              console.log(record.user.displayName+' - '+record.subject.subjectName); 
              total = total + record.total;
              totalObtained = totalObtained + record.obtained;
              totalFailMarks = totalFailMarks + record.failMarks;
              let isFailed = record.obtained < record.failMarks ? true : false;
              subjectsForEach.push({'subject':record.subject.subjectName,'obtained':record.obtained ,'isFailed':isFailed});
              failedEvenOne = isFailed;
              if(isFailed){
                message = message+record.subject.subjectName+','
              }
            } else {
              console.log("Record not found");
              subjectsForEach.push({'subject':distinctSubjects[j].value,'obtained':0 ,'isFailed' : true})
               message = message+distinctSubjects[j].value+','
            }

          }


          stud["marks"] = subjectsForEach;
          stud["total"] = total;
          stud["totalObtained"] = totalObtained;
          stud["totalFailMarks"] = totalFailMarks;
          let prec =  (100/total)*totalObtained;
          stud["percentage"] =prec;

          if(gradeDivisions!==null && gradeDivisions!==undefined && gradeDivisions.length>0){
            const gradeDivisionObtained = gradeDivisions.find(grade => prec> grade.from && prec <= grade.to);
            if(gradeDivisionObtained!==null && gradeDivisionObtained!==undefined){
              stud["gradeId"] = gradeDivisionObtained.id;
            }
          }

          if(!failedEvenOne){
            resultsWithRank.push(stud);
          }else{
            stud["message"] = message;
            resultsWithAtleastOneFailed.push(stud);
          }
        }


        //Students not faield in any subject
        if(resultsWithRank!==null && resultsWithRank!==undefined && resultsWithRank.length>0){
          resultsWithRank.sort((a, b) => b.percentage - a.percentage);
          
          const rankedStudents = resultsWithRank.map((student, index) => ({
            ...student,
            rank: index + 1,
          }));
          
          //Save results
          rankedStudents.forEach(async (element) => {
            await prisma.result.create({
              data: {
                campusId: Number(campusId),
                sessionId: Number(sessionId),
                examId: Number(examId),
                classId: Number(classId),
                sectionId: Number(sectionId),
                userId: Number(element.userId),
                gradeDivisionId: Number(element.gradeId),
                rank:Number(element.rank),
                total:element.total,
                failMarks:element.totalFailMarks,
                obtained:element.totalObtained,
                declareResult: 0,
                created_by:userId,
                created_at: new Date(),
                updated_by: userId,
                updated_at: new Date()
              },
            });
          });
        }

        //Failed Studennts
        if(resultsWithAtleastOneFailed!==null && resultsWithAtleastOneFailed!==undefined && resultsWithAtleastOneFailed.length>0){
          resultsWithAtleastOneFailed.forEach(async (element) => {
            await prisma.result.create({
              data: {
                campusId: Number(campusId),
                sessionId: Number(sessionId),
                examId: Number(examId),
                classId: Number(classId),
                sectionId: Number(sectionId),
                userId: Number(element.userId),
                gradeDivisionId: Number(element.gradeId),
                total:element.total,
                failMarks:element.totalFailMarks,
                obtained:element.totalObtained,
                declareResult: 0,
                overallRemarks:'Failed in '+element.message,
                created_by:userId,
                created_at: new Date(),
                updated_by: userId,
                updated_at: new Date()
              },
            });
          });
        }

    }
    return res.json({ status: true, 
      data: null, 
      message: 'Result is generated' });
  }

  public async declareResult(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const sessionId = Number(req.params.sessionId);
    const examId =  Number(req.params.examId);
    const classId = Number(req.params.classId);
    const sectionId = Number(req.params.sectionId);
    const userId = Number(req.params.userId);
    
    await prisma.result.updateMany({
      where:{
        campusId: Number(campusId),
        sessionId: Number(sessionId),
        examId: Number(examId),
        classId: Number(classId),
        sectionId: Number(sectionId),
        
      },
      data: {
        declareResult: 1,
        updated_by: userId,
        updated_at: new Date()
      },
    }).then(async (result)=> {
      
      await prisma.result.findMany({
        where:{
          campusId: Number(campusId),
          sessionId: Number(sessionId),
          examId: Number(examId),
          classId: Number(classId),
          sectionId: Number(sectionId),
        },
        include:{
          exam: true,
          gradeDivision:true,
          user: {
            include:{
              campus: true,
              class:true,
              section:true,
              parent: {
                include: {
                  parent: true
                }
              }
            }
          }
        }
      }).then(async (resultObj)=> {
        if(resultObj!==null && resultObj!==undefined && resultObj.length>0){
          const institute = await prisma.institute.findFirst({
            include: {
              session: true,
            }
          });

          
          for(let i=0;i<resultObj.length;i++){
            let percentage = (100/resultObj[i].total)*resultObj[i].obtained;


            addANotification(Number(campusId),
              Number(resultObj[i].user.id),
              Number(userId),
              buildMessage(EXAM_RESULT_DECLARED,
                  resultObj[i].user.displayName, 
                  percentage+'%', 
                  resultObj[i].exam.examName));

            if(resultObj[i]!==null && resultObj[i]!==undefined &&  
              resultObj[i].user !== null && resultObj[i].user !== undefined && resultObj[i].user.parent.length > 0){
                for (let j = 0; j < resultObj[i].user.parent.length; j++) {
                  if (resultObj[i].user.parent[j].parent !== null && resultObj[i].user.parent[j].parent !== undefined &&
                    resultObj[i].user.parent[j].parent.email !== null && resultObj[i].user.parent[j].parent.email !== undefined){ 
                      
                      
                      
                      addANotification(Number(campusId),
                        Number(resultObj[i].user.parent[j].parentId),
                        Number(userId),
                        buildMessage(EXAM_RESULT_DECLARED,resultObj[i].user.displayName, percentage+'%', resultObj[i].exam.examName));
                        
                        
                        
                        sendSms('Declare Exams',
                          {
                            campusId: Number(campusId),
                            student_name: resultObj[i].user.displayName,
                            parent_name: resultObj[i].user.parent[j].parent.displayName,
                            parent_phone: resultObj[i].user.parent[j].parent.mobile,
                            roll_no: resultObj[i].user.rollNoProcessed,
                            student_id_card: resultObj[i].user.idCardNumber,
                            institute_name: institute.instituteName,
                            institute_campus: resultObj[i].user.campus.campusName,
                            class_name: resultObj[i].user.class.className,
                            section_name: resultObj[i].user.section.sectionName,
                            session: institute.session.session,
                            loggedInUserId: Number(userId),
                            studentOrTeacherId: null,
                            classId: resultObj[i].user.classId,
                            sectionId: resultObj[i].user.sectionId,
                            exam_name: resultObj[i].exam.examName,
                            exam_percentage: percentage+'%'
                          },
                          [
                            resultObj[i].user.parent[j].parent.mobile
                          ]);
          
                        sendEmail('Declare Exams',
                          {
                            campusId: Number(campusId),
                            student_name: resultObj[i].user.displayName,
                            parent_name: resultObj[i].user.parent[j].parent.displayName,
                            parent_phone: resultObj[i].user.parent[j].parent.mobile,
                            roll_no: resultObj[i].user.rollNoProcessed,
                            student_id_card: resultObj[i].user.idCardNumber,
                            institute_name: institute.instituteName,
                            institute_campus: resultObj[i].user.campus.campusName,
                            class_name: resultObj[i].user.class.className,
                            section_name: resultObj[i].user.section.sectionName,
                            session: institute.session.session,
                            loggedInUserId: Number(userId),
                            studentOrTeacherId: null,
                            classId: resultObj[i].user.classId,
                            sectionId: resultObj[i].user.sectionId,
                            exam_name: resultObj[i].exam.examName,
                            exam_percentage: percentage+'%'
                          },
                          [
                            {
                              name: resultObj[i].user.parent[j].parent.displayName,
                              email: resultObj[i].user.parent[j].parent.email
                            },
                          ]
                        );  
                  }
               }
              }
            
          }
        }
      });
    });

    return res.json({ status: true, 
      data: null, 
      message: 'Result has been declared' });
  }

  public async getResultsForMarksheetGeneration(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const sessionId = Number(req.params.sessionId);
    const examId =  Number(req.params.examId);
    const classId = Number(req.params.classId);
    const sectionId = Number(req.params.sectionId);
    const userId = req.params.userId;
    console.log(req.params);
    let data = [];
    let finalData = [];
    
    if(userId!==null && userId!==undefined && isNaN(Number(userId))){
      console.log('Fetching marksheet for whole class');
      data = await prisma.result.findMany({
        where:{
          campusId: Number(campusId),
          sessionId: Number(sessionId),
          examId: Number(examId),
          classId: Number(classId),
          sectionId: Number(sectionId),
        },
        include: {
          campus: true,
          section: true,
          gradeDivision: true,
          class: true,
          exam: true,
          session:true,
          user: true
        },
      });
    }else{
      console.log('Fetching marksheet for Single student');
      data = await prisma.result.findMany({
        where:{
          campusId: Number(campusId),
          sessionId: Number(sessionId),
          examId: Number(examId),
          classId: Number(classId),
          sectionId: Number(sectionId),
          userId:Number(userId),
        },
        include: {
          campus: true,
          section: true,
          gradeDivision: true,
          class: true,
          exam: true,
          session:true,
          user: true
        },
      });
    }
    //console.log(data);
   
    if(data!==null && data!==undefined && data.length>0){
     for(let i=0;i<data.length;i++){
      let subjectsData = await prisma.subjectMarksTimeTable.findMany({
        where:{
          campusId: Number(campusId),
          sessionId: Number(sessionId),
          examId: Number(examId),
          classId: Number(classId),
          sectionId: Number(sectionId),
          userId:Number(data[i].userId),
        },
        include: {
          gradeDivision: true,
          subject: true
        },
      });
      //
      data[i]["subjects"] = subjectsData;
      finalData.push(data[i]);
     }
    }
    
    return res.json({ status: true, 
      data: finalData, 
      message: 'Marksheet preview generated' });
  }

  public async getMyAllExams(req: Request, res: Response) {
    console.log(req.params)
    const campusId = Number(req.params.campusId);
    const sessionId = Number(req.params.sessionId);
    const userId =  Number(req.params.userId);
    const classId = Number(req.params.classId);
    const sectionId = Number(req.params.sectionId);
    let distinctExams;
    let studentsAdmitCard = [];
    let examDetails = [];
    let examClassSection = {};
    
    const student = await prisma.user.findUnique({
      where:{
        campusId: Number(campusId),
        id: Number(userId)
      },
      include:{
        section:true,
        class: true
      }
    });

    studentsAdmitCard.push(student);

    
    const examsTimetable = await prisma.subjectMarksTimeTable.findMany({
      include: {
        user: true,
        gradeDivision: true,
        exam: true,
        subject: true,
        class: true,
        section: true
      },
      where:{
        campusId: Number(campusId),
        sessionId: Number(sessionId),
        userId: Number(userId),
        classId: Number(classId),
        sectionId: Number(sectionId),
      },
    
    });
    if(examsTimetable!==null && examsTimetable!==undefined && examsTimetable.length>0){
      distinctExams = getUniqueValues(examsTimetable, 'exam', 'examName');
    }

    console.log(examsTimetable)
    
    if(examsTimetable!==null && examsTimetable!==undefined && examsTimetable.length>0 &&
        distinctExams!==null && distinctExams!==undefined && distinctExams.length>0 ){
        
        for(let i=0;i<distinctExams.length;i++){
          let exam = {};
          exam["name"] = distinctExams[i].value;
          exam["id"] = distinctExams[i].id;
          
          //get if result generated
          const resukltGenerated = await prisma.result.findFirst({
            where:{
              campusId: Number(campusId),
              sessionId: Number(sessionId),
              examId: Number(distinctExams[i].id),
              userId: Number(userId),
              classId: Number(classId),
              sectionId: Number(sectionId),
            },
          });
          if(resukltGenerated!==null && resukltGenerated!==undefined ){
            exam["declareResult"] = resukltGenerated.declareResult;
            exam["result"] = resukltGenerated;
          }else{
            exam["declareResult"] = 0;
            exam["result"] = null;
          }

          //get Subject Details
          const record = examsTimetable.filter((p) => p.examId === distinctExams[i].id);
          let subjects = [];
          
          if (record!==null && record!==undefined && record.length>0) {
            for(let j=0;j<record.length;j++){
              let subj = {};
              exam["sessionId"] = sessionId; 
              exam["className"] = record[j].class.className;
              exam["classId"] = record[j].class.id;
              exam["sectionName"] = record[j].section.sectionName; 
              exam["sectionId"] = record[j].section.id; 
              exam["type"]= record[j].exam.type;
              exam["user"]= record[j].user;
              exam["description"]= record[j].exam.description;
              subj["subject"] = record[j].subject;
              subj["total"] = record[j].total;
              subj["failMarks"] = record[j].failMarks;
              subj["obtained"] = record[j].obtained;
              subj["examDate"] = record[j].examDate;
              subj["startTime"] = record[j].startTime;
              subj["endTime"] = record[j].endTime;
              subj["location"] = record[j].location;
              subj["gradeDivision"] = record[j].gradeDivision;
              subj["remarks"] = record[j].remarks;
              subj["class"] = record[j].class;
              subj["section"] = record[j].section;
              subjects.push(subj);
            }
          } 
          exam["subjects"] = subjects;
          const resultGenerated = await prisma.result.findFirst({
            where:{
              campusId: Number(campusId),
              sessionId: Number(sessionId),
              userId: Number(userId),
              classId: Number(classId),
              sectionId: Number(sectionId),
              examId: Number(distinctExams[i].id),
            },
            include:{
              gradeDivision: true,
            }
          });
          
          if(resultGenerated!==null && resultGenerated!==undefined){
            exam["declareResult"] = resultGenerated.declareResult;
            exam["overallGrade"] = resultGenerated.gradeDivision;
            exam["rank"] = resultGenerated.rank;
            exam["overallRemarks"] = resultGenerated.overallRemarks;
            exam["obtained"] = resultGenerated.obtained;
            exam["total"] = resultGenerated.total;
            exam["failMarks"] = resultGenerated.failMarks;
          }
         
          examDetails.push(exam);

        }

    }

    return res.json({ status: true, 
      data: {'studentsAdmitCard':studentsAdmitCard,
             'examDetails': examDetails},
      message: 'Exams/Tests retrieved' });
  }

}

