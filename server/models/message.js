// import mongoose from "mongoose"

// const messageSchema = new mongoose.Schema(
//     {
//         sender:String,
//         message: String,
//         timestamp: {type:Date, default: Date.now},
//     },
//     {timestamps:true}
// );
// export default mongoose.model("Message",messageSchema);
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
