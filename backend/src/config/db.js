import pg from "pg";

export const pool = new pg.Pool({
  user: "khushiashta",
  host: "localhost",
  database: "todo_app",
  password: "",
  port: 5432,
});








// import mongoose from "mongoose";

// export const connectDB = async () => {
//     try{
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log("MongoDB connected successfully");
//     } catch(error){
//         console.error("Error connecting to MONGODB", error);
//         process.exit(1) //1 for exit with failure and 0 for success
//     }
// }