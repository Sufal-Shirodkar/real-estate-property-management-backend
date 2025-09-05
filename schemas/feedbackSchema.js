const { v4: uuidv4 } = require('uuid');

const FeedbackItemSchema = ({ name, email, rating, comment,propertyId }) => {
    return {
        TableName: 'Feedback',
        Item: {
            id: uuidv4(),
            propertyId,
            name,
            email,
            rating,
            comment,
            timestamp: new Date().toISOString(),
        },
    };
};

module.exports = { FeedbackItemSchema }; 