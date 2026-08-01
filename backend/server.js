import 'dotenv/config';
import app from './src/app.js'
import connectDB from './src/config/db.js'

connectDB();

const PORT= process.env.PORT || 3000

app.listen(PORT,(req,res)=>{
console.log(`Server is runing at the http://localhost:${PORT}`)
})