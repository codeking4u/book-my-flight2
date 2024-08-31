import express from 'express';
import router from './routes/routes.js';

const app = express();
const PORT = 3000;

app.listen(PORT, () => console.log('Server started'));
app.use("/", router)