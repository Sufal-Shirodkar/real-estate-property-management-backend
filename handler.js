    // handler.js
    exports.streamProcessor = async (event) => {
        console.log('Received DynamoDB Stream Event:', JSON.stringify(event, null, 2));

        for (const record of event.Records) {
            console.log('Event Name:', record.eventName); // INSERT, MODIFY, REMOVE
            console.log('DynamoDB Record:', JSON.stringify(record.dynamodb, null, 2));

            // You can process the data here. For example:
            if (record.eventName === 'INSERT' || record.eventName === 'MODIFY') {
                const newImage = record.dynamodb.NewImage;
                console.log('New Image:', newImage);
                // Perform actions based on new data, e.g., send to another service, update an index
            } else if (record.eventName === 'REMOVE') {
                const oldImage = record.dynamodb.OldImage;
                console.log('Old Image (deleted):', oldImage);
                // Perform actions for deleted data
            }
        }

        return { statusCode: 200, body: 'Processed stream records' };
    };