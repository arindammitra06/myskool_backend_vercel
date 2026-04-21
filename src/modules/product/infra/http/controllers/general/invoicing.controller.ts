import { Request, Response } from "express";
import { prisma } from "../../../../../../shared/db-client";
import { generatePdfFromTemplate } from "../../../../../../shared/helpers/utils/pdf.generateFromTemplate";

export class InvoicingController {
    constructor() {
        this.generateSaveAndView = this.generateSaveAndView.bind(this);
        this.generateAndSavePdf = this.generateAndSavePdf.bind(this);
        this.viewSavedPdf = this.viewSavedPdf.bind(this);
    }

    /* =====================================
       GET PDF TEMPLATES
    ===================================== */
    public async getPDFTemplates(req: Request, res: Response) {
        try {
            const templates = await prisma.pdfTemplate.findMany();
            const selectItems = templates.map(t => ({
                value: String(t.id),
                label: t.name
            }));

            return res.json({
                status: true,
                data: selectItems,
                message: "PDF Templates fetched successfully"
            });
        } catch (err) {
            console.error(err);
            res.json({
                status: false,
                data: [],
                message: "Failed to fetch templates"
            });
        }
    }
    public async deleteTemplate(req: Request, res: Response) {
        const id = Number(req.params.id);
        console.log(req.params)
        await prisma.pdfTemplate.delete({
            where: {
                id: id,
            }
        });
        return res.json({ status: true, data: null, message: 'PDF Template deleted successfully' });
    }


    public async getPDFMeTemplates(req: Request, res: Response) {
        try {
            const templates = await prisma.pdfTemplate.findMany(
                {
                    include: {
                        TemplateMaster: true
                    }
                }
            );
            return res.json({
                status: true,
                data: templates,
                message: "Templates fetched successfully"
            });
        } catch (err) {
            console.error(err);
            res.json({
                status: false,
                data: [],
                message: "Failed to fetch templates"
            });
        }
    }
    /* =====================================
       GET TEMPLATES
    ===================================== */
    public async getTemplates(req: Request, res: Response) {
        try {
            const templates = await prisma.templateMaster.findMany(
                {
                    include: {
                        pdf: true
                    }
                }
            );
            return res.json({
                status: true,
                data: templates,
                message: "Templates fetched successfully"
            });
        } catch (err) {
            console.error(err);
            res.json({
                status: false,
                data: [],
                message: "Failed to fetch templates"
            });
        }
    }


    /* =====================================
       ADD TEMPLATE
    ===================================== */
    public async saveOrUpdateTemplate(req: Request, res: Response) {
        try {
            const { id, pdfId, currentUserId } = req.body.form;

            const template = await prisma.templateMaster.update({
                where: {
                    id: Number(id)
                },
                data: {
                    pdfId: Number(pdfId),
                    updated_at: new Date()
                },
            });

            return res.json({
                status: true,
                data: template,
                message: "Template updated successfully"
            });
        } catch (err) {
            console.error(err);
            res.json({
                status: false,
                message: "Failed to update template"
            });
        }
    }

    /* =====================================
       GENERATE + SAVE
    ===================================== */
    public async generateAndSavePdf(req: Request, res: Response) {
        try {
            const templateId = Number(req.params.templateId);
            const { studentId, invoiceId } = req.body;
            const institute = await prisma.institute.findFirst();

            const runtimeData = await this.fetchTemplateData(
                templateId,
                studentId,
                invoiceId,
                institute?.id
            );
            console.log('runtimeData --->', runtimeData);
            const pdfBytes = await generatePdfFromTemplate(templateId, runtimeData, institute);

            const doc = await prisma.generatedDocument.create({
                data: {
                    templateId,
                    fileName: `document-${Date.now()}.pdf`,
                    mimeType: "application/pdf",
                    pdfData: Buffer.from(pdfBytes)
                }
            });

            return res.json({
                status: true,
                data: { documentId: doc.id },
                message: "PDF saved"
            });

        } catch (err) {
            console.error(err);
            res.json({
                status: false,
                message: "PDF generation failed"
            });
        }
    }

    /* =====================================
       VIEW SAVED PDF
    ===================================== */
    public async viewSavedPdf(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);

            const doc = await prisma.generatedDocument.findUnique({
                where: { id }
            });

            if (!doc) {
                return res.json({
                    status: false,
                    message: "Document not found"
                });
            }

