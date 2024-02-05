const  Service = require('../models/service.model');

async function getServiceById(idServ){
    try{
        const serviceExist = await Service.findOne({ _id : idServ});
        return serviceExist;
    }catch{
        throw new Error('Service not found');
    }
}

module.exports = {
    getServiceById
}
