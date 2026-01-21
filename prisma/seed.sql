
INSERT INTO TaxSlabs (id, active, regime, slab_order, income_min, income_max, tax_rate, fixed_tax, notes) VALUES
(1, 1, 'Old', 1,      0,     250000, 0,     0,       ''),
(2, 1, 'Old', 2, 250001,     500000, 5,     0,       ''),
(3, 1, 'Old', 3, 500001,    1000000, 20, 12500,      ''),
(4, 1, 'Old', 4,1000001,   99999999, 30, 112500,     '');

-- New Regime (Post Budget 2023: 0–7L has rebate, standard deduction applies)
INSERT INTO TaxSlabs (id, active, regime, slab_order, income_min, income_max, tax_rate, fixed_tax, notes) VALUES
(5, 1, 'New', 1,      0,     300000, 0,      0,      ''),
(6, 1, 'New', 2, 300001,     600000, 5,      0,      ''),
(7, 1, 'New', 3, 600001,     900000,10,   15000,     ''),
(8, 1, 'New', 4, 900001,    1200000,15,   45000,     ''),
(9, 1, 'New', 5,1200001,    1500000,20,   90000,     ''),
(10,1, 'New', 6,1500001,   99999999,30, 150000,     '');


INSERT INTO TaxRebate (id, active, regime, minIncome, maxIncome, rebateAmount) VALUES
(1, 1,'Old',     0, 500000, 12500),
(2, 1,'New',     0, 700000, 25000);

 
    
INSERT INTO myskool.Theme (
 id, active, themeType, themeName, scheme, schemeColor,
 fontFamily, fontSize, primaryColor, actionGreenButton,
 secondaryOrangeButton, blue, red, orange, yellow, green,
 backg, foreg, header, leftmenu, white, black,
 created_by, updated_by, created_at, updated_at, defaultRadius
)
VALUES (
 1, 
 1,
 'System',          -- themeType
 'Light',           -- themeName
 'light',           -- scheme
 NULL,              -- schemeColor
 'NotoSans',        -- fontFamily
 0,                 -- fontSize
 '#8c59b0',         -- primaryColor
 '#5582b4',         -- actionGreenButton
 '#da2f8e',         -- secondaryOrangeButton
 '#1F7DCF',         -- blue
 '#E14A4A',         -- red
 '#E47112',         -- orange
 '#E19E05',         -- yellow
 '#3AAD4E',         -- green
 '#F5F5F5',         -- backg
 '#FFFFFF',         -- foreg
 '#f9efff',         -- header
 '#FEFBFB',         -- leftmenu
 '#FFFFFF',         -- white
 '#000000',         -- black
 1,                 -- created_by
 1,                 -- updated_by
 CURRENT_TIMESTAMP(6), -- created_at
 CURRENT_TIMESTAMP(6), -- updated_at
 25                 -- defaultRadius
);
INSERT INTO myskool.Theme VALUES (
 2, 1,
 'System', 'Dark', 'dark', NULL,
 'NotoSans', 0,
 '#8c59b0', '#145bf0', '#ff09c8',
 '#1F7DCF', '#E14A4A', '#E47112', '#E19E05', '#3AAD4E',
 '#141517', '#000000', '#25262b', '#141517',
 '#FFFFFF', '#000000',
 1, 1,
 CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6),
 25
);

INSERT INTO myskool.Theme VALUES (
 3, 1,
 'System', 'Pale Red', 'light', NULL,
 'NotoSans', 0,
 '#e22762', '#4d1bed', '#58abad',
 '#1F7DCF', '#E14A4A', '#E47112', '#E19E05', '#3AAD4E',
 '#F5F5F5', '#FFFFFF', '#F8EDED', '#FEFBFB',
 '#FFFFFF', '#000000',
 1, 1,
 CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6),
 25
);

INSERT INTO myskool.Theme VALUES (
 5, 1,
 'System', 'Haloween', 'dark', NULL,
 'Exo', 50,
 '#ff8b09', '#f04118', '#848484',
 '#1E88E5', '#E14A4A', '#E47112', '#E19E05', '#3AAD4E',
 '#212616', '#160D02', '#5D2C00', '#291300',
 '#FFFFFF', '#000000',
 1, 1,
 CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6),
 75
);

INSERT INTO myskool.Theme VALUES (
 7, 1,
 'System', 'Havana', 'light', NULL,
 'NotoSans', 0,
 '#3ebccf', '#b94fae', '#8d22e6',
 '#1F7DCF', '#E14A4A', '#E47112', '#E19E05', '#3AAD4E',
 '#fff4e4', '#f7ffff', '#d7f0f3', '#eefcea',
 '#FFFFFF', '#000000',
 1, 1,
 CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6),
 25
);

INSERT INTO myskool.Theme VALUES (
 8, 1,
 'System', 'Berries', 'light', NULL,
 'NotoSans', 0,
 '#da2e49', '#5e69ab', '#d9355a',
 '#1F7DCF', '#E14A4A', '#E47112', '#E19E05', '#3AAD4E',
 '#fffbfe', '#efeaee', '#9b889c', '#fff2f2',
 '#FFFFFF', '#000000',
 1, 1,
 CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6),
 25
);

INSERT INTO myskool.Theme VALUES (
 9, 1,
 'System', 'Bonfire', 'light', NULL,
 'NotoSans', 0,
 '#fd530d', '#dd662a', '#5f7aa8',
 '#1F7DCF', '#E14A4A', '#E47112', '#E19E05', '#3AAD4E',
 '#fffbfe', '#dbe3e6', '#dbe3e6', '#f7f7f7',
 '#FFFFFF', '#000000',
 1, 1,
 CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6),
 25
);