            res.setHeader("Content-Type", doc.mimeType);
            res.setHeader("Content-Disposition", `inline; filename=${doc.fileName}`);
            res.setHeader("Content-Length", doc.pdfData.length);

            res.end(doc.pdfData);

        } catch (err) {
            console.error(err);
            res.json({
                status: false,
                message: "Failed to load PDF"
            });
        }
    }

    /* =====================================
       GENERATE + SAVE + VIEW
    ===================================== */
    public async generateSaveAndView(req: Request, res: Response) {
        try {
            const templateId = Number(req.params.templateId);
            const { studentId, invoiceId } = req.body;

            const institute = await prisma.institute.findFirst();
            const runtimeData = await this.fetchTemplateData(
                templateId,
                studentId,
                invoiceId,
                institute?.id
            );
            console.log('runtimeData --->', runtimeData);
            const pdfBytes = await generatePdfFromTemplate(templateId, runtimeData, institute);

            const doc = await prisma.generatedDocument.create({
                data: {
                    templateId,
                    fileName: `document-${Date.now()}.pdf`,
                    mimeType: "application/pdf",
                    pdfData: Buffer.from(pdfBytes)
                }
            });

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `inline; filename=document-${doc.id}.pdf`);
            res.setHeader("Content-Length", pdfBytes.length);

            res.end(pdfBytes);

        } catch (err) {
            console.error(err);
            res.json({
                status: false,
                message: "PDF generation failed"
            });
        }
    }

    /* =====================================
       ADD TEMPLATE (WITH QUERY)
    ===================================== */
    public async addPdfTemplate(req: Request, res: Response) {
        try {
            let { id, name, type, templateJson, query } = req.body.form;

            if (!name || !type || !templateJson || !query) {
                return res.json({
                    status: false,
                    message: "Missing required fields"
                });
            }

            if (typeof templateJson === "string") templateJson = JSON.parse(templateJson);

            if (id !== null && id !== undefined) {
                const template = await prisma.pdfTemplate.update({
                    where: { id },
                    data: {
                        name: name,
                        type: type,
                        templateJson: templateJson,
                        dataQuery: query,
                        active: 1
                    }
                });
                return res.json({
                    status: true,
                    message: "Template updated successfully"
                });
            } else {
                const template = await prisma.pdfTemplate.create({
                    data: {
                        name: name,
                        type: type,
                        active: 1,
                        templateJson: templateJson,
                        dataQuery: query
                    }
                });
                return res.json({
                    status: true,
                    message: "Template added successfully"
                });
            }



        } catch (err) {
            console.error(err);
            res.json({
                status: false,
                message: "Failed to create template"
            });
        }
    }

    /* =====================================
       FETCH DATA USING TEMPLATE QUERY
    ===================================== */
    private async fetchTemplateData(
        templateId: number,
        studentId: number,
        invoiceId: number | null,
        instituteId: number
    ) {
        const template = await prisma.pdfTemplate.findUnique({
            where: { id: templateId }
        });

        if (!template) {
            throw new Error("Template not found");
        }

        let sql = template.dataQuery;
        //console.log('SQL --->', sql);
        // simple parameter replacement
        const sqlReplaced = sql
            .replace(/:studentId\b/g, String(studentId))
            .replace(/:instituteId\b/g, String(instituteId))
            .replace(/:invoiceId\b/g, invoiceId ? String(invoiceId) : "NULL");
        console.log('SQL replaced --->', sqlReplaced);

        if (sqlReplaced.includes(':')) {
            console.error('UNRESOLVED PARAM FOUND:', sqlReplaced);
        }
        const rows: any[] = await prisma.$queryRawUnsafe(sqlReplaced);
        //console.log('Rows --->', rows);
        if (!rows.length) return {};

        return this.convertFlatToNested(rows[0]);
    }

    /* =====================================
       CONVERT ALIAS OBJECT TO NESTED
       student.name → { student: { name } }
    ===================================== */
    private convertFlatToNested(row: Record<string, any>) {
        const result: any = {};

        for (const key in row) {
            const parts = key.split(".");
            let current = result;

            parts.forEach((part, index) => {
                if (index === parts.length - 1) {
                    current[part] = row[key];
                } else {
                    current[part] = current[part] || {};
                    current = current[part];
                }
            });
        }
        //console.log('Result --->', result);
        return result;
    }
}