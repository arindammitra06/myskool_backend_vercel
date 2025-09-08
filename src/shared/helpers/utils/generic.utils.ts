import { FeeType, Gender, Permission, Regime, TimeTable } from '@prisma/client';
import * as crypto from 'crypto';
import { prisma } from '../../db-client';
import { v4 as uuidv4 } from 'uuid';
import { HolidayListModel } from '../../models/time-model';
import ShadeGenerator, { Shade } from 'shade-generator';
import fs from 'fs';
import path from 'path';
import imagekit from './imagekitClient';

const ENC = "bf3c199c2470cb477d907b1e0917c17b";
const IV = "5183666c72eec9e4";
const ALGO = "aes-256-cbc";



export const monthsString = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const monthArray = [
  { value: '0', label: 'January' },
  { value: '1', label: 'February' },
  { value: '2', label: 'March' },
  { value: '3', label: 'April' },
  { value: '4', label: 'May' },
  { value: '5', label: 'June' },
  { value: '6', label: 'July' },
  { value: '7', label: 'August' },
  { value: '8', label: 'September' },
  { value: '9', label: 'October' },
  { value: '10', label: 'November' },
  { value: '11', label: 'December' },
];

export function encrypt(text: string): string {
  let cipher = crypto.createCipheriv(ALGO, ENC, IV);
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
}

export function getBlankMonthWiseHolidayList() {
  let arrayOfMonths: HolidayListModel[] = [];

  for (let i = 0; i < monthsString.length; i++) {
    let month = new HolidayListModel();
    month.month = monthsString[i];
    arrayOfMonths.push(month);
  }
  return arrayOfMonths;
}

export function getUniqueValues(arr: any[], key: string, field: string): any[] {
  const uniqueSet = [];

  arr.forEach(async (element) => {
    const attribute = element[key];
    if (attribute !== null && attribute !== undefined && !objectExists(uniqueSet, 'id', attribute.id)) {
      uniqueSet.push({ id: attribute.id, value: attribute[field] })
    }
  });
  return uniqueSet;

}
function objectExists(arr: any[], prop: string, value: any): boolean {
  return arr.some(obj => obj[prop] === value);
}

export function getGenderByRelation(relation: string): string {
  if (relation === 'NA_PARENTTYPE') {
    return Gender.Others;
  } else if (relation === 'BrotherInLaw') {
    return Gender.Male;
  }
  else if (relation === 'Aunt') {
    return Gender.Female;
  }
  else if (relation === 'Cousin') {
    return Gender.Others;
  }
  else if (relation === 'Daughter') {
    return Gender.Female;
  }
  else if (relation === 'DaughterInLaw') {
    return Gender.Female;
  }
  else if (relation === 'GrandMother') {
    return Gender.Female;
  }
  else if (relation === 'Mother') {
    return Gender.Female;
  } else if (relation === 'MotherInLaw') {
    return Gender.Female;
  }
  else if (relation === 'Sister') {
    return Gender.Female;
  }
  else if (relation === 'SisterInLaw') {
    return Gender.Female;
  }
  else if (relation === 'Wife') {
    return Gender.Female;
  }
  else if (relation === 'Wife') {
    return Gender.Female;
  }
  else if (relation === 'LegalGuardian') {
    return Gender.Others;
  }
  else if (relation === 'Father') {
    return Gender.Male;
  }
  else if (relation === 'FatherInLaw') {
    return Gender.Male;
  }
  else if (relation === 'GrandFather') {
    return Gender.Male;
  }
  else if (relation === 'Husband') {
    return Gender.Male;
  }
  else if (relation === 'Nephew') {
    return Gender.Male;
  }
  else if (relation === 'Son') {
    return Gender.Male;
  }
  else if (relation === 'SonInLaw') {
    return Gender.Male;
  }
  else if (relation === 'Uncle') {
    return Gender.Male;
  }


}


export function getCurrencySymbol(locale: string, currency: string) {
  return (0).toLocaleString(
    locale,
    {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }
  ).replace(/\d/g, '').trim()
}
export function processTimeTableJsonData(timtables, day: string) {
  const filtered = timtables.filter((value: TimeTable) => value.day === day);
  let dayEvent;
  let events = [];

  if (filtered !== null && filtered !== undefined && filtered.length > 0) {
    filtered.forEach(async (eachItem) => {
      events.push({
        startTime: eachItem.startTime,
        endTime: eachItem.endTime,
        title: eachItem.subject,
        color: eachItem.color,
        description: eachItem.id,
      });
    });
  }
  dayEvent = { name: day, events: events };
  return dayEvent;
}

