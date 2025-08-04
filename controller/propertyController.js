    require('dotenv').config();

const { PropertyModelCreate, PropertyModelUploadPhotos, PropertyModelRead, PropertyModelReadById } = require("../models/propertyModel")
const PropertySchema = require("../schemas/propertySchema")

const propertyController = {}

propertyController.create = async (req, res) => {
    try {
        const parsedBody = JSON.parse((req.body).toString())
        const { name,photos, description, price ,location, propertyStatus} = parsedBody
        const propertyContent = PropertySchema({ name,photos, description, price ,location, propertyStatus})
        const response = await PropertyModelCreate(propertyContent)
        if(response.status === 201){
            res.status(201).send(response)
        }else{
            res.status(response.status).send(response.message)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
}

propertyController.uploadPhotos = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                status: 400,
                message: "No files uploaded"
            });
        }

        // Upload each file to S3
        const uploadPromises = req.files.map(async (file, index) => {
            // Validate file
            if (!file.buffer || file.buffer.length === 0) {
                throw new Error(`File ${index} has no content`);
            }

            const uploadParams = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: `property-photos/${Date.now()}-${index}-${file.originalname}`,
                Body: file.buffer, // Use original buffer directly
                ContentType: file.mimetype || "image/jpeg"
            };
            
            return await PropertyModelUploadPhotos(uploadParams);
        });


        const uploadResults = await Promise.all(uploadPromises);
        
        // Check if all uploads were successful
        const failedUploads = uploadResults.filter(result => result.status !== 201);
        
        if (failedUploads.length > 0) {
            return res.status(500).json({
                status: 500,
                message: "Some uploads failed",
                failedCount: failedUploads.length,
                totalCount: uploadResults.length,
                errors: failedUploads.map(f => f.error)
            });
        }

        // Extract the URLs from successful uploads
        const photoUrls = uploadResults.map(result => result.data.Location);

        res.status(201).json({
            status: 201,
            message: "Photos uploaded successfully",
            photoUrls: photoUrls,
            uploadCount: uploadResults.length
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

propertyController.listAll = async (req, res) => {
    try {
        const response = await PropertyModelRead()
        if(response.status === 200){
            res.status(200).send(response)
        }else{
            res.status(response.status).send(response.message)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
}

propertyController.getById = async (req, res) => {
    try {
        if(!req.params.id){
            return res.status(400).json({
                status: 400,
                message: "Property ID is required",
                data:null
            })
        }
        const response = await PropertyModelReadById(req.params.id)
        if(response.status === 200){
            res.status(response.status).send(response)
        }else{
            res.status(response.status).send(response.message)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
}

module.exports = propertyController