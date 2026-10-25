import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express(); const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const rooms = new Map();
function publicMembers(room) { return [...(rooms.get(room)?.values() ?? [])].map(({id,name})=>({id,name})); }
io.on('connection', socket => {
  socket.on('join-room', ({room, name}) => {
    room = String(room || 'sala').slice(0,40); name = String(name || 'Convidado').slice(0,24);
    if (!rooms.has(room)) rooms.set(room, new Map());
    const members = rooms.get(room); const existing = publicMembers(room);
    socket.join(room); socket.data.room = room; socket.data.name = name;
    members.set(socket.id, {id:socket.id,name});
    socket.emit('room-state', {selfId:socket.id, members:existing, game: null});
    socket.to(room).emit('member-joined', {id:socket.id,name});
    socket.to(room).emit('signal', {from:socket.id, signal:{type:'hello'}});
    io.to(room).emit('members', publicMembers(room));
  });
  socket.on('signal', ({to,signal}) => io.to(to).emit('signal',{from:socket.id,signal}));
  socket.on('chat-message', text => { const room=socket.data.room; if(room) io.to(room).emit('chat-message',{name:socket.data.name,text:String(text).slice(0,500),at:Date.now()}); });
  socket.on('game-state', state => { const room=socket.data.room; if(room) socket.to(room).emit('game-state',state); });
  socket.on('disconnect',()=>{const room=socket.data.room;if(!room)return;rooms.get(room)?.delete(socket.id);socket.to(room).emit('member-left',{id:socket.id});io.to(room).emit('members',publicMembers(room));if(rooms.get(room)?.size===0)rooms.delete(room);});
});
app.use(express.static(path.join(__dirname,'dist')));
app.use((req,res)=>res.sendFile(path.join(__dirname,'dist','index.html')));
const port=process.env.PORT||3000; server.listen(port,'0.0.0.0',()=>console.log(`Conviva rodando na porta ${port}`));