export function decrypt(encryptedText: string): string {
  let decipher = crypto.createDecipheriv(ALGO, ENC, IV);
  let decrypted = decipher.update(encryptedText, "base64", "utf8");
  return decrypted;
}

export function generateIdsForParentAndStudent(id: number, typeParam: string) {
  return makeid(4) + String(id).padStart(8, '0') + typeParam;
}
export function generateInvoiceNumber(id: number) {
  return 'INV-' + makeid(4) + String(id).padStart(8, '0');
}

export function generateSellingInvoiceNumber(id: number) {
  return 'INVSL-' + makeid(4) + String(id).padStart(8, '0');
}

export function generatePaySlipNumber(id: number) {
  return 'PLSLP-' + makeid(4) + String(id).padStart(8, '0');
}

export function generateProductIdNumber(id: number) {
  return 'PRDCT-' + makeid(4) + String(id).padStart(8, '0');
}


export function getARandomAlphanumericID() {
  let myuuid = uuidv4();;
  return myuuid.replaceAll("-", "").toUpperCase();
}

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export function getDateForMatching(i: number, month: number, year: number) {
  let date = i < 10 ? '0' + i : i;
  let monthProc = month < 10 ? '0' + month : month;
  return date + '-' + monthProc + '-' + year;
}

export function sortUsersBy(list: any[], property: string) {
  return list.sort((a, b) => {
    return a[property] >= b[property]
      ? 1
      : -1
  })
}



export function buildFontSize(value: number) {

  if (value === 0) {
    return {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    };
  } else if (value === 25) {
    return {
      xs: '0.80rem',
      sm: '0.925rem',
      md: '1.05rem',
      lg: '1.175rem',
      xl: '1.3rem',
    };
  } else if (value === 50) {
    return {
      xs: '0.85rem',
      sm: '0.97rem',
      md: '1.1rem',
      lg: '1.22rem',
      xl: '1.35rem',
    };
  } else if (value === 75) {
    return {
      xs: '0.9rem',
      sm: '1.1rem',
      md: '1.15rem',
      lg: '1.3rem',
      xl: '1.45rem',
    };
  } else if (value === 100) {
    return {
      xs: '1rem',
      sm: '1.15rem',
      md: '1.2rem',
      lg: '1.35rem',
      xl: '1.5rem',
    };
  }
}

export function getIsoDay(day: string) {
  if (day === 'mo') {
    return 1;
  } else if (day === 'tu') {
    return 2;
  } else if (day === 'we') {
    return 3;
  } else if (day === 'th') {
    return 4;
  } else if (day === 'fr') {
    return 5;
  } else if (day === 'sa') {
    return 6;
  } else if (day === 'su') {
    return 7;
  }
}

function buildRadius(defaultRadius: any) {
  if (defaultRadius === 0) {
    return 0;
  } else if (defaultRadius === 25) {
    return 5;
  } else if (defaultRadius === 50) {
    return 8;
  } else if (defaultRadius === 75) {
    return 11;
  } else if (defaultRadius === 100) {
    return 15;
  }
}
function repeatStringInArray(str: string): string[] {
  return Array(10).fill(str);
}
export function buildTheme(themeObject: any) {
  let primaryswatch: any = generateShades(themeObject.primaryColor);
   
   let blueswatch: any = generateShades(themeObject.blue);
   let greenswatch: any = generateShades(themeObject.green);
   let yellowswatch: any = generateShades(themeObject.yellow);
   let orangeswatch: any = generateShades(themeObject.orange);
   let redswatch: any = generateShades(themeObject.red);
   let actionGreenButtonswatch: any = generateShades(themeObject.actionGreenButton);
   let secondaryOrangeButtonswatch: any = generateShades(themeObject.secondaryOrangeButton);

   let defaultRadius = buildRadius(themeObject.defaultRadius);

   let backg: any = repeatStringInArray(themeObject.backg);
   let foreg: any = repeatStringInArray(themeObject.foreg);
   let header: any = repeatStringInArray(themeObject.header);
   let leftmenu: any = repeatStringInArray(themeObject.leftmenu);

   
   let newTheme: any = {
      fontFamily: themeObject.fontFamily,
      primaryShade: { light: 5, dark: 9 },
      //colorScheme: form.values.lightOrDark as ColorScheme,
      white: themeObject.white,
      black: themeObject.black,
      fontSizes: buildFontSize(themeObject.fontSize),
      defaultRadius: defaultRadius,
      colors: {
         backg: backg,
         foreg: foreg,
         header: header,
         leftmenu: leftmenu,
         primary: primaryswatch,
         red: redswatch,
         orange: orangeswatch,
         blue: blueswatch,
         green: greenswatch,
         yellow: yellowswatch,
         actionButton: actionGreenButtonswatch,
         secondaryButton: secondaryOrangeButtonswatch,
      },
      primaryColor: 'primary',

   };
   return newTheme;
}


