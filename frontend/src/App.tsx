import { useEffect, useMemo, useState } from "react";
import {
  Bell, Bot, CalendarDays, Camera, ChevronRight, CircleUserRound, CloudRain,
  Droplets, Home, Leaf, MapPin, Menu, Mic, Play, ScanLine, Search, Settings,
  Sprout, Store, Tractor, TrendingUp, Volume2, Wallet, Wheat, X, Languages
} from "lucide-react";
import { supabase } from "./lib/supabase";
import { api } from "./lib/api";

type Lang = { code: string; native: string; name: string };
const languages: Lang[] = [
  {code:"en",native:"English",name:"English"},{code:"hi",native:"हिंदी",name:"Hindi"},
  {code:"kn",native:"ಕನ್ನಡ",name:"Kannada"},{code:"te",native:"తెలుగు",name:"Telugu"},
  {code:"ta",native:"தமிழ்",name:"Tamil"},{code:"mr",native:"मराठी",name:"Marathi"},
  {code:"bn",native:"বাংলা",name:"Bengali"},{code:"gu",native:"ગુજરાતી",name:"Gujarati"},
  {code:"pa",native:"ਪੰਜਾਬੀ",name:"Punjabi"},{code:"ml",native:"മലയാളം",name:"Malayalam"},
  {code:"ur",native:"اردو",name:"Urdu"}
];

const copy: Record<string, Record<string,string>> = {
  en:{welcome:"Welcome to Dharti Mitr AI",tag:"Your Smart Farming Friend",start:"Get Started",login:"Login",create:"Create Account",mobile:"Mobile / Username",password:"Password",home:"Home",assistant:"AI Assistant",crops:"My Crops",alerts:"Alerts",profile:"Profile",scan:"Scan My Crop",weather:"Weather",market:"Market Prices",schemes:"Government Schemes",shops:"Nearby Shops",advisor:"Crop Advisor",profit:"Profit Calculator",calendar:"Farming Calendar",reminders:"Reminders",ask:"Ask Dharti Mitr",speak:"Speak",listen:"Listen",send:"Send",actions:"Today's Farming Actions"},
  hi:{welcome:"धर्ति मित्र AI में आपका स्वागत है",tag:"आपका स्मार्ट खेती साथी",start:"शुरू करें",login:"लॉगिन",create:"खाता बनाएं",mobile:"मोबाइल / यूज़रनेम",password:"पासवर्ड",home:"होम",assistant:"AI सहायक",crops:"मेरी फसलें",alerts:"अलर्ट",profile:"प्रोफ़ाइल",scan:"फसल स्कैन करें",weather:"मौसम",market:"बाज़ार भाव",schemes:"सरकारी योजनाएं",shops:"पास की दुकानें",advisor:"फसल सलाहकार",profit:"लाभ कैलकुलेटर",calendar:"खेती कैलेंडर",reminders:"रिमाइंडर",ask:"धर्ति मित्र से पूछें",speak:"बोलें",listen:"सुनें",send:"भेजें",actions:"आज के खेती के काम"},
  kn:{welcome:"ಧರ್ತಿ ಮಿತ್ರ AI ಗೆ ಸ್ವಾಗತ",tag:"ನಿಮ್ಮ ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಸ್ನೇಹಿತ",start:"ಪ್ರಾರಂಭಿಸಿ",login:"ಲಾಗಿನ್",create:"ಖಾತೆ ರಚಿಸಿ",mobile:"ಮೊಬೈಲ್ / ಬಳಕೆದಾರ ಹೆಸರು",password:"ಪಾಸ್‌ವರ್ಡ್",home:"ಮುಖಪುಟ",assistant:"AI ಸಹಾಯಕ",crops:"ನನ್ನ ಬೆಳೆಗಳು",alerts:"ಎಚ್ಚರಿಕೆಗಳು",profile:"ಪ್ರೊಫೈಲ್",scan:"ನನ್ನ ಬೆಳೆಯನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",weather:"ಹವಾಮಾನ",market:"ಮಾರುಕಟ್ಟೆ ಬೆಲೆ",schemes:"ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",shops:"ಹತ್ತಿರದ ಅಂಗಡಿಗಳು",advisor:"ಬೆಳೆ ಸಲಹೆಗಾರ",profit:"ಲಾಭ ಕ್ಯಾಲ್ಕುಲೇಟರ್",calendar:"ಕೃಷಿ ಕ್ಯಾಲೆಂಡರ್",reminders:"ಜ್ಞಾಪನೆಗಳು",ask:"ಧರ್ತಿ ಮಿತ್ರನನ್ನು ಕೇಳಿ",speak:"ಮಾತನಾಡಿ",listen:"ಕೇಳಿ",send:"ಕಳುಹಿಸಿ",actions:"ಇಂದಿನ ಕೃಷಿ ಕೆಲಸಗಳು"}
};
const t = (lang:string,key:string) => copy[lang]?.[key] || copy.en[key] || key;

