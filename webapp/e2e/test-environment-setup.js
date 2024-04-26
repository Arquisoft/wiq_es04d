const { MongoMemoryServer } = require('mongodb-memory-server');


let mongoserver;
let userservice;
let authservice;
let historyservice;
let gatewayservice;
let questionservice;
async function startServer() {
    console.log('Starting MongoDB memory server...');
    mongoserver = await MongoMemoryServer.create();
    const mongoUri = mongoserver.getUri();
    process.env.MONGODB_URI = mongoUri;
    process.env.SECRET_KEY = 'F0f`7a@G90J{m-$4Wml@gy!cCcgUc#=K'
    console.log(process.env.MONGODB_URI)
    userservice = await require("../../users/userservice/user-service");
    authservice = await require("../../users/authservice/auth-service");
    historyservice = await require("../../users/historyservice/history-service");
    gatewayservice = await require("../../gatewayservice/gateway-service");
    questionservice = await require("../../questionservice/question-service");
  }

  startServer();