insert into myskool.Institute(instituteName, instituteSignature,instituteCode, address
,phone,email,currency,feeDuesDays,allowOnlineClass,jitsiAppID,logo,headerImage,created_by,updated_by,themeId) values
('Demo School', 'Demo School','DC123',  '290 River Road', '+18483139524', 'arindammitra06@gmail.com','INR', 35,0,'',  '','',1,1, 1);

insert into myskool.Campus(campusName,campusAddress,campusPhone,active,instituteId,created_by,updated_by) 
values ('Salt Lake','Salt lake Address', '+919836618119', 1, 1,1,1);


insert into myskool.Sessions(session, campusId,startMonth,startYear,endMonth,endYear) values ('2024-2025',1,3,2024,3,2025 );
insert into myskool.Sessions(session, campusId,startMonth,startYear,endMonth,endYear) values ('2025-2026',1,3,2025,3,2026 );

insert into myskool.FinancialYear(id, financialYear) values (1, '2024-2025');
insert into myskool.FinancialYear(id, financialYear) values (2, '2025-2026');
insert into myskool.FinancialYear(id, financialYear) values (3, '2026-2027');
insert into myskool.FinancialYear(id, financialYear) values (4, '2027-2028');
insert into myskool.FinancialYear(id, financialYear) values (5, '2028-2029');


insert into myskool.Permission(id,permissionName,permissionType,isReadonly, isMobile, active, created_by,updated_by, campusId) values
(1, 'Super Admin','admin',1, 0, 1,1,1,1);
insert into myskool.Permission(id,permissionName,permissionType, isReadonly,isMobile, active, created_by,updated_by, campusId) values
(2, 'Staff', 'staff',1,0, 1,1,1,1);
insert into myskool.Permission(id,permissionName,permissionType,isReadonly, isMobile, active, created_by,updated_by, campusId) values
(3, 'Accountant','accountant',1, 0, 1,1,1,1);
insert into myskool.Permission(id,permissionName,permissionType, isReadonly,isMobile, active, created_by,updated_by, campusId) values
(4, 'Parent','parent',1, 0, 1,1,1,1);
insert into myskool.Permission(id,permissionName,permissionType,isReadonly, isMobile, active, created_by,updated_by, campusId) values
(5, 'Student','student',1, 0, 1,1,1,1);

insert into myskool.Months values(1,'January');
insert into myskool.Months values(2,'February');
insert into myskool.Months values(3,'March');
insert into myskool.Months values(4,'April');
insert into myskool.Months values(5,'May');
insert into myskool.Months values(6,'June');
insert into myskool.Months values(7,'July');
insert into myskool.Months values(8,'August');
insert into myskool.Months values(9,'September');
insert into myskool.Months values(10,'October');
insert into myskool.Months values(11,'November');
insert into myskool.Months values(12,'December');

insert into myskool.User(firstName,lastName, displayName, idCardNumber, userType,gender, email,mobile,whatsapp,password,active,
		campusId,created_by,updated_by, resetPasswordFlag) values
('Super','Admin', 'Super Admin','ADMN00000000AD','admin','Others',
	'admin@studifypro.com','+919836618119','+919836618119', 
	'ywbU7heBn3Cq9tO5fYiWqA==', 1,1,1,1, 0);



-- Adding Menu categories
insert into myskool.MenuCategory values (1,'Dashboard','app',1, 1, 1,1, CURDATE(),CURDATE(),'Dashboard');
insert into myskool.MenuCategory values (2,'My Profile','myProfile',2, 1, 1,1, CURDATE(),CURDATE(),'My Profile');
insert into myskool.MenuCategory values (3,'Admissions Management','',3, 1, 1,1, CURDATE(),CURDATE(),'Admissions Management');
insert into myskool.MenuCategory values (4,'Student Management','',4, 1, 1,1, CURDATE(),CURDATE(),'Student Management');
insert into myskool.MenuCategory values (5,'Parent Management','',5, 1, 1,1, CURDATE(),CURDATE(),'Parent Management');
insert into myskool.MenuCategory values (6,'Staff Management','manageStaffs',6, 1, 1,1, CURDATE(),CURDATE(),'Staff Management');
insert into myskool.MenuCategory values (7,'Accountants','manageAccountants',7, 1, 1,1, CURDATE(),CURDATE(),'Accountants');
insert into myskool.MenuCategory values (8,'ID Cards','',8, 1, 1,1, CURDATE(),CURDATE(),'ID Cards');
insert into myskool.MenuCategory values (9,'Classes & Sections','',9, 1, 1,1, CURDATE(),CURDATE(),'Classes & Sections');
insert into myskool.MenuCategory values (10,'Timetable','',10, 1, 1,1, CURDATE(),CURDATE(),'Timetable');
insert into myskool.MenuCategory values (11,'Subjects','manageSubjects',11, 1, 1,1, CURDATE(),CURDATE(),'Subjects');
insert into myskool.MenuCategory values (12,'Study Material','',12, 1, 1,1, CURDATE(),CURDATE(),'Study Material');
insert into myskool.MenuCategory values (13,'Online Classes','',13, 1, 1,1, CURDATE(),CURDATE(),'Online Classes');
insert into myskool.MenuCategory values (15,'Assignments','',15, 1, 1,1, CURDATE(),CURDATE(),'Assignments');
insert into myskool.MenuCategory values (16,'Manage Attendance','',16, 1, 1,1, CURDATE(),CURDATE(),'Manage Attendance');
insert into myskool.MenuCategory values (17,'Exam & Tests','',17, 1, 1,1, CURDATE(),CURDATE(),'Exam & Tests');
insert into myskool.MenuCategory values (18,'Leave Management','',18, 1, 1,1, CURDATE(),CURDATE(),'Leave Management');
insert into myskool.MenuCategory values (19,'Accounting','',19, 1, 1,1, CURDATE(),CURDATE(),'Accounting');
insert into myskool.MenuCategory values (20,'Salary Management','',20, 1, 1,1, CURDATE(),CURDATE(),'Salary Management');
insert into myskool.MenuCategory values (21,'Stock & Inventory','',21, 1, 1,1, CURDATE(),CURDATE(),'Stock & Inventory');
insert into myskool.MenuCategory values (22,'Expense Management','',22, 1, 1,1, CURDATE(),CURDATE(),'Expense Management');
insert into myskool.MenuCategory values (23,'Notifications','',23, 1, 1,1, CURDATE(),CURDATE(),'Notifications');
insert into myskool.MenuCategory values (26,'Settings','',26, 1, 1,1, CURDATE(),CURDATE(),'Settings');