type Page = "home"|"assistant"|"scan"|"weather"|"market"|"schemes"|"shops"|"advisor"|"profit"|"calendar"|"reminders"|"crops"|"alerts"|"profile";

function LanguageScreen({onSelect}:{onSelect:(l:Lang)=>void}) {
  return <div className="min-h-screen bg-gradient-to-br from-[#eaf5df] via-[#f8f5e9] to-[#d8ead2] flex items-center justify-center p-5">
    <div className="w-full max-w-5xl">
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 h-16 w-16 rounded-3xl bg-leaf text-white flex items-center justify-center"><Leaf size={34}/></div>
        <h1 className="text-4xl md:text-5xl font-black text-ink">{copy.en.welcome}</h1>
        <p className="mt-2 text-lg text-earth font-semibold">{copy.en.tag}</p>
        <p className="mt-4 text-sm text-gray-600">Choose your comfortable language</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {languages.map(l=><button key={l.code} onClick={()=>onSelect(l)} className="card p-5 text-left hover:border-leaf hover:shadow-lg transition">
          <div className="text-2xl font-black">{l.native}</div><div className="text-sm text-gray-600 mt-1">{l.name}</div>
        </button>)}
      </div>
    </div>
  </div>
}

function Auth({lang,onDone}:{lang:Lang,onDone:()=>void}) {
  const [mode,setMode]=useState<"login"|"create">("login");
  const [identifier,setIdentifier]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState("");
  async function submit(e:React.FormEvent){e.preventDefault();setError("");
    try {
      // Demo-friendly: use local login until real Supabase credentials are configured.
      const supabaseConfigured = Boolean(
        import.meta.env.VITE_SUPABASE_URL &&
        import.meta.env.VITE_SUPABASE_ANON_KEY &&
        !import.meta.env.VITE_SUPABASE_URL.includes("YOUR_PROJECT") &&
        !import.meta.env.VITE_SUPABASE_ANON_KEY.includes("YOUR_SUPABASE")
      );
      if (!supabaseConfigured) { localStorage.setItem("demoUser", identifier||"Farmer"); onDone(); return; }
      const email = identifier.includes("@") ? identifier : `${identifier.replace(/\D/g,"")}@dhartimitr.local`;
      if(mode==="login"){ const {error}=await supabase.auth.signInWithPassword({email,password}); if(error) throw error; }
      else { const {error}=await supabase.auth.signUp({email,password,options:{data:{display_name:identifier,preferred_language:lang.code}}}); if(error) throw error; }
      onDone();
    } catch(err:any){ setError(err.message || "Unable to continue"); }
  }
  return <div className="min-h-screen bg-cream flex items-center justify-center p-5">
    <form onSubmit={submit} className="card w-full max-w-md p-7">
      <div className="h-14 w-14 rounded-2xl bg-leaf text-white flex items-center justify-center mb-5"><Sprout/></div>
      <h1 className="text-3xl font-black">{mode==="login"?t(lang.code,"login"):t(lang.code,"create")}</h1>
      <p className="text-gray-600 mt-2">{lang.native} · Dharti Mitr AI</p>
      <label className="block mt-6 text-sm font-bold">{t(lang.code,"mobile")}</label>
      <input value={identifier} onChange={e=>setIdentifier(e.target.value)} required className="w-full mt-2 p-4 rounded-2xl border bg-white" placeholder="+91 98765 43210"/>
      <label className="block mt-4 text-sm font-bold">{t(lang.code,"password")}</label>
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} className="w-full mt-2 p-4 rounded-2xl border"/>
      {error && <div className="mt-3 p-3 rounded-xl bg-red-50 text-red-700 text-sm">{error}</div>}
      <button className="big-btn bg-leaf text-white w-full mt-6">{mode==="login"?t(lang.code,"login"):t(lang.code,"create")} <ChevronRight size={20}/></button>
      <button type="button" onClick={()=>setMode(mode==="login"?"create":"login")} className="w-full mt-4 p-3 font-bold text-leaf">{mode==="login"?t(lang.code,"create"):t(lang.code,"login")}</button>
    </form>
  </div>
}

