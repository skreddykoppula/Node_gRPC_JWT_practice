const express = require('express')
const connect = require('./database/connectMongo')

const grpc = require('@grpc/grpc-js');
const serviceGRPC = require('./server/location_server')

app = express();
app.use(express.json())


const server = new grpc.Server();
server.addService(serviceGRPC.definition,serviceGRPC.methods);


server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  console.log('Server running at http://0.0.0.0:50051');
  server.start();
});


;( async () => {
    try{
        await connect();
    } catch(error){
        console.log("error:",error)
    }
})();

app.get('/', (req,res) => res.send("Hello Server"));



app.listen(3000,(error) => {
    if(error) console.log(error);
    console.log("Listening to port 3000")
})