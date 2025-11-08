import express from 'express'
import multer from 'multer'
import File from '../models/file.js'
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req,file,cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({storage});

router.post("/upload",upload.single("file"), async (req,res)=>{
    try{
        const newFile = await File.create({
            filename: req.file.originalname,
            filepath:req.file.path,
        });
        res.json({success: true, file: newFile});
    } catch(error){
        res.status(500).json({ success: false, message:error.message});
    }
});

router.get("/",async(req,res)=>{
    try{
        const files = (await File.find()).toSorted({createdAt: -1});
        res.json(files);
    }catch(error){
        res.status(500).json({message: error.message});
    }
});

export default router;