function Layout({lang,page,setPage,children}:{lang:Lang,page:Page,setPage:(p:Page)=>void,children:React.ReactNode}) {
  const nav:[Page,string,any][] = [["home","home",Home],["assistant","assistant",Bot],["crops","crops",Sprout],["alerts","alerts",Bell],["profile","profile",CircleUserRound]];
  const side:[Page,string,any][] = [["home","home",Home],["assistant","assistant",Bot],["scan","scan",ScanLine],["weather","weather",CloudRain],["market","market",TrendingUp],["schemes","schemes",Wheat],["shops","shops",Store],["advisor","advisor",Tractor],["profit","profit",Wallet],["calendar","calendar",CalendarDays],["reminders","reminders",Bell],["crops","crops",Sprout],["profile","profile",CircleUserRound]];
  return <div className="min-h-screen bg-cream flex">
    <aside className="hidden lg:flex w-64 bg-white border-r p-4 flex-col sticky top-0 h-screen">
      <button onClick={()=>setPage("home")} className="flex items-center gap-3 p-3 mb-5"><span className="h-11 w-11 rounded-2xl bg-leaf text-white flex items-center justify-center"><Leaf/></span><span className="font-black text-xl">Dharti Mitr</span></button>
      <div className="space-y-1 overflow-auto">{side.map(([id,key,Icon])=><button key={id} onClick={()=>setPage(id)} className={`w-full p-3 rounded-xl flex items-center gap-3 text-left font-semibold ${page===id?"bg-[#e8f4e7] text-leaf":"hover:bg-gray-50"}`}><Icon size={19}/>{t(lang.code,key)}</button>)}</div>
    </aside>
    <main className="flex-1 pb-24 lg:pb-8">
      <header className="sticky top-0 z-10 bg-cream/90 backdrop-blur border-b border-black/5 px-4 md:px-7 py-3 flex items-center justify-between">
        <div><div className="text-xs text-gray-500">{lang.native}</div><div className="font-black">Dharti Mitr AI</div></div>
        <div className="flex items-center gap-2"><button className="p-3 rounded-xl bg-white"><Bell size={20}/></button><button className="p-3 rounded-xl bg-white" onClick={()=>setPage("profile")}><CircleUserRound size={20}/></button></div>
      </header>
      <div className="p-4 md:p-7 max-w-7xl mx-auto">{children}</div>
    </main>
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-white border-t p-2 grid grid-cols-5">{nav.map(([id,key,Icon])=><button key={id} onClick={()=>setPage(id)} className={`py-2 text-xs font-bold flex flex-col items-center gap-1 ${page===id?"text-leaf":"text-gray-500"}`}><Icon size={21}/>{t(lang.code,key)}</button>)}</nav>
  </div>
}

