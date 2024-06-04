import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors'; // Import the CORS package
import { Server, Socket } from 'socket.io';
import path from 'path';
import mysql from 'mysql2/promise'
// Create Express app
const app = express();
const server = http.createServer(app);
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST']
}));

const db=mysql.createPool({
    host:'localhost',
    user:'root',
    password:'9843',
    database:'quiz'
})
db.getConnection().then(connection=>{
    console.log("connection sucessfull to database")
    connection.release()
}).catch(err => {
    console.error('Unable to connect to the MySQL database:', err);
    process.exit(1); 
});
const io = new Server(server,{
    cors: {
        origin: 'http://localhost:3000', 
        methods: ['GET', 'POST']
    }
});
app.get('/', (req: Request, res: Response) => {
    res.send('/heloo')
});

io.on('connection', async(socket: Socket) => {
    console.log('client connected', socket.id);
 
    const [rows]=await db.query("SELECT id,username,profile_uri,notification_message FROM notificationchats ORDER BY id DESC")
    
    try{
        console.log('data sent')
    }catch(err){
        console.log(err)
    }
    socket.on('initial-data',()=>{
        socket.emit('initial-data-sent',{
            message:rows,
        })
    })
    socket.on('user-message', async(user:any,profile_uri:any,message: any) => {
        console.log(user,profile_uri,message);
        
        socket.broadcast.emit('server-message',{message:{
            username:user,
            profile_uri:profile_uri,
            message:message
        }})
        try{
            const [result]=await db.query('INSERT INTO notificationchats (username,profile_uri,notification_message) VALUES(?,?,?)',[user,profile_uri,message])
            console.log("message from ",user)
        }catch(err){
            console.log(err)
        }   
    });
   
});

const PORT = process.env.PORT || 8081;

interface UnreadnotificationMessages{
    unreadmessage_length:number
}
server.listen(PORT, () => {
    console.log(`server running on port: ${PORT}`);
});
