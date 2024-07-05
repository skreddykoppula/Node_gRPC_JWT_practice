const location = require('../model/location')

module.exports.get_data = async (id) => {
    try{
        const locations = await location.findById({_id:id.id});
        return [locations]
    } catch(error){
        return res.status(401).json(error);
    }
}
