const { v4: uuidv4 } = require('uuid');

const PropertySchema = ({name, photos, description, price, location, propertyStatus,position})=>{
    return {
        TableName: "Property",
        Item: {
            id: uuidv4(),
            name,
            description,
            photos,
            price,
            location,
            propertyStatus,
            position
        }
    }
}

module.exports = PropertySchema