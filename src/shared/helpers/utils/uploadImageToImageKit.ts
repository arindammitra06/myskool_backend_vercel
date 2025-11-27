import fs from "fs";
import path from "path";
import imagekit from "./imagekitClient"; // you already created this

export async function uploadImageToImageKit(buffer: Buffer, fileName?: string, folderPath?: string): Promise<any> {
    try {
        

        const result = await imagekit.upload({
            file: buffer,
            isPrivateFile: false,
            useUniqueFileName: true,
            fileName: fileName,
            folder: folderPath,
        });

        return result;
    } catch (err) {
        console.error("ImageKit upload error:", err);
        throw err;
    }
}
