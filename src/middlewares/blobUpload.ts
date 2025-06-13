require("dotenv").config();
const { Readable } = require("stream");
import azureStorage from "azure-storage";
import { Request, Response } from "express";
import { v4 as uuidV4 } from "uuid";
import ApiResponse from "../constants/ApiResponse";

const azureStorageConfig = {
    accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME || "",
    accountKey: process.env.AZURE_STORAGE_ACCOUNT_KEY || "",
    blobURL: "",
    containerName: process.env.AZURE_STORAGE_CONTAINER_NAME || "",
};

const uploadFileToBlob = async (directoryPath: any, file: any) => {
    return new Promise((resolve, reject) => {
        const blobName = getBlobName(file.originalname);
        const stream = Readable.from(file.buffer);
        const streamLength = file.buffer.length;
        const blobService = azureStorage.createBlobService(
            azureStorageConfig.accountName,
            azureStorageConfig.accountKey
        );
        blobService.createBlockBlobFromStream(
            azureStorageConfig.containerName,
            `${directoryPath}/${blobName}`,
            stream,
            streamLength,
            (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        filename: blobName,
                        originalname: file.originalname,
                        size: streamLength,
                        path: `${azureStorageConfig.containerName}/${directoryPath}/${blobName}`,
                        url: `${azureStorageConfig.blobURL}${azureStorageConfig.containerName}/${directoryPath}/${blobName}`,
                    });
                }
            }
        );
    });
};

const getBlobName = (originalName: any) => {
    const identifier = uuidV4();
    return `${identifier}-${originalName}`;
};

function getDynamicPath(fieldName: string) {
    switch (fieldName) {
        case "user":
            return "userimage";
        case "selldocument":
            return "sellPropertyDocument";
        case "buydocument":
            return "buyPropertyDocument";
        default:
            return "default";
    }
}

export default async function fileUploadMiddleware(
    req: Request,
    res: Response,
    next: any
) {
    if (req.file === undefined) {
        if (req.files === undefined) {
            return res.status(400).send({
                status: 400,
                message: "File is required",
                data: false,
            } as ApiResponse);
        }
        let files: any[] = [];
        let arr = req.files as Express.Multer.File[];
        for (let i = 0; i < arr.length; i++) {
            let item = arr[i];
            const file = await uploadFileToBlob(
                getDynamicPath(item.fieldname),
                item
            );
            files.push(file);
        }
        req.body.files = files;
    } else {
        const file = await uploadFileToBlob(
            getDynamicPath(req.file.fieldname),
            req.file
        );
        req.body.file = file;
    }

    next();
}
