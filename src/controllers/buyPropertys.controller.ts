import { Request, Response } from "express";
import {
    createBuyPropertyDetail, updateBuyPropertyDetail,
    deleteBuyPropertyDetail, getBuyAllPropertyDetail, getBuyPropertyDetail,
    getAllUserBuyPropertyList
} from "../resource/buyPropertys.resource";
import { IBuyProperty } from "../interfaces/buyProperty.interface";
import { isValidObjectId } from "mongoose";


export const createBuyProperty = async (req: Request, res: Response, next: Function) => {
    try {

        let data = req.body

        let buyPropertyObj: IBuyProperty = {
            propertyType: data.propertyType,
            district: data.district,
            village: data.village,
            // taluka: data.taluka,
            // audio: data.audio,
            descriptions: data.descriptions,
            userId: data.userId
        }

      
        let checkObject = Object.keys(buyPropertyObj).filter((o) => o !== 'district' && !(buyPropertyObj as any)[o]);
        if (checkObject.length > 0) {
            return res.status(400).send(checkObject);
        }
        const allowedPropertyTypes = ["residential", "commercial", "land/plot"];
        if (!allowedPropertyTypes.includes(buyPropertyObj.propertyType)) {
            return res.status(400).send({ "Invalid propertyType:": buyPropertyObj.propertyType });
        }

        let buyPoperty = await createBuyPropertyDetail(buyPropertyObj) as any
        if (!buyPoperty) {
            return res.status(400).send(false);
        }
        return res.status(200).send(buyPoperty);

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong!");
    }
};




export const updateBuyProperty = async (req: Request, res: Response, next: Function) => {
    try {

        let data = req.body

        let buyPropertyObj: IBuyProperty = {
            propertyType: data.propertyType,
            district: data.district,
            village: data.village,

            // taluka: data.taluka,
            // audio: data.audio,
            descriptions: data.descriptions,
            userId: data.userId
        }


        let checkObject = Object.keys(buyPropertyObj).filter((o) => o !== 'district' && !(buyPropertyObj as any)[o]);
        if (checkObject.length > 0) {
            return res.status(400).send(checkObject);
        }

        const allowedPropertyTypes = ["residential", "commercial", "land/plot"];
        if (!allowedPropertyTypes.includes(buyPropertyObj.propertyType)) {
            return res.status(400).send({ "Invalid propertyType:": buyPropertyObj.propertyType });
        }

        let buyPoperty = await updateBuyPropertyDetail(data._id, buyPropertyObj) as any
        if (!buyPoperty) {
            return res.status(400).send(false);
        }
        return res.status(200).send(buyPoperty);

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong!");
    }
};


export const deleteBuyProperty = async (req: Request, res: Response, next: Function) => {
    try {

        let buyPropertyId = req.query.buyPropertyId as string
        if (!buyPropertyId) {
            return res.status(400).send("buyproperty id is required");
        }

        if (!isValidObjectId(buyPropertyId)) {
            return res.status(400).send("Invalid buyPropertyId");
        }

        let buyPoperty = await deleteBuyPropertyDetail(buyPropertyId) as any
        if (!buyPoperty) {
            return res.status(400).send(false);
        }
        return res.status(200).send(true);

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong!");
    }
};



export const uploadBuyPropertyDocument = async (
    req: Request,
    res: Response,
    next: Function
) => {
    try {

        if ((req as any).errorMessage) {
            return res.status(400).send((req as any).errorMessage);
        }

        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        let filePath = process.env.BASE_URL + req.file.path
        return res.status(200).send({ Message: "File upload successfully", data: filePath });

    } catch (err) {
        console.log(err);
        return res.status(500).send("Something went wrong!");
    }
};


export const getBuyAllProperty = async (req: Request, res: Response, next: Function) => {
    try {

        const page: number = parseInt(req.query?.page as string) || 1;
        const limit: number = parseInt(req.query?.limit as string) || 10;
        const userId: string = req.query?.userId as string;


        let buyPoperty = await getBuyAllPropertyDetail(page, limit ,userId) as any
        if (!buyPoperty) {
            return res.status(400).send(false);
        }
        return res.status(200).send(buyPoperty);

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong!");
    }
};

export const getBuyProperty = async (req: Request, res: Response, next: Function) => {
    try {

        const buyPropertyId: string = req.query?.buyPropertyId as string;

        if (!isValidObjectId(buyPropertyId)) {
            return res.status(400).send("Invalid propertyId");
        }

        let buyPoperty = await getBuyPropertyDetail(buyPropertyId) as any
        if (!buyPoperty) {
            return res.status(400).send(false);
        }
        return res.status(200).send(buyPoperty[0] ? buyPoperty[0] : {});

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong!");
    }
};

export const getAllUserBuyProperty = async (req: Request, res: Response, next: Function) => {
    try {

        const userId: string = req.query?.userId as string;
        const page: number = parseInt(req.query?.page as string) || 1;
        const limit: number = parseInt(req.query?.limit as string) || 10;
        // const searchkey: string = req.query?.searchkey as string

        if (!isValidObjectId(userId)) {
            return res.status(400).send("Invalid userId");
        }


        let buyPoperty = await getAllUserBuyPropertyList(page, limit, userId) as any
        if (!buyPoperty) {
            return res.status(400).send(false);
        }
        return res.status(200).send(buyPoperty);

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong!");
    }
};


