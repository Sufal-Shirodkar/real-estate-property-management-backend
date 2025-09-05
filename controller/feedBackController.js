const feedBackController = {}
const { FeedBackModelCreate, FeedBackModelRead, FeedBackModelUpdate, FeedBackModelDelete } = require('../models/feebackModel');
const { FeedbackItemSchema } = require('../schemas/feedbackSchema');

feedBackController.create = async (req, res) => {
    try {
    //    const  parsedBody = JSON.parse(req.body.toString());
        const { name, email, rating, comment,propertyId } = req.body;

        const feedbackContent = FeedbackItemSchema({ name, email, rating, comment,propertyId });

        const response = await FeedBackModelCreate(feedbackContent)
        if (response.status === 201) {
            res.status(201).send(response)
        }else{
            res.status(response.status).send(response.message)
        }

    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }

}

feedBackController.getAllRecords = async (req, res) => {
    try {
        const { tableName } = req.params;
        const response = await FeedBackModelRead(tableName);
        if (response.status === 200) {
            res.status(200).send(response);
        } else {
            res.status(response.status).send(response.message);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};

feedBackController.updateRecord =async(req,res) =>{
    try{
        const { id } = req.query; // Get id from query parameters
        const updateData = req.body; // Get update data from request body
        const parsedBody = JSON.parse(updateData.toString())
        
        if (!id) {
            return res.status(400).send({ message: "id is required for update." });
        }
        if (Object.keys(updateData).length === 0) {
            return res.status(400).send({ message: "No update data provided." });
        }

        const response = await FeedBackModelUpdate(id, parsedBody);
        if(response.status === 200){
            res.status(200).send(response)
        }else{
            res.status(response.status).send(response.message)
        }
        
    }catch(error){
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
}

feedBackController.deleteRecord = async (req, res) => {
    try {
        const { id } = req.query; // Get id from query parameters

        if (!id) {
            return res.status(400).send({ message: "id is required for delete." });
        }

        const response = await FeedBackModelDelete(id);
        if (response.status === 200) {
            res.status(200).send(response);
        } else {
            res.status(response.status).send(response.message);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = feedBackController;
