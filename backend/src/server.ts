import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
dotenv.config();

const app=express();
app.use(cors());
app.use(express.json({limit:"10mb"}));

const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY) : null;

const demoWeather={location:"Your location",temperature:28,condition:"Partly cloudy",rainProbability:35,humidity:68,wind:"12 km/h",advice:"Monitor rain before spraying."};
const demoMarkets=[
 {market:"Demo Mandi A",crop:"Tomato",price:"₹2,500/quintal",trend:"Rising",updated:"Demo data"},
 {market:"Demo Mandi B",crop:"Tomato",price:"₹2,750/quintal",trend:"Stable",updated:"Demo data"},
 {market:"Demo Mandi A",crop:"Cotton",price:"₹7,100/quintal",trend:"Stable",updated:"Demo data"}
];
const demoSchemes=[{title:"Farmer Support Scheme",description:"Demo record — verify official eligibility and benefit details.",benefit:"Support varies by scheme",documents:"Applicable ID, land and bank documents",apply:"Use the official government portal",updated:"Demo data"}];
const demoShops=[{name:"Demo Seed & Fertilizer Store",category:"Seeds / fertilizer",distance:"2.4 km"},{name:"Demo Soil Testing Center",category:"Soil testing",distance:"4.1 km"}];

app.get("/api/health",(_,res)=>res.json({ok:true,service:"Dharti Mitr AI"}));
app.get("/api/weather",(_,res)=>res.json(demoWeather));
app.get("/api/markets",(_,res)=>res.json(demoMarkets));
app.get("/api/schemes",(_,res)=>res.json(demoSchemes));
app.get("/api/shops",(_,res)=>res.json(demoShops));
app.get("/api/crops",(_,res)=>res.json([{name:"Tomato",duration:"90–120 days",water:"Moderate",risk:"Pests and disease",profit:"Estimate only"}]));
app.get("/api/dashboard",(_,res)=>res.json({weather:demoWeather,healthScore:82,actions:["Check tomato leaves for pests","Avoid spraying before rain","Monitor soil moisture","Check tomorrow's market price"]}));

app.post("/api/chat",async(req,res)=>{
  const {message,language="en"}=req.body||{};
  if(!message) return res.status(400).json({error:"Message required"});
  // Replace this block with your chosen AI provider. Secrets stay on the backend.
  const answer=`Demo agricultural guidance (${language}): Based on your question, check the crop symptoms carefully, monitor weather before spraying, and follow crop-specific recommendations. For serious crop damage, consult a qualified agricultural expert.`;
  res.json({answer});
});

app.post("/api/diagnose",(req,res)=>{
  const {imageName}=req.body||{};
  res.json({
    crop:"Tomato (initial estimate)",
    problem:"Possible leaf spot / fungal stress",
    details:{
      confidence:"Demo indication — not a medical/agricultural diagnosis",
      symptoms:"Yellow or brown spots on leaves",
      possibleCause:"Moisture and fungal pressure can contribute",
      recommendedAction:"Remove badly affected leaves and avoid unnecessary leaf wetness",
      prevention:"Improve airflow and monitor irrigation/weather",
      severity:"Moderate — verify on the actual crop",
      immediate:"Seek expert confirmation if damage is spreading",
      uploaded:imageName||"image"
    },
    disclaimer:"AI diagnosis is an initial assessment. For serious crop damage, consult a qualified agricultural expert."
  });
});

app.post("/api/profile",async(req,res)=>{
  if(!supabase) return res.json({saved:false,message:"Supabase is not configured"});
  const {data,error}=await supabase.from("profiles").upsert(req.body).select().single();
  if(error) return res.status(400).json({error:error.message});
  res.json({saved:true,data});
});

const port=Number(process.env.PORT||4000);
app.listen(port,()=>console.log(`Dharti Mitr API running on http://localhost:${port}`));
