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
const governmentSchemes=[
 {title:"PM-KISAN",description:"Income support for eligible landholding farmer families through direct benefit transfer.",benefit:"Up to ₹6,000 per year, paid in three instalments of ₹2,000.",eligibility:"Eligible landholding farmer families, subject to government exclusions and verification.",documents:"Aadhaar, mobile number, bank account details and land records.",applicationSteps:["Open the official PM-KISAN portal","Choose New Farmer Registration","Verify Aadhaar and enter land and bank details","Submit and save the registration number"],officialUrl:"https://pmkisan.gov.in/",updated:"Official portal"},
 {title:"Pradhan Mantri Fasal Bima Yojana",description:"Crop insurance protection against notified natural risks, pests and diseases.",benefit:"Financial support for eligible crop losses; premium rates and coverage depend on the notified crop and season.",eligibility:"Farmers growing notified crops in notified areas, including sharecroppers and tenant farmers where applicable.",documents:"Aadhaar, land or tenancy proof, bank details and sowing declaration.",applicationSteps:["Open the official PMFBY portal","Select your state, season and crop","Review the notified premium and coverage","Apply through the available insurer, bank or CSC channel"],officialUrl:"https://pmfby.gov.in/",updated:"Official portal"},
 {title:"Kisan Credit Card",description:"Flexible short-term credit for cultivation, post-harvest needs and allied agricultural activities.",benefit:"Access timely agricultural credit; interest support and limits depend on eligibility, bank rules and government directions.",eligibility:"Farmers, tenant farmers, sharecroppers, self-help groups and joint liability groups involved in farming or allied activities.",documents:"Identity and address proof, land or cultivation proof, photographs and bank-required documents.",applicationSteps:["Open the official scheme information page","Check eligibility and required documents","Apply through a participating bank branch or its digital channel","Complete bank verification and credit assessment"],officialUrl:"https://www.myscheme.gov.in/schemes/kcc",updated:"Official portal"},
 {title:"Soil Health Card",description:"Soil testing and nutrient recommendations to help farmers use fertiliser more efficiently.",benefit:"A soil health report with nutrient status and crop-specific fertiliser recommendations.",eligibility:"Farmers can use the government soil testing service as available through their state or district centre.",documents:"Farmer details, land or plot information and a soil sample as instructed by the centre.",applicationSteps:["Open the Soil Health portal","Find a nearby soil testing centre or service","Submit the soil sample and plot details","Collect the report and follow the recommended dosage"],officialUrl:"https://soilhealth.dac.gov.in/",updated:"Official portal"},
 {title:"PM-KUSUM",description:"Support for solar pumps and decentralised solar energy for farmers, subject to state implementation.",benefit:"Subsidy or financial support for eligible solar pumps and renewable energy installations; amount varies by component and state.",eligibility:"Eligibility, component availability and application windows are determined by the state implementing agency.",documents:"Aadhaar, land ownership or cultivation proof, bank details and electricity or pump documents where required.",applicationSteps:["Open the official PM-KUSUM portal","Check your state implementing agency and active component","Review subsidy, contribution and vendor details","Apply through the state portal or authorised agency"],officialUrl:"https://pmkusum.mnre.gov.in/",updated:"Official portal"}
];
const demoShops=[{name:"Demo Seed & Fertilizer Store",category:"Seeds / fertilizer",distance:"2.4 km"},{name:"Demo Soil Testing Center",category:"Soil testing",distance:"4.1 km"}];

app.get("/api/health",(_,res)=>res.json({ok:true,service:"Dharti Mitr AI"}));
app.get("/api/weather",(_,res)=>res.json(demoWeather));
app.get("/api/markets",(_,res)=>res.json(demoMarkets));
app.get("/api/schemes",(_,res)=>res.json(governmentSchemes));
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
