import express, {Request, Response} from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();
import multer from "multer";
const upload = multer({ dest: 'uploads/' })
import OpenAI from "openai";
const openai = new OpenAI({
    organization: process.env.OPENAI_ORGANISATION_ID,
    project: process.env.OPENAI_PROJECT_ID,
    apiKey: process.env.OPENAI_API_KEY
});


const app = express();
app.use(cors());
app.use(express());

app.post("/transcribe", upload.single("audioFile"), async(req:Request,res:Response)=>{
try{
    const {file} = req as any;
    fs.renameSync(file.path,file.path+".webm");
    
    const fileData = fs.createReadStream(file.path+".webm");

    const transcription = await openai.audio.transcriptions.create({
        file: fileData,
        model: "whisper-1",
      });
    
      console.log(transcription.text);

    return res.status(200).send(transcription.text)
}
catch(err){
    res.status(500).send("Internal server error!");
}
});

app.listen(process.env.PORT,()=>{
console.log(`Server start on port: ${process.env.PORT}`);
})