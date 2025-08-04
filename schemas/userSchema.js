const { v4: uuidv4 } = require('uuid');

const UserSchema = ({name, email, password})=> {
   return {
    TableName: 'User',
    Item: {
        id: uuidv4(),
        name,
        email,
        password,
    }
   }
}

module.exports = UserSchema;