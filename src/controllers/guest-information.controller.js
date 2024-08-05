const validator = require("../utils/request-validator")
const guestInfoService = require("../services/guest-information.service");
const { default: mongoose } = require("mongoose");

async function createGuestInfo(req, res, next){
    try {
        const body = req.body;
        const guestInfo = {
            firstName: body.firstName?.trim(),
            lastName: body.lastName?.trim(),
            phoneNumber: body.phoneNumber?.trim(),
            email: body.email?.trim(),
            message: body.message?.trim()
        }
        const validate = validator.validateGuestInfo(guestInfo);
        if(Object.keys(validate).length){
            const error = new Error();
            error.status = 400;
            error.message = "Bad request";
            error.error = validate;
            throw error;
        }

        const result = await guestInfoService.createGuestInfo(guestInfo);
        return res.status(200).send(result)
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function getGuestInfos(req, res, next){
    try {
        const error = new Error();
        const regex = /^\d+$/
        if(!req.query.pageSize || !regex.test(req.query.pageSize)){
            error.status=400;
            error.message="invalid page size."
            throw error;
        }

        const result = await guestInfoService.getGuestInfo(req.query.pageSize, req.query.currentPage);
        return res.status(200).send(result)
    } catch (error) {
       console.log(error);
       next(error); 
    }
}

async function deleteGuestInfo(req, res, next){
    try {
        const id = req.params.id;
        if(!id || !mongoose.isValidObjectId(id)){
            const error = new Error();
            error.status = 400;
            error.message = "Bad request.";
            error.error = {id: "invalid object id"}
            throw error
        }

        const result = await guestInfoService.deleteGuestInfoById(id);
        return res.status(201).send(result);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports = {
    createGuestInfo, 
    getGuestInfos,
    deleteGuestInfo
}