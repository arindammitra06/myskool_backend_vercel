import { Request, Response } from "express";
import { prisma } from "../../../../../../shared/db-client";
import { addANotification, buildTheme, decrypt, encrypt, getDateForMatching } from "../../../../../../shared/helpers/utils/generic.utils";
import { AbsenseStatus, AttendanceType, FeeStatus, UserType } from "@prisma/client";
import { systemAppThemes } from "../../../../../../shared/helpers/utils/app-themes";
import { AttendanceSheetModel } from "../../../../../../shared/models/attendance.model";
import moment from "moment";
import { ROLE_DELETED, ROLE_UPDATES, USER_DELETED, USER_DETAILS_UPDATED, USER_PASSWORD_RESET, USER_PERMISSION_MODIFIED, USER_PHOTO_UPDATED, USER_THEME_UPDATED } from "../../../../../../shared/constants/notification.constants";



export class UserController {

  public async fetchAllUsers(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);

    const users = await prisma.user.findMany({
      where: {
        campusId: Number(campusId),
      },
      include: {
        campus: true,
        class: true,
        parent: {
          include: {
            parent: true
          }
        },
        children: {
          include: {
            children: true
          }
        },
        userPermissions: {
          include: {
            permission: true
          }
        }
      },
    });
    return res.json({ status: true, data: users, message: 'Users retrieved' });
  }


  public async fetchAllActiveInactiveUsers(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const type = Number(req.params.type);
    const empType = String(req.params.empType);

    const users = await prisma.user.findMany({
      where: {
        campusId: Number(campusId),
        active: type,
        userType: UserType[empType]
      },
      include: {
        campus: true,
        class: true,
      },
    });
    return res.json({ status: true, data: users, message: '' });
  }



  public async createUser(req: Request, res: Response) {

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

  public async updateUser(req: Request, res: Response) {
    const id = Number(req.params.id);
    const input: any = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    })


    if (!user) {
      return res.status(404).json({ message: `The user with the id "${id}" not found.` })
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


  public async updateThemeAndPhoto(req: Request, res: Response) {
    const userData: any = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id: userData.form.id,
        campusId: userData.form.campusId,
      },
    })


    if (!user) {
      return res.status(404).json({ status: false, data: null, message: `The user with the id "${userData.form.id}" not found.` })
    }

    try {
      const updatedUser = await prisma.user.update({
        where: {
          id: userData.form.id,
          campusId: userData.form.campusId,
        },
        data: {
          photo: userData.photo,
          thumbnailUrl: userData.thumbnailUrl,
          updated_at: new Date(),
          updated_by: userData.updated_by
        },
      })

      //Add notification
      addANotification(Number(userData.form.campusId),Number(userData.form.id), Number(userData.updated_by),USER_PHOTO_UPDATED+userData.form.firstName);

      return res.json({ status: true, data: updatedUser, message: `Updated successfully. Relogin for theme changes.` });
    } catch (error) {
      console.error(error);

      return res.status(400).json({ status: false, data: null, message: error.message })
    }
  }

  public async updateUserTheme(req: Request, res: Response) {
    const userData: any = req.body;
    
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userData.id),
        campusId: Number(userData.campusId),
      },
    });
    if (!user) {
      return res.status(404).json({ status: false, data: null, message: `The user with the id "${userData.id}" not found.` })
    }

    try {
      const updatedUser = await prisma.user.update({
        where: {
          id: Number(userData.id),
          campusId: Number(userData.campusId),
        },
        data: {
          themeName: userData.themeName.toUpperCase(),
          isUserTheme: userData.isUserTheme,
          updated_at: new Date(),
          updated_by: Number(userData.id)
        },
      })

      //Add notification
      addANotification(Number(userData.campusId),Number(userData.id), Number(userData.id),USER_THEME_UPDATED+userData.themeName);

      return res.json({ status: true, data: null, message: "" });
    } catch (error) {
      console.error(error);

      return res.status(400).json({ status: false, data: null, message: error.message })
    }
  }


  public async updateUserByFields(req: Request, res: Response) {
    const userData: any = req.body;
    console.log(userData)
    const user = await prisma.user.findUnique({
      where: {
        id: userData.form.id,
        campusId: userData.campusId
      },
    })


    if (!user) {
      return res.status(404).json({ status: false, data: null, message: `The user with the id "${userData.form.id}" not found.` })
    }

    try {

      const updatedUser = await prisma.user.update({
        where: {
          id: userData.form.id,
          campusId: userData.campusId
        },
        data: userData.fields,
      })

      //Add notification
      addANotification(Number(userData.campusId),Number(userData.form.id), Number(userData.updated_by),USER_DETAILS_UPDATED+userData.fields.displayName);

      return res.json({ status: true, data: updatedUser, message: `Updated successfully. Relogin to see changes.` });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ status: true, data: null, message: error.message })
    }
  }

  public async updateLoggedInUserByFields(req: Request, res: Response) {
    const userData: any = req.body;
    console.log(userData)
    
    const user = await prisma.user.findUnique({
      where: {
        id: userData.form.id,
        campusId: userData.campusId
      },
    })


    if (!user) {
      return res.status(404).json({ status: false, data: null, message: `The user with the id "${userData.form.id}" not found.` })
    }

    try {

      const updatedUser = await prisma.user.update({
        where: {
          id: userData.form.id,
          campusId: userData.campusId
        },
        data: userData.fields,
      })

      return res.json({ status: true, data: updatedUser, message: `Updated successfully. Relogin to see changes.` });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ status: true, data: null, message: error.message })
    }
  }
  
  public async getActiveUsersByType(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const empType = String(req.params.empType);

    let users;

    if (empType === 'employee') {
      users = await prisma.user.findMany({
        where: {
          campusId: Number(campusId),
          userType: {
            in: [UserType.staff, UserType.accountant, UserType.admin]
          },
          active: 1
        },
        include: {
          campus: true,
          class: true,
          parent: {
            include: {
              parent: true
            }
          },
          children: {
            include: {
              children: true
            }
          },

        },
      });
    } else {
      const classId = Number(req.params.classId);
      const sectionId = Number(req.params.sectionId);

      users = await prisma.user.findMany({
        where: {
          campusId: Number(campusId),
          userType: {
            in: [UserType.student]
          },
          classId: classId,
          sectionId: sectionId,
          active: 1
        },
        include: {
          campus: true,
          class: true,
          parent: {
            include: {
              parent: true
            }
          },
          children: {
            include: {
              children: true
            }
          },

        },
      });
    }


    return res.json({ status: true, data: users, message: 'Employees retrieved successfully' });
  }



  public async deleteUser(req: Request, res: Response) {
    const id = Number(req.params.id);

    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    })

    if (!user) {
      return res.status(404).json({ message: `The user with the id "${id}" not found.` })
    }

    const deletedUser = await prisma.user.delete({
      where: {
        id: id,
      },
    })

    return res.json({ message: "The user has been deleted successfully!" });
  }



  public async getUserById(req: Request, res: Response) {
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
          campus: true,
          class: true
        },
      });


    if (!drafts) {
      return res.status(404).json({ message: `The user with the id "${id}" not found.` })
    }

    return res.json({ data: drafts });
  }

  public async loginUserByIdPassword(req: Request, res: Response) {
    const parmaspassed: any = req.body.params;
    const idCardNumber = parmaspassed.idCardNumber;
    const password = parmaspassed.password;
    let user;
    try {

      user = await prisma.user
        .findFirst({
          where: {
            idCardNumber: String(idCardNumber),
            password: encrypt(String(password)),
            active: 1
          },
          include: {
            campus: true,
            class: true,
            section: true,

            children: {
              include: {
                children: {
                  include: {
                    class: true,
                    section: true,
                    campus: true,
                    MYAALInvoices: true,
                    Attendance: true,
                  }
                }
              }
            },
            userPermissions: {
              include: {
                permission: {
                  include: {
                    AccessPermission: {
                      include: {
                        access: true
                      }
                    },
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

      return res.json({ status: false, data: null, message: 'User/Password not found' });
    }

    if (!user) {
      return res.json({ status: false, currentUser: null, message: 'User/Password not found' });
    }


    //This is for adding the children to parents
    if (user !== null && user !== undefined && user.userType === UserType.parent && user.children !== null && user.children !== undefined && user.children.length > 0) {
      let childrenProcessed = [];
      user.children.forEach((eachChild: any) => {
        if (eachChild !== null && eachChild !== undefined && eachChild.children !== null && eachChild.children !== undefined) {
          childrenProcessed.push(eachChild.children);
        }
      });
      user['childrenProcessed'] = childrenProcessed;
    }

    if (user !== null && user !== undefined && user.themeName !== null && user.themeName !== undefined) {
      if (user.isUserTheme === 1) {
        let themeFound = await prisma.theme
          .findFirst({
            where: {
              themeName: String(user.themeName),
              userId: Number(user.id),
              campusId: Number(user.campusId),
            }
          });
        if (themeFound !== null && themeFound !== undefined) {
          let newTheme = buildTheme(themeFound);
          user['themeObjProcessed'] = newTheme;
        }

      } else {
        let themeObj = systemAppThemes.filter(item => item.key === user.themeName);
        if (themeObj !== null && themeObj !== undefined && themeObj.length > 0) {
          user['themeObjProcessed'] = themeObj[0].value;
        }
      }
    }

    return res.json({ status: true, currentUser: user, message: 'Login successful' });
  }

  public async resetMyPassword(req: Request, res: Response) {
    const parmaspassed: any = req.body;
    console.log(parmaspassed)
    const idCardNumber = parmaspassed.form.idCardNumber;
    const newPassword = parmaspassed.form.newPassword;
    const otp = parmaspassed.secretCode;

    let user;
    try {

      user = await prisma.user
        .findFirst({
          where: {
            idCardNumber: String(idCardNumber),
            resetPasswordFlag: 1,
            resetPasswordCode: otp
          },
        });
        
    } catch (error) {
      return res.json({ status: false, data: null, message: 'ID Card number or secret code invalid' });
    }

    if (!user) {
      return res.json({ status: false, data: null, message: 'ID Card number or secret code invalid' });
    }

    const encryptedPassword = encrypt(newPassword);

    let userUpdated = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: encryptedPassword,
        resetPasswordFlag: 0,
        resetPasswordCode: null,
        updated_by: user.id,
        updated_at: new Date()
      }
    }).then((userUpdatedResponse)=>{
      //Add notification
      addANotification(Number(userUpdatedResponse.campusId), 
                        Number(userUpdatedResponse.id), 
                        Number(user.id),
                        USER_PASSWORD_RESET+userUpdatedResponse.displayName);
    })


    return res.json({ status: true, data: null, message: 'Password reset successful. Relogin.' });
  }



  public async getAllActiveMenus(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);

    const menus = await prisma.menuCategory.findMany({
      where: {
        active: 1
      },
      include: {
        menu_item: true,
      },
    });
    return res.json({ status: true, data: menus, message: '' });
  }

  public async getAllMenusAsCreatersJSON(req: Request, res: Response) {
    const menus = await prisma.menuCategory.findMany({
      where: {
        active: 1
      },
      include: {
        menu_item: true,
      },
    });

    let menuNodes = [];

    if (menus !== null && menus !== undefined && menus.length > 0) {

      menus.forEach((menuCat: any) => {
        if (menuCat !== null && menuCat !== undefined && menuCat.active === 1) {

          let hasChildren = false;
          let children = [];

          if (menuCat.menu_item !== null && menuCat.menu_item !== undefined && menuCat.menu_item.length > 0) {
            hasChildren = true;
            menuCat.menu_item.forEach((item: any) => {
              children.push({ value: item.id + '|MENU_ITEM|' + item.label, label: item.label })
            });
          }

          if (hasChildren) {
            menuNodes.push({ value: menuCat.id + '|MENU_CAT|' + menuCat.label, label: menuCat.label, children: children })
          } else {
            menuNodes.push({ value: menuCat.id + '|MENU_CAT|' + menuCat.label, label: menuCat.label })
          }
        }
      });
    }
    return res.json({ status: true, data: menuNodes, message: '' });
  }

  public async getAllAccesses(req: Request, res: Response) {

    const access = await prisma.access.findMany();

    return res.json({ status: true, data: access, message: '' });
  }


  public async getAllActivePermissions(req: Request, res: Response) {
    const campusId = Number(req.params.campusId);
    const permissions = await prisma.permission.findMany({
      where: {
        active: 1,
        campusId: Number(campusId)
      },
      include: {
        AccessPermission: {
          include: {
            access: true,
          }
        },
        MenuCategoryPermissions: {
          include: {
            menuCategory: true
          }
        },
        MenuItemPermissions: {
          include: {
            menuItem: true
          }
        },
        UserPermission: {
          include: {
            User: true
          }
        }

      },
    });
    console.log(permissions);
    return res.json({ status: true, data: permissions, message: 'User Roles retrieved' });
  }



  public async addUpdateRoles(req: Request, res: Response) {

    const roleDetails: any = req.body;
    
    try {

      if (roleDetails !== null && roleDetails.id !== null && roleDetails.id !== undefined) {

        const updatePermission = await prisma.permission.update({
          where: {
            id: roleDetails.id,
            campusId: roleDetails.campusId,
          },
          data: {
            permissionName: roleDetails.permissionName,
            permissionType: roleDetails.permissionType,
            isReadonly: roleDetails.readonly,
            dashboardUrl:roleDetails.dashboardUrl,
            updated_by: roleDetails.currentUserId,
            updated_at: new Date()
          }

        });

        
        //Add Access Permissions
        if (roleDetails.permissionAccess !== null && roleDetails.permissionAccess !== undefined 
          && Array.isArray(roleDetails.permissionAccess) && roleDetails.permissionAccess.length > 0) {

          const deletingAccessPermissions = await prisma.accessPermission.deleteMany({
            where: {
              permissionId: roleDetails.id,
              campusId: roleDetails.campusId,
            },
          });
          roleDetails.permissionAccess.forEach(async (id) => {
            await prisma.accessPermission.create({
              data: {
                permissionId: Number(roleDetails.id),
                accessId: Number(id),
                campusId: roleDetails.campusId,
                created_by: roleDetails.currentUserId,
                created_at: new Date(),
                updated_by: roleDetails.currentUserId,
                updated_at: new Date()
              },
            },);
          });

        } else {
          const deletingAccessPermissions = await prisma.accessPermission.deleteMany({
            where: {
              permissionId: roleDetails.id,
              campusId: roleDetails.campusId,
            },
          });
        }


        //Menu related
        if (roleDetails.selected !== null && roleDetails.selected !== undefined
          && Array.isArray(roleDetails.selected) && roleDetails.selected.length > 0) {

          let menuCategories = [];
          let menuItems = [];
          roleDetails.selected.forEach(async (idsEach) => {
            let splitMenu = idsEach.split("|");
            if (splitMenu !== null && splitMenu !== undefined && splitMenu.length == 3) {
              if (splitMenu[1] !== null && splitMenu[1] !== undefined && splitMenu[1] === 'MENU_CAT') {
                menuCategories.push(Number(splitMenu[0]));
              } else if (splitMenu[1] !== null && splitMenu[1] !== undefined && splitMenu[1] === 'MENU_ITEM') {
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

          if (menuCategories !== null && menuCategories.length > 0) {
            menuCategories.forEach(async (id) => {
              console.log('menu CAT ID-- >' + id)

              await prisma.menuCategoryPermissions.create({
                data: {
                  permissionId: Number(roleDetails.id),
                  menuCategoryId: Number(id),
                  campusId: roleDetails.campusId,
                  active: 1,
                  created_by: roleDetails.currentUserId,
                  updated_by: roleDetails.currentUserId
                },
              },);
            });
          }


          if (menuItems !== null && menuItems.length > 0) {
            menuItems.forEach(async (id) => {
              console.log('menu ITEM ID-- >' + id)

              await prisma.menuItemPermissions.create({
                data: {
                  permissionId: Number(roleDetails.id),
                  menuItemId: Number(id),
                  campusId: roleDetails.campusId,
                  active: 1,
                  created_by: roleDetails.currentUserId,
                  updated_by: roleDetails.currentUserId
                },
              },);
            });
          }

          //TBD This is to be done
          //update user permission type in users with permission ID
          let userpermissions = await prisma.userPermission.findMany({
            where: {
              permissionId: Number(roleDetails.id),
              campusId: roleDetails.campusId,
              active: 1
            },
            include: {
              User: true,
            },
          });

          if (userpermissions !== null && userpermissions !== undefined && userpermissions.length > 0) {
            userpermissions.forEach(async (userPerm) => {
              if (userPerm !== null && userPerm !== undefined && userPerm.User !== null && userPerm.User !== null) {
                console.log('User present for permission id -->' + userPerm.User.displayName)

              }
            });
          }

          //Add notification
          addANotification(Number(roleDetails.campusId), 
          Number(roleDetails.currentUserId), 
          Number(roleDetails.currentUserId),
          roleDetails.permissionName+ ROLE_UPDATES);


          //END
          //TBD This is to be done
          //update user permission type in users with permission ID

          return res.json({ status: true, data: null, message: 'Updated Role' });
        } else {
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
              permissionId: Number(roleDetails.id),
              campusId: roleDetails.campusId,
              active: 1
            },
            include: {
              User: true,
            },
          });

          if (userpermissions !== null && userpermissions !== undefined && userpermissions.length > 0) {
            userpermissions.forEach(async (userPerm) => {
              if (userPerm !== null && userPerm !== undefined && userPerm.User !== null && userPerm.User !== null) {
                console.log('User present for permission id -->' + userPerm.User.displayName)

              }
            });
          }
          //END
          //TBD This is to be done
          //update user permission type in users with permission ID

          return res.json({ status: true, data: null, message: 'Updated Role' });
        }


      } else {

        const createPermission = await prisma.permission.create({
          data: {
            active: 1,
            isMobile: 0,
            permissionName: roleDetails.permissionName,
            permissionType: roleDetails.permissionType,
            campusId: roleDetails.campusId,
            dashboardUrl:roleDetails.dashboardUrl,
            isReadonly: roleDetails.readonly,
            created_by: roleDetails.currentUserId,
            created_at: new Date(),
            updated_by: roleDetails.currentUserId,
            updated_at: new Date()
          }

        });
        console.log('Created role with id -->' + createPermission.id)

        console.log('Going to create Access permissions for role with id -->' + createPermission.id)
        if (createPermission !== null && createPermission.id !== null
          && roleDetails.permissionAccess !== null && roleDetails.permissionAccess !== undefined
          && Array.isArray(roleDetails.permissionAccess) && roleDetails.permissionAccess.length > 0) {

          roleDetails.permissionAccess.forEach(async (id) => {
            await prisma.accessPermission.create({
              data: {
                permissionId: Number(createPermission.id),
                accessId: Number(id),
                campusId: roleDetails.campusId,
                created_by: roleDetails.currentUserId,
                created_at: new Date(),
                updated_by: roleDetails.currentUserId,
                updated_at: new Date()
              },
            },);
          });
        }

        if (createPermission !== null && createPermission.id !== null && roleDetails.selected !== null && roleDetails.selected !== undefined
          && Array.isArray(roleDetails.selected) && roleDetails.selected.length > 0) {

          let menuCategories = [];
          let menuItems = [];
          roleDetails.selected.forEach(async (idsEach) => {
            let splitMenu = idsEach.split("|");
            if (splitMenu !== null && splitMenu !== undefined && splitMenu.length == 3) {
              if (splitMenu[1] !== null && splitMenu[1] !== undefined && splitMenu[1] === 'MENU_CAT') {
                menuCategories.push(Number(splitMenu[0]));
              } else if (splitMenu[1] !== null && splitMenu[1] !== undefined && splitMenu[1] === 'MENU_ITEM') {
                menuItems.push(Number(splitMenu[0]));
              }
            }

          });

          if (menuCategories !== null && menuCategories.length > 0) {
            menuCategories.forEach(async (id) => {
              await prisma.menuCategoryPermissions.create({
                data: {
                  permissionId: Number(createPermission.id),
                  menuCategoryId: Number(id),
                  campusId: roleDetails.campusId,
                  active: 1,
                  created_by: roleDetails.currentUserId,
                  updated_by: roleDetails.currentUserId
                },
              },);
            });
          }

          if (menuItems !== null && menuItems.length > 0) {
            menuItems.forEach(async (id) => {
              await prisma.menuItemPermissions.create({
                data: {
                  permissionId: Number(createPermission.id),
                  menuItemId: Number(id),
                  active: 1,
                  campusId: roleDetails.campusId,
                  created_by: roleDetails.currentUserId,
                  updated_by: roleDetails.currentUserId
                },
              },);
            });
          }
        //Add notification
            addANotification(Number(roleDetails.campusId), 
            Number(roleDetails.currentUserId), 
            Number(roleDetails.currentUserId),
            roleDetails.permissionName+ ROLE_UPDATES);

        }
        return res.json({ status: true, data: null, message: 'Created new role' });
      }



    } catch (error) {
      console.error(error);

      return res.json({ status: false, data: null, message: 'Failed to update role' });
    }
  }


  public async deleteUserRole(req: Request, res: Response) {
    const id = Number(req.params.id);
    const campusId = Number(req.params.campusId);
    const currentUserId = Number(req.params.currentUserId);
console.log(req.params);
    console.log('Delete User Role By ID : ' + id);
    try {

      const usersPermissions = await prisma.userPermission.findMany({
        where: {
          permissionId: Number(id),
          campusId: Number(campusId),
        },
      })


      if (usersPermissions !== null && usersPermissions !== undefined && usersPermissions.length > 0) {
        return res.json({ status: false, data: null, message: `Users linked to Role. Remove roles from user before deleting role.` })
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
      }).then((delRole)=>{
          //Add notification
          addANotification(Number(campusId), 
          Number(currentUserId), 
          Number(currentUserId),
          delRole.permissionName+ ROLE_DELETED);
      });


      

    } catch (error) {
      console.error(error);

      return res.status(400).json({ status: false, data: null, message: error.message })
    }
    return res.json({ status: true, data: null, message: "Role deleted" });
  }


  public async updateUserPermission(req: Request, res: Response) {
    const userData: any = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id: Number(userData.form.id),
      },
    })


    if (!user) {
      return res.status(404).json({ status: false, data: null, message: `The user with the id "${userData.form.id}" not found.` })
    }

    try {
      const permission = await prisma.permission.findUnique({
        where: {
          id: Number(userData.form.permissionId),
          campusId: Number(userData.form.campusId),
        },
      })
      if (permission !== null && permission !== undefined) {
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
        //delete existing permissions
        await prisma.userPermission.deleteMany({
          where: {
            campusId: Number(userData.form.campusId),
            userId: Number(updatedUser.id),
          }
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
        //Add notification
        addANotification(Number(userData.form.campusId), 
        Number(updatedUser.id), 
        Number(userData.form.currentUserId),
        USER_PERMISSION_MODIFIED+updatedUser.displayName);

        addANotification(Number(userData.form.campusId), 
        Number(userData.form.currentUserId), 
        Number(userData.form.currentUserId),
        USER_PERMISSION_MODIFIED+updatedUser.displayName);

      } else {
        return res.status(404).json({ status: false, data: null, message: `Selected permission not found.` })
      }



      return res.json({ status: true, data: null, message: `Role updated. User can login to see changes.` });


    } catch (error) {
      console.error(error);
      return res.status(400).json({ status: true, data: null, message: error.message })
    }
  }


  public async deactivateUser(req: Request, res: Response) {
    const id = Number(req.params.id);
    const campusId = Number(req.params.campusId);
    const currentUserId = Number(req.params.currentUserId);

    console.log('Deactivate User By ID : ' + id);
    try {
      const deactivatedUSer = await prisma.user.update({
        where: {
          id: Number(id),
          campusId: Number(campusId),
        },
        data: {
          active: 0,
          updated_at: new Date(),
          updated_by: Number(req.params.currentUserId)
        }
      });

      //Add notification
      addANotification(Number(campusId),  Number(id),  Number(req.params.currentUserId),  USER_DELETED+ deactivatedUSer.displayName);


    } catch (error) {
      console.error(error);

      return res.status(400).json({ status: false, data: null, message: error.message })
    }
    return res.json({ status: true, data: null, message: "User deactivated" });
  }


  public async getUserOverviewById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const campusId = Number(req.params.campusId);
    const usertype = String(req.params.usertype);
    let daysInMonthNumber = 7;
    let overviewDate = {};
    console.log('usertype >>'+usertype);
    if (id === undefined) {
      return res.json({ status: false, data: null, message: '' });
    }
    let user;

    if(usertype!==null && usertype!==undefined && (usertype==='student' || usertype==='parent')){
      
      user = await prisma.user.findUnique({
        where: {
          id: id,
          campusId: campusId
        },
        include: {
          campus: true,
          class: true,
          FamilyCredit: true,
          StudentFees: true,
          OnlineClasses: true,
          MYAALInvoices: {
            where: {
              feeStatus:{
                in: [FeeStatus.Unpaid, FeeStatus.Partial]
              }
            }
          },
          Notifications:{
            where:{
              markedRead: 0
            },
            orderBy: {
              id: 'desc',
            },
            take: 5,
            include:{
              user: true,
              createdbyuser:true,
            }
          },
          Transactions: {
            orderBy: {
              id: 'desc',
            },
            take: 5,
          },
        },
      });
      if(user!==null && user!==undefined){
        //last 5 transactions
        if(user.Transactions!==null && user.Transactions!==undefined && user.Transactions.length>0){
          overviewDate["my-last-transaction"] = user.Transactions;
        }else{
          overviewDate["my-last-transaction"] = [];
        }
        //current loan
        if(user.FamilyCredit!==null && user.FamilyCredit!==undefined && user.FamilyCredit.length>0){
          overviewDate["my-wallet"] = user.FamilyCredit[0];
        }else{
          overviewDate["my-wallet"] = null;
        }

        //last 2 MYAALInvoices
        if(user.MYAALInvoices!==null && user.MYAALInvoices!==undefined && user.MYAALInvoices.length>0){
          overviewDate["my-fees"] = user.MYAALInvoices;
        }else{
          overviewDate["my-fees"] = [];
        }
        //current notifications
        if(user.Notifications!==null && user.Notifications!==undefined && user.Notifications.length>0){
          overviewDate["my-notifications"] = user.Notifications;
        }else{
          overviewDate["my-notifications"]  = [];
        }
      }
    }else{
      user = await prisma.user.findUnique({
        where: {
          id: id,
          campusId: campusId
        },
        include: {
          campus:{
            include:{
              Attendance:{
                include:{
                  user: true,
                  class: true,
                  section: true
                },
                where:{
                  attendanceStatus: AbsenseStatus.Present,
                  userType: UserType.student
                },
                orderBy: {
                  id: 'desc',
                },
                take: 10,
              }
            }
          },
          Notifications:{
            where:{
              markedRead: 0
            },
            orderBy: {
              id: 'desc',
            },
            take: 5,
            include:{
              user: true,
              createdbyuser:true,
            }
          },
          EmployeeSalary: {
            orderBy: {
              id: 'desc',
            },
            take: 1,
          },
          EmployeeLoan: {
            orderBy: {
              id: 'desc',
            },
            take: 1,
          },
          PaySlip: {
            orderBy: {
              id: 'desc',
            },
            take: 5,
          },
          TeachersInSection: {
            include:{
              section:{
                include: {
                  class: true,
                  User: {
                    include: {
                      _count: true,
                      Attendance: {
                        orderBy: {
                          id: 'desc',
                        },
                        take: 10,
                      }
                    }
                  }
                }
              }
            }
          },
          Transactions: {
            orderBy: {
              id: 'desc',
            },
            take: 5,
          },
        },
      });
      if(user!==null && user!==undefined){
        //last 5 transactions
        if(user.Transactions!==null && user.Transactions!==undefined && user.Transactions.length>0){
          overviewDate["my-last-transaction"] = user.Transactions;
        }else{
          overviewDate["my-last-transaction"] =[];
        }
        //last 2 payslips
        if(user.PaySlip!==null && user.PaySlip!==undefined && user.PaySlip.length>0){
          overviewDate["my-payslips"] = user.PaySlip;
        }else{
          overviewDate["my-payslips"] = [];
        }
        //current loan
        if(user.EmployeeLoan!==null && user.EmployeeLoan!==undefined && user.EmployeeLoan.length>0){
          overviewDate["my-loan"] = user.EmployeeLoan[0];
        }else{
          overviewDate["my-loan"] = [];
        }
        //current notifications
        if(user.Notifications!==null && user.Notifications!==undefined && user.Notifications.length>0){
          overviewDate["my-notifications"] = user.Notifications;
        }else{
          overviewDate["my-notifications"]  = []
        }

        //latest activity for overview
        if(user.campus!==null && user.campus!==undefined && user.campus.Attendance!==null 
                                      && user.campus.Attendance!==undefined && user.campus.Attendance.length>0){
          let attendanceActivity = [];
          user.campus.Attendance.forEach(async (eachAttendanceActivity) => {
            if(eachAttendanceActivity!==null && eachAttendanceActivity!==undefined){
              let activity = {};
              activity["message"] =eachAttendanceActivity.user.displayName +' ('+ eachAttendanceActivity.class.className+", "+eachAttendanceActivity.section.sectionName+") was checked in";
              activity["datetime"] =eachAttendanceActivity.attendanceDateProcessed+" - "+eachAttendanceActivity.recordStartTime;
              attendanceActivity.push(activity);
            }
          })
          overviewDate["latest-activity"] = attendanceActivity;
        }else{
          overviewDate["latest-activity"] = [];
        }

        //Checkin ratio
        let overviewCheckingRaio = [];
        if(user.TeachersInSection!==null && user.TeachersInSection!==undefined && user.TeachersInSection.length>0){
          
          user.TeachersInSection.forEach(async (eachTSection) => {
            
            if(eachTSection!==null && eachTSection!==undefined  && eachTSection.section!==null && eachTSection.section!==undefined ){
                let sectionStats = {};
                sectionStats["class"] =eachTSection.section.class.className; 
                sectionStats["section"] =eachTSection.section.sectionName;
                sectionStats["totalUsers"] =eachTSection.section.User.length;
                let totalPresent =0;
                let totalAbsent=0;
                let totalHoliday =0;
                let totalLeave =0;

                if(eachTSection.section.User!==null && eachTSection.section.User!==undefined && eachTSection.section.User.length>0){
                  eachTSection.section.User.forEach(async (eachUser) => {
                      if(eachUser!==null && eachUser!==undefined && eachUser.Attendance!==null 
                                  &&  eachUser.Attendance!==undefined &&  eachUser.Attendance.length>0){

                            let todaysAttendance = eachUser.Attendance.find(i => i.attendanceDateProcessed === moment(Date.now()).format("DD-MM-YYYY"));
                            
                            
                            if(todaysAttendance!==null && todaysAttendance!==undefined){
                              console.log(todaysAttendance);
                              if(todaysAttendance.attendanceStatus==="Present"){
                                totalPresent = totalPresent+1;
                              }else if(todaysAttendance.attendanceStatus==="Absent"){
                                totalAbsent = totalAbsent+1;
                              }else if(todaysAttendance.attendanceStatus==="Holiday"){
                                totalHoliday = totalHoliday+1;
                              }else if(todaysAttendance.attendanceStatus==="Leave"){
                                totalLeave = totalLeave+1;
                              }
                            }
                      }
                  });
                }
                sectionStats["totalPresent"] =totalPresent;
                sectionStats["totalAbsent"] =totalAbsent;
                sectionStats["totalHoliday"] =totalHoliday;
                sectionStats["totalLeave"] =totalLeave;

                overviewCheckingRaio.push(sectionStats);
              }
          });
        }
        overviewDate["sectionwise-checkin-ratio"] = overviewCheckingRaio;
      }
    
    }
    
    let myAttendance = await findAttendanceForStudentInDateRange(user, campusId, daysInMonthNumber);
    overviewDate["my-attendance"] = myAttendance;
  

    return res.json({ status: true, data: overviewDate, message: 'Information refreshed' });
  }



}

