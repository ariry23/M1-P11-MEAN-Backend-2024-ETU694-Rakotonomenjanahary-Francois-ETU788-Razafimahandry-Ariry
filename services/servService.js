const  Service = require('../models/service.model');

async function getServiceById(idServ){
    try{
        const serviceExist = await Service.findOne({ _id : idServ});
        return serviceExist;
    }catch{
        throw new Error('Service not found');
    }
}
async function getResaByClient(vidclient){
    try {
        const historique = await Service.aggregate([
            { $addFields: { "idserv": { $toObjectId: "$idserv" }}},
            {
                $lookup: {
                    from: "reservations",
                    localField: "_id",
                    foreignField: "idserv",
                    as: "resa"
                }
            },
            {
                $unwind: "$resa"
            },
            {
                $project: {
                    _id: 1, 
                    idserv: '$reservations.idserv',

                }
            }
        ])
        return historique;
    } catch (error) {
        throw error;
    }
}
module.exports = {
    getServiceById,
    getResaByClient
}
