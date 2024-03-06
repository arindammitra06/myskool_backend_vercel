import { Request, Response } from "express";
import { prisma } from "../../../../../../shared/db-client";
import { SubjectType } from "@prisma/client";


export class SubjectsController {



public async createOrUpdateSubject  (req: Request, res: Response) {

    const subjectForm: any = req.body;
    console.log(subjectForm);
    try {
      
      if(subjectForm!==null && subjectForm.form.id!==null && subjectForm.form.id!==undefined){
        
            if(subjectForm.form.teacherId!==null && subjectForm.form.teacherId!==undefined 
              && Array.isArray(subjectForm.form.teacherId) && subjectForm.form.teacherId.length>0){
                
                let teachersid = [];
                subjectForm.form.teacherId.forEach(async (idsEach) => {
                  teachersid.push({id: Number(idsEach)});
                });

                
                const deletingReferences = await prisma.subject.update({
                  where: {
                    id: subjectForm.form.id,
                    campusId:Number(subjectForm.form.campusId)
                  },
                  data: {
                    teachers: {
                      set: []
                    }
                  },
                });

                
                const updatedSubject = await prisma.subject.update({
                  where: {
                    id: subjectForm.form.id,
                    campusId:Number(subjectForm.form.campusId)
                  },
                  data: {
                    campusId: subjectForm.form.campusId,
                    subjectName: subjectForm.form.subjectName,
                    subjectCode: subjectForm.form.subjectCode,
                    subjectType: SubjectType[subjectForm.form.subjectType],
                    created_by: subjectForm.form.created_by,
                    created_at: new Date(),
                    updated_at: new Date(),
                    updated_by: subjectForm.form.updated_by,
                    active: 1,
                    teachers: {
                      connect: teachersid
                    }
                  },
                });

                return res.json({ status: true,  data: updatedSubject , message:'Updated Subject' });
            }else{
                    const deletingReferences = await prisma.subject.update({
                      where: {
                        id: subjectForm.form.id,
                        campusId:Number(subjectForm.form.campusId)
                      },
                      data: {
                        teachers: {
                          set: []
                        }
                      },
                    });
                    const createSubject = await prisma.subject.update({
                      where: {
                        id: subjectForm.form.id,
                        campusId:Number(subjectForm.form.campusId)
                      },
                      data: {
                        campusId: subjectForm.form.campusId,
                        subjectName: subjectForm.form.subjectName,
                        subjectCode: subjectForm.form.subjectCode,
                        subjectType: SubjectType[subjectForm.form.subjectType],
                        created_by: subjectForm.form.created_by,
                        created_at: new Date(),
                        updated_at: new Date(),
                        updated_by: subjectForm.form.updated_by,
                        active: 1,
                      },
                    }); 

                    return res.json({ status: true,  data: createSubject , message:'Updated Subject' });
            }
      }else{
        

        if(subjectForm.form.teacherId!==null && subjectForm.form.teacherId!==undefined 
                && Array.isArray(subjectForm.form.teacherId) && subjectForm.form.teacherId.length>0){
                  
                  let teachersid = [];
                  subjectForm.form.teacherId.forEach(async (idsEach) => {
                    teachersid.push({id: Number(idsEach)});
                  });

                  const createSubject = await prisma.subject.create({
                    data: {
                      campusId: subjectForm.form.campusId,
                      subjectName: subjectForm.form.subjectName,
                      subjectCode: subjectForm.form.subjectCode,
                      subjectType: SubjectType[subjectForm.form.subjectType],
                      created_by: subjectForm.form.created_by,
                      created_at: new Date(),
                      updated_at: new Date(),
                      updated_by: subjectForm.form.updated_by,
                      active: 1,
                      teachers: {
                        connect: teachersid
                      }
                      },
                    },); 

                  return res.json({ status: true,  data: createSubject , message:'Created Subject' });
        }else{
                const createSubject = await prisma.subject.create({
                  data: {
                    campusId: subjectForm.form.campusId,
                    subjectName: subjectForm.form.subjectName,
                    subjectCode: subjectForm.form.subjectCode,
                    subjectType: SubjectType[subjectForm.form.subjectType],
                    created_by: subjectForm.form.created_by,
                    created_at: new Date(),
                    updated_at: new Date(),
                    updated_by: subjectForm.form.updated_by,
                    active: 1,
                  },
                }); 

                return res.json({ status: true,  data: createSubject , message:'Created Subject' });
        }
        
  
      }
      
  
      
    } catch (error) {
      console.error(error);
  
      return res.json({ status: false,  data: null , message:'Failed to create Class' });
    }
  }

  

public async deleteSubject (req: Request, res: Response)  {
  const id = Number(req.params.id);
  const campusId = Number(req.params.campusId);
  const userId = Number(req.params.userId);
  console.log('Indelete Subject by ID : '+id);

  const subject = await prisma.subject.findUnique({
    where: {
      id: id,
      campusId:campusId
    },
  })

  if (!subject) {
    return res.json({ status: false,  data: subject , message:'Unable to find subject' });
  }
  
  
  try{
    await prisma.subject.update({
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

    return res.json({ status: true,  data: null , message:'Subject deleted' });


  } catch (error) {
    console.error(error);
    return res.json({ status: false,  data: null , message:error.message });
  }
  

}



public async getSubjectById  (req: Request, res: Response)  {
  const id = Number(req.params.id);
  const campusId = Number(req.params.campusId);

  const classS = await prisma.subject
  .findUnique({
    where: {
      id: Number(id),
      campusId : Number(campusId)
    },
    include: {
      teachers: true, 
      campus:true,
    },
  });


  if (!classS) {
    return res.json({ status: false,  data: classS , message:'Failed to fetch subject' });
  }

  return res.json({ status: true,  data: classS , message:'Retrieved subject' });
}


public async getAllSubjects  (req: Request, res: Response)  {
  const campusId = Number(req.params.campusId);
  const subjects = await prisma.subject.findMany({
    where: {
      campusId : Number(campusId),
      active: 1
    },
    include: {
      teachers: true, 
      campus:true,
    },
  });

  return res.json({ status: true,  data: subjects , message:'Subjects fetched' });
}

public async getAllSubjectsByType  (req: Request, res: Response)  {
  const campusId = Number(req.params.campusId);
  const type = String(req.params.type);
  console.log(campusId);
  if(type===null || (type!==null && type!==undefined && type==='') || (type!==null && type!==undefined && type==='All')){
    const subjects = await prisma.subject.findMany({
      where: {
        campusId : Number(campusId),
        active: 1,
      },
      include: {
        teachers: true, 
        campus:true,
      },
    });
    return res.json({ status: true,  data: subjects , message:'Subjects loaded successfully' });
  
  }else{

    const subjects = await prisma.subject.findMany({
      where: {
        campusId : Number(campusId),
        active: 1,
        subjectType: SubjectType[type]
      },
      include: {
        teachers: true, 
        campus:true,
      },
    });
  
    return res.json({ status: true,  data: subjects , message:'Subjects loaded successfully' });
  }
  
}

}