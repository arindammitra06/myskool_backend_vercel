import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const seagramBase64 = fs
    .readFileSync(path.join(__dirname, "../../../assets/fonts/Seagram.ttf"))
    .toString("base64");

export const oldEnglishBase64 = fs
    .readFileSync(path.join(__dirname, "../../../assets/fonts/OldEnglishFive.ttf"))
    .toString("base64");

export const greatVibesBase64 = fs
    .readFileSync(path.join(__dirname, "../../../assets/fonts/GreatVibes-Regular.ttf"))
    .toString("base64");

export const notoSansBase64 = fs
    .readFileSync(path.join(__dirname, "../../../assets/fonts/NotoSans.ttf"))
    .toString("base64");

export const notoSansBoldBase64 = fs
    .readFileSync(path.join(__dirname, "../../../assets/fonts/NotoSans_Condensed-Bold.ttf"))
    .toString("base64");

export const exo2Base64 = fs
    .readFileSync(path.join(__dirname, "../../../assets/fonts/Exo-VariableFont_wght.ttf"))
    .toString("base64");

export const montserratBase64 = fs
    .readFileSync(path.join(__dirname, "../../../assets/fonts/Montserrat-VariableFont_wght.ttf"))
    .toString("base64");

export const robotoBase64 = fs
    .readFileSync(path.join(__dirname, "../../../assets/fonts/Roboto.ttf"))
    .toString("base64");

export const notoSerifJpBase64 = fs
    .readFileSync(path.join(__dirname, "../../../assets/fonts/NotoSerifJP.ttf"))
    .toString("base64");

export const notoSansJpBase64 = fs
    .readFileSync(path.join(__dirname, "../../../assets/fonts/NotoSansJP.ttf"))
    .toString("base64");

export const pinyonBase64 = fs
    .readFileSync(path.join(__dirname, "../../../assets/fonts/PinyonScript-Regular.ttf"))
    .toString("base64");