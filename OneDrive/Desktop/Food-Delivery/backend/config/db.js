import mongoose from "mongoose";

export const connectDB=async()=>{
  await mongoose.connect('mongodb+srv://biswasuttam0911:0911@cluster0.zb4xdlp.mongodb.net/food-del').then(()=>console.log("Db connected"));
}