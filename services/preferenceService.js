const preference = require('../models/preference.model');

async function getAllPreferencesClient(client){
    try {
        const preferences = await preference.aggregate([
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
                    _id:1,
                    idempl: 1,
                    idserv: 1,
                    iduser: 1,
                    commission: 1,
                    emplname: "$user.username",
                    prix: 1,
                    duree: 1,
                    status: 1
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
                    _id:'$_id',
                    idempl: '$idempl',
                    idserv: '$idserv',
                    iduser: '$iduser',
                    servname:'$serv.nom',
                    commission: '$commission',
                    emplname: "$emplname",
                    prix: '$prix',
                    duree: '$duree',
                    status: '$status'
                }
            },
            {
                $match :{
                    iduser : client
                }
            }
        ]);
    return preferences
    } catch (error) {
        throw error
    }
}

async function getAllPreferences(){
    try {
        const preferences = await preference.aggregate([
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
                    _id:1,
                    idempl: 1,
                    idserv: 1,
                    iduser: 1,
                    commission: 1,
                    emplname: "$user.username",
                    prix: 1,
                    duree: 1,
                    status: 1
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
                    _id:'$_id',
                    idempl: '$idempl',
                    idserv: '$idserv',
                    iduser: '$iduser',
                    servname:'$serv.nom',
                    commission: '$commission',
                    emplname: "$emplname",
                    prix: '$prix',
                    duree: '$duree',
                    status: '$status'
                }
            },
            // {
            //     $match :{
            //         status : 'E'
            //     }
            // }
        ]);
    return preferences
    } catch (error) {
        throw error
    }
}



async function addOrUpdatePref(req, res){
    try {
        let preferences;
        let message = 'Ajout preferences avec succes';
        if(req.body._id != null){
            preferences = await preference.findOne({"_id" : req.body._id}) ; 
            preferences.duree = req.body.duree
            preferences.prix = req.body.prix ; 
            preferences.status = req.body.status ;
            preferences.idempl = req.body.idempl;
            message = 'Mise a jour succes'
        }else{
            preferences = await preference.findOne({"idserv" : req.body.idserv, "iduser": req.body.iduser}) ; 
            console.log(preferences)
            if(preferences!=null||preferences!= undefined){
                throw new Error('Service existe deja !!!');
            }
            preferences = new preference({
                iduser: req.body.iduser,
                idserv: req.body.idserv ,
                idempl: req.body.idempl,
                prix: req.body.prix,
                commission: req.body.commission,
                duree: req.body.duree,
                status: req.body.status
            });
        }
        await preferences.save() ; 
        return message;
    } catch (error) {
        throw error;
    }
}

async function getServiceById(idServ, idclient){
    try{
        const serviceExist = await Service.findOne({ idserv : idServ, iduser : idclient, status : 'V'});
        return serviceExist;
    }catch{
        throw new Error('Service not found');
    }
}

async function validPref(id, status){
    try{
        let preferences = await preference.findOne({"_id" : id}) ;
        preferences.status = status;
        await preferences.save() 
        let message = 'Validation success';
        return message;
    }catch{
        throw new Error('Service not found');
    }
}

module.exports = {
    getAllPreferencesClient,
    addOrUpdatePref,
    getServiceById,
    getAllPreferences,
    validPref
}