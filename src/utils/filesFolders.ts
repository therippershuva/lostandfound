import fs from "node:fs";
import { dirname } from "node:path";

export const getRootDir = (): string => {
    const rootDir = dirname(dirname(dirname(__filename)));
    return rootDir;
};

export const readFileContent = async (filename: string) => {
    const data = await fs.promises.readFile(filename, "utf8");
    return data;
};

export const deleteFile = async (filename: string) => {
    try {
        if (fs.existsSync(filename)) {
            fs.promises.rm(filename);
        }
    } catch (error: Error | any) {
        throw new Error(`Error deleting file ${filename}: ${error.message}`);
    }
};
