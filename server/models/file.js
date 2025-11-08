import mongoose from "mongoose";
const fileSchema = new mongoose.Schema({
    filename: {type: String, required: true},
    filepath: {type: String, required: true},
    size: {type: Number, required: true},
    uploadDate: {type: Date, default: Date.now},
});
export default mongoose.model("File", fileSchema);