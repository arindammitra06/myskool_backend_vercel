import { Request, Response } from "express";
import { prisma } from "../../../../../../shared/db-client";
import { decrypt, encrypt } from "../../../../../../shared/helpers/utils/generic.utils";
import { UserType } from "@prisma/client";



export class UserController {

public async fetchAllUsers  (req: Request, res: Response)  {
    const campusId = Number(req.params.campusId);
    
    const users = await prisma.user.findMany({
      where: {
        campusId : Number(campusId),
      },
      include: {
        campus : true,
        class: true,
        parent: {
          include: {
            parent:true
          }
        },  
        children: {
          include: {
            children:true
          }
        },
        userPermissions:{
          include:{
            permission: true
          }
        }
      },
    });
    return res.json({ status: true,  data: users , message:'' });
}


public async fetchAllActiveInactiveUsers  (req: Request, res: Response)  {
  const campusId = Number(req.params.campusId);
  const type = Number(req.params.type);
  const empType = String(req.params.empType);
  
  const users = await prisma.user.findMany({
    where: {
      campusId : Number(campusId),
      active: type,
      userType: UserType[empType]
    },
    include: {
      campus : true,
      class: true,
    },
  });
  return res.json({ status: true,  data: users , message:'' });
}



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


public async updateThemeAndPhoto (req: Request, res: Response) {
  const userData: any = req.body;
  
  
  const user = await prisma.user.findUnique({
    where: {
      id: userData.form.id,
    },
  })

  
  if (!user) {
    return res.status(404).json({ status: false,  data: null , message: `The user with the id "${userData.form.id}" not found.`})
  }

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userData.form.id,
      },
      data: {
        colorName :userData.form.colorName,
        photo: userData.photo,
        thumbnailUrl: userData.thumbnailUrl,
        created_by :userData.created_by,
        updated_by :userData.updated_by
      },
    })


    return res.json({status: true,   data: updatedUser ,message: `Updated successfully. Relogin for theme changes.`});
  } catch (error) {
    console.error(error);

   return res.status(400).json({status: false,  data: null , message: error.message })
  }
}

public async updateUserByFields (req: Request, res: Response) {
  const userData: any = req.body;
  const user = await prisma.user.findUnique({
    where: {
      id: userData.form.id,
    },
  })

  
  if (!user) {
    return res.status(404).json({status: false,  data: null , message: `The user with the id "${userData.form.id}" not found.`})
  }

  try {
    
    const updatedUser = await prisma.user.update({
      where: {
        id: userData.form.id,
      },
      data: userData.fields,
    })


  return res.json({status: true,   data: updatedUser ,message: `Updated successfully. Relogin to see changes.`});
   } catch (error) {
     console.error(error);
  return res.status(400).json({ status: true, data: null , message: error.message })
  }
}

