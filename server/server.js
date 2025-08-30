import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoute.js';

const app= express();
const port = process.env.PORT || 4000;
connectDB();
// This code sets up an Express server that connects to a MongoDB database and listens on a specified port.
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());
// This code imports necessary modules, sets up an Express server, and connects to a MongoDB database.
// It also configures middleware for parsing JSON and cookies.
const allowedOrigins = [
    'http://localhost:5173', // React app
    'https://your-production-domain.com' // Replace with your production domain
];
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// api end points
// This code sets up CORS middleware to allow cross-origin requests with credentials.
app.get('/', (req, res) => {
    res.send('Hello World !');
});

app.use('/api/auth',authRouter);

app.listen(port, () => {    
    console.log(`Server is running on port ${port}`);
});