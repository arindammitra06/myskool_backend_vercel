import axios from "axios";

/* =========================
   VALUE RESOLVER
========================= */

export function getValue(obj: any, path: string) {
    return path.split(".").reduce((o, key) => {
        if (!o) return undefined;
        return o[key];
    }, obj);
}

/* =========================
   BUILD SINGLE FIELD
========================= */

async function buildField(config: any, runtimeData: any) {

    // ---------- SIMPLE STRING PATH ----------
    if (typeof config === "string") {
        const value = getValue(runtimeData, config);
        return value ?? "";
    }

    // ---------- STATIC ----------
    if (config.type === "static") {
        return config.value ?? "";
    }

    // ---------- IMAGE / TEXT / QR / BARCODE ----------
    if (config.path) {
        const rawValue = getValue(runtimeData, config.path);
        return await processFieldValue(rawValue, config.type);
    }

    // ---------- MULTI VARIABLE TEXT ----------
    if (config.type === "multiVariableText") {
        const result: any = {};

        for (const variableName in config.variables) {
            const path = config.variables[variableName];
            const rawValue = getValue(runtimeData, path);

            result[variableName] = rawValue ?? "";
        }

        return normalizeMVT(result);
    }

    return "";
}


function normalizeMVT(value: any) {
    if (value == null) return "";

    // already JSON string
    if (typeof value === "string") {
        try {
            JSON.parse(value);
            return value;
        } catch {
            return JSON.stringify({ value });
        }
    }
    console.log(value)
    // object → stringify
    return JSON.stringify(value);
}

/* =========================
   IMAGE URL → BASE64
========================= */

const imageCache = new Map<string, string>();

export async function imageUrlToBase64(url: string) {
    if (!url) return "";

    if (url.startsWith("data:image")) return url;

    if (imageCache.has(url)) {
        return imageCache.get(url)!;
    }

    const response = await axios.get(url, {
        responseType: "arraybuffer"
    });

    const contentType = response.headers["content-type"];
    const base64 = Buffer.from(response.data).toString("base64");

    const dataUrl = `data:${contentType};base64,${base64}`;

    imageCache.set(url, dataUrl);

    return dataUrl;
}

/* =========================
   PROCESS FIELD BY TYPE
========================= */

export async function processFieldValue(
    value: any,
    type: string
) {
    if (value == null) return "";

    switch (type) {
        case "text":
            return String(value);

        case "image":
            return await imageUrlToBase64(value);

        case "qr":
            return String(value); // pdfme generates QR

        case "barcode":
            return String(value);

        default:
            return value;
    }
}
export async function buildPdfInputObject(
    mappingJson: any,
    runtimeData: any
) {
    const result: any = {};

    for (const fieldName in mappingJson) {
        const config = mappingJson[fieldName];
        result[fieldName] = await buildField(config, runtimeData);
    }

    return result;
}

export async function buildPdfInputsGeneric(
    mappingJson: any,
    runtimeData: any | any[]
) {
    const records = Array.isArray(runtimeData)
        ? runtimeData
        : [runtimeData];

    const inputs = [];

    for (const record of records) {
        const input = await buildPdfInputObject(mappingJson, record);

        inputs.push(input);
    }
    console.log('buildPdfInputsGeneric ->', inputs);
    return inputs;
}