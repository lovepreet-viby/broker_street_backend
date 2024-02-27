import { Request, Response } from "express";
import { createBuyPropertyDetail, updateBuyPropertyDetail, deleteBuyPropertyDetail } from "../resource/buyPropertys.resource";
import { IBuyProperty } from "../interfaces/buyProperty.interface";
import { isValidObjectId } from "mongoose";


export const createBuyProperty = async (req: Request, res: Response, next: Function) => {
    try {

        let data = req.body

        let buyPropertyObj: IBuyProperty = {
            propertyType: data.propertyType,
            district: data.district,
            taluka: data.taluka,
            audio: data.audio,
            descriptions: data.descriptions,
            userId: data.userId
        }

        let checkObject = Object.keys(buyPropertyObj).filter((o) => !(buyPropertyObj as any)[o]);
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
            taluka: data.taluka,
            audio: data.audio,
            descriptions: data.descriptions,
            userId: data.userId
        }

        let checkObject = Object.keys(buyPropertyObj).filter((o) => !(buyPropertyObj as any)[o]);
        if (checkObject.length > 0) {
            return res.status(400).send(checkObject);
        }

        const allowedPropertyTypes = ["residential", "commercial", "land/plot"];
        if (!allowedPropertyTypes.includes(buyPropertyObj.propertyType)) {
            return res.status(400).send({ "Invalid propertyType:": buyPropertyObj.propertyType });
        }

        let buyPoperty = await updateBuyPropertyDetail(data.buyPropertyId, buyPropertyObj) as any
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

        // Validate ObjectId
      

        if (!isValidObjectId(buyPropertyId)) {
            return res.status(400).send("Invalid userId");
          }


        let buyPoperty = await deleteBuyPropertyDetail(buyPropertyId) as any
        if (!buyPoperty) {
            return res.status(400).send(false);
        }
        return res.status(200).send(buyPoperty);

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