export function generateShades(colorString: string) {
  const config: Record<Shade, number> = {
    "10": 0.9,
    "20": 0.8,
    "30": 0.7,
    "40": 0.6,
    "50": 0.5,
    "60": 0.4,
    "70": 0.3,
    "80": 0.2,
    "90": 0.1,
    "100": 0,
    "200": 0.9,
    "300": 0.8,
    "400": 0.7,
    "500": 0.6,
    "600": 0.5,
    "700": 0.4,
    "800": 0.3,
    "900": 0.2,
    "1000": 0.1,
  };
  const color = ShadeGenerator.hue(colorString).config(config).shadesMap("hex");

  return [
    color['10'],
    color['30'],
    color['60'],
    color['80'],
    color['90'],
    color['100'],
    color['200'],
    color['300'],
    color['400'],
    color['500'],
  ] as string[];
}

export async function addANotification(campusId: number, userId: number, createdBy: number, message: string) {
  await prisma.notifications.create({
    data: {
      campusId: campusId,
      userId: userId,
      created_by: createdBy,
      created_at: new Date(),
      message: message,
      markedRead: 0
    },
  })
}
type TaxSlab = {
  income_min: number;
  income_max: number;
  tax_rate: number;     // e.g. 5, 10, 15, 30
  fixed_tax: number;    // e.g. 12500 for Old Regime 20% slab
};

export function calculateTaxFromSlabs(taxableIncome: number, slabs: TaxSlab[]): number {
  let totalTax = 0;

  // Sort slabs by income_min just to be safe
  const sortedSlabs = slabs.sort((a, b) => a.income_min - b.income_min);

  for (const slab of sortedSlabs) {
    const { income_min, income_max, tax_rate } = slab;

    if (taxableIncome > income_min) {
      const taxableInThisSlab = Math.min(taxableIncome, income_max) - income_min;
      const taxForThisSlab = (taxableInThisSlab * tax_rate) / 100;
      totalTax += taxForThisSlab;
    }

    if (taxableIncome <= income_max) {
      break;
    }
  }

  return Math.round(totalTax);
}

/**
 * Get total TDS (tax) deducted for an employee in a given financial year
 * @param userId - Employee/User ID
 * @param financialYearId - ID of the financial year (e.g., 1 for 2025–2026)
 * @returns total TDS deducted
 */
export async function getTdsDeductedTillNow(
  userId: number,
  financialYearId: number
): Promise<number> {
  const { _sum } = await prisma.paySlip.aggregate({
    where: {
      userId,
      financialYearId,
      tax: {
        gt: 0,
      },
    },
    _sum: {
      tax: true,
    },
  });

  return _sum.tax ?? 0;
}


/**
 * Calculates how many months have passed in the financial year (April–March)
 * @param year - Calendar year (e.g., 2025)
 * @param month - Month number (1 = Jan, 12 = Dec)
 * @returns Number of months paid in current financial year till given month
 */
export function getMonthsPaidInFiscalYear(year: number, month: number): number {
  // Determine the financial year start year
  const fyStartYear = month >= 4 ? year : year - 1;

  const fiscalMonths = [
    ...Array.from({ length: 9 }, (_, i) => 4 + i), // Apr (4) to Dec (12)
    ...Array.from({ length: 3 }, (_, i) => 1 + i), // Jan (1) to Mar (3)
  ];

  // Count how many fiscal months are up to (and including) the given month in that FY
  let monthsPaid = 0;
  for (const m of fiscalMonths) {
    const mYear = m >= 4 ? fyStartYear : fyStartYear + 1;
    if (mYear < year || (mYear === year && m <= month)) {
      monthsPaid++;
    }
  }

  return monthsPaid;
}
type PayslipContext = {
  employeeId: number;
  monthlySalary: number;
  monthsPaid: number;
  currentMonth: number; // 1–12
  annualBonusExpected: number; // expected or 0
  adhocPaidTillNow: number;
  tdsDeductedTillNow: number;
  professionalTaxMonthly: number;
  financialYear: number;
  regime?: Regime;
};




