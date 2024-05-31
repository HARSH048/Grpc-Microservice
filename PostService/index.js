const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync(path.join(__dirname, '../protos/post.proto'));

const postProto = grpc.loadPackageDefinition(packageDefinition);

const Post = [
    {
        id: '100',
        title: 'Engineering',
        content: 'Electronics',
        userId: '1'
    },
    {
        id: '200',
        title: 'Engineering',
        content: 'Computer Science',
        userId: '2'
    },
    {
        id: '300',
        title: 'Engineering',
        content: 'Telecommunication',
        userId: '3'
    },
];
         
function findPostById(call,callback){
    let post = Post.find((ele)=>ele.id === call.request.id)
    if(post) {
        callback(null, post);
    }
    else {
        callback({
            message: 'Post not found',
            code: grpc.status.INVALID_ARGUMENT
        });
    }
}

const server = new grpc.Server();
server.addService(postProto.Posts.service, { find: findPostById });
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Server started on port 50051');
});