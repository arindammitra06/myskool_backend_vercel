import { Request, Response } from "express";
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export class UserController {


  public async createUser  (req: Request, res: Response)  {

  const user: any = req.body;

  try {
    
    const createUser = await prisma.user.create({
      data: user,
    })

    return res.json({ data: createUser });

  } catch (error) {
    console.error(error);

    return res.status(400).json({ message: error.message })
  }
}

public async updateUser (req: Request, res: Response) {
  const id = Number(req.params.id);
  const input: any = req.body;

  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  })

  
  if (!user) {
    return res.status(404).json({ message: `The user with the id "${id}" not found.`})
  }

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: input,
    })


    return res.json({ data: updatedUser });
  } catch (error) {
    console.error(error);

    return res.status(400).json({ message: error.message })
  }
}

public async deleteUser  (req: Request, res: Response) {
  const id = Number(req.params.id);

  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  })

  if (!user) {
    return res.status(404).json({ message: `The user with the id "${id}" not found.`})
  }

  const deletedUser = await prisma.user.delete({
    where: {
      id: id,
    },
  })

  return res.json({ message: "The user has been deleted successfully!" });
}



public async getUserById  (req: Request, res: Response) {
  const id = Number(req.params.id);

  const drafts = await prisma.user
  .findUnique({
    where: {
      id: Number(id),
    },
    include: {
      userPermissions: {
        include: {
          permission: {
            include: {
              MenuCategoryPermissions: {
                include: {
                  menuCategory: true,
                }
              },
              MenuItemPermissions: {
                include: {
                  menuItem: true,
                }
              },
            },
          },
        }
      },  
      campus : true,
      class: true
    },
  });


  if (!drafts) {
    return res.status(404).json({ message: `The user with the id "${id}" not found.`})
  }

  return res.json({ data: drafts });
}

public async loginUserByIdPassword  (req: Request, res: Response) {
  const parmaspassed: any = req.body.params;
  const id = parmaspassed.id;
  const password = parmaspassed.password;
  const user = await prisma.user
  .findUnique({
    where: {
      id: Number(id),
      password : String(password),
      active: 1
    },
    include: {
      campus : true,
      class: true,
      userPermissions: {
        include: {
          permission: {
            include: {
              MenuCategoryPermissions: {
                include: {
                  menuCategory: true,
                }
              },
              MenuItemPermissions: {
                include: {
                  menuItem: true,
                }
              },
            },
          },
        }
      }, 
    },
  });

  console.log(user);
  if (!user) {
    return res.json({status: false,  currentUser: null , message:'User/Password not found'});
  }

  return res.json({status: true,  currentUser: user , message:'Login successful'});
}



public async getAllUsers  (req: Request, res: Response) {
  const users = await prisma.user.findMany();
  return res.json({ data: users });
}

}