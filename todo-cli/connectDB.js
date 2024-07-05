require('dotenv').config();

const mongoose = require("mongoose");
const connect=async ()=>{
    await mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true, useUnifiedTopology:true})
.then(()=>{
    console.log("Connection has been established successfully.");
})
.catch((error)=>{
    console.error("Unable to connect to the database:", error);
});
}



module.exports = connect,mongoose