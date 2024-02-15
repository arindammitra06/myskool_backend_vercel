import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export class InstituteController {
public async createInstitute (req: Request, res: Response) {

  const institute: any = req.body;

  try {
    
    const createInstitute = await prisma.institute.create({
      data: institute,
    })

    return res.json({ status: true,  data: createInstitute , message:'Successfully created Institute' });

  } catch (error) {
    console.error(error);

    return res.json({ status: false,  data: institute , message:'Failed to create Institute' });
  }
}

public async updateInstitute(req: Request, res: Response) {
  const id = Number(req.params.id);
  const input: any = req.body;

  const institute = await prisma.institute.findUnique({
    where: {
      id: id,
    },
  })

  
  if (!institute) {
    return res.json({ status: false,  data: institute , message:'Failed to delete Institute' });
  }

  try {
    const updatedinstitute = await prisma.institute.update({
      where: {
        id: id,
      },
      data: input,
    })


    return res.json({ status: true,  data: updatedinstitute , message:'Updated Institute successfully' });
  
} catch (error) {
    console.error(error);
    return res.json({ status: false,  data: institute , message:'Failed to delete Institute' });
  }
}

public async deleteInstitute (req: Request, res: Response) {
  const id = Number(req.params.id);

  const institute = await prisma.institute.findUnique({
    where: {
      id: id,
    },
  })

  if (!institute) {
    return res.json({ status: false,  data: institute , message:'Unable to find Institute' });
  }

  const deletedinstitute = await prisma.institute.delete({
    where: {
      id: id,
    },
  })

  return res.json({ status: false,  data: null , message:'Deleted institute' });
}



public async getInstituteById  (req: Request, res: Response)  {
  const id = Number(req.params.id);

  const inst = await prisma.institute
  .findUnique({
    where: {
      id: Number(id),
    },
    include: {
      Campus: true, 
    },
  });


  if (!inst) {
    return res.json({ status: false,  data: inst , message:'Failed to fetch Institute' });
  }

  return res.json({ status: true,  data: inst , message:'Fetched Institute successfully' });
}


public async getAllInstitutes  (req: Request, res: Response)  {
  const ins = await prisma.institute.findMany();
  return res.json({ status: true,  data: ins , message:'Institutes loaded successfully' });
}
}
