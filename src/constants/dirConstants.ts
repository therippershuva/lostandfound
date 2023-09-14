import path from "node:path";
import { getRootDir } from "../utils/filesFolders";

// DIR PATHS
export const ROOT_DIR_PATH = getRootDir();
export const ENV_FILE_PATH = path.join(ROOT_DIR_PATH, ".env");
export const PUBLIC_DIR_PATH = path.join(ROOT_DIR_PATH, "public");
export const TEMPLATE_DIR_PATH = path.join(ROOT_DIR_PATH, "src", "templates");
export const USER_UPLOAD_DIR_PATH = path.join(
    PUBLIC_DIR_PATH,
    "upload",
    "users",
);
export const LOG_DIR_PATH = path.join(ROOT_DIR_PATH, "logs");
export const LOG_DIR_PATH_DEVELOPMENT = path.join(LOG_DIR_PATH, "development");
export const LOG_DIR_PATH_PRODUCTION = path.join(LOG_DIR_PATH, "production");
