import { Request, Response } from "express";
import { ISellProperty } from "../interfaces/sellProperty.interface";
import {
    createSellPropertyDetail, getAllSellPropertyList,
    getSellPropertyDetail, updateSellPropertyDetail, deleteSellPropertyDetail,
    checkSellPropertyId, getAllUserSellPropertyList, getAllSellPropertyWithUserDetailData
} from "../resource/sellPropertys.resource";
import { isValidObjectId } from "mongoose";
import { getUserDetail, getUserDetailByRole } from "../resource/users.resource";

// Function to handle creating a new sell property
export const createSellProperty = async (req: Request, res: Response, next: Function) => {
    try {

        let data = req.body

        let sellPropertyObj: ISellProperty = {
            propertyType: data.propertyType,
            district: data.district,
            village: data.village,
            // taluka: data.taluka,
            locationURL: data.locationURL,
            uploadFilePath: data.uploadFilePath,
            uploadImagePath: data.uploadImagePath,
            amount: data.amount,
            amountUnit: data.amountUnit,
            descriptions: data.descriptions,
            userId: data.userId
        }

        let checkObject = Object.keys(sellPropertyObj).filter((o) => o !== 'locationURL' && !(sellPropertyObj as any)[o]);
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


// Function to get all sell properties
export const getAllSellProperty = async (req: Request, res: Response, next: Function) => {
    try {

        const userId: string = req.query?.userId as string;
        const page: number = parseInt(req.query?.page as string) || 1;
        const limit: number = parseInt(req.query?.limit as string) || 10;
        const searchkey: string = req.query?.searchkey as string

        let sellPoperty = await getAllSellPropertyList(page, limit, searchkey, userId) as any
        if (!sellPoperty) {
            return res.status(400).send(false);
        }
        return res.status(200).send(sellPoperty);

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong!");
    }
};

// Function to update a sell property
export const updateSellProperty = async (req: Request, res: Response, next: Function) => {
    try {

        let data = req.body

        let sellPropertyObj: ISellProperty = {
            propertyType: data.propertyType,
            district: data.district,
            village: data.village,
            // taluka: data.taluka,
            amountUnit: data.amountUnit,
            locationURL: data.locationURL,
            uploadFilePath: data.uploadFilePath,
            uploadImagePath: data.uploadImagePath,
            amount: data.amount,
            descriptions: data.descriptions,
            userId: data.userId,

            adminLocationURL: data.adminLocationURL,
            adminAmountUnit: data.adminAmountUnit,
            adminAmount: data.adminAmount,
        }

        // let checkObject = Object.keys(sellPropertyObj).filter((o) => o !== 'locationURL' && !(sellPropertyObj as any)[o]);
        // if (checkObject.length > 0) {
        //     return res.status(400).send(checkObject);
        // }
        // Filter out the keys to be excluded from the check
        let checkObject = Object.keys(sellPropertyObj).filter((o) =>
            o !== 'locationURL' &&
            o !== 'adminLocationURL' &&
            o !== 'adminAmountUnit' &&
            o !== 'adminAmount' &&
            !(sellPropertyObj as any)[o]
        );
        if (checkObject.length > 0) {
            return res.status(400).send(checkObject);
        }

        const allowedPropertyTypes = ["residential", "commercial", "land/plot"];
        if (!allowedPropertyTypes.includes(sellPropertyObj.propertyType)) {
            return res.status(400).send({ "Invalid propertyType:": sellPropertyObj.propertyType });
        }


        let sellPoperty = await updateSellPropertyDetail(data._id, sellPropertyObj) as any
        if (!sellPoperty) {
            return res.status(400).send(false);
        }
        return res.status(200).send(sellPoperty);

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong!");
    }
};

// Function to delete a sell property
export const deleteSellProperty = async (req: Request, res: Response, next: Function) => {
    try {

        let sellPropertyId = req.query.sellPropertyId as string
        if (!sellPropertyId) {
            return res.status(400).send("sellProperty id is required");
        }

        if (!isValidObjectId(sellPropertyId)) {
            return res.status(400).send("Invalid sellPropertyId");
        }


        let checkSellProperty = await checkSellPropertyId(sellPropertyId) as any
        if (!checkSellProperty) {
            return res.status(400).send(false);
        }

        if (checkSellProperty.userId.toString() != req.body.user.user_id) {
            return res.status(400).send("Unauthorized person, so you cannot delete the property.");
        }

        let buyPoperty = await deleteSellPropertyDetail(sellPropertyId) as any
        if (!buyPoperty) {
            return res.status(400).send(false);
        }
        return res.status(200).send(true);

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong!");
    }
};

// Function to upload sell property documents
export const uploadSellPropertyDocument = async (req: Request, res: Response, next: Function) => {
    try {

        if ((req as any).errorMessage) {
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

// Function to get sell property details by ID
export const getSellProperty = async (req: Request, res: Response, next: Function) => {
    try {

        const sellPropertyId: string = req.query?.sellPropertyId as string;
        if (!isValidObjectId(sellPropertyId)) {
            return res.status(400).send("Invalid propertyId");
        }


        let sellPoperty = await getSellPropertyDetail(sellPropertyId) as any
        if (!sellPoperty) {
            return res.status(400).send(false);
        }

        let adminDetail = await getUserDetailByRole("admin")

        let result  = { 
            ...sellPoperty[0] ? sellPoperty[0] : {},
            admin_detail : adminDetail
        }

        return res.status(200).send(result);

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong!");
    }
};


// Function to get all sell properties for a specific user
export const getAllUserSellProperty = async (req: Request, res: Response, next: Function) => {
    try {

        const userId: string = req.query?.userId as string;
        const page: number = parseInt(req.query?.page as string) || 1;
        const limit: number = parseInt(req.query?.limit as string) || 10;
        // const searchkey: string = req.query?.searchkey as string

        if (!isValidObjectId(userId)) {
            return res.status(400).send("Invalid userId");
        }

        let sellPoperty = await getAllUserSellPropertyList(page, limit, userId) as any
        if (!sellPoperty) {
            return res.status(400).send(false);
        }
        return res.status(200).send(sellPoperty);

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong!");
    }
};

// Function to get all sell properties with user details
export const getAllSellPropertyWithUserDetail = async (req: Request, res: Response, next: Function) => {
    try {

        const page: number = parseInt(req.query?.page as string) || 1;
        const limit: number = parseInt(req.query?.limit as string) || 10;

        let sellPoperty = await getAllSellPropertyWithUserDetailData(page, limit) as any
        if (!sellPoperty) {
            return res.status(400).send(false);
        }
        return res.status(200).send(sellPoperty);

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong!");
    }
};
