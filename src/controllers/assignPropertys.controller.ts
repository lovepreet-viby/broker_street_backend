import { Request, Response } from "express";
import { IAssignProperty } from "../interfaces/assignProperty.interface";
import { isValidObjectId } from "mongoose";
import { createAssignPropertyDetail, updateAssignPropertyDetail, deleteAssignPropertyDetail, getUserAssignPropertyDetail } from "../resource/assignPropertys.resource";

export const createAssignProperty = async (req: Request, res: Response, next: Function) => {
    try {

        let data = req.body

        const expectedKeys = ['userId', 'propertyId', 'propertyType'];
        const allowedPropertyTypes = ["residential", "commercial", "land/plot"];

        // Check for missing, empty keys or invalid propertyType
        let checkObjects = data.filter((obj: any) => {
            return (
                !expectedKeys.every((key) => obj.hasOwnProperty(key) && obj[key] !== '') ||
                !allowedPropertyTypes.includes(obj.propertyType)
            );
        });

        if (checkObjects.length > 0) {
            return res.status(400).send(checkObjects);
        }



        let assignPoperty = await createAssignPropertyDetail(data) as any
        if (!assignPoperty) {
            return res.status(400).send(false);
        }
        return res.status(200).send(assignPoperty);

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong!");
    }
};

export const updateAssignProperty = async (req: Request, res: Response, next: Function) => {
    try {

        let data = req.body

        let assignPropertyObj: IAssignProperty = {
            id: data.id,
            userId: data.userId,
            propertyId: data.propertyId,
            propertyType: data.propertyType,
        }

        let checkObject = Object.keys(assignPropertyObj).filter((o) => !(assignPropertyObj as any)[o]);
        if (checkObject.length > 0) {
            return res.status(400).send(checkObject);
        }

        const allowedPropertyTypes = ["residential", "commercial", "land/plot"];
        if (!allowedPropertyTypes.includes(assignPropertyObj.propertyType)) {
            return res.status(400).send({ "Invalid propertyType:": assignPropertyObj.propertyType });
        }

        let assignPoperty = await updateAssignPropertyDetail(assignPropertyObj) as any
        if (!assignPoperty) {
            return res.status(400).send(false);
        }
        return res.status(200).send(assignPoperty);

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong!");
    }
};

export const deleteAssignProperty = async (req: Request, res: Response, next: Function) => {
    try {

        let assignId = req.query.assignId as string
        if (!assignId) {
            return res.status(400).send("assign id is required");
        }

        if (!isValidObjectId(assignId)) {
            return res.status(400).send("Invalid assignId");
        }


        let assignPoperty = await deleteAssignPropertyDetail(assignId) as any
        if (!assignPoperty) {
            return res.status(400).send(false);
        }
        return res.status(200).send(assignPoperty);

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong!");
    }
};

export const getUserAssignProperty = async (req: Request, res: Response, next: Function) => {
    try {

        let userId = req.query.userId as string
        const page: number = parseInt(req.query?.page as string) || 1; // Default to page 1 if not specified
        const limit: number = parseInt(req.query?.limit as string) || 10; // Default page size to 10 if not specified
        const searchkey: string = req.query?.searchKey as string

        if (!userId) {
            return res.status(400).send("user id is required");
        }

        if (!isValidObjectId(userId)) {
            return res.status(400).send("Invalid userId");
        }


        let buyPoperty = await getUserAssignPropertyDetail(userId, page, limit,searchkey) as any
        if (!buyPoperty) {
            return res.status(400).send(false);
        }
        return res.status(200).send(buyPoperty);

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong!");
    }
};