export async function getTdsSlabs(finYear: number, regime: Regime) {

  let slabs = await prisma.taxSlabs.findMany({
    where: {
      regime: regime,
      active: 1
    },
    orderBy: {
      income_min: 'asc'
    }
  });

  return slabs;
}





export async function getRebate(finYear: number, regime: Regime, income: number): Promise<number> {

  let rebates = await prisma.taxRebate.findFirst({
    orderBy: {
      id: 'desc',
    },
    where: {
      regime: regime,
      active: 1
    },
    take: 1,
  });


  if (rebates && income <= rebates.maxIncome) {
    return rebates.rebateAmount;
  }

  return 0;
}


/**
* Get financial year record by given year and month
* @param year - calendar year (e.g., 2025)
* @param month - numeric month (1=Jan, 12=Dec)
*/
export async function getFinancialYearIdByDate(year: number, month: number): Promise<number | null> {
  let finYearStart: number;
  let finYearEnd: number;

  if (month >= 4) {
    // April–Dec: financial year starts same year
    finYearStart = year;
    finYearEnd = year + 1;
  } else {
    // Jan–March: financial year starts previous year
    finYearStart = year - 1;
    finYearEnd = year;
  }

  const finYearString = `${finYearStart}-${finYearEnd}`;

  const financialYear = await prisma.financialYear.findFirst({
    where: {
      financialYear: finYearString,
    },
  });

  return financialYear?.id ?? null;
}

type TaxCalculationInput = {
  currentMonth: number;
  monthlyInhand: number;
  bonusThisMonth: number; // current month bonus
  expectedTotalBonus?: number;
  professionalTaxMonthly: number;
  employeePFMonthly: number;
  tdsPaidTillNow: number;
  financialYear: number;
};


export async function calculateMonthlyTDS_NewRegime(input: TaxCalculationInput) {
  const {
    currentMonth, // Calendar month: 1 = Jan, 2 = Feb, ..., 12 = Dec
    monthlyInhand,
    bonusThisMonth = 0, // bonus paid this month only
    professionalTaxMonthly,
    employeePFMonthly,
    tdsPaidTillNow,
    financialYear,
  } = input;

  const monthsInYear = 12;

  const getFiscalMonth = (calendarMonth: number): number => ((calendarMonth + 8) % 12) + 1;
  const fiscalMonth = getFiscalMonth(currentMonth); // April = 1, March = 12
  const monthsRemaining = Math.max(1, monthsInYear - fiscalMonth + 1); // at least 1

  // Only monthly salary (not bonus) included in projected income
  const projectedAnnualIncome = monthlyInhand * 12;

  const standardDeduction = 50000;
  const taxableIncome = Math.max(0, projectedAnnualIncome - standardDeduction);

  const slabs = await getTdsSlabs(financialYear, Regime.New);
  let projectedTax = calculateTaxFromSlabs(taxableIncome, slabs);

  const rebate = await getRebate(financialYear, Regime.New, taxableIncome);
  projectedTax = Math.max(0, projectedTax - rebate);
  projectedTax += projectedTax * 0.04; // 4% cess

  const tdsAnnual = Math.round(projectedTax);
  let tdsRemaining = Math.max(0, tdsAnnual - tdsPaidTillNow);
  let tdsThisMonth = Math.round(tdsRemaining / monthsRemaining);

  // Add bonus tax ONLY if bonus is paid this month
  let bonusTax = 0;
  if (bonusThisMonth > 0) {
    const bonusTaxable = bonusThisMonth;
    const bonusTaxableIncome = taxableIncome + bonusTaxable;
    let totalTaxWithBonus = calculateTaxFromSlabs(bonusTaxableIncome, slabs);
    const rebateWithBonus = await getRebate(financialYear, Regime.New, bonusTaxableIncome);
    totalTaxWithBonus = Math.max(0, totalTaxWithBonus - rebateWithBonus);
    totalTaxWithBonus += totalTaxWithBonus * 0.04; // 4% cess

    bonusTax = Math.round(totalTaxWithBonus - projectedTax);
    tdsThisMonth += bonusTax;
    tdsRemaining += bonusTax;
  }

  const amountBeforeDeductables = monthlyInhand + bonusThisMonth;
  const totalDeductions = professionalTaxMonthly + employeePFMonthly + tdsThisMonth;
  const netPay = amountBeforeDeductables - totalDeductions;

  return {
    monthNumber: currentMonth,
    monthName: monthsString[currentMonth - 1],
    monthlyGross: amountBeforeDeductables,
    projectedAnnualIncome,
    taxableIncome,
    tdsAnnual,
    tdsRemaining,
    tdsThisMonth,
    amountBeforeDeductables,
    professionalTaxMonthly,
    employeePFMonthly,
    netPay,
    notes: `TDS paid: ₹${tdsPaidTillNow}, Remaining: ₹${tdsRemaining}, Rebate: ₹${rebate}, Bonus taxed this month: ₹${bonusTax}`,
  };
}

