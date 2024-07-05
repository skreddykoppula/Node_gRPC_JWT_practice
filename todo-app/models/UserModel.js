const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required : true
    },
    lastName: {
        type: String,
        required : true
    },
    email: {
        type: String,
        required : true,
        allowNull: false,
        unique: true
    },
    password: {
        type: String,
        required : true
    }
})


userSchema.statics = {
    async addUser({ firstName, lastName, email, password }) {
      try {
        return await this.create({ firstName: firstName, lastName: lastName, email: email, password: password });
      } catch (error) {
        console.log("Error in adding user:", error);
      }
    },
}

module.exports = mongoose.model("users", userSchema);