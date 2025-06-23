const express= require('express')
const mongoose=require('mongoose')
const dotenv=require('dotenv')
const cors=require("cors")
const result=dotenv.config()

const app=express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.mongo_string,{
    useNewUrlParser:true,

    useUnifiedTopology:true
}).then(console.log("mongodb connected"))
.catch(err=>{
    console.log(`error connecting to db${err}`);
})

const vegeeschema=new mongoose.Schema({
    vegeename:String,
    vegeeprice:Number,
})

const Vegee=mongoose.model('Vegees',vegeeschema );


app.post('/vegees',async(req,res)=>{
    const newitem=new Vegee(req.body);
    await newitem.save();
    res.json(newitem);
})

app.get('/vegees',async(req,res)=>{
    const data=await Vegee.find();
    res.json(data);
})

app.put('/vegees/:id',async(req,res)=>{
    const {id}=req.params;
    const {vegeename,vegeeprice}=(req.body)
    const data=await Vegee.findByIdAndUpdate(id,{vegeename,vegeeprice},{new:true})
    res.json(data)

})

app.delete('/vegees/:id',async(req,res)=>{
    const {id}=req.params;
    const data=await Vegee.findByIdAndDelete(id);
    res.json(data)
})

app.listen(process.env.port,()=>console.log(`server running in port ${process.env.port}`))
