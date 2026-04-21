import { Institute } from "@prisma/client";
import { prisma } from "../../db-client";
import { processFieldValue } from "./pdf.paramProcessor";
import { getAppSelectedCurrencySymbol } from "./generic.utils";
import sharp from "sharp";
import axios from "axios";

function isTableField(field: any) {
    return field.type === "table" || field.name.startsWith("table");
}
function buildTableRows(
    structure: any,
    runtimeData: Record<string, any>,
    institute: Institute | null
) {
    if (!Array.isArray(structure)) return [];

    return structure.map((row: string[]) =>
        row.map(key =>
            formatIfCurrencyKey(key, runtimeData[key], institute)
        )
    );
}

function formatIfCurrencyKey(
    key: string,
    value: any,
    institute: Institute | null
) {
    if (value === null || value === undefined || value === "") return "";

    if (key.includes("FxCurrency")) {
        const symbol = getAppSelectedCurrencySymbol(institute);

        // optional number formatting
        const num = Number(value);
        if (!isNaN(num)) {
            return symbol + num.toLocaleString("en-IN");
        }

        return symbol + value;
    }

    return value;
}

function getRoundedMode(fieldName: string) {
    if (fieldName.endsWith("RoundedCornersXS")) return "XS";
    if (fieldName.endsWith("RoundedCornersSM")) return "SM";
    if (fieldName.endsWith("RoundedCornersMD")) return "MD";
    if (fieldName.endsWith("RoundedCornersLG")) return "LG";
    if (fieldName.endsWith("RoundedCorners")) return "FULL";
    return null;
}

function getRadiusByMode(mode: string, size: number) {
    switch (mode) {
        case "XS": return 8;
        case "SM": return 16;
        case "MD": return 24;
        case "LG": return 40;
        case "FULL": return size / 2;
        default: return 0;
    }
}

async function loadImageBuffer(value: string): Promise<Buffer> {
    if (!value) throw new Error("Empty image");

    if (value.startsWith("data:image")) {
        const base64 = value.split(",")[1];
        return Buffer.from(base64, "base64");
    }

    const response = await axios.get(value, { responseType: "arraybuffer" });
    return Buffer.from(response.data);
}

async function makeRoundedImage(value: string, mode: string) {
    const inputBuffer = await loadImageBuffer(value);

    const metadata = await sharp(inputBuffer).metadata();
    const size = Math.min(metadata.width || 300, metadata.height || 300);

    const radius = getRadiusByMode(mode, size);

    const svg =
        mode === "FULL"
            ? `<svg width="${size}" height="${size}">
                   <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" />
               </svg>`
            : `<svg width="${size}" height="${size}">
                   <rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" ry="${radius}" />
               </svg>`;

    const rounded = await sharp(inputBuffer)
        .resize(size, size)
        .composite([{ input: Buffer.from(svg), blend: "dest-in" }])
        .png()
        .toBuffer();

    return `data:image/png;base64,${rounded.toString("base64")}`;
}


export async function normalizeRowForPdf(
    row: Record<string, any>,
    schemaFields: any[],
    institute: Institute | null
) {
    const result: Record<string, any> = {};

    for (const field of schemaFields) {
        const name = field.name;
        const type = field.type;

        // ================================
        // ✅ TABLE
        // ================================
        if (type === "table") {
            let structure = field.content || [];

            if (typeof structure === "string") {
                try {
                    structure = JSON.parse(structure);
                } catch {
                    structure = [];
                }
            }

            result[name] = buildTableRows(structure, row, institute);
            continue;
        }

        // ================================
        // ✅ MULTI VARIABLE TEXT
        // ================================
        if (type === "multiVariableText") {
            const variables: string[] = field.variables || [];
            const variableMap: Record<string, any> = {};

            for (const v of variables) {
                const raw = row[v] ?? "";
                variableMap[v] = formatIfCurrencyKey(v, raw, institute);
            }

            result[name] = JSON.stringify(variableMap);
            continue;
        }

        // ================================
        // ✅ DYNAMIC VALUE FROM DATA
        // ================================
        if (name in row) {
            const raw = row[name];
            const formatted = formatIfCurrencyKey(name, raw, institute);

            let value = await processFieldValue(formatted, type);

            // ===== IMAGE ROUNDED CORNERS LOGIC =====
            if (type === "image") {
                const mode = getRoundedMode(name);
                if (mode && value) {
                    try {
                        value = await makeRoundedImage(value, mode);
                    } catch (err) {
                        console.warn("Image rounding failed:", name, err);
                    }
                }
            }

            result[name] = value;
            continue;
        }

        // ================================
        // ✅ STATIC TEMPLATE TEXT
        // ================================
        if (type === "text") {
            if (field.text) {
                result[name] = field.text;
                continue;
            }

            if (field.content && field.content !== "{}") {
                result[name] = field.content;
                continue;
            }
        }
    }

    return result;
}
export function transformTablesFromTemplate(
    templateSchemas: Record<string, any>,
    runtimeData: Record<string, any>
) {
    const result = { ...runtimeData };

    Object.entries(templateSchemas).forEach(([fieldName, schema]: any) => {
        if (!fieldName.startsWith("table")) return;

        // pdfme table structure stored in schema.content
        const structure = schema?.content;
        if (!Array.isArray(structure)) return;

        result[fieldName] = structure.map((row: string[]) =>
            row.map(key => runtimeData[key] ?? "")
        );
    });

    return result;
}


export async function runTemplateQuery(
    query: string,
    params: Record<string, any>
) {
    console.log('Query --->', query);
    console.log('Params --->', params);
    console.log('Replaced Query --->', replaceNamedParams(query, params));
    const rows = await prisma.$queryRawUnsafe(
        replaceNamedParams(query, params)
    );

    return rows;
}

function replaceNamedParams(
    query: string,
    params: Record<string, any>
) {
    let finalQuery = query;

    for (const key in params) {
        const value = params[key];

        if (value === null || value === undefined) {
            finalQuery = finalQuery.replaceAll(`:${key}`, "NULL");
        } else if (typeof value === "number") {
            finalQuery = finalQuery.replaceAll(`:${key}`, String(value));
        } else {
            finalQuery = finalQuery.replaceAll(
                `:${key}`,
                `'${escapeSql(value)}'`
            );
        }
    }

    return finalQuery;
}

function escapeSql(val: string) {
    return val.replace(/'/g, "''");
}