export async function getTotalBonusPaidForEmployee(
  employeeId: number,
  financialYearId: number
): Promise<number> {
  try {
    const result = await prisma.paySlip.aggregate({
      _sum: {
        bonus: true,
      },
      where: {
        userId: employeeId,
        financialYearId: financialYearId,
      },
    });

    return result._sum.bonus ?? 0;
  } catch (error) {
    console.error('Error fetching bonus total:', error);
    return 0;
  }
}

export function getBonusByEmployeeId(
  employeeId: number | string,
  bonusMap: { [key: string]: number }
): number {
  try {
    const bonus = bonusMap[employeeId.toString()];
    return typeof bonus === 'number' ? bonus : 0;
  } catch {
    return 0;
  }
}

export async function getPermissionByName(name: string) {
  let permission = await prisma.permission.findFirst({
    where: {
      permissionName: name,
      active: 1
    },
  });

  return permission;
}
export const MenuIcons: Map<string, string> =
  new Map([
    ["Dashboard", "IconDashboard"],
    ["My Profile", "IconUser"],
    ["Admissions Management", "IconDoorEnter"],
    ["Student Management", "IconBuildingBank"],
    ["Parent Management", "IconMasksTheater"],
    ["Staff Management", "IconTemplate"],
    ["Accountants", "IconSquareRoot2"],
    ["Classes & Sections", "IconSchool"],
    ["Subjects", "IconBook"],
    ["Manage Attendance", "IconBellSchool"],
    ["Salary Management", "IconCash"],
    ["Accounting", "IconMathSymbols"],
    ["Stock & Inventory", "IconBooks"],
    ["Exam & Tests", "IconTextGrammar"],
    ["Reports", "IconChartPie"],
    ["Notifications", "IconBell"],
    ["Online Classes", "IconWifi"],
    ["Timetable", "IconCalendarTime"],
    ["Expense Management", "IconLicense"],
    ["Certification", "IconCertificate"],
    ["Study Material", "IconPencilCog"],
    ["Leave Management", "IconLuggage"],
    ["Settings", "IconVip"],
    ["ID Cards", "IconIdBadge"],
    ["Incoming Messages", "IconMessageReply"],
    ["Assignments", "IconHomeEdit"],

  ]);

