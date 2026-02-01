import express from "express";
import cors from "cors";
const app = express();
const PORT=4000;
app.use(cors());

// app.get("/getcheck",(req,res)=>{
// console.log("Hello from backend");
// res.send("Hello from backend");
// })

// app.post("/postcheck",(req,res)=>{
//     console.log("Post request received");
//     res.send("Post request received");
// });

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});