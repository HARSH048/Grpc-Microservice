const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const express = require('express');

const packageDefinitionRecPost = protoLoader.loadSync(path.join(__dirname, '../protos/post.proto'));
const packageDefinitionRecUser = protoLoader.loadSync(path.join(__dirname, '../protos/user.proto'));

const postProto = grpc.loadPackageDefinition(packageDefinitionRecPost);
const userProto = grpc.loadPackageDefinition(packageDefinitionRecUser);


const postProcessingStub = new postProto.Posts('0.0.0.0:50051', grpc.credentials.createInsecure());
                       
const userProcessingStub = new userProto.Users('0.0.0.0:50052',grpc.credentials.createInsecure());
                        
const app = express();
app.use(express.json());

const port = 3000;

async function asyncUser(userId){
    return new Promise((resolve, reject) => {
        userProcessingStub.find({id: userId}, (err, user) => {
            if(err) {
                reject(err);
            } else {
                resolve(user);
            }
        });
    });
}

app.get('/user/:id', async (req, res) => {
    if(!req.params.id) {
        res.status(400).send('User ID not provided');
        return;
    }

    const userId = req.params.id;
    try {
        const obj = await asyncUser(userId);
        console.log("obj------------>", obj);
        res.send(obj);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.listen(port, () => {
    console.log(`API is listening on port ${port}`)
  });

                        

                            