export function getMenuCategory(currentUser: any) {
  let returnObj = {};
  let menuMap = new Map<number, any>([]);
  let isFirstMenuOpen = true;
  let dashboardUrl = null;

  if (currentUser !== null && currentUser !== undefined &&
    currentUser.userPermissions !== null && currentUser.userPermissions !== undefined && currentUser.userPermissions.length > 0) {
    currentUser.userPermissions.forEach((userPerm: any) => {


      if (userPerm !== null && userPerm !== undefined && userPerm.active === 1
        && userPerm.permission !== null && userPerm.permission !== undefined && userPerm.permission.active === 1
        && userPerm.permission.MenuCategoryPermissions !== null && userPerm.permission.MenuCategoryPermissions !== undefined && userPerm.permission.MenuCategoryPermissions.length > 0) {

        //process menus
        userPerm.permission.MenuCategoryPermissions.forEach((menuCat: any) => {

          if (menuCat !== null && menuCat !== undefined && menuCat.active === 1 && menuCat.menuCategory !== null
            && menuCat.menuCategory !== undefined && menuCat.menuCategory.active === 1) {
            let pushObj: any = {};
            pushObj.id = menuCat.menuCategory.id;
            pushObj.initiallyOpened = false;
            pushObj.label = menuCat.menuCategory.label;
            pushObj.order = menuCat.menuCategory.orderKey;
            pushObj.route = menuCat.menuCategory.route;
            //console.log(menuCat.menuCategory.label+' - '+ MenuIcons.get(menuCat.menuCategory.label));
            pushObj.icon = MenuIcons.get(menuCat.menuCategory.label);
            pushObj.description = menuCat.menuCategory.description;
            menuMap.set(menuCat.menuCategory.id, pushObj);

          }
        });

        //process sub menus
        if (userPerm.permission.MenuItemPermissions !== null && userPerm.permission.MenuItemPermissions !== undefined && userPerm.permission.MenuItemPermissions.length > 0) {
          userPerm.permission.MenuItemPermissions.forEach((menuItems: any) => {

            if (menuItems !== null && menuItems !== undefined && menuItems.active === 1 && menuItems.menuItem !== null
              && menuItems.menuItem !== undefined && menuItems.menuItem.active === 1) {
              let category = menuMap.get(menuItems.menuItem.categoryId);

              if (category !== null && category !== undefined) {
                let links = category.links;
                if (links !== null && links !== undefined) {

                  let pushItem: any = {};
                  pushItem.id = menuItems.menuItem.id;
                  pushItem.label = menuItems.menuItem.label;
                  pushItem.order = menuItems.menuItem.orderKey;
                  pushItem.route = menuItems.menuItem.route;
                  pushItem.description = menuItems.menuItem.description;
                  links.push(pushItem);

                } else {
                  let itemsArray: any[] = [];

                  let pushItem: any = {};
                  pushItem.id = menuItems.menuItem.id;
                  pushItem.label = menuItems.menuItem.label;
                  pushItem.order = menuItems.menuItem.orderKey;
                  pushItem.route = menuItems.menuItem.route;
                  pushItem.description = menuItems.menuItem.description;
                  itemsArray.push(pushItem);
                  category.links = itemsArray;
                }
              }

            }
          });
        }

        //Dashboard Url
        dashboardUrl = userPerm.permission.dashboardUrl;
      }
    });
  }

  let menusAsArray = Array.from(menuMap.values());
  let sortedMap = sortUsersBy(menusAsArray, 'order');
  if (sortedMap !== null && sortedMap !== undefined && sortedMap.length > 0) {
    sortedMap.forEach((itemRevisited: any, index: number) => {

      //setting initial page
      if (index === 0) {
        if (itemRevisited.route === '') {
          if (itemRevisited.links !== null && itemRevisited.links !== undefined && itemRevisited.links.length > 0) {
            //console.log(itemRevisited.links);
            let sortedLinks = itemRevisited.links.sort((a, b) => a.order - b.order);
            if (sortedLinks !== null && sortedLinks !== undefined && sortedLinks.length > 0) {
              returnObj["firstPage"] = "/home/" + sortedLinks[0].route;
            } else {
              returnObj["firstPage"] = "/home/" + itemRevisited.links[0].route;
            }

          }
        } else if (itemRevisited.route === 'home') {
          returnObj["firstPage"] = "/" + itemRevisited.route;
        } else {
          returnObj["firstPage"] = "/home/" + itemRevisited.route;
        }
      }

      if (itemRevisited !== null && itemRevisited !== undefined && itemRevisited.links !== null
        && itemRevisited.links !== undefined && itemRevisited.links.length > 0) {
        let links = itemRevisited.links;

        const uniqueLinks = links.filter((value, index) => {
          const _value = JSON.stringify(value);
          return index === links.findIndex(obj => {
            return JSON.stringify(obj) === _value;
          });
        });
        let sortedLinks = sortUsersBy(uniqueLinks, 'order');
        itemRevisited.links = sortedLinks;
        itemRevisited.initiallyOpened = isFirstMenuOpen;
        isFirstMenuOpen = false;

      }
    });
  }
  returnObj["menus"] = sortedMap;
  returnObj["dashboardUrl"] = dashboardUrl;
  return returnObj;
}
