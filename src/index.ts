import * as dotenv from 'dotenv';
import express from 'express';
import { Server } from 'typescript-rest';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connectDB } from './config/database';

// Import Controllers to register them
import './controllers/TeamController';
import './controllers/ScreenTimeController';
import './controllers/UserController'; 

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
console.log(process.env.MONGO_URI);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect Database
connectDB();

// Build Routes via typescript-rest
Server.buildServices(app);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});