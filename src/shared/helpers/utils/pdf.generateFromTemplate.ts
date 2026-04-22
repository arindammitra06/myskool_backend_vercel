import { prisma } from "../../db-client";
import fs from "fs";
import {
    image,
    line,
    multiVariableText,
    text,
    barcodes,
    rectangle,
    table
} from "@pdfme/schemas";
import {
    exo2Base64,
    greatVibesBase64,
    montserratBase64,
    notoSansBase64,
    notoSansBoldBase64,
    notoSansJpBase64,
    notoSerifJpBase64,
    oldEnglishBase64,
    pinyonBase64,
    robotoBase64,
    seagramBase64
} from "./fonts";
import { normalizeRowForPdf } from "./runTemplateQuery";
import { Institute } from "@prisma/client";

type PdfMeTemplate = {
    basePdf: unknown;
    schemas: Array<Record<string, any>>;
};

export async function generatePdfFromTemplate(
    templateId: number,
    runtimeData: Record<string, any>,
    institute: Institute | null
) {
    // ✅ FIX: dynamic import
    const { generate } = await import("@pdfme/generator");

    const template = await prisma.pdfTemplate.findUnique({
        where: { id: templateId }
    });

    if (!template) {
        throw new Error("Template not found");
    }

    const pdfTemplate = template.templateJson as unknown as PdfMeTemplate;

    const schemaFields = Object.values(pdfTemplate.schemas[0]);

    console.log(
        "Template fields:",
        schemaFields.map((f: any) => f.name)
    );

    console.log("Runtime keys:", Object.keys(runtimeData));

    const normalizedInput = await normalizeRowForPdf(
        runtimeData,
        schemaFields,
        institute
    );

    console.log("Normalized input --->", normalizedInput);

    return await generate({
        template: pdfTemplate as any,
        inputs: [normalizedInput],
        plugins: {
            text,
            image,
            multiVariableText,
            line,
            rectangle,
            table,
            ...barcodes
        },
        options: {
            font: {
                NotoSans: { data: notoSansBase64, fallback: true },
                NotoSansBold: { data: notoSansBoldBase64 },
                Seagram: { data: seagramBase64 },
                OldEnglish: { data: oldEnglishBase64 },
                GreatVibes: { data: greatVibesBase64 },
                Exo: { data: exo2Base64 },
                Montserrat: { data: montserratBase64 },
                Roboto: { data: robotoBase64 },
                'PinyonScript-Regular': { data: pinyonBase64 },
                NotoSerifJP: { data: notoSerifJpBase64 },
                NotoSansJP: { data: notoSansJpBase64 }
            },
            multiVariableText: { normalize: true }
        }
    });
}