function Dashboard({lang,setPage}:{lang:Lang,setPage:(p:Page)=>void}) {
  const [weather,setWeather]=useState<any>(null);
  useEffect(()=>{api.weather().then(setWeather).catch(()=>{});},[]);
  const cards:[Page,string,any,string][] = [
    ["assistant","assistant",Bot,"Ask farming questions with text or voice"],
    ["scan","scan",ScanLine,"Take a photo of your crop"],
    ["weather","weather",CloudRain,"Smart weather advice"],
    ["market","market",TrendingUp,"Compare crop prices"],
    ["schemes","schemes",Wheat,"Understand farmer schemes"],
    ["shops","shops",Store,"Find agricultural services"],
    ["advisor","advisor",Tractor,"Choose a suitable crop"],
    ["profit","profit",Wallet,"Estimate farm profit"]
  ];
  return <div>
    <section className="rounded-[2rem] p-6 md:p-8 bg-gradient-to-r from-[#1f7a45] to-[#4d9c55] text-white shadow-soft">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div><div className="text-white/75 font-semibold">Namaste, Farmer 👋</div><h1 className="text-3xl md:text-4xl font-black mt-1">What can Dharti Mitr do for you today?</h1><p className="mt-3 text-white/85">Ask. Listen. Learn. Grow.</p></div>
        <div className="bg-white/15 rounded-3xl p-5 min-w-[230px]"><div className="flex items-center gap-2"><MapPin size={18}/> Your location</div><div className="text-3xl font-black mt-2">{weather?.temperature ?? 28}°C</div><div className="text-white/80">{weather?.condition ?? "Partly cloudy"} · Rain {weather?.rainProbability ?? 35}%</div></div>
      </div>
    </section>
    <section className="card mt-5 p-5"><div className="flex items-center gap-3"><Bell className="text-leaf"/><div><div className="font-black">Smart Farming Alert</div><div className="text-gray-600 text-sm">Rain may arrive tomorrow. Consider postponing pesticide spraying.</div></div></div></section>
    <div className="flex items-center justify-between mt-7 mb-3"><h2 className="text-2xl font-black">{t(lang.code,"actions")}</h2><span className="text-sm text-gray-500">Personalized</span></div>
    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
      {["Check tomato leaves for pests","Avoid spraying before rain","Monitor soil moisture","Check tomorrow's market price"].map((x,i)=><div className="card p-4" key={i}><div className="h-10 w-10 rounded-xl bg-[#e8f4e7] text-leaf flex items-center justify-center font-black">{i+1}</div><p className="mt-3 font-semibold">{x}</p></div>)}
    </div>
    <h2 className="text-2xl font-black mb-3">Everything you need</h2>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{cards.map(([id,key,Icon,desc])=><button onClick={()=>setPage(id)} key={id} className="card p-5 text-left hover:-translate-y-1 transition"><div className="h-12 w-12 rounded-2xl bg-[#e8f4e7] text-leaf flex items-center justify-center"><Icon/></div><h3 className="font-black mt-4">{t(lang.code,key)}</h3><p className="text-sm text-gray-600 mt-1">{desc}</p></button>)}</div>
    <div className="card mt-5 p-5"><div className="flex justify-between items-center"><div><div className="font-black">Farm Health Score</div><p className="text-sm text-gray-600">Based on crop, irrigation, weather, pest and soil indicators.</p></div><div className="text-3xl font-black text-leaf">82<span className="text-base text-gray-400">/100</span></div></div><div className="h-3 bg-gray-100 rounded-full mt-4 overflow-hidden"><div className="h-full bg-leaf rounded-full w-[82%]"/></div></div>
  </div>
}

function Assistant({lang}:{lang:Lang}) {
  const [messages,setMessages]=useState<{role:string,text:string}[]>([{role:"ai",text:"Namaste! Tell me about your crop. You can type or use the microphone."}]);
  const [input,setInput]=useState(""); const [listening,setListening]=useState(false);
  const speak=(text:string)=>{ if("speechSynthesis" in window){const u=new SpeechSynthesisUtterance(text); u.lang=lang.code==="kn"?"kn-IN":lang.code==="hi"?"hi-IN":"en-IN"; speechSynthesis.speak(u);} };
  function voice(){const SR=(window as any).SpeechRecognition||(window as any).webkitSpeechRecognition;if(!SR){alert("Voice input is not supported in this browser.");return;}const r=new SR();r.lang=lang.code==="kn"?"kn-IN":lang.code==="hi"?"hi-IN":"en-IN";r.onstart=()=>setListening(true);r.onend=()=>setListening(false);r.onresult=(e:any)=>setInput(e.results[0][0].transcript);r.start();}
  async function send(){if(!input.trim())return;const q=input;setInput("");setMessages(m=>[...m,{role:"user",text:q}]);try{const d=await api.chat(q,lang.code);setMessages(m=>[...m,{role:"ai",text:d.answer}]);}catch{setMessages(m=>[...m,{role:"ai",text:"I couldn't connect right now. Please try again."}]);}}
  return <div className="max-w-4xl mx-auto"><h1 className="text-3xl font-black">{t(lang.code,"assistant")}</h1><p className="text-gray-600 mt-1">Talk to Dharti Mitr in your language.</p>
    <div className="card mt-5 p-4 min-h-[520px] flex flex-col"><div className="flex-1 space-y-4 overflow-auto">{messages.map((m,i)=><div key={i} className={`flex ${m.role==="user"?"justify-end":""}`}><div className={`max-w-[85%] rounded-3xl p-4 ${m.role==="user"?"bg-leaf text-white":"bg-[#edf5e9]"}`}><div>{m.text}</div>{m.role==="ai"&&<button onClick={()=>speak(m.text)} className="mt-3 text-xs font-bold flex items-center gap-1"><Volume2 size={15}/> {t(lang.code,"listen")}</button>}</div></div>)}</div>
      <div className="flex gap-2 mt-4"><button onClick={voice} className={`h-14 w-14 rounded-2xl flex items-center justify-center ${listening?"bg-red-500 text-white":"bg-[#e8f4e7] text-leaf"}`}><Mic/></button><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} className="flex-1 rounded-2xl border px-4" placeholder={t(lang.code,"ask")}/><button onClick={send} className="px-5 rounded-2xl bg-leaf text-white font-black">{t(lang.code,"send")}</button></div>
    </div>
  </div>
}

