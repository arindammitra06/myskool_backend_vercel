import { TimeTable } from '@prisma/client';
import * as crypto from 'crypto';

const ENC = "bf3c199c2470cb477d907b1e0917c17b";
const IV = "5183666c72eec9e4";
const ALGO = "aes-256-cbc";

export function encrypt(text: string): string {
    let cipher = crypto.createCipheriv(ALGO, ENC, IV);
    let encrypted = cipher.update(text, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
}

export function processTimeTableJsonData(timtables, day:string) {
    const filtered = timtables.filter((value: TimeTable) => value.day === day);
    let dayEvent;
    let events = [];

    if (filtered !== null && filtered!==undefined && filtered.length > 0) {
      filtered.forEach(async (eachItem) => {
        events.push({
          startTime: eachItem.startTime,
          endTime: eachItem.endTime,
          title: eachItem.subject,
          color:eachItem.color,
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

export function generateIdsForParentAndStudent(id: number, typeParam :string) {
    return makeid(4) + String(id).padStart(8,'0') + typeParam;
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

