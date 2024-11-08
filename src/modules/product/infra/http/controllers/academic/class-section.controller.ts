import { Request, Response } from "express";
import { prisma } from "../../../../../../shared/db-client";


export class ClassSectionController {



  public async createOrUpdateClass(req: Request, res: Response) {

    const classS: any = req.body;

    try {

      if (classS !== null && classS.form.id !== null && classS.form.id !== undefined) {

        const updatedClassS = await prisma.class.update({
          where: {
            id: classS.form.id,
            campusId: Number(classS.form.campusId)
          },
          data: {
            campusId: classS.form.campusId,
            className: classS.form.className,
            numericName: classS.form.numericName,
            teacherId: classS.form.teacherId,
            updated_at: new Date(),
            updated_by: classS.form.updated_by,
            active: 1,
          },
        })

        return res.json({ status: true, data: updatedClassS, message: 'Successfully updated Class' });


      } else {
        const createclassS = await prisma.class.create({
          data: classS.form,
        })
        return res.json({ status: true, data: createclassS, message: 'Successfully created Class' });

      }



    } catch (error) {
      console.error(error);

      return res.json({ status: false, data: classS, message: 'Failed to create Class' });
    }
  }




  public async createStudentClass(req: Request, res: Response) {

    const classS: any = req.body;

    try {

      const createclassS = await prisma.class.create({
        data: classS,
      })

      return res.json({ status: true, data: createclassS, message: 'Successfully created Class' });

    } catch (error) {
      console.error(error);

      return res.json({ status: false, data: classS, message: 'Failed to create Class' });
    }
  }

  public async updateStudentClass(req: Request, res: Response) {
    const id = Number(req.params.id);
    const campusId = Number(req.params.campusId);
    const input: any = req.body;

    const classS = await prisma.class.findUnique({
      where: {
        id: id,
        campusId: campusId
      },
    })


    if (!classS) {
      return res.json({ status: false, data: classS, message: 'Failed to delete Class' });
    }

    try {
      const updatedClassS = await prisma.class.update({
        where: {
          id: id,
          campusId: campusId
        },
        data: input,
      })


      return res.json({ status: true, data: updatedClassS, message: 'Updated Class successfully' });

    } catch (error) {
      console.error(error);
      return res.json({ status: false, data: classS, message: 'Failed to udpate Class' });
    }
  }

  public async deleteStudentClass(req: Request, res: Response) {
    const id = Number(req.params.id);
    const campusId = Number(req.params.campusId);
    const userId = Number(req.params.userId);
    console.log('Indelete Class by ID : ' + id);

    const classS = await prisma.class.findUnique({
      where: {
        id: id,
        campusId: campusId
      },
    })

    if (!classS) {
      return res.json({ status: false, data: classS, message: 'Unable to find Class' });
    }


    try {
      await prisma.class.update({
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

      return res.json({ status: true, data: null, message: 'Class is deleted' });


    } catch (error) {
      console.error(error);
      return res.json({ status: false, data: null, message: error.message });
    }


  }



  public async getStudentClassById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const campusId = Number(req.params.campusId);

    const classS = await prisma.class
      .findUnique({
        where: {
          id: Number(id),
          campusId: Number(campusId)
        },
        include: {
          Section: true,
        },
      });


    if (!classS) {
      return res.json({ status: false, data: classS, message: 'Failed to fetch class' });
    }

    return res.json({ status: true, data: classS, message: 'Fetched class successfully' });
  }


  public async getAllStudentClass(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);

    const classS = await prisma.class.findMany({
      where: {
        campusId: Number(campusId),
        active: 1
      },
      include: {
        Section: {
          where:{
            active: 1
          }
        },

      },
    });

    return res.json({ status: true, data: classS, message: 'Classes loaded successfully' });
  }



  public async getAllDetailedClass(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);

    const classS = await prisma.class.findMany({
      where: {
        campusId: Number(campusId),
        active: 1
      },
      include: {
        Section: {
          include: {
            subjects: true,
            TeachersInSection:{
              include:{
                teacher: true
              }
            }
          }
        },
        campus: true,
        User: true,
      },
    });