function Scan(){const [file,setFile]=useState<File|null>(null);const [result,setResult]=useState<any>(null);const [loading,setLoading]=useState(false);
  async function analyze(){if(!file)return;setLoading(true);try{setResult(await api.diagnosis(file.name));}finally{setLoading(false);}}
  return <div className="max-w-3xl mx-auto"><h1 className="text-3xl font-black">Scan My Crop</h1><p className="text-gray-600">Take or upload a photo of a leaf, fruit, stem or whole plant.</p>
    <div className="card mt-5 p-7 border-dashed border-2"><div className="h-20 w-20 rounded-3xl bg-[#e8f4e7] text-leaf flex items-center justify-center mx-auto"><Camera size={36}/></div>
      <input type="file" accept="image/*" capture="environment" onChange={e=>setFile(e.target.files?.[0]||null)} className="block mx-auto mt-5"/>
      {file&&<p className="text-center mt-3 font-semibold">{file.name}</p>}
      <button disabled={!file||loading} onClick={analyze} className="big-btn bg-leaf text-white mx-auto mt-5 disabled:opacity-40">{loading?"Analyzing…":"Analyze Crop"}</button>
    </div>
    {result&&<div className="card mt-5 p-6"><h2 className="text-xl font-black">{result.crop} · {result.problem}</h2><div className="mt-4 grid md:grid-cols-2 gap-3">{Object.entries(result.details).map(([k,v])=><div key={k} className="rounded-2xl bg-[#f5f7ef] p-4"><div className="text-xs uppercase text-gray-500 font-bold">{k}</div><div className="font-semibold mt-1">{String(v)}</div></div>)}</div><p className="text-xs text-gray-500 mt-5">{result.disclaimer}</p></div>}
  </div>
}

function DataPage({title,items}:{title:string,items:any[]}){return <div><h1 className="text-3xl font-black">{title}</h1><div className="grid md:grid-cols-2 gap-4 mt-5">{items.map((x,i)=><div className="card p-5" key={i}><h2 className="font-black text-xl">{x.name||x.market||x.title}</h2><p className="text-gray-600 mt-1">{x.description||x.crop||x.category||x.condition}</p><div className="mt-4 grid grid-cols-2 gap-2">{Object.entries(x).filter(([k])=>!["name","market","title","description","crop","category","condition"].includes(k)).map(([k,v])=><div className="bg-[#f5f7ef] rounded-xl p-3" key={k}><div className="text-xs text-gray-500 uppercase">{k}</div><div className="font-bold">{String(v)}</div></div>)}</div></div>)}</div></div>}

function Profit(){const [v,setV]=useState({land:1,seed:3000,fert:5000,input:3000,labor:6000,irrigation:2000,other:1000,yield:20,price:2500});const total=Object.values(v).slice(1,8).reduce((a,b)=>a+Number(b),0);const revenue=Number(v.yield)*Number(v.land)*Number(v.price);return <div className="max-w-3xl"><h1 className="text-3xl font-black">Farm Profit Calculator</h1><div className="card p-6 mt-5 grid md:grid-cols-2 gap-4">{Object.entries(v).map(([k,val])=><label className="font-semibold capitalize" key={k}>{k}<input type="number" value={val} onChange={e=>setV({...v,[k]:Number(e.target.value)})} className="mt-1 w-full p-3 rounded-xl border"/></label>)}</div><div className="grid md:grid-cols-3 gap-4 mt-5"><div className="card p-5"><div className="text-sm">Total Investment</div><div className="text-2xl font-black">₹{total.toLocaleString()}</div></div><div className="card p-5"><div className="text-sm">Expected Revenue</div><div className="text-2xl font-black">₹{revenue.toLocaleString()}</div></div><div className="card p-5"><div className="text-sm">Estimated Profit</div><div className="text-2xl font-black text-leaf">₹{(revenue-total).toLocaleString()}</div></div></div><p className="text-xs text-gray-500 mt-4">All values are estimates, not guarantees.</p></div>}

