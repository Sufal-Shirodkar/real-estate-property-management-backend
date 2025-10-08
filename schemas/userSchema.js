const { v4: uuidv4 } = require('uuid');

const UserSchema = ({name, email, password,role})=> {
   return {
    TableName: 'User',
    Item: {
        id: uuidv4(),
        name,
        email,
        password,
        role
    }
   }
}

module.exports = UserSchema;