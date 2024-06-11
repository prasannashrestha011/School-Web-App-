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
        origin: '*', 
        methods: ['GET', 'POST']
    }
});
app.get('/', (req: Request, res: Response) => {
    res.send('/heloo')
});
var conn:number=0;
io.on('connection', async(socket: Socket) => {
    console.log('client connected', socket.id);
    conn++;
    console.log('new connection ',conn)
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
    socket.on('disconnect',(reason)=>{
        console.log('user disconnected ',socket.id)
        console.log('reason: ',reason)
    })
    socket.on('dashboard-message',async(user:string,profile_uri:string,time:string,message:string)=>{
        console.log('dashboard-message->',user,profile_uri,message)
        socket.broadcast.emit('dashboard-sent-message',{message:{
            username:user,
            profile_uri:profile_uri,
            time:time,
            message:message
        }})
        const [result]=await db.query('INSERT INTO dashboardmessage (username,profile_uri,time_uploaded,message) VALUES(?,?,?,?)',[user,profile_uri,time,message])
    })
    socket.on('terminal-help-prompt',async()=>{
        console.log('terminal help prompt called ...')
        const helpList = new Map([
            ["/http_api", 'for api'],
            ["/admin_info", 'for admin'],
            ["/clear","clear the terminal"]
        ]);
        const helpListObject = Object.fromEntries(helpList);
        socket.emit('terminal-help-prompt-message',{helplist:helpListObject})
    })
    socket.on('http-api-prompt',async()=>{
        const httpApiList=new Map([
            ["home","http://localhost:8080/get-questions"],
            ["test_scores","http://localhost:8080/get-scores"],
            ["notes","http://localhost:8080/get-pdf"]
        ])
        const httpApiListObj=Object.fromEntries(httpApiList)
        socket.emit('http-api-prompt-message',{httpApiList:httpApiListObj})
    })
    socket.on('http-invalid-prompt',async()=>{
        const httpInvalidPrompt= new Map([
            ["invalid","prompt not found"]
        ])
        const httpInvalidPromptObj=Object.fromEntries(httpInvalidPrompt)
        socket.emit('http-api-prompt-message',{httpApiList:httpInvalidPromptObj})
    })
});

const PORT = process.env.PORT || 8081;

interface UnreadnotificationMessages{
    unreadmessage_length:number
}
server.listen(PORT, () => {
    console.log(`server running on port: ${PORT}`);
});