function Profile({lang,onLang}:{lang:Lang,onLang:(l:Lang)=>void}){return <div className="max-w-2xl"><h1 className="text-3xl font-black">Profile & Settings</h1><div className="card mt-5 p-6"><div className="h-16 w-16 rounded-2xl bg-[#e8f4e7] text-leaf flex items-center justify-center"><CircleUserRound size={32}/></div><h2 className="text-xl font-black mt-4">Farmer</h2><p className="text-gray-600">Keep only the information needed to personalize your farming assistant.</p><div className="mt-6"><label className="font-bold">Language</label><select value={lang.code} onChange={e=>onLang(languages.find(x=>x.code===e.target.value)!)} className="mt-2 w-full p-4 rounded-2xl border">{languages.map(x=><option key={x.code} value={x.code}>{x.native} — {x.name}</option>)}</select></div></div></div>}

function App(){
  const [lang,setLang]=useState<Lang|null>(()=>{const c=localStorage.getItem("dhartiLang");return languages.find(x=>x.code===c)||null});
  const [authed,setAuthed]=useState(()=>!!localStorage.getItem("demoUser"));
  const [page,setPage]=useState<Page>("home");
  useEffect(()=>{if(lang)localStorage.setItem("dhartiLang",lang.code)},[lang]);
  if(!lang)return <LanguageScreen onSelect={setLang}/>;
  if(!authed)return <Auth lang={lang} onDone={()=>setAuthed(true)}/>;
  const dataPage=()=>{
    if(page==="weather") return <DataPage title={t(lang.code,"weather")} items={[{name:"Today",condition:"Partly cloudy",temperature:"28°C",rain:"35%",humidity:"68%",advice:"Monitor rain before spraying"}]} />;
    if(page==="market") return <DataPage title={t(lang.code,"market")} items={[{market:"Demo Mandi A",crop:"Tomato",price:"₹2,500/quintal",trend:"↗ Rising",updated:"Demo data"},{market:"Demo Mandi B",crop:"Tomato",price:"₹2,750/quintal",trend:"→ Stable",updated:"Demo data"}]} />;
    if(page==="schemes") return <DataPage title={t(lang.code,"schemes")} items={[{title:"Farmer Support Scheme",description:"Demo scheme record. Verify eligibility and official details before applying.",benefit:"Support varies",documents:"ID, land and bank documents",apply:"Check official government portal",updated:"Demo data"}]} />;
    if(page==="shops") return <DataPage title={t(lang.code,"shops")} items={[{name:"Demo Seed & Fertilizer Store",category:"Seeds / fertilizer",distance:"2.4 km",phone:"Demo listing"},{name:"Demo Soil Testing Center",category:"Soil testing",distance:"4.1 km",phone:"Demo listing"}]} />;
    if(page==="advisor") return <DataPage title={t(lang.code,"advisor")} items={[{name:"Tomato",description:"Example crop recommendation",duration:"90–120 days",water:"Moderate",risk:"Pests/disease",cost:"Estimate required",profit:"Estimate only"}]} />;
    if(page==="crops") return <DataPage title={t(lang.code,"crops")} items={[{name:"Tomato",stage:"Vegetative",planted:"Demo date",harvest:"Estimated"}]} />;
    if(page==="alerts") return <DataPage title={t(lang.code,"alerts")} items={[{name:"Rain alert",description:"Rain may be expected tomorrow. Review spraying plans."},{name:"Market alert",description:"Check latest market prices before selling."}]} />;
    if(page==="calendar") return <DataPage title={t(lang.code,"calendar")} items={[{name:"Sowing",description:"Add crop-specific dates to your calendar."},{name:"Irrigation",description:"Set a reminder for irrigation."},{name:"Harvest",description:"Track expected harvest."}]} />;
    if(page==="reminders") return <DataPage title={t(lang.code,"reminders")} items={[{name:"Water crop",description:"Demo reminder — connect notifications for production use."}]} />;
    if(page==="profit") return <Profit/>;
    if(page==="profile") return <Profile lang={lang} onLang={setLang}/>;
    if(page==="assistant") return <Assistant lang={lang}/>;
    if(page==="scan") return <Scan/>;
    return <Dashboard lang={lang} setPage={setPage}/>;
  };
  return <Layout lang={lang} page={page} setPage={setPage}>{dataPage()}</Layout>
}
export default App;
