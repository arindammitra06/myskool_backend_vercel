import { Request, Response } from "express";
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()


export class ClassSectionController {


  public async createStudentClass  (req: Request, res: Response) {

  const classS: any = req.body;
  
  try {
    
    const createclassS = await prisma.class.create({
      data: classS,
    })

    return res.json({ status: true,  data: createclassS , message:'Successfully created Class' });

  } catch (error) {
    console.error(error);

    return res.json({ status: false,  data: classS , message:'Failed to create Class' });
  }
}

public async updateStudentClass (req: Request, res: Response) {
  const id = Number(req.params.id);
  const campusId = Number(req.params.campusId);
  const input: any = req.body;

  const classS = await prisma.class.findUnique({
    where: {
      id: id,
      campusId:campusId
    },
  })

  
  if (!classS) {
    return res.json({ status: false,  data: classS , message:'Failed to delete Class' });
  }

  try {
    const updatedClassS = await prisma.class.update({
      where: {
        id: id,
        campusId:campusId
      },
      data: input,
    })


    return res.json({ status: true,  data: updatedClassS , message:'Updated Class successfully' });
  
} catch (error) {
    console.error(error);
    return res.json({ status: false,  data: classS , message:'Failed to delete Class' });
  }
}

public async deleteStudentClass  (req: Request, res: Response)  {
  const id = Number(req.params.id);
  const campusId = Number(req.params.campusId);

  const classS = await prisma.class.findUnique({
    where: {
      id: id,
      campusId:campusId
    },
  })

  if (!classS) {
    return res.json({ status: false,  data: classS , message:'Unable to find Class' });
  }

  const deletedClass = await prisma.class.delete({
    where: {
      id: id,
      campusId:campusId
    },
  })

  return res.json({ status: false,  data: null , message:'Deleted Class' });
}



public async getStudentClassById  (req: Request, res: Response)  {
  const id = Number(req.params.id);
  const campusId = Number(req.params.campusId);

  const classS = await prisma.class
  .findUnique({
    where: {
      id: Number(id),
      campusId : Number(campusId)
    },
    include: {
      Section: true, 
    },
  });


  if (!classS) {
    return res.json({ status: false,  data: classS , message:'Failed to fetch class' });
  }

  return res.json({ status: true,  data: classS , message:'Fetched class successfully' });
}


public async getAllStudentClass  (req: Request, res: Response)  {
  const campusId = Number(req.params.campusId);

  const classS = await prisma.class.findMany({
    where: {
      campusId : Number(campusId)
    },
    include: {
      Section: true, 
    },
  });

  return res.json({ status: true,  data: classS , message:'Classes loaded successfully' });
}

//Sections here

public async createStudentSection  (req: Request, res: Response) {

  const section: any = req.body;

  try {
    
    const createsection= await prisma.section.create({
      data: section,
    })

    return res.json({ status: true,  data: createsection , message:'Successfully created section' });

  } catch (error) {
    console.error(error);

    return res.json({ status: false,  data: section , message:'Failed to create section' });
  }
}

public async updateStudentSection (req: Request, res: Response) {
  const id = Number(req.params.id);
  const campusId = Number(req.params.campusId);
  const input: any = req.body;

  const section = await prisma.section.findUnique({
    where: {
      id: id,
      campusId:campusId
    },
  })

  
  if (!section) {
    return res.json({ status: false,  data: section , message:'Failed to delete section' });
  }

  try {
    const updatedsection= await prisma.section.update({
      where: {
        id: id,
        campusId:campusId
      },
      data: input,
    })


    return res.json({ status: true,  data: updatedsection , message:'Updated section successfully' });
  
} catch (error) {
    console.error(error);
    return res.json({ status: false,  data: section , message:'Failed to delete section' });
  }
}

public async deleteStudentSection (req: Request, res: Response) {
  const id = Number(req.params.id);
  const campusId = Number(req.params.campusId);
  const section = await prisma.section.findUnique({
    where: {
      id: id,
      campusId: campusId
    },
  })

  if (!section) {
    return res.json({ status: false,  data: section , message:'Unable to find section' });
  }

  const deletedSection = await prisma.section.delete({
    where: {
      id: id,
      campusId:campusId
    },
  })

  return res.json({ status: false,  data: null , message:'Deleted section' });
}



public async getStudentSectionById  (req: Request, res: Response)  {
  const id = Number(req.params.id);
  const campusId = Number(req.params.campusId);

  const section = await prisma.section
  .findUnique({
    where: {
      id: Number(id),
      campusId :Number(campusId)
    },
  });


  if (!section) {
    return res.json({ status: false,  data: section , message:'Failed to fetch section' });
  }

  return res.json({ status: true,  data: section , message:'Fetched section successfully' });
}

public async getAllSectionsByClass  (req: Request, res: Response)  {
  const campusId = Number(req.params.campusId);
  const classId = Number(req.params.classId);

  const section = await prisma.section.findMany({
    where: {
      campusId :Number(campusId),
      classId : Number(classId)
    },
  });
  return res.json({ status: true,  data: section , message:'Sections for Class loaded' });
}

public async getAllStudentSections  (req: Request, res: Response)  {
  const campusId = Number(req.params.campusId);

  const section = await prisma.section.findMany({
    where: {
      campusId :Number(campusId)
    },
  });
  return res.json({ status: true,  data: section , message:'Sections loaded successfully' });
}

}