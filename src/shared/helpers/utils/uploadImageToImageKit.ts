import fs from "fs";
import path from "path";
import imagekit from "./imagekitClient"; // you already created this

export async function uploadImageToImageKit(buffer: Buffer, fileName?: string): Promise<any> {
    try {
        

        const result = await imagekit.upload({
            file: buffer,
            isPrivateFile: false,
            useUniqueFileName: true,
            fileName: fileName,
            folder: "myskool",
        });

        return result;
    } catch (err) {
        console.error("ImageKit upload error:", err);
        throw err;
    }
}
