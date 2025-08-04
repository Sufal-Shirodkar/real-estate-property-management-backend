const { v4: uuidv4 } = require('uuid');

const FeedbackItemSchema = ({ name, email, rating, comment }) => {
    return {
        TableName: 'Feedback',
        Item: {
            id: uuidv4(),
            name,
            email,
            rating,
            comment,
            timestamp: new Date().toISOString(),
        },
    };
};

module.exports = { FeedbackItemSchema }; 