-- Adding Menu Items
insert into myskool.MenuItems values (1,'Admit Student','admitStudent',1, 1, 1,1, CURDATE(),CURDATE(),3,'');
insert into myskool.MenuItems values (2,'Admission Requests','admissionRequest',2, 1, 1,1, CURDATE(),CURDATE(),3,'');
insert into myskool.MenuItems values (3,'Admission Inquiries','admissionInquiries',3, 1, 1,1, CURDATE(),CURDATE(),3,'');
insert into myskool.MenuItems values (4,'Print Admission Form','printAdmission',4, 1, 1,1, CURDATE(),CURDATE(),3,'');
insert into myskool.MenuItems values (5,'Student Information','studentInfo',1, 1, 1,1, CURDATE(),CURDATE(),4,'');
insert into myskool.MenuItems values (6,'Student Promotion','studentPromote',2, 1, 1,1, CURDATE(),CURDATE(),4,'');
insert into myskool.MenuItems values (7,'Student Birthday','studentBirthday',3, 1, 1,1, CURDATE(),CURDATE(),4,'');
insert into myskool.MenuItems values (8,'Student Transfer','studentTransfer',4, 1, 1,1, CURDATE(),CURDATE(),4,'');
insert into myskool.MenuItems values (85,'Student History','studentHistory',5, 1, 1,1, CURDATE(),CURDATE(),4,'');

insert into myskool.MenuItems values (9,'Parent Accounts','parentAccounts',1, 1, 1,1, CURDATE(),CURDATE(),5,'');
insert into myskool.MenuItems values (10,'Account Requests','accountRequests',2, 1, 1,1, CURDATE(),CURDATE(),5,'');
insert into myskool.MenuItems values (11,'Print Cards','printCards',1, 1, 1,1, CURDATE(),CURDATE(),8,'');
insert into myskool.MenuItems values (12,'Card Settings','cardSettings',2, 1, 1,1, CURDATE(),CURDATE(),8,'');
insert into myskool.MenuItems values (13,'Manage Classes','manageClass',1, 1, 1,1, CURDATE(),CURDATE(),9,'');
insert into myskool.MenuItems values (14,'Manage Sections','manageSection',2, 1, 1,1, CURDATE(),CURDATE(),9,'');
insert into myskool.MenuItems values (15,'View Timetable','viewTimeTable',1, 1, 1,1, CURDATE(),CURDATE(),10,'');
insert into myskool.MenuItems values (16,'Manage Timetable','manageTimeTable',2, 1, 1,1, CURDATE(),CURDATE(),10,'');
insert into myskool.MenuItems values (17,'Manage Holidays','manageHolidays',3, 1, 1,1, CURDATE(),CURDATE(),10,'');
insert into myskool.MenuItems values (18,'View Study Material','viewStudyMaterials',1, 1, 1,1, CURDATE(),CURDATE(),12,'');
insert into myskool.MenuItems values (19,'Manage Study Materials','manageStudyMaterials',2, 1, 1,1, CURDATE(),CURDATE(),12,'');
insert into myskool.MenuItems values (20,'My Online Classes','viewOnlineClass',1, 1, 1,1, CURDATE(),CURDATE(),13,'');
insert into myskool.MenuItems values (21,'Manage Online Classes','createOnlineClass',2, 1, 1,1, CURDATE(),CURDATE(),13,'');
insert into myskool.MenuItems values (25,'View My Homeworks','viewHomework',1, 1, 1,1, CURDATE(),CURDATE(),15,'');
insert into myskool.MenuItems values (26,'Manage Daily Notes','dailyHomework',2, 1, 1,1, CURDATE(),CURDATE(),15,'');
insert into myskool.MenuItems values (87,'Manage Student Engagements','manageStudentEngagements',3, 1, 1,1, CURDATE(),CURDATE(),15,'');
insert into myskool.MenuItems values (89,'Manage Co-Curricular','manageExtracurriculars',4, 1, 1,1, CURDATE(),CURDATE(),15,'');

