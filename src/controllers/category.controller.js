const { default: mongoose } = require("mongoose");
const categoryService = require("../services/category.service")

async function createCategory(req, res, next){
    console.log(req.body)
    try {
        if(!req.body?.name){
            return res.status(400).json({message: "category name is missing"})
        }
        const result = await categoryService.createCategory({name: req.body.name});
        return res.status(201).send(result);
    } catch (error) {
        console.log(error)
        next(error)
    }
}

async function getCategories(req, res, next){
    try {
        const error = new Error();
        const regex = /^\d+$/
        if(!req.query.pageSize || !regex.test(req.query.pageSize)){
            error.status=400;
            error.message="invalid page size."
            throw error;
        }

        const result = await categoryService.getCategories(req.query.pageSize, req.query.currentPage);
        return res.status(200).send(result)
    } catch (error) {
       console.log(error);
       next(error); 
    }
}

async function updateCategory(req, res ,next){
    try{
        const error = new Error()
        if(!mongoose.isValidObjectId(req.params.id)){
            error.status = 400;
            error.message = "invalid object id."
            throw error
        }
        if(!req.body.name?.trim()){
            error.status = 400;
            error.message = "Category name cannot be empty."
            throw error
        }

        const category = { name: req.body.name };
        const result = await categoryService.updateCategory(req.params.id, category);

        if(!result){
            error.status = 400;
            error.message = "object does not exist";
            throw error;
        }

        return res.status(201).send(result);
    }catch(error){
        console.log(error);
        next(error);
    }
}

async function deleteCategory(req, res, next){
    try {
        const error = new Error()
        if(!mongoose.isValidObjectId(req.params.id)){
            error.status = 400;
            error.message = "invalid object id."
            throw error
        }
        const result = await categoryService.deleteCategory(req.params.id);
        if(!result){
            return res.status(200).json({"message": "Category id not found"})
        }
        return res.status(201).send(result);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports = {
    createCategory,
    getCategories,
    updateCategory, 
    deleteCategory
}
