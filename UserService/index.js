const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync(path.join(__dirname, '../protos/user.proto'));

const userProto = grpc.loadPackageDefinition(packageDefinition);

const User = [
    { id: '1', email: 'user1@example.com', name: 'User One' },
    { id: '2', email: 'user2@example.com', name: 'User Two' },
    { id: '3', email: 'user3@example.com', name: 'User Three' }
  ];
         
function findUserById(call,callback){
    let user = User.find((ele)=>ele.id === call.request.id)
    if(user) {
        callback(null, user);
    }
    else {
        callback({
            message: 'User not found',
            code: grpc.status.INVALID_ARGUMENT
        });
    }
}

const server = new grpc.Server();
server.addService(userProto.Users.service, { find: findUserById });
server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), () => {
   console.log(`server started on 500052`)
});