insert into myskool.MenuItems values (27,'View Attendance','viewMyAttendance',1, 1, 1,1, CURDATE(),CURDATE(),16,'');
insert into myskool.MenuItems values (28,'Staff Attendance','staffAttendance',2, 1, 1,1, CURDATE(),CURDATE(),16,'');
insert into myskool.MenuItems values (29,'Student Attendance','studentAttendance',3, 1, 1,1, CURDATE(),CURDATE(),16,'');
insert into myskool.MenuItems values (30,'My Exams','myExams',1, 1, 1,1, CURDATE(),CURDATE(),17,'');
insert into myskool.MenuItems values (31,'Add Exams/Tests','manageExamsTests',2, 1, 1,1, CURDATE(),CURDATE(),17,'');
insert into myskool.MenuItems values (32,'Manage Timetable & Marks','examTimetable',3, 1, 1,1, CURDATE(),CURDATE(),17,'');

insert into myskool.MenuItems values (40,'My Leaves','myLeaves',1, 1, 1,1, CURDATE(),CURDATE(),18,'');
insert into myskool.MenuItems values (41,'Student Leave Management','studentLeaveManagement',2, 1, 1,1, CURDATE(),CURDATE(),18,'');
insert into myskool.MenuItems values (42,'Staff Leave Management','staffLeaveManagement',3, 1, 1,1, CURDATE(),CURDATE(),18,'');
insert into myskool.MenuItems values (43,'Fee Payment','feePayment',1, 2, 1,1, CURDATE(),CURDATE(),19,'');
insert into myskool.MenuItems values (44,'Generate Fees','generateFees',1, 1, 1,1, CURDATE(),CURDATE(),19,'');
insert into myskool.MenuItems values (45,'Wallet','creditSystem',3, 1, 1,1, CURDATE(),CURDATE(),19,'');
insert into myskool.MenuItems values (46,'Family Fee Calculator','familyFeeCalc',4, 1, 1,1, CURDATE(),CURDATE(),19,'');
insert into myskool.MenuItems values (48,'Balance Sheet','balanceSheet',6, 1, 1,1, CURDATE(),CURDATE(),19,'');
insert into myskool.MenuItems values (49,'Generate Salary','generateSalary',1, 1, 1,1, CURDATE(),CURDATE(),20,'');
insert into myskool.MenuItems values (50,'Pay Salaries','paySalaries',2, 1, 1,1, CURDATE(),CURDATE(),20,'');
insert into myskool.MenuItems values (51,'Manage Loans','manageLoans',3, 1, 1,1, CURDATE(),CURDATE(),20,'');
insert into myskool.MenuItems values (82,'Apply Loans','applyLoans',6, 1, 1,1, CURDATE(),CURDATE(),20,'Apply or Approve Loans');
insert into myskool.MenuItems values (52,'Salary Settings','salarySettings',4, 1, 1,1, CURDATE(),CURDATE(),20,'');
insert into myskool.MenuItems values (54,'Marketplace','pointOfSale',1, 1, 1,1, CURDATE(),CURDATE(),21,'');
insert into myskool.MenuItems values (55,'Manage Categories','manageStokcCategories',2, 1, 1,1, CURDATE(),CURDATE(),21,'');
insert into myskool.MenuItems values (56,'Products & Stocks','productsAndStocks',3, 1, 1,1, CURDATE(),CURDATE(),21,'');
insert into myskool.MenuItems values (81,'Stock & Inventory Reports','stockReports',5, 1, 1,1, CURDATE(),CURDATE(),21,'');
insert into myskool.MenuItems values (58,'Manage Expense','manageExpense',1, 1, 1,1, CURDATE(),CURDATE(),22,'');
insert into myskool.MenuItems values (59,'Expense Types','expenseTypes',2, 1, 1,1, CURDATE(),CURDATE(),22,'');
insert into myskool.MenuItems values (60,'My Notifications','myNotifications',1, 1, 1,1, CURDATE(),CURDATE(),23,'');
insert into myskool.MenuItems values (61,'Send Adhoc Notification','sendAdhocNotification',2, 1, 1,1, CURDATE(),CURDATE(),23,'');
insert into myskool.MenuItems values (62,'SMS Templates','smsTemplates',3, 1, 1,1, CURDATE(),CURDATE(),23,'');
insert into myskool.MenuItems values (63,'SMS History','smsHistory',4, 1, 1,1, CURDATE(),CURDATE(),23,'');
insert into myskool.MenuItems values (64,'Email Templates','emailTemplates',5, 1, 1,1, CURDATE(),CURDATE(),23,'');
insert into myskool.MenuItems values (65,'Email History','emailHistory',6, 1, 1,1, CURDATE(),CURDATE(),23,'');
insert into myskool.MenuItems values (66,'Manage Noticeboard','manageNoticeboard',7, 1, 1,1, CURDATE(),CURDATE(),23,'');
insert into myskool.MenuItems values (67,'All Notifications','notificationHistory',8, 1, 1,1, CURDATE(),CURDATE(),23,'');
insert into myskool.MenuItems values (69,'General','admin/generalSettings',1, 1, 1,1, CURDATE(),CURDATE(),26,'');
insert into myskool.MenuItems values (70,'Notification','admin/smsEmailWhatsappSettings',2, 1, 1,1, CURDATE(),CURDATE(),26,'');
insert into myskool.MenuItems values (71,'Payment','admin/paymentSettings',3, 1, 1,1, CURDATE(),CURDATE(),26,'');
insert into myskool.MenuItems values (72,'QR Scanner Devices','admin/qrdevices',4, 1, 1,1, CURDATE(),CURDATE(),26,'');
insert into myskool.MenuItems values (73,'Manage Campus','admin/manageCampus',5, 1, 1,1, CURDATE(),CURDATE(),26,'');
insert into myskool.MenuItems values (74,'Manage Fee Plan','admin/feePlan',6, 1, 1,1, CURDATE(),CURDATE(),26,'');
insert into myskool.MenuItems values (75,'User Roles','admin/userRoles',7, 1, 1,1, CURDATE(),CURDATE(),26,'');
insert into myskool.MenuItems values (76,'User Admin','admin/userAdmin',8, 1, 1,1, CURDATE(),CURDATE(),26,'');
insert into myskool.MenuItems values (80,'Manage Themes','admin/manageThemes',9, 1, 1,1, CURDATE(),CURDATE(),26,'');
insert into myskool.MenuItems values (84,'Manage Grades','admin/manageGrades',10, 1, 1,1, CURDATE(),CURDATE(),26,'Manage Exam Test Grades');
insert into myskool.MenuItems values (86,'Manage Year','admin/manageYear',11, 1, 1,1, CURDATE(),CURDATE(),26,'Manage Year, Session & Fiscal Year');
insert into myskool.MenuItems values (88,'Manage Recognition','admin/manageRecognition',12, 1, 1,1, CURDATE(),CURDATE(),26,'Manage badges, appreciations');



-- All Access codes
insert into myskool.Access(accessName, description)  values('view-all-study-materials','Access to all Study Materials irrespective of Class/Sections');
insert into myskool.Access(accessName, description)  values('add-study-materials','Add new Study Materials to class');
insert into myskool.Access(accessName, description)  values('promote-students','Permission to promote students');
insert into myskool.Access(accessName, description)  values('add-edit-delete-staff','Add/Edit/Delete staff permission');
insert into myskool.Access(accessName, description)  values('add-edit-delete-accountant','Add/Edit/Delete accountant');
insert into myskool.Access(accessName, description)  values('add-edit-class-section','Add/Edit/Delete Class or Section');
insert into myskool.Access(accessName, description)  values('add-edit-subjects','Add/Edit/Delete Subjects');
insert into myskool.Access(accessName, description)  values('add-edit-timetable','Manage timetables & Holidays');
insert into myskool.Access(accessName, description)  values('manage-homework','Manage homeworks');
insert into myskool.Access(accessName, description)  values('add-online-class','Add Online Classes');
insert into myskool.Access(accessName, description)  values('view-selling-history','View Selling History');
insert into myskool.Access(accessName, description)  values('approve-reject-leaves','Approve or Reject Leave Requests');
insert into myskool.Access(accessName, description)  values('master-access-notification','Edit or Delete Notifications');
insert into myskool.Access(accessName, description)  values('approve-reject-loans','Approve or Reject Loan Requests');
insert into myskool.Access(accessName, description)  values('add-stock-products','Add single or bulk products/categories');
-- Add Admin permissions

-- this is for admin
-- Adding Menu Permissions for Admin Permissions
insert into myskool.MenuCategoryPermissions(permissionId, menuCategoryId,active, created_by,updated_by) values(1,26,1,1,1);
insert into myskool.MenuItemPermissions(permissionId, menuItemId, active, created_by,updated_by) values(1,75,1,1,1);
-- Added Menu Permissions for Admin Permissions

-- ------------------------------------------------------------------------------------------------------------------------

insert into myskool.UserPermission(userId, permissionId, active, created_by,updated_by) values
(1,1,1,1,1);

-- Add some dummy class and sections
insert into myskool.Class(className, numericName,  campusId,active, created_by, updated_by)
values('One','I', 1,1,1,1);
insert into myskool.Class(className, numericName,  campusId,active, created_by, updated_by)
values('Two','II', 1,1,1,1);
insert into myskool.Class(className, numericName,  campusId,active, created_by, updated_by)
values('Three','III', 1,1,3,3);

insert into myskool.Section(sectionName, classId,  campusId,active, created_by, updated_by)
values('A',1, 1,1,3,3);
insert into myskool.Section(sectionName, classId,  campusId,active, created_by, updated_by)
values('B',1, 1,1,3,3);
insert into myskool.Section(sectionName, classId,  campusId,active, created_by, updated_by)
values('C',1, 1,1,3,3);
insert into myskool.Section(sectionName, classId,  campusId,active, created_by, updated_by)
values('A',2, 1,1,3,3);
insert into myskool.Section(sectionName, classId,  campusId,active, created_by, updated_by)
values('B',2, 1,1,3,3);
insert into myskool.Section(sectionName, classId,  campusId,active, created_by, updated_by)
values('A',3, 1,1,3,3);
insert into myskool.Section(sectionName, classId,  campusId,active, created_by, updated_by)
values('B',3, 1,1,3,3);
insert into myskool.Section(sectionName, classId,  campusId,active, created_by, updated_by)
values('C',3, 1,1,3,3);
insert into myskool.Section(sectionName, classId,  campusId,active, created_by, updated_by)
values('D',3, 1,1,3,3);

-- List of value
insert into myskool.ListOfValues(groupName, uniqueKey, shortName, longName, description, campusId, active, created_by, updated_by) values
('SessionTimeTableRange','SessionTimeTableRange_StartTime', '07:00:00','07:00:00','Start Time for timetable',1,1,1,1);

insert into myskool.ListOfValues(groupName, uniqueKey, shortName, longName, description, campusId, active, created_by, updated_by) values
('SessionTimeTableRange','SessionTimeTableRange_EndTime', '15:00:00','15:00:00','End Time for timetable',1,1,1,1);

insert into myskool.ListOfValues(groupName, uniqueKey, shortName, longName, description, campusId, active, created_by, updated_by) values
('SessionTimeTableRange','SessionTimeTableRange_HalfTime', '11:00:00','11:00:00','Half Time for timetable',1,1,1,1);

