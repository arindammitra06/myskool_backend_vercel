import { Request, Response } from "express";
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export class TransportController {
  
  public async createTransportRoute  (req: Request, res: Response)  {

  const transportRoutes: any = req.body;

  try {
    
    const createTransportRoute = await prisma.transportRoutes.create({
      data: transportRoutes,
    })

    return res.json({ status: true,  data: createTransportRoute , message:'Successfully created transport route' });

  } catch (error) {
    console.error(error);

    return res.json({ status: false,  data: transportRoutes , message:'Failed to create transport routes' });
  }
}

public async updateTransportRoute (req: Request, res: Response) {
  const id = Number(req.params.id);
  const campusId = Number(req.params.campusId);
  const input: any = req.body;

  const transportRoutes = await prisma.transportRoutes.findUnique({
    where: {
      id: id,
      campusId:campusId
    },
  })

  
  if (!transportRoutes) {
    return res.json({ status: false,  data: transportRoutes , message:'Failed to delete Institute' });
  }

  try {
    const updatedtransportRoutes = await prisma.transportRoutes.update({
      where: {
        id: id,
        campusId:campusId
      },
      data: input,
    })


    return res.json({ status: true,  data: updatedtransportRoutes , message:'Updated transport route successfully' });
  
} catch (error) {
    console.error(error);
    return res.json({ status: false,  data: transportRoutes , message:'Failed to delete transport route' });
  }
}

public async deleteTransportRoute  (req: Request, res: Response) {
  const id = Number(req.params.id);
  const campusId = Number(req.params.campusId);
  const transportRoutes = await prisma.transportRoutes.findUnique({
    where: {
      id: id,
      campusId:campusId
    },
  })

  if (!transportRoutes) {
    return res.json({ status: false,  data: transportRoutes , message:'Unable to find transport route' });
  }

  const deletedTransportRoute = await prisma.transportRoutes.delete({
    where: {
      id: id,
      campusId:campusId
    },
  })

  return res.json({ status: false,  data: null , message:'Deleted transport route' });
}



public async getTransportRouteById  (req: Request, res: Response)  {
  const id = Number(req.params.id);
  const campusId = Number(req.params.campusId);
  const transportRoutes = await prisma.transportRoutes
  .findUnique({
    where: {
      id: Number(id),
      campusId:Number(campusId)
    },
  });


  if (!transportRoutes) {
    return res.json({ status: false,  data: transportRoutes , message:'Failed to fetch transport route' });
  }

  return res.json({ status: true,  data: transportRoutes , message:'Fetched transport route successfully' });
}


public async getAllTransportRoutes  (req: Request, res: Response)  {
  const campusId = Number(req.params.campusId);
  const ins = await prisma.transportRoutes.findMany({
    where: {
      campusId : Number(campusId)
    },
  });
  return res.json({ status: true,  data: ins , message:'Rransport routes loaded successfully' });
}
}