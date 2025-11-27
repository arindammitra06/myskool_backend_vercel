import type { Request, Response } from 'express';
import { prisma } from '../../../../../shared/db-client';
import { buildTheme } from '../../../../../shared/helpers/utils/generic.utils';



export class InstituteController {
  public async createInstitute(req: Request, res: Response) {

    const institute: any = req.body;

    try {

      const createInstitute = await prisma.institute.create({
        data: institute,
      })

      return res.json({ status: true, data: createInstitute, message: 'Successfully created Institute' });

    } catch (error) {
      console.error(error);

      return res.json({ status: false, data: institute, message: 'Failed to create Institute' });
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
      return res.json({ status: false, data: institute, message: 'Failed to delete Institute' });
    }

    try {
      const updatedinstitute = await prisma.institute.update({
        where: {
          id: id,
        },
        data: input,
      })


      return res.json({ status: true, data: updatedinstitute, message: 'Updated Institute successfully' });

    } catch (error) {
      console.error(error);
      return res.json({ status: false, data: institute, message: 'Failed to delete Institute' });
    }
  }


  public async updateInstituteByFields(req: Request, res: Response) {
    const instituteData: any = req.body;
    console.log(instituteData)
    const ins = await prisma.institute.findUnique({
      where: {
        id: instituteData.form.instituteId,
      },
    })


    if (!ins) {
      return res.status(404).json({ status: false, data: null, message: `The Institute with the id "${instituteData.form.id}" not found.` })
    }

    try {

      const updatedIns = await prisma.institute.update({
        where: {
          id: instituteData.form.instituteId,
        },
        data: instituteData.fields,
      })


      return res.json({ status: true, data: updatedIns, message: `Updated successfully. Relogin to see changes.` });
    } catch (error) {
      console.error(error);

      return res.json({ status: false, data: null, message: error.message })
    }
  }



  public async deleteInstitute(req: Request, res: Response) {
    const id = Number(req.params.id);

    const institute = await prisma.institute.findUnique({
      where: {
        id: id,
      },
    })

    if (!institute) {
      return res.json({ status: false, data: institute, message: 'Unable to find Institute' });
    }

    await prisma.institute.delete({
      where: {
        id: id,
      },
    })

    return res.json({ status: false, data: null, message: 'Deleted institute' });
  }



  public async getInstituteById(req: Request, res: Response) {
    const id = Number(req.params.id);

    const inst = await prisma.institute
      .findFirst({
        take: 1,
        include: {
          Campus: true,
          theme: true,
          PaymentDetails: true
        },
      });


    if (!inst) {
      return res.json({ status: false, data: inst, message: 'Failed to fetch Institute' });
    }
    let newTheme;
    if (inst !== null && inst !== undefined && inst.theme !== null && inst.theme !== undefined) {
      newTheme = buildTheme(inst.theme);
    }

    return res.json({
      status: true, data: { institute: inst, theme: newTheme, colorScheme: inst.theme.scheme },
      message: 'Fetched Institute successfully'
    });
  }


  public async getAllInstitutes(req: Request, res: Response) {
    const ins = await prisma.institute.findMany();
    return res.json({ status: true, data: ins, message: 'Institutes loaded successfully' });
  }
}
