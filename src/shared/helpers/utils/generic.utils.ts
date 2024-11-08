import { Permission, TimeTable } from '@prisma/client';
import * as crypto from 'crypto';
import { prisma } from '../../db-client';
import { v4 as uuidv4 } from 'uuid';
import { HolidayListModel } from '../../models/time-model';
import ShadeGenerator, { Shade } from 'shade-generator';


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
  }else if (day === 'sa') {
    return 6;
  }else if (day === 'su') {
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
export function buildTheme(themeObject: any) {
  let primaryswatch: any = generateShades(themeObject.primaryColor);
  let darkSwatch: any = generateShades(themeObject.schemeColor);

  let blueswatch: any = generateShades(themeObject.blue);
  let greenswatch: any = generateShades(themeObject.green);
  let yellowswatch: any = generateShades(themeObject.yellow);
  let orangeswatch: any = generateShades(themeObject.orange);
  let redswatch: any = generateShades(themeObject.red);

  let actionGreenButtonswatch: any = generateShades(themeObject.actionGreenButton);
  let secondaryOrangeButtonswatch: any = generateShades(themeObject.secondaryOrangeButton);

  let defaultRadius = buildRadius(themeObject.defaultRadius);


  let newTheme: any = {
    fontFamily: themeObject.fontFamily,
    primaryShade: { light: 5, dark: 9 },
    colorScheme: themeObject.scheme,
    white: themeObject.white,
    black: themeObject.black,
    defaultRadius: defaultRadius,
    fontSizes: buildFontSize(themeObject.fontSize),
    colors: {
      backg: [
        themeObject.backg,//light bg
      ],
      foreg: [
        themeObject.foreg,//light panels
      ],
      header: [
        themeObject.header,//light header color
      ],
      leftmenu: [
        themeObject.leftmenu,//light left menu color
      ],
      dark: darkSwatch,
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

export async function addANotification(campusId: number, userId: number, createdBy: number, message: string){
  await prisma.notifications.create({
    data: {
      campusId:campusId,
      userId:userId,
      created_by:createdBy,
      created_at: new Date(),
      message:message,
      markedRead: 0
    },
  })
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
