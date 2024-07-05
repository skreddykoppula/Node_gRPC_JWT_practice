const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path')
const packageDefinition = protoLoader.loadSync(path.join(__dirname,'../proto/location_server.proto'));
const definition = grpc.loadPackageDefinition(packageDefinition);


var client = new definition.messageService("0.0.0.0:50051",grpc.credentials.createInsecure())

exports.getMessageData = async(id)=>{
    return new Promise((reslove,reject)=>{
        client.sendData(id,function(err,response){
            console.log(id)
            if (err){
                console.log(err)
                return reject(err)
            }
            console.log(response)
            return reslove(response)
        })
    })
}