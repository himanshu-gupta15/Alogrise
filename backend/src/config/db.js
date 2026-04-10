import mongoose from "mongoose";

const main =async()=>{
    await mongoose.connect(process.env.DB_CONNECT_STRING)
}
export default main