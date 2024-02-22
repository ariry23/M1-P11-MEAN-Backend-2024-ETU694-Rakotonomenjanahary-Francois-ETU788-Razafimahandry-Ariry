const preference = require('../models/preference.model');

async function getAllPreferencesClient(client){
    try {
        const preference = await preference.aggregate([
            { $addFields: { "idempl": { $toObjectId: "$idempl" }}},
            {
                $lookup: {
                    from: "users",
                    localField: "idempl",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $project:{
                    idempl: 1,
                    idserv: 1,
                    iduser: 1,
                    emplname: "$user.username",
                    prix: 1,
                    duree: 1,
                }
            },
            { $addFields: { "idServ": { $toObjectId: "$idserv" }}},
            {
                $lookup: {
                    from: "services",
                    localField: "idServ",
                    foreignField: "_id",
                    as: "serv"
                }
            },
            {
                $unwind: "$serv"
            },
            {
                $project:{
                    idempl: '$idempl',
                    idserv: '$idserv',
                    iduser: '$iduser',
                    emplname: "$emplname",
                    prix: '$prix',
                    duree: '$duree',
                }
            },
            {
                $match :{
                    idempl : client
                }
            }
        ]);
    return preference
    } catch (error) {
        throw error
    }
}