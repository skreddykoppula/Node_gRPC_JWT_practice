const addressClient = require('../client/client_location');

module.exports.form_post = async (req,res) => {
    try{
        const id = req.body.id;
        console.log("id:",id);
        const address=await addressClient.getMessageData({ id: id });
        // console.log(address)
        res.send(address)
    } catch(error){
        console.log(error)
    }
    
}