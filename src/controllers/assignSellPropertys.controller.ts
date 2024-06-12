import { Request, Response } from "express";
import { IAssignSellProperty } from "../interfaces/assignSellProperty.interface";
import { isValidObjectId } from "mongoose";
import { createAssignSellPropertyDetail, updateAssignSellPropertyDetail, deleteAssignSellPropertyDetail, getUserAssignSellPropertyDetail } from "../resource/assignSellPropertys.resource";


// Function to create an assigned sell property
export const createAssignSellProperty = async (req: Request, res: Response, next: Function) => {
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



        let assignPoperty = await createAssignSellPropertyDetail(data) as any
        if (!assignPoperty) {
            return res.status(400).send(false);
        }
        return res.status(200).send(assignPoperty);

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong!");
    }
};

// Function to update an assigned sell property
export const updateAssignSellProperty = async (req: Request, res: Response, next: Function) => {
    try {

        let data = req.body

        let assignPropertyObj: IAssignSellProperty = {
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

        let assignPoperty = await updateAssignSellPropertyDetail(assignPropertyObj) as any
        if (!assignPoperty) {
            return res.status(400).send(false);
        }
        return res.status(200).send(assignPoperty);

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong!");
    }
};

// Function to delete an assigned sell property
export const deleteAssignSellProperty = async (req: Request, res: Response, next: Function) => {
    try {

        let assignId = req.query.assignId as string
        if (!assignId) {
            return res.status(400).send("assign id is required");
        }

        if (!isValidObjectId(assignId)) {
            return res.status(400).send("Invalid assignId");
        }


        let assignPoperty = await deleteAssignSellPropertyDetail(assignId) as any
        if (!assignPoperty) {
            return res.status(400).send(false);
        }
        return res.status(200).send(assignPoperty);

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong!");
    }
};

// Function to get user-specific assigned sell properties
export const getUserAssignSellProperty = async (req: Request, res: Response, next: Function) => {
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


        let buyPoperty = await getUserAssignSellPropertyDetail(userId, page, limit,searchkey) as any
        if (!buyPoperty) {
            return res.status(400).send(false);
        }
        return res.status(200).send(buyPoperty);

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong!");
    }
};