    return res.json({ status: true, data: classS, message: 'Classes loaded successfully' });
  }

  //Sections here

  public async createStudentSection(req: Request, res: Response) {

    const sectionS: any = req.body;
    console.log(sectionS);
    try {

      if (sectionS !== null && sectionS.form.id !== null && sectionS.form.id !== undefined) {


        const updatedClassS = await prisma.section.update({
          where: {
            id: sectionS.form.id,
            campusId: Number(sectionS.form.campusId)
          },
          data: {
            campusId: sectionS.form.campusId,
            classId: sectionS.form.classId,
            sectionName: sectionS.form.sectionName,
            updated_by: sectionS.form.updated_by,
            updated_at: new Date(),
            active: 1,
          },
        })

        //Delete all teachers
        await prisma.teachersInSection.deleteMany({
          where: {
            campusId: Number(sectionS.form.campusId),
            sectionId: Number(sectionS.form.id),
          }
        });
        //Add New Teachers
        if (sectionS.form.teacherId !== null && sectionS.form.teacherId !== undefined 
                  && Array.isArray(sectionS.form.teacherId) && sectionS.form.teacherId.length > 0) {
          sectionS.form.teacherId.forEach(async (idsEach) => {
            const teachersInSection = await prisma.teachersInSection.create({
              data: {
                campusId: Number(sectionS.form.campusId),
                teacherId: Number(idsEach),
                sectionId: Number(sectionS.form.id),
              }
            });
          });

        }

        return res.json({ status: true, data: updatedClassS, message: 'Successfully updated section' });


      } else {
        const createSectionS = await prisma.section.create({
          data: {
            campusId: sectionS.form.campusId,
            classId: sectionS.form.classId,
            sectionName: sectionS.form.sectionName,
            created_at:new Date(),
            created_by:sectionS.form.updated_by,
            updated_by: sectionS.form.updated_by,
            updated_at: new Date(),
            active: 1,
          },
        });

        if (sectionS.form.teacherId !== null && sectionS.form.teacherId !== undefined && Array.isArray(sectionS.form.teacherId) && sectionS.form.teacherId.length > 0) {
          sectionS.form.teacherId.forEach(async (idsEach) => {
            const teachersInSection = await prisma.teachersInSection.create({
              data: {
                campusId: Number(sectionS.form.campusId),
                teacherId: Number(idsEach),
                sectionId: Number(createSectionS.id),
              }
            });
          });

        }

        return res.json({ status: true, data: createSectionS, message: 'Successfully created section' });

      }



    } catch (error) {
      console.error(error);

      return res.json({ status: false, data: null, message: 'Failed to create section' });
    }
  }

  public async updateStudentSection(req: Request, res: Response) {
    const id = Number(req.params.id);
    const campusId = Number(req.params.campusId);
    const input: any = req.body;

    const section = await prisma.section.findUnique({
      where: {
        id: id,
        campusId: campusId
      },
    })


    if (!section) {
      return res.json({ status: false, data: section, message: 'Failed to update section' });
    }

    try {
      const updatedsection = await prisma.section.update({
        where: {
          id: id,
          campusId: campusId
        },
        data: input,
      })


      return res.json({ status: true, data: updatedsection, message: 'Updated section successfully' });

    } catch (error) {
      console.error(error);
      return res.json({ status: false, data: section, message: 'Failed to update section' });
    }
  }


  public async addSubjectToSection(req: Request, res: Response) {
    const input: any = req.body;
    console.log(input.form)
    const section = await prisma.section.findUnique({
      where: {
        id: input.form.id,
        campusId: input.form.campusId
      },
    })


    if (!section) {
      return res.json({ status: false, data: section, message: 'Failed to update section' });
    }

    try {
      let subjectIds = [];
      input.form.subjectId.forEach(async (idsEach) => {
        subjectIds.push({ id: Number(idsEach) });
      });


      const deletingReferences = await prisma.section.update({
        where: {
          id: input.form.id,
          campusId: Number(input.form.campusId)
        },
        data: {
          subjects: {
            set: []
          }
        },
      });


      const updatedSectionWithSubject = await prisma.section.update({
        where: {
          id: input.form.id,
          campusId: Number(input.form.campusId)
        },
        data: {
          subjects: {
            connect: subjectIds
          }
        },
      });


      return res.json({ status: true, data: updatedSectionWithSubject, message: 'Subjects added' });

    } catch (error) {
      console.error(error);
      return res.json({ status: false, data: section, message: 'Failed to update section' });
    }
  }


  public async deleteStudentSection(req: Request, res: Response) {
    const id = Number(req.params.id);
    const campusId = Number(req.params.campusId);
    const userId = Number(req.params.userId);
    console.log(req.params)

    const section = await prisma.section.findUnique({
      where: {
        id: id,
        campusId: campusId
      },
    })

    if (!section) {
      return res.json({ status: false, data: section, message: 'Unable to find section' });
    }

    await prisma.section.update({
      where: {
        id: id,
        campusId: campusId
      },
      data: {
        active: 0,
        updated_by: userId,
        updated_at: new Date()
      }
    })

    return res.json({ status: true, data: null, message: 'Deleted section' });
  }



  public async getStudentSectionById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const campusId = Number(req.params.campusId);

    const section = await prisma.section
      .findUnique({
        where: {
          id: Number(id),
          campusId: Number(campusId)
        },
        include:{
          TeachersInSection: true,
        }
      });


    if (!section) {
      return res.json({ status: false, data: section, message: 'Failed to fetch section' });
    }

    return res.json({ status: true, data: section, message: 'Fetched section successfully' });
  }

  public async getAllSectionsByClass(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const classId = Number(req.params.classId);
    const active = Number(req.params.active);

    const section = await prisma.section.findMany({
      where: {
        campusId: Number(campusId),
        classId: Number(classId),
        active: Number(active)
      },

      include: {
        class: true,
        campus: true,
        User: true,
        subjects: true,
        TeachersInSection: {
          include:{
            teacher: true
          }
        }
      },
    });
    return res.json({ status: true, data: section, message: 'Sections for Class loaded' });
  }

  public async getAllStudentSections(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);

    const section = await prisma.section.findMany({
      where: {
        campusId: Number(campusId)
      },
      include:{
        TeachersInSection: true,
      }
    });
    return res.json({ status: true, data: section, message: 'Sections loaded successfully' });
  }

}