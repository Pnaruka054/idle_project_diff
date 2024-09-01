require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
const Routes = require('./routes/routes');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: 'https://idle-project-diff-client.onrender.com', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

app.use(express.json());
app.use(Routes);

const io = socketIo(server, {
    cors: {
        origin: 'https://idle-project-diff-client.onrender.com', 
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type']
    }
});

let activeUsers = 0;

io.on('connection', (socket) => {
    activeUsers++;
    io.emit('activeUsers', activeUsers);

    socket.on('disconnect', () => {
        activeUsers--;
        io.emit('activeUsers', activeUsers);
    });
});

async function dataBase_connection() {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
    }
}
dataBase_connection();

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server started on port - ${PORT}`);
});