insert into myskool.ListOfValues(groupName, uniqueKey, shortName, longName, description, campusId, active, created_by, updated_by) values
('InstituteCommonLateFee','InstituteCommonLateFee', '200','200','Commonly used late fee for students fee payment',1,1,1,1);

insert into myskool.ListOfValues(groupName, uniqueKey, shortName, longName, description, campusId, active, created_by, updated_by) values
('StockInventoryDashboard','StockInventoryOverviewDashboard', '200','200','Dashboard for Stock & Inventory. Needs to be added manually',1,1,1,1);


-- Themes for reports
insert into myskool.ReportThemes(id, groupName, uniqueKey, image, active,created_by, updated_by)
values(1, 'SchoolLeavingCert', 'Light_SchoolLeavingCert1', './../assets/theme_samples/skul_cert_theme_sample1.png', 1,1,1);
insert into myskool.ReportThemes(id, groupName, uniqueKey, image, active,created_by, updated_by)
values(2, 'SchoolLeavingCert', 'Light_SchoolLeavingCert2', './../assets/theme_samples/skul_cert_theme_sample2.png', 1,1,1);

insert into myskool.DefaultImageSetting(campusId, front, back, type, forUser, created_by, updated_by)
values (1,null,null, 'id-card', 'STUDENT',1,1);
insert into myskool.DefaultImageSetting(campusId, front, back, type, forUser, created_by, updated_by)
values (1,null,null, 'id-card', 'EMPLOYEE',1,1);



-- SMS Templates
insert into myskool.SMSTemplate(campusId,active, body, name,keywords, created_by, updated_by, created_at, updated_at) 
values(1, 1, 
'Admission successful for $student_name on $current_date. Parent: $parent_name, Roll#: $roll_no. Thank You for being a part of $institute_name',
'Admission SMS', 
'$student_name|$parent_name|$parent_phone|$roll_no|$student_id_card|$institute_name|$institute_campus|$class_name|$section_name|$session|$current_date',
1,1,CURDATE(),CURDATE());

insert into myskool.SMSTemplate(campusId,active, body, name,keywords, created_by, updated_by, created_at, updated_at) 
values(1, 1, 
'Dear $student_name, We have received your request for admission on $current_date',
'Admission Enquiry', 
'$student_name|$parent_name|$parent_phone|$roll_no|$student_id_card|$institute_name|$institute_campus|$class_name|$section_name|$session|$current_date',
1,1,CURDATE(),CURDATE());

insert into myskool.SMSTemplate(campusId,active, body, name,keywords, created_by, updated_by, created_at, updated_at) 
	values(1, 1, 
	'Dear $student_name, We have processed your request for admission on $current_date. The request is $admission_status. Please call for more details.',
	'Admission Enquiry Processed', 
	'$student_name|$parent_name|$parent_phone|$roll_no|$student_id_card|$institute_name|$institute_campus|$class_name|$section_name|$session|$admission_status|$current_date|$extra_content',
	1,1,CURDATE(),CURDATE());
    
insert into myskool.SMSTemplate(campusId,active, body, name,keywords, created_by, updated_by, created_at, updated_at) 
	values(1, 1, 
	'Dear $user_name, We have processed your request for account creation on $current_date. The request is $approval_status. Please call for more details.',
	'Account Creation Request Processed', 
	'$user_name|$current_date|$approval_status',
	1,1,CURDATE(),CURDATE());
    
insert into myskool.SMSTemplate(campusId,active, body, name,keywords, created_by, updated_by, created_at, updated_at) 
	values(1, 1, 
	'Dear Parent, $student_name has acquired $exam_percentage in $exam_name. Please login to app for details.',
	'Declare Exams', 
	'$student_name|$parent_name|$parent_phone|$roll_no|$student_id_card|$institute_name|$institute_campus|$class_name|$section_name|$session|$exam_name|$exam_percentage|$current_date',
	1,1,CURDATE(),CURDATE());


    
insert into myskool.SMSTemplate(campusId,active, body, name,keywords, created_by, updated_by, created_at, updated_at) 
	values(1, 1, 
	'Dear $staff_name, your salary of $staff_payment_total for month of $salary_month has been issues. Total present days are $staff_present_days',
	'Salary Issue', 
	'$staff_name|$staff_payment_total|$salary_month|$staff_present_days|$staff_absent_days|$institute_name|$institute_campus|$current_date',
	1,1,CURDATE(),CURDATE());
    
insert into myskool.SMSTemplate(campusId,active, body, name,keywords, created_by, updated_by, created_at, updated_at) 
	values(1, 1, 
	'Dear Parent, it is identified that the fees of $student_name are due. This is the $reminder_number reminder. Please pay the dues to avoid any inconvenience',
	'Fee Reminder', 
	'$student_name|$parent_name|$parent_phone|$roll_no|$student_id_card|$institute_name|$institute_campus|$class_name|$section_name|$session|$reminder_number|$current_date',
	1,1,CURDATE(),CURDATE());


    
insert into myskool.SMSTemplate(campusId,active, body, name,keywords, created_by, updated_by, created_at, updated_at) 
	values(1, 1, 
	'Daily homework for $student_name is $diary. Please check app for more details.',
	'Homework SMS', 
	'$student_name|$parent_name|$parent_phone|$roll_no|$student_id_card|$institute_name|$institute_campus|$class_name|$section_name|$session|$diary|$current_date',
	1,1,CURDATE(),CURDATE());
    