public async getActiveUsersByType  (req: Request, res: Response)  {
  const campusId = Number(req.params.campusId);
  const empType = String(req.params.empType);
  
  let users;
  
  if(empType==='employee'){
    users = await prisma.user.findMany({
      where: {
        campusId : Number(campusId),
        userType: {
          in: [UserType.staff, UserType.accountant, UserType.admin] 
        },
        active: 1
      },
      include: {
        campus : true,
        class: true,
        parent: {
          include: {
            parent:true
          }
        },  
        children: {
          include: {
            children:true
          }
        },
  
      },
    });
  }else{
    const classId = Number(req.params.classId);
    const sectionId = Number(req.params.sectionId);
    
    users = await prisma.user.findMany({
      where: {
        campusId : Number(campusId),
        userType: {
          in: [UserType.student]
        },
        classId: classId,
        sectionId: sectionId,
        active: 1
      },
      include: {
        campus : true,
        class: true,
        parent: {
          include: {
            parent:true
          }
        },  
        children: {
          include: {
            children:true
          }
        },
  
      },
    });
  }

  
  return res.json({ status: true,  data: users , message:'Employees retrieved successfully' });
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
  const idCardNumber = parmaspassed.idCardNumber;
  const password = parmaspassed.password;
  let user;
  try{
 
  user = await prisma.user
  .findFirst({
    where: {
      idCardNumber: String(idCardNumber),
      password : encrypt(String(password)),
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
  } catch (error) {
    console.error(error);

    return res.json({ status: false,  data: null , message:'User/Password not found' });
  }

  if (!user) {
    return res.json({status: false,  currentUser: null , message:'User/Password not found'});
  }
  return res.json({status: true,  currentUser: user , message:'Login successful'});
}

public async resetMyPassword  (req: Request, res: Response) {
  const parmaspassed: any = req.body;
  console.log(parmaspassed)
  const idCardNumber = parmaspassed.form.idCardNumber;
  const newPassword = parmaspassed.form.newPassword;
  const otp = parmaspassed.secretCode;
  
  let user;
  try{
 
  user = await prisma.user
  .findFirst({
    where: {
      idCardNumber: String(idCardNumber),
      resetPasswordFlag: 1,
      resetPasswordCode: otp
    },
    });
  } catch (error) {
    return res.json({ status: false,  data: null , message:'ID Card number or secret code invalid' });
  }

  if (!user) {
    return res.json({status: false,  data: null , message:'ID Card number or secret code invalid'});
  }

  const encryptedPassword = encrypt(newPassword);
  
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data:{
        password: encryptedPassword,
        resetPasswordFlag: 0,
        resetPasswordCode: null,
        updated_by: user.id,
        updated_at: new Date()
    }
    
  })


  return res.json({status: true,  data: null , message:'Password reset successful. Relogin.'});
}



public async getAllActiveMenus  (req: Request, res: Response) {
  const campusId = Number(req.params.campusId);
    
  const menus = await prisma.menuCategory.findMany({
    where:{
      active: 1
    },
    include: {
      menu_item: true,
    },
  });
  return res.json({status:true,  data: menus, message:'' });
}

public async getAllMenusAsCreatersJSON  (req: Request, res: Response) {
  const menus = await prisma.menuCategory.findMany({
    where:{
      active: 1
    },
    include: {
      menu_item: true,
    },
  });
  
  let menuNodes = [];

  if(menus!==null && menus!==undefined && menus.length>0){
    
    menus.forEach((menuCat : any) => {
     if(menuCat!==null && menuCat!==undefined && menuCat.active===1){
        
        let hasChildren = false;
        let children = [];
        
        if(menuCat.menu_item!==null && menuCat.menu_item!==undefined && menuCat.menu_item.length>0){
          hasChildren=true;
          menuCat.menu_item.forEach((item : any) => {
            children.push({value: item.id+'|MENU_ITEM|'+item.label, label: item.label})
          });
        }

        if(hasChildren){
          menuNodes.push({value: menuCat.id+'|MENU_CAT|'+menuCat.label, label: menuCat.label , children : children})
        }else{
          menuNodes.push({value: menuCat.id+'|MENU_CAT|'+menuCat.label, label: menuCat.label })
        }
      }
    });
  }
  return res.json({status:true,  data: menuNodes, message:'' });
}

public async getAllActivePermissions  (req: Request, res: Response) {
  const campusId = Number(req.params.campusId);
  console.log('here')
  const permissions = await prisma.permission.findMany({
    where:{
      active: 1,
      campusId: Number(campusId)
    },
    include: {
      MenuCategoryPermissions: {
        include:{
          menuCategory: true
        }
      },
      MenuItemPermissions: {
        include:{
          menuItem: true
        }
      },
      UserPermission:{
          include :{
            User :true
          }
      }

    },
  });
  console.log(permissions);
  return res.json({status:true,  data: permissions, message:'' });
}



public async addUpdateRoles  (req: Request, res: Response) {
              
  const roleDetails: any = req.body;
  console.log(roleDetails)
  
  try {
    
    if(roleDetails!==null && roleDetails.id!==null && roleDetails.id!==undefined){
      
          const updatePermission = await prisma.permission.update({
            where: {
              id: roleDetails.id,
              campusId: roleDetails.campusId,
            },
            data:{
                permissionName: roleDetails.permissionName,
                permissionType: roleDetails.permissionType,
                isReadonly: roleDetails.readonly,
                updated_by: roleDetails.currentUserId,
                updated_at: new Date()
            }
            
          })

          if(roleDetails.selected!==null && roleDetails.selected!==undefined 
            && Array.isArray(roleDetails.selected) && roleDetails.selected.length>0){
              
              let menuCategories = [];
              let menuItems = [];
              roleDetails.selected.forEach(async (idsEach) => {
                let splitMenu = idsEach.split("|");
                if(splitMenu!==null && splitMenu!==undefined && splitMenu.length==3){
                  if(splitMenu[1]!==null && splitMenu[1]!==undefined && splitMenu[1]==='MENU_CAT'){
                    menuCategories.push(Number(splitMenu[0]));
                  }else if(splitMenu[1]!==null && splitMenu[1]!==undefined && splitMenu[1]==='MENU_ITEM'){
                    menuItems.push(Number(splitMenu[0]));
                  }
                }
                
              });

              
              const deletingCatReferences = await prisma.menuCategoryPermissions.deleteMany({
                where: {
                  permissionId: roleDetails.id,
                  campusId: roleDetails.campusId,
                },
              });

              const deletingItemReferences = await prisma.menuItemPermissions.deleteMany({
                where: {
                  permissionId: roleDetails.id,
                  campusId: roleDetails.campusId,
                },
              });
             
              if(menuCategories!==null && menuCategories.length>0){
                menuCategories.forEach(async (id) => {
                    console.log('menu CAT ID-- >'+id)
              
                    await prisma.menuCategoryPermissions.create({
                    data: {
                        permissionId: Number(roleDetails.id),
                        menuCategoryId: Number(id),
                        campusId: roleDetails.campusId,
                        active:1,
                        created_by:roleDetails.currentUserId,
                        updated_by: roleDetails.currentUserId
                      },
                    },); 
                });
              }
              
              
              if(menuItems!==null && menuItems.length>0){
                menuItems.forEach(async (id) => {
                    console.log('menu ITEM ID-- >'+id)
              
                    await prisma.menuItemPermissions.create({
                    data: {
                        permissionId: Number(roleDetails.id),
                        menuItemId:  Number(id),
                        campusId: roleDetails.campusId,
                        active:1,
                        created_by:roleDetails.currentUserId,
                        updated_by: roleDetails.currentUserId
                      },
                    },); 
                });
              }

              //TBD This is to be done
            //update user permission type in users with permission ID
            let userpermissions = await prisma.userPermission.findMany({
              where: {
                permissionId : Number(roleDetails.id),
                campusId: roleDetails.campusId,
                active: 1
              },
              include: {
                User : true,
              },
            });

            if(userpermissions!==null && userpermissions!==undefined && userpermissions.length>0){
              userpermissions.forEach(async (userPerm) => {
                if(userPerm!==null && userPerm!==undefined && userPerm.User!==null && userPerm.User!==null){
                  console.log('User present for permission id -->'+userPerm.User.displayName)
          
                }
            });
            }
            //END
            //TBD This is to be done
            //update user permission type in users with permission ID
              
              return res.json({ status: true,  data: null , message:'Updated Role' });
          }else{
            console.log('Clear references if nothing is selected or unselected')
            const deletingCatReferences = await prisma.menuCategoryPermissions.deleteMany({
              where: {
                permissionId: roleDetails.id,
                campusId: roleDetails.campusId,
              },
            });

            const deletingItemReferences = await prisma.menuItemPermissions.deleteMany({
              where: {
                permissionId: roleDetails.id,
                campusId: roleDetails.campusId,
              },
            });
            
            //TBD This is to be done
            //update user permission type in users with permission ID
            let userpermissions = await prisma.userPermission.findMany({
              where: {
                permissionId : Number(roleDetails.id),
                campusId: roleDetails.campusId,
                active: 1
              },
              include: {
                User : true,
              },
            });

            if(userpermissions!==null && userpermissions!==undefined && userpermissions.length>0){
              userpermissions.forEach(async (userPerm) => {
                if(userPerm!==null && userPerm!==undefined && userPerm.User!==null && userPerm.User!==null){
                  console.log('User present for permission id -->'+userPerm.User.displayName)
          
                }
            });
            }
            //END
            //TBD This is to be done
            //update user permission type in users with permission ID
           
            return res.json({ status: true,  data: null , message:'Updated Role' });
          }
    }else{
      
      const createPermission = await prisma.permission.create({
        data:{
            active: 1,
            isMobile:0,
            permissionName: roleDetails.permissionName,
            permissionType: roleDetails.permissionType,
            campusId: roleDetails.campusId,
            isReadonly: roleDetails.readonly,
            created_by:roleDetails.currentUserId,
            created_at:new Date(),
            updated_by: roleDetails.currentUserId,
            updated_at: new Date()
        }
        
      })
      console.log('Created role with id -->'+createPermission.id)
      if(createPermission!==null && createPermission.id!==null && roleDetails.selected!==null && roleDetails.selected!==undefined 
        && Array.isArray(roleDetails.selected) && roleDetails.selected.length>0){
          
          let menuCategories = [];
          let menuItems = [];
          roleDetails.selected.forEach(async (idsEach) => {
            let splitMenu = idsEach.split("|");
            if(splitMenu!==null && splitMenu!==undefined && splitMenu.length==3){
              if(splitMenu[1]!==null && splitMenu[1]!==undefined && splitMenu[1]==='MENU_CAT'){
                menuCategories.push(Number(splitMenu[0]));
              }else if(splitMenu[1]!==null && splitMenu[1]!==undefined && splitMenu[1]==='MENU_ITEM'){
                menuItems.push(Number(splitMenu[0]));
              }
            }
            
          });

          if(menuCategories!==null && menuCategories.length>0){
            menuCategories.forEach(async (id) => {
                await prisma.menuCategoryPermissions.create({
                data: {
                    permissionId: Number(createPermission.id),
                    menuCategoryId: Number(id),
                    campusId: roleDetails.campusId,
                    active:1,
                    created_by:roleDetails.currentUserId,
                    updated_by: roleDetails.currentUserId
                  },
                },); 
            });
          }

          if(menuItems!==null && menuItems.length>0){
            menuItems.forEach(async (id) => {
                await prisma.menuItemPermissions.create({
                data: {
                    permissionId: Number(createPermission.id),
                    menuItemId: Number(id),
                    active:1,
                    campusId: roleDetails.campusId,
                    created_by:roleDetails.currentUserId,
                    updated_by: roleDetails.currentUserId
                  },
                },); 
            });
          }
          
         
      }
      return res.json({ status: true,  data: null , message:'Created new role' });
    }
    

    
  } catch (error) {
    console.error(error);

    return res.json({ status: false,  data: null , message:'Failed to update role' });
  }
}


public async deleteUserRole  (req: Request, res: Response) {
  const id = Number(req.params.id);
  const campusId = Number(req.params.campusId);
  
  console.log('Delete User Role By ID : '+id);
  try{

    const usersPermissions = await prisma.userPermission.findMany({
      where: {
        permissionId: Number(id),
        campusId: Number(campusId),
      },
    })
  
    
    if (usersPermissions!==null && usersPermissions!==undefined && usersPermissions.length>0) {
      return res.json({ status: false,  data: null , message: `Users linked to Role. Remove roles from user before deleting role.`})
    }


    const deletedMenuCatPermissions = await prisma.menuCategoryPermissions.deleteMany({
      where: {
        permissionId: Number(id),
        campusId: Number(campusId),
      },
    })

    const deletedMenuItemPermissions = await prisma.menuItemPermissions.deleteMany({
      where: {
        permissionId: Number(id),
        campusId: Number(campusId),
      },
    })


    const deletedRole = await prisma.permission.delete({
      where: {
        id: Number(id),
        campusId: Number(campusId),
      },
    });


    } catch (error) {
      console.error(error);

    return res.status(400).json({status: false,  data: null , message: error.message })
  }
  return res.json({ status: true,  data: null , message: "Role deleted" });
}


public async updateUserPermission(req: Request, res: Response) {
  const userData: any = req.body;
  console.log(userData)
  const user = await prisma.user.findUnique({
    where: {
      id: Number(userData.form.id),
    },
  })

  
  if (!user) {
    return res.status(404).json({status: false,  data: null , message: `The user with the id "${userData.form.id}" not found.`})
  }

  try {
    const permission = await prisma.permission.findUnique({
      where: {
        id: Number(userData.form.permissionId),
        campusId : Number(userData.form.campusId),
      },
    })
    if(permission!==null && permission!==undefined){
      const updatedUser = await prisma.user.update({
        where: {
          id: Number(userData.form.id),
          campusId: Number(userData.form.campusId),
        },
        data: {
          userType: UserType[permission.permissionType],
          updated_at: new Date(),
          updated_by: Number(userData.form.currentUserId)
        },
      });

      const createUserPermission = await prisma.userPermission.create({
        data: {
          userId: Number(updatedUser.id),
          permissionId: Number(permission.id),
          active: 1,
          campusId: Number(userData.form.campusId),
          updated_at: new Date(),
          updated_by: Number(userData.form.currentUserId),
          created_at: new Date(),
          created_by: Number(userData.form.currentUserId)
        },
      });
    }else{
      return res.status(404).json({status: false,  data: null , message: `Selected permission not found.`})
    }
    


    return res.json({status: true,   data: null ,message: `Role updated. User can login to see changes.`});


   } catch (error) {
     console.error(error);
  return res.status(400).json({ status: true, data: null , message: error.message })
  }
}


public async deactivateUser  (req: Request, res: Response) {
  const id = Number(req.params.id);
  const campusId = Number(req.params.campusId);
  const currentUserId = Number(req.params.currentUserId);
  
  console.log('Deactivate User By ID : '+id);
  try{
    const deactivatedUSer = await prisma.user.update({
      where: {
        id: Number(id),
        campusId: Number(campusId),
      },
      data:{
        active: 0,
        updated_at: new Date(),
        updated_by: Number(req.params.currentUserId)
      }
    });


    } catch (error) {
      console.error(error);

    return res.status(400).json({status: false,  data: null , message: error.message })
  }
  return res.json({ status: true,  data: null , message: "User deactivated" });
}

}