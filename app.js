require('dotenv').config({ path: './config.env' })
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const SocketServer = require('./socketServer');
const corsOptions = {
  Credential: 'true',
  
};


const app = express();

app.use(express.json())
app.options("*" , cors(corsOptions));
app.use(cors(corsOptions));
app.use(cookieParser())


//#region // !Socket
const http = require('http').createServer(app);
const io = require('socket.io')(http);


const port = process.env.HTTP_PORT || 8080;
http.listen(port, () => {
  console.log("Listening on ", port);
});
io.on('connection', socket => {
  console.log("connection with socket is established");
    SocketServer(socket);
})

//#endregion

//#region // !Routes
app.use('/api', require('./routes/authRouter'));
app.use('/api', require('./routes/userRouter'));
app.use('/api', require('./routes/postRouter'));
app.use('/api', require('./routes/commentRouter'));
app.use('/api', require('./routes/adminRouter'));
app.use('/api', require('./routes/notifyRouter'));
app.use('/api', require('./routes/messageRouter'));
//#endregion

if(process.env.NODE_ENV==="production"){
  app.use(express.static("frontend/build"));
  const path = require("path");
//   app.use(express.static(path.join(__dirname, './my_final_project_front/build')))
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build'))
})
}
// const URI = process.env.MONGODB_URL;
const URI = process.env.DB_LOCAL_URI;
console.log("url",`${process.env.DB_LOCAL_URI}`);
console.log("port",process.env.PORT);
mongoose.connect(URI, {
  
    useNewUrlParser:true,
    useUnifiedTopology:true
}, err => {
    if(err) throw err;
    console.log("Database Connected!!")
})

app.listen(`${process.env.PORT}`,()=>console.log(`server started at ${process.env.PORT} in ${process.env.NODE_ENV}`
));