insert into myskool.SMSTemplate(campusId,active, body, name,keywords, created_by, updated_by, created_at, updated_at) 
	values(1, 1, 
	'Student $student_name has been successfully transferred to $institute_campus. Please report if you have not requested the transfer. Thank You.',
	'Student Transfer Complete', 
	'$student_name|$parent_name|$parent_phone|$roll_no|$student_id_card|$institute_name|$institute_campus|$class_name|$section_name|$session|$current_date',
	1,1,CURDATE(),CURDATE());
    
insert into myskool.SMSTemplate(campusId,active, body, name,keywords, created_by, updated_by, created_at, updated_at) 
	values(1, 1, 
	'Dear $user_name, Please be informed that you are marked as absent today. Please maintain attendance to avoid loss of pay. Thank You.',
	'Absent SMS', 
	'$user_name|$selected_day|$current_date',
	1,1,CURDATE(),CURDATE());
    
insert into myskool.SMSTemplate(campusId,active, body, name,keywords, created_by, updated_by, created_at, updated_at) 
	values(1, 1, 
	'Dear $user_name, Please be informed that you are marked as late arrival today. Please maintain punctuality to avoid inconvenience. Thank You.',
	'Late SMS', 
	'$user_name|$selected_day|$current_date',
	1,1,CURDATE(),CURDATE());
    
insert into myskool.SMSTemplate(campusId,active, body, name,keywords, created_by, updated_by, created_at, updated_at) 
	values(1, 1, 
	'Thank You for your payment. Student: $student_name, Amount Paid: $student_amount_paid, Received by: $student_fee_received_by',
	'Student Fee Payment', 
	'$student_name|$parent_name|$parent_phone|$roll_no|$student_id_card|$institute_name|$institute_campus|$class_name|$section_name|$session|$student_fee|$student_amount_paid|$student_discount|$student_late_fees|$student_fee_received_by|$current_date',
	1,1,CURDATE(),CURDATE());
    
insert into myskool.SMSTemplate(campusId,active, body, name,keywords, created_by, updated_by, created_at, updated_at) 
	values(1, 1, 
	'Dear, leave request for $student_name has been $student_leave_status. Please contact for any queries',
	'Leave Request', 
	'$student_name|$roll_no|$student_id_card|$institute_name|$student_leave_start|$student_leave_end|$student_leave_approved_by|$student_leave_status|$current_date',
	1,1,CURDATE(),CURDATE());
    
    
-- EMAIL Templates



insert into myskool.EmailTemplate(campusId,active,subject, body, name,keywords, created_by, updated_by, created_at, updated_at,isEditable) 
	values(1, 1, 
    'Reset Password Requested for User', 
	'<p>Hi User,</p>
	<p>Someone recently requested a password change for your Institute App account. It is suggested you set a new password using the secret code provided below.</p>
	<p>{code}</p>
	<p>Use the below link to go to the password reset page and enter the code and new passwords.</p>
	<p>To keep your account secure, please change your password ASAP and don''t forward this email to anyone.</p>
	<p>Thank You,</p><p>Institute</p>',
	'Reset Password', 
	'',
	1,1,CURDATE(),CURDATE(),0);   
    
insert into myskool.EmailTemplate(campusId,active,subject, body, name,keywords, created_by, updated_by, created_at, updated_at,isEditable) 
	values(1, 1, 
    'Profile Created for User', 
	'<p>Hi User,</p>
	<p>Someone recently requested a password change for your Institute App account. It is suggested you set a new password using the secret code provided below.</p>
	<p>{code}</p>
	<p>Use the below link to go to the password reset page and enter the code and new passwords.</p>
	<p>To keep your account secure, please change your password ASAP and don''t forward this email to anyone.</p>
	<p>Thank You,</p><p>Institute</p>',
	'Profile Created', 
	'',
	1,1,CURDATE(),CURDATE(),0); 

insert into myskool.EmailTemplate(campusId,active,subject, body, name,keywords, created_by, updated_by, created_at, updated_at, isEditable) 
values(1, 1, 
'Admission Successful', 
'Admission successful for $student_name on $current_date. Parent: $parent_name, Roll#: $roll_no. Thank You for being a part of $institute_name',
'Admission Email', 
'$student_name|$parent_name|$parent_phone|$roll_no|$student_id_card|$institute_name|$institute_campus|$class_name|$section_name|$session|$current_date',
1,1,CURDATE(),CURDATE(),1);

insert into myskool.EmailTemplate(campusId,active,subject, body, name,keywords, created_by, updated_by, created_at, updated_at,isEditable) 
values(1, 1, 
'Admission Enquiry Received', 
'Dear $student_name, We have received your request for admission on $current_date',
'Admission Enquiry', 
'$student_name|$parent_name|$parent_phone|$roll_no|$student_id_card|$institute_name|$institute_campus|$class_name|$section_name|$session|$current_date',
1,1,CURDATE(),CURDATE(),1);




insert into myskool.EmailTemplate(campusId,active, subject,body, name,keywords, created_by, updated_by, created_at, updated_at,isEditable) 
	values(1, 1, 
    'Admission Enquiry Completed', 
	'Dear $student_name, We have processed your request for admission on $current_date. The request is $admission_status. Please call for more details.',
	'Admission Enquiry Processed', 
	'$student_name|$parent_name|$parent_phone|$roll_no|$student_id_card|$institute_name|$institute_campus|$class_name|$section_name|$session|$admission_status|$current_date|$extra_content',
	1,1,CURDATE(),CURDATE(),1);
   
insert into myskool.EmailTemplate(campusId,active, subject,body, name,keywords, created_by, updated_by, created_at, updated_at,isEditable) 
	values(1, 1, 
    'Account Creation Request Processed', 
	'Dear $user_name, We have processed your request for account creation on $current_date. The request is $approval_status. Please call for more details.',
	'Account Creation Request Processed', 
	'$user_name|$current_date|$approval_status',
	1,1,CURDATE(),CURDATE(),1);
    
insert into myskool.EmailTemplate(campusId,active, subject,body, name, keywords, created_by, updated_by, created_at, updated_at,isEditable) 
	values(1, 1, 
    '$student_name''s Exam Marks for $exam_name',
	'Dear Parent, $student_name has acquired $exam_percentage in $exam_name. Please login to app for details.',
	'Declare Exams', 
	'$student_name|$parent_name|$parent_phone|$roll_no|$student_id_card|$institute_name|$institute_campus|$class_name|$section_name|$session|$exam_name|$exam_percentage|$current_date',
	1,1,CURDATE(),CURDATE(),1);


    
insert into myskool.EmailTemplate(campusId,active, subject,body, name,keywords, created_by, updated_by, created_at, updated_at,isEditable) 
	values(1, 1, 
    'Your salary has been issued', 
	'Dear $staff_name, your salary of $staff_payment_total for month of $salary_month has been issues. Total present days are $staff_present_days',
	'Salary Issue', 
	'$staff_name|$staff_payment_total|$salary_month|$staff_present_days|$staff_absent_days|$institute_name|$institute_campus|$current_date',
	1,1,CURDATE(),CURDATE(),1);
    
insert into myskool.EmailTemplate(campusId,active, subject,body, name,keywords, created_by, updated_by, created_at, updated_at,isEditable) 
	values(1, 1, 
    'Fee Reminder', 
	'Dear Parent, it is identified that the fees of $student_name are due. This is the $reminder_number reminder. Please pay the dues to avoid any inconvenience',
	'Fee Reminder', 
	'$student_name|$parent_name|$parent_phone|$roll_no|$student_id_card|$institute_name|$institute_campus|$class_name|$section_name|$session|$reminder_number|$current_date',
	1,1,CURDATE(),CURDATE(),1);

    
insert into myskool.EmailTemplate(campusId,active,subject, body, name,keywords, created_by, updated_by, created_at, updated_at,isEditable) 
	values(1, 1, 
    'Homework Assigned', 
	'Daily homework for $student_name is $diary. Please check app for more details.',
	'Homework Email', 
	'$student_name|$parent_name|$parent_phone|$roll_no|$student_id_card|$institute_name|$institute_campus|$class_name|$section_name|$session|$diary|$current_date',
	1,1,CURDATE(),CURDATE(),1);
    
insert into myskool.EmailTemplate(campusId,active,subject, body, name,keywords, created_by, updated_by, created_at, updated_at,isEditable) 
	values(1, 1, 
    'Student transfer to different campus completed', 
	'Student $student_name has been successfully transferred to $institute_campus. Please report if you have not requested the transfer. Thank You.',
	'Student Transfer Complete', 
	'$student_name|$parent_name|$parent_phone|$roll_no|$student_id_card|$institute_name|$institute_campus|$class_name|$section_name|$session|$current_date',
	1,1,CURDATE(),CURDATE(),1);
    
insert into myskool.EmailTemplate(campusId,active, subject, body, name,keywords, created_by, updated_by, created_at, updated_at,isEditable) 
	values(1, 1, 
    'Absence recorded today', 
	'Dear $user_name, Please be informed that you are marked as absent today. Please maintain attendance to avoid loss of pay. Thank You.',
	'Absent Email', 
	'$user_name|$selected_day|$current_date',
	1,1,CURDATE(),CURDATE(),1);
    
insert into myskool.EmailTemplate(campusId,active, subject, body, name,keywords, created_by, updated_by, created_at, updated_at,isEditable) 
	values(1, 1, 
    'Late attendance recorded today', 
	'Dear $user_name, Please be informed that you are marked as late arrival today. Please maintain punctuality to avoid inconvenience. Thank You.',
	'Late Email', 
	'$user_name|$selected_day|$current_date',
	1,1,CURDATE(),CURDATE(),1);
    
insert into myskool.EmailTemplate(campusId,active,subject, body, name,keywords, created_by, updated_by, created_at, updated_at,isEditable) 
	values(1, 1, 
    'Thank You for your fee payment', 
	'Thank You for your payment. Student: $student_name, Amount Paid: $student_amount_paid, Received by: $student_fee_received_by',
	'Student Fee Payment', 
	'$student_name|$parent_name|$parent_phone|$roll_no|$student_id_card|$institute_name|$institute_campus|$class_name|$section_name|$session|$student_fee|$student_amount_paid|$student_discount|$student_late_fees|$student_fee_received_by|$current_date',
	1,1,CURDATE(),CURDATE(),1);
    
insert into myskool.EmailTemplate(campusId,active,subject, body, name,keywords, created_by, updated_by, created_at, updated_at,isEditable) 
	values(1, 1, 
    'Leave Request Updated', 
	'Dear, leave request for $student_name has been $student_leave_status. Please contact for any queries',
	'Leave Request', 
	'$student_name|$roll_no|$student_id_card|$institute_name|$student_leave_start|$student_leave_end|$student_leave_approved_by|$student_leave_status|$current_date',
	1,1,CURDATE(),CURDATE(),1);    
    
   


