export async function findAttendanceForStudentInDateRange(user: any, campusId: number, daysInMonthNumber: number) {
  let attendance = [];

  if (!user) {
    return null;
  }

  for (let i = 0; i <= daysInMonthNumber; i++) {
    let result: any[];

    let currentDay = new Date(Date.now() - (24 * 60 * 60 * 1000 * i));
    result = await prisma.$queryRaw`SELECT dh.*, DATE_FORMAT(dh.attendanceDate,'%d-%m-%Y') as attendanceDateProcessed 
        FROM myskool.Attendance dh
        LEFT JOIN myskool.Campus cam ON cam.id=dh.campusId
        LEFT JOIN myskool.Class cls ON cls.id=dh.classId
        LEFT JOIN myskool.Section sec ON sec.id=dh.sectionId 
        where dh.userId=${user.id} and dh.campusId=${campusId}   
        and DATE_FORMAT(dh.attendanceDate,'%d-%m-%Y') =${moment(currentDay).format("DD-MM-YYYY")}  order by dh.created_at;;`

    if (result !== null && result !== undefined && result.length > 0) {

      attendance.push(
        {
          date: moment(currentDay).format("DD-MM-YYYY"),
          studentId: user.id,
          daysAgo: i,
          studentIdCard: user.idCardNumber,
          studentName: user.displayName,
          studentPhoto: user.photo,
          studentAttendance: result[0].attendanceStatus,
          dayStatus:result[0].dayStatus,
          recordType: result[0].attendanceType,
          checkinTime: result[0].recordStartTime,
          checkOutTime: result[0].recordEndTime,
        });
    } else {
      attendance.push(
        {
          date: moment(currentDay).format("DD-MM-YYYY"),
          studentId: user.id,
          daysAgo: i,
          studentIdCard: user.idCardNumber,
          studentName: user.displayName,
          studentPhoto: user.photo,
          studentAttendance: "Not Recorded",
          dayStatus:"N/A",
          recordType: "N/A",
          checkinTime:"N/A",
          checkOutTime: "N/A",

        });
    }
  }
  return attendance;
}
