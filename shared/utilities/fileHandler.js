const fs = require("fs");
const path = require("path");

class FileHandler {
    constructor() {
        this.baseURL = process.env.baseUrl || "http://localhost:4000";
        this.public = "public";
        this.storageName = "storage";
    }

    async createFolder(pathName) {
        try {
            const folderName = path.join(this.public, this.storageName, ...pathName);

            await fs.promises.mkdir(folderName, { recursive: true });
        } catch (err) {
            console.error("Failed to create folder:", err);
        }
    }

    async createFile(pathName, file) {
        try {
            const fileName = `${file.fieldname}${path.extname(file.originalname)}`;

            const filePath = path.join(this.public, this.storageName, ...pathName, fileName);

            await fs.promises.writeFile(filePath, file.buffer);

            const fileSrc = `${this.baseURL}/${path.join(this.storageName, ...pathName, fileName)}`;

            return { fileName: file.fieldname, fileSrc };
        } catch (err) {
            console.error("Failed to write file:", err);
        }
    }
}

module.exports = new FileHandler();
