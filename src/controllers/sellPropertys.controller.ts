import { Request, Response } from "express";
import { ISellProperty } from "../interfaces/sellProperty.interface";
import { createSellPropertyDetail, getSellPropertyDetail,updateSellPropertyDetail,deleteSellPropertyDetail } from "../resource/sellPropertys.resource";
import { isValidObjectId } from "mongoose";

export const createSellProperty = async (req: Request, res: Response, next: Function) => {
    try {

        let data = req.body

        let sellPropertyObj: ISellProperty = {
            propertyType: data.propertyType,
            district: data.district,
            taluka: data.taluka,
            locationURL: data.locationURL,
            uploadFilePath: data.uploadFilePath,
            amount: data.amount,
            descriptions: data.descriptions,
            userId: data.userId
        }

        let checkObject = Object.keys(sellPropertyObj).filter((o) => !(sellPropertyObj as any)[o]);
        if (checkObject.length > 0) {
            return res.status(400).send(checkObject);
        }

        const allowedPropertyTypes = ["residential", "commercial", "land/plot"];
        if (!allowedPropertyTypes.includes(sellPropertyObj.propertyType)) {
            return res.status(400).send({ "Invalid propertyType:": sellPropertyObj.propertyType });
        }

        let sellPoperty = await createSellPropertyDetail(sellPropertyObj) as any
        if (!sellPoperty) {
            return res.status(400).send(false);
        }
        return res.status(200).send(sellPoperty);

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong!");
    }
};



export const getSellProperty = async (req: Request, res: Response, next: Function) => {
    try {

        const userId: string = req.query?.userId as string;
        const page: number = parseInt(req.query?.page as string) || 1; // Default to page 1 if not specified
        const limit: number = parseInt(req.query?.limit as string) || 10; // Default page size to 10 if not specified

        if (!isValidObjectId(userId)) {
            return res.status(400).send("Invalid userId");
        }


        let sellPoperty = await getSellPropertyDetail(userId, page, limit) as any
        if (!sellPoperty) {
            return res.status(400).send(false);
        }
        return res.status(200).send(sellPoperty);

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong!");
    }
};


export const updateSellProperty = async (req: Request, res: Response, next: Function) => {
    try {

        let data = req.body

        let sellPropertyObj: ISellProperty = {
            propertyType: data.propertyType,
            district: data.district,
            taluka: data.taluka,
            locationURL: data.locationURL,
            uploadFilePath: data.uploadFilePath,
            amount: data.amount,
            descriptions: data.descriptions,
            userId: data.userId
        }


        let checkObject = Object.keys(sellPropertyObj).filter((o) => !(sellPropertyObj as any)[o]);
        if (checkObject.length > 0) {
            return res.status(400).send(checkObject);
        }

        const allowedPropertyTypes = ["residential", "commercial", "land/plot"];
        if (!allowedPropertyTypes.includes(sellPropertyObj.propertyType)) {
            return res.status(400).send({ "Invalid propertyType:": sellPropertyObj.propertyType });
        }


        let sellPoperty = await updateSellPropertyDetail(data.sellPropertyId, sellPropertyObj) as any
        if (!sellPoperty) {
            return res.status(400).send(false);
        }
        return res.status(200).send(sellPoperty);

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong!");
    }
};


export const deleteSellProperty = async (req: Request, res: Response, next: Function) => {
    try {

        let sellPropertyId = req.query.sellPropertyId as string
        if (!sellPropertyId) {
            return res.status(400).send("sellProperty id is required");
        }

        // Validate ObjectId
      

        if (!isValidObjectId(sellPropertyId)) {
            return res.status(400).send("Invalid userId");
          }


        let buyPoperty = await deleteSellPropertyDetail(sellPropertyId) as any
        if (!buyPoperty) {
            return res.status(400).send(false);
        }
        return res.status(200).send(buyPoperty);

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong!");
    }
};

export const uploadSellPropertyDocument = async (req: Request, res: Response, next: Function) => {
    try {

        if((req as any).errorMessage){
            return res.status(400).send((req as any).errorMessage);
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).send('No files uploaded.');
        }

        let fileUrls: string[] = [];
        (req.files as Express.Multer.File[]).forEach(file => {
            let filePath: string = process.env.BASE_URL + (file.path as string);
            fileUrls.push(filePath);
        });
        return res.status(200).send({ Message: "File upload successfully", data: fileUrls });

    } catch (err) {
        console.log(err);
        return res.status(500).send("Something went wrong!");
    }
};