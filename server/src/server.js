import app from './app.js';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

dotenv.config();

const port = process.env.PORT || 5000;

connectDB()
.then(() => {
    app.listen(port , () => {
        console.log("Server is listening on port: " , port)
    })
})
.catch((error) => {
    console.log('Server Failed during connecting Database...' , error)
})