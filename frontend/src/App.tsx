import { useEffect, useRef, useState } from "react";
import {
  Bell, Bot, CalendarDays, Camera, ChevronRight, CircleUserRound, CloudRain,
  Droplets, Home, Leaf, MapPin, Menu, Mic, Play, ScanLine, Search, Settings,
  Sprout, Store, Tractor, TrendingUp, Volume2, Wallet, Wheat, X, Languages, ExternalLink
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

const baseCopy = {welcome:"Welcome to Dharti Mitr AI",tag:"Your Smart Farming Friend",start:"Get Started",login:"Login",create:"Create Account",mobile:"Mobile / Username",password:"Password",home:"Home",assistant:"AI Assistant",crops:"My Crops",alerts:"Alerts",profile:"Profile",scan:"Scan My Crop",weather:"Weather",market:"Market Prices",schemes:"Government Schemes",shops:"Nearby Shops",advisor:"Crop Advisor",profit:"Profit Calculator",calendar:"Farming Calendar",reminders:"Reminders",ask:"Ask Dharti Mitr",speak:"Speak",listen:"Listen",stop:"Stop",send:"Send",actions:"Today's Farming Actions",takePhoto:"Take Photo",uploadPhoto:"Upload Photo",cameraUnavailable:"Camera is unavailable. Please upload a photo.",useCamera:"Use Camera",retake:"Retake Photo",analyze:"Analyze Crop"};
const copy: Record<string, Record<string,string>> = {
  en:baseCopy,
  hi:{...baseCopy,welcome:"धर्ति मित्र AI में आपका स्वागत है",tag:"आपका स्मार्ट खेती साथी",start:"शुरू करें",login:"लॉगिन",create:"खाता बनाएं",mobile:"मोबाइल / यूज़रनेम",password:"पासवर्ड",home:"होम",assistant:"AI सहायक",crops:"मेरी फसलें",alerts:"अलर्ट",profile:"प्रोफ़ाइल",scan:"फसल स्कैन करें",weather:"मौसम",market:"बाज़ार भाव",schemes:"सरकारी योजनाएं",shops:"पास की दुकानें",advisor:"फसल सलाहकार",profit:"लाभ कैलकुलेटर",calendar:"खेती कैलेंडर",reminders:"रिमाइंडर",ask:"धर्ति मित्र से पूछें",speak:"बोलें",listen:"सुनें",send:"भेजें",actions:"आज के खेती के काम",takePhoto:"फोटो लें",uploadPhoto:"फोटो अपलोड करें",cameraUnavailable:"कैमरा उपलब्ध नहीं है। कृपया फोटो अपलोड करें।",useCamera:"कैमरा इस्तेमाल करें",retake:"फिर से फोटो लें",analyze:"फसल का विश्लेषण करें"},
  kn:{...baseCopy,welcome:"ಧರ್ತಿ ಮಿತ್ರ AI ಗೆ ಸ್ವಾಗತ",tag:"ನಿಮ್ಮ ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಸ್ನೇಹಿತ",start:"ಪ್ರಾರಂಭಿಸಿ",login:"ಲಾಗಿನ್",create:"ಖಾತೆ ರಚಿಸಿ",mobile:"ಮೊಬೈಲ್ / ಬಳಕೆದಾರ ಹೆಸರು",password:"ಪಾಸ್‌ವರ್ಡ್",home:"ಮುಖಪುಟ",assistant:"AI ಸಹಾಯಕ",crops:"ನನ್ನ ಬೆಳೆಗಳು",alerts:"ಎಚ್ಚರಿಕೆಗಳು",profile:"ಪ್ರೊಫೈಲ್",scan:"ನನ್ನ ಬೆಳೆಯನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",weather:"ಹವಾಮಾನ",market:"ಮಾರುಕಟ್ಟೆ ಬೆಲೆ",schemes:"ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",shops:"ಹತ್ತಿರದ ಅಂಗಡಿಗಳು",advisor:"ಬೆಳೆ ಸಲಹೆಗಾರ",profit:"ಲಾಭ ಕ್ಯಾಲ್ಕುಲೇಟರ್",calendar:"ಕೃಷಿ ಕ್ಯಾಲೆಂಡರ್",reminders:"ಜ್ಞಾಪನೆಗಳು",ask:"ಧರ್ತಿ ಮಿತ್ರನನ್ನು ಕೇಳಿ",speak:"ಮಾತನಾಡಿ",listen:"ಕೇಳಿ",send:"ಕಳುಹಿಸಿ",actions:"ಇಂದಿನ ಕೃಷಿ ಕೆಲಸಗಳು",takePhoto:"ಫೋಟೋ ತೆಗೆದುಕೊಳ್ಳಿ",uploadPhoto:"ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",cameraUnavailable:"ಕ್ಯಾಮೆರಾ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",useCamera:"ಕ್ಯಾಮೆರಾ ಬಳಸಿ",retake:"ಮತ್ತೆ ಫೋಟೋ ತೆಗೆದುಕೊಳ್ಳಿ",analyze:"ಬೆಳೆಯನ್ನು ವಿಶ್ಲೇಷಿಸಿ"},
  te:{...baseCopy,welcome:"ధర్తి మిత్ర AI కి స్వాగతం",tag:"మీ స్మార్ట్ వ్యవసాయ స్నేహితుడు",login:"లాగిన్",create:"ఖాతా సృష్టించండి",mobile:"మొబైల్ / వినియోగదారు పేరు",password:"పాస్‌వర్డ్",home:"హోమ్",assistant:"AI సహాయకుడు",crops:"నా పంటలు",alerts:"అలర్ట్‌లు",profile:"ప్రొఫైల్",scan:"నా పంటను స్కాన్ చేయండి",weather:"వాతావరణం",market:"మార్కెట్ ధరలు",schemes:"ప్రభుత్వ పథకాలు",shops:"సమీప దుకాణాలు",advisor:"పంట సలహాదారు",profit:"లాభాల కాలిక్యులేటర్",calendar:"వ్యవసాయ క్యాలెండర్",reminders:"రిమైండర్లు",ask:"ధర్తి మిత్రను అడగండి",listen:"వినండి",send:"పంపండి",actions:"ఈరోజు వ్యవసాయ పనులు",takePhoto:"ఫోటో తీయండి",uploadPhoto:"ఫోటో అప్‌లోడ్ చేయండి",cameraUnavailable:"కెమెరా అందుబాటులో లేదు. ఫోటో అప్‌లోడ్ చేయండి.",useCamera:"కెమెరా ఉపయోగించండి",retake:"మళ్లీ ఫోటో తీయండి",analyze:"పంటను విశ్లేషించండి"},
  ta:{...baseCopy,welcome:"தர்த்தி மித்ர் AI-க்கு வரவேற்கிறோம்",tag:"உங்கள் ஸ்மார்ட் விவசாய நண்பர்",login:"உள்நுழைவு",create:"கணக்கை உருவாக்கு",mobile:"மொபைல் / பயனர்பெயர்",password:"கடவுச்சொல்",home:"முகப்பு",assistant:"AI உதவியாளர்",crops:"என் பயிர்கள்",alerts:"எச்சரிக்கைகள்",profile:"சுயவிவரம்",scan:"என் பயிரை ஸ்கேன் செய்",weather:"வானிலை",market:"சந்தை விலைகள்",schemes:"அரசுத் திட்டங்கள்",shops:"அருகிலுள்ள கடைகள்",advisor:"பயிர் ஆலோசகர்",profit:"லாபக் கணிப்பான்",calendar:"விவசாய காலண்டர்",reminders:"நினைவூட்டல்கள்",ask:"தர்த்தி மித்ரிடம் கேளுங்கள்",listen:"கேளுங்கள்",send:"அனுப்பு",actions:"இன்றைய விவசாயப் பணிகள்",takePhoto:"புகைப்படம் எடு",uploadPhoto:"புகைப்படத்தைப் பதிவேற்று",cameraUnavailable:"கேமரா கிடைக்கவில்லை. புகைப்படத்தைப் பதிவேற்றுங்கள்.",useCamera:"கேமராவைப் பயன்படுத்து",retake:"மீண்டும் புகைப்படம் எடு",analyze:"பயிரை ஆய்வு செய்"},
  mr:{...baseCopy,welcome:"धर्ती मित्र AI मध्ये आपले स्वागत आहे",tag:"तुमचा स्मार्ट शेती मित्र",login:"लॉगिन",create:"खाते तयार करा",mobile:"मोबाईल / वापरकर्ता नाव",password:"पासवर्ड",home:"मुख्यपृष्ठ",assistant:"AI सहाय्यक",crops:"माझी पिके",alerts:"सूचना",profile:"प्रोफाइल",scan:"माझे पीक स्कॅन करा",weather:"हवामान",market:"बाजारभाव",schemes:"सरकारी योजना",shops:"जवळची दुकाने",advisor:"पीक सल्लागार",profit:"नफा कॅल्क्युलेटर",calendar:"शेती दिनदर्शिका",reminders:"स्मरणपत्रे",ask:"धर्ती मित्राला विचारा",listen:"ऐका",send:"पाठवा",actions:"आजची शेतीची कामे",takePhoto:"फोटो काढा",uploadPhoto:"फोटो अपलोड करा",cameraUnavailable:"कॅमेरा उपलब्ध नाही. कृपया फोटो अपलोड करा.",useCamera:"कॅमेरा वापरा",retake:"पुन्हा फोटो काढा",analyze:"पिकाचे विश्लेषण करा"},
  bn:{...baseCopy,welcome:"ধরতি মিত্র AI-তে স্বাগতম",tag:"আপনার স্মার্ট কৃষি বন্ধু",login:"লগইন",create:"অ্যাকাউন্ট তৈরি করুন",mobile:"মোবাইল / ব্যবহারকারীর নাম",password:"পাসওয়ার্ড",home:"হোম",assistant:"AI সহায়ক",crops:"আমার ফসল",alerts:"সতর্কতা",profile:"প্রোফাইল",scan:"আমার ফসল স্ক্যান করুন",weather:"আবহাওয়া",market:"বাজারদর",schemes:"সরকারি প্রকল্প",shops:"কাছের দোকান",advisor:"ফসল পরামর্শদাতা",profit:"লাভ ক্যালকুলেটর",calendar:"কৃষি ক্যালেন্ডার",reminders:"অনুস্মারক",ask:"ধরতি মিত্রকে জিজ্ঞাসা করুন",listen:"শুনুন",send:"পাঠান",actions:"আজকের কৃষিকাজ",takePhoto:"ছবি তুলুন",uploadPhoto:"ছবি আপলোড করুন",cameraUnavailable:"ক্যামেরা পাওয়া যাচ্ছে না। ছবি আপলোড করুন।",useCamera:"ক্যামেরা ব্যবহার করুন",retake:"আবার ছবি তুলুন",analyze:"ফসল বিশ্লেষণ করুন"},
  gu:{...baseCopy,welcome:"ધરતી મિત્ર AI માં આપનું સ્વાગત છે",tag:"તમારો સ્માર્ટ ખેતી મિત્ર",login:"લોગિન",create:"ખાતું બનાવો",mobile:"મોબાઇલ / વપરાશકર્તા નામ",password:"પાસવર્ડ",home:"હોમ",assistant:"AI સહાયક",crops:"મારા પાક",alerts:"ચેતવણીઓ",profile:"પ્રોફાઇલ",scan:"મારો પાક સ્કેન કરો",weather:"હવામાન",market:"બજાર ભાવ",schemes:"સરકારી યોજનાઓ",shops:"નજીકની દુકાનો",advisor:"પાક સલાહકાર",profit:"નફા કેલ્ક્યુલેટર",calendar:"ખેતી કેલેન્ડર",reminders:"રીમાઇન્ડર્સ",ask:"ધરતી મિત્રને પૂછો",listen:"સાંભળો",send:"મોકલો",actions:"આજનાં ખેતીનાં કામ",takePhoto:"ફોટો લો",uploadPhoto:"ફોટો અપલોડ કરો",cameraUnavailable:"કેમેરા ઉપલબ્ધ નથી. ફોટો અપલોડ કરો.",useCamera:"કેમેરાનો ઉપયોગ કરો",retake:"ફરી ફોટો લો",analyze:"પાકનું વિશ્લેષણ કરો"},
  pa:{...baseCopy,welcome:"ਧਰਤੀ ਮਿੱਤਰ AI ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ",tag:"ਤੁਹਾਡਾ ਸਮਾਰਟ ਖੇਤੀ ਸਾਥੀ",login:"ਲੌਗਇਨ",create:"ਖਾਤਾ ਬਣਾਓ",mobile:"ਮੋਬਾਈਲ / ਵਰਤੋਂਕਾਰ ਨਾਮ",password:"ਪਾਸਵਰਡ",home:"ਮੁੱਖ ਪੰਨਾ",assistant:"AI ਸਹਾਇਕ",crops:"ਮੇਰੀਆਂ ਫਸਲਾਂ",alerts:"ਚੇਤਾਵਨੀਆਂ",profile:"ਪ੍ਰੋਫਾਈਲ",scan:"ਆਪਣੀ ਫਸਲ ਸਕੈਨ ਕਰੋ",weather:"ਮੌਸਮ",market:"ਮੰਡੀ ਭਾਅ",schemes:"ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ",shops:"ਨੇੜਲੀਆਂ ਦੁਕਾਨਾਂ",advisor:"ਫਸਲ ਸਲਾਹਕਾਰ",profit:"ਮੁਨਾਫਾ ਕੈਲਕੁਲੇਟਰ",calendar:"ਖੇਤੀ ਕੈਲੰਡਰ",reminders:"ਯਾਦ ਦਿਹਾਨੀਆਂ",ask:"ਧਰਤੀ ਮਿੱਤਰ ਨੂੰ ਪੁੱਛੋ",listen:"ਸੁਣੋ",send:"ਭੇਜੋ",actions:"ਅੱਜ ਦੇ ਖੇਤੀ ਕੰਮ",takePhoto:"ਫੋਟੋ ਖਿੱਚੋ",uploadPhoto:"ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ",cameraUnavailable:"ਕੈਮਰਾ ਉਪਲਬਧ ਨਹੀਂ। ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ।",useCamera:"ਕੈਮਰਾ ਵਰਤੋ",retake:"ਦੁਬਾਰਾ ਫੋਟੋ ਖਿੱਚੋ",analyze:"ਫਸਲ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ"},
  ml:{...baseCopy,welcome:"ധർത്തി മിത്ര AI-ലേക്ക് സ്വാഗതം",tag:"നിങ്ങളുടെ സ്മാർട്ട് കൃഷി സുഹൃത്ത്",login:"ലോഗിൻ",create:"അക്കൗണ്ട് സൃഷ്ടിക്കുക",mobile:"മൊബൈൽ / ഉപയോക്തൃനാമം",password:"പാസ്‌വേഡ്",home:"ഹോം",assistant:"AI സഹായി",crops:"എന്റെ വിളകൾ",alerts:"അറിയിപ്പുകൾ",profile:"പ്രൊഫൈൽ",scan:"എന്റെ വിള സ്കാൻ ചെയ്യുക",weather:"കാലാവസ്ഥ",market:"വിപണി വിലകൾ",schemes:"സർക്കാർ പദ്ധതികൾ",shops:"അടുത്തുള്ള കടകൾ",advisor:"വിള ഉപദേശകൻ",profit:"ലാഭ കാൽക്കുലേറ്റർ",calendar:"കൃഷി കലണ്ടർ",reminders:"ഓർമ്മപ്പെടുത്തലുകൾ",ask:"ധർത്തി മിത്രയോട് ചോദിക്കൂ",listen:"കേൾക്കുക",send:"അയയ്ക്കുക",actions:"ഇന്നത്തെ കൃഷിപ്പണികൾ",takePhoto:"ഫോട്ടോ എടുക്കുക",uploadPhoto:"ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക",cameraUnavailable:"ക്യാമറ ലഭ്യമല്ല. ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക.",useCamera:"ക്യാമറ ഉപയോഗിക്കുക",retake:"വീണ്ടും ഫോട്ടോ എടുക്കുക",analyze:"വിള വിശകലനം ചെയ്യുക"},
  ur:{...baseCopy,welcome:"دھرتی متر AI میں خوش آمدید",tag:"آپ کا اسمارٹ کاشتکاری ساتھی",login:"لاگ ان",create:"اکاؤنٹ بنائیں",mobile:"موبائل / صارف نام",password:"پاس ورڈ",home:"ہوم",assistant:"AI معاون",crops:"میری فصلیں",alerts:"الرٹس",profile:"پروفائل",scan:"اپنی فصل اسکین کریں",weather:"موسم",market:"منڈی کے نرخ",schemes:"سرکاری اسکیمیں",shops:"قریبی دکانیں",advisor:"فصل مشیر",profit:"منافع کیلکولیٹر",calendar:"زرعی کیلنڈر",reminders:"یاد دہانیاں",ask:"دھرتی متر سے پوچھیں",listen:"سنیں",send:"بھیجیں",actions:"آج کے زرعی کام",takePhoto:"تصویر لیں",uploadPhoto:"تصویر اپ لوڈ کریں",cameraUnavailable:"کیمرہ دستیاب نہیں۔ براہ کرم تصویر اپ لوڈ کریں۔",useCamera:"کیمرہ استعمال کریں",retake:"دوبارہ تصویر لیں",analyze:"فصل کا تجزیہ کریں"}
};
const speechLocale: Record<string,string> = {en:"en-IN",hi:"hi-IN",kn:"kn-IN",te:"te-IN",ta:"ta-IN",mr:"mr-IN",bn:"bn-IN",gu:"gu-IN",pa:"pa-IN",ml:"ml-IN",ur:"ur-IN"};
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

function WeatherChart(){const points=[35,48,42,62,55,70,58];const max=80;const line=points.map((value,index)=>`${index*50+10},${110-(value/max)*90}`).join(" ");return <div className="card p-5"><div className="flex items-center justify-between"><div><div className="font-black">7-day rain probability</div><div className="text-sm text-gray-500">Plan irrigation and spraying</div></div><CloudRain className="text-leaf"/></div><svg viewBox="0 0 320 130" role="img" aria-label="Seven day rain probability chart" className="w-full h-44 mt-4"><path d="M10 110H310" stroke="#dbe8d7" strokeWidth="2"/><polyline points={line} fill="none" stroke="#2f8f51" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>{points.map((value,index)=><circle key={index} cx={index*50+10} cy={110-(value/max)*90} r="4" fill="#2f8f51"/>)}{["M","T","W","T","F","S","S"].map((day,index)=><text key={index} x={index*50+10} y="127" textAnchor="middle" fontSize="10" fill="#728176">{day}</text>)}</svg></div>}

function HealthChart(){const values=[82,74,68,91];const labels=["Soil","Water","Pest","Growth"];return <div className="card p-5"><div className="flex items-center justify-between"><div><div className="font-black">Crop health indicators</div><div className="text-sm text-gray-500">Current farm health snapshot</div></div><Leaf className="text-leaf"/></div><div className="space-y-4 mt-5">{values.map((value,index)=><div key={labels[index]}><div className="flex justify-between text-sm font-semibold"><span>{labels[index]}</span><span className="text-leaf">{value}%</span></div><div className="h-3 rounded-full bg-gray-100 mt-1 overflow-hidden"><div className="h-full rounded-full bg-leaf" style={{width:`${value}%`}}/></div></div>)}</div></div>}

function MarketChart({markets}:{markets:any[]}){const fallback=[{market:"Mandi A",price:"₹2,500/quintal"},{market:"Mandi B",price:"₹2,750/quintal"},{market:"Mandi C",price:"₹2,300/quintal"},{market:"Mandi D",price:"₹2,900/quintal"}];const source=markets.length?markets:fallback;const entries=source.slice(0,4).map(item=>({label:String(item.market||"Mandi"),value:Number(String(item.price||"").replace(/[^0-9.]/g,""))||0}));const highest=Math.max(...entries.map(item=>item.value),1);return <div className="card p-5"><div className="flex items-center justify-between"><div><div className="font-black">Market price comparison</div><div className="text-sm text-gray-500">Tomato price per quintal</div></div><TrendingUp className="text-leaf"/></div><div className="flex items-end justify-between gap-3 h-44 mt-5 px-2">{entries.map(item=><div key={item.label} className="flex-1 h-full flex flex-col items-center justify-end"><div className="text-xs font-bold text-leaf mb-1">₹{item.value.toLocaleString()}</div><div className="w-full max-w-12 rounded-t-xl bg-leaf/80" style={{height:`${(item.value/highest)*105}px`}}/><div className="text-[10px] text-gray-500 mt-2 text-center">{item.label}</div></div>)}</div></div>}

function Dashboard({lang,setPage}:{lang:Lang,setPage:(p:Page)=>void}) {
  const [weather,setWeather]=useState<any>(null);
  const [markets,setMarkets]=useState<any[]>([]);
  useEffect(()=>{api.weather().then(setWeather).catch(()=>{});api.markets().then(setMarkets).catch(()=>{});},[]);
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
    <h2 className="text-2xl font-black mt-7 mb-3">Farm insights</h2>
    <div className="grid lg:grid-cols-3 gap-4"><WeatherChart/><HealthChart/><MarketChart markets={markets}/></div>
  </div>
}

function Assistant({lang}:{lang:Lang}) {
  const [messages,setMessages]=useState<{role:string,text:string}[]>([{role:"ai",text:"Namaste! Tell me about your crop. You can type or use the microphone."}]);
  const [input,setInput]=useState(""); const [listening,setListening]=useState(false); const [speaking,setSpeaking]=useState(false);
  const stopSpeaking=()=>{if("speechSynthesis" in window){speechSynthesis.cancel();setSpeaking(false);}};
  const speak=(text:string)=>{if(!("speechSynthesis" in window))return;stopSpeaking();const u=new SpeechSynthesisUtterance(text);u.lang=speechLocale[lang.code]||"en-IN";u.onstart=()=>setSpeaking(true);u.onend=()=>setSpeaking(false);u.onerror=()=>setSpeaking(false);speechSynthesis.speak(u);};
  function voice(){const SR=(window as any).SpeechRecognition||(window as any).webkitSpeechRecognition;if(!SR){alert("Voice input is not supported in this browser.");return;}const r=new SR();r.lang=speechLocale[lang.code]||"en-IN";r.onstart=()=>setListening(true);r.onend=()=>setListening(false);r.onresult=(e:any)=>setInput(e.results[0][0].transcript);r.start();}
  async function send(){if(!input.trim())return;const q=input;setInput("");setMessages(m=>[...m,{role:"user",text:q}]);try{const d=await api.chat(q,lang.code);setMessages(m=>[...m,{role:"ai",text:d.answer}]);}catch{setMessages(m=>[...m,{role:"ai",text:"I couldn't connect right now. Please try again."}]);}}
  return <div className="max-w-4xl mx-auto"><h1 className="text-3xl font-black">{t(lang.code,"assistant")}</h1><p className="text-gray-600 mt-1">Talk to Dharti Mitr in your language.</p>
    <div className="card mt-5 p-4 min-h-[520px] flex flex-col"><div className="flex-1 space-y-4 overflow-auto">{messages.map((m,i)=><div key={i} className={`flex ${m.role==="user"?"justify-end":""}`}><div className={`max-w-[85%] rounded-3xl p-4 ${m.role==="user"?"bg-leaf text-white":"bg-[#edf5e9]"}`}><div>{m.text}</div>{m.role==="ai"&&<div className="mt-3 flex gap-3"><button onClick={()=>speak(m.text)} className="text-xs font-bold flex items-center gap-1"><Volume2 size={15}/> {t(lang.code,"listen")}</button>{speaking&&<button onClick={stopSpeaking} className="text-xs font-bold text-red-600 flex items-center gap-1"><X size={15}/> {t(lang.code,"stop")}</button>}</div>}</div></div>)}</div>
      <div className="flex gap-2 mt-4"><button onClick={voice} className={`h-14 w-14 rounded-2xl flex items-center justify-center ${listening?"bg-red-500 text-white":"bg-[#e8f4e7] text-leaf"}`}><Mic/></button><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} className="flex-1 rounded-2xl border px-4" placeholder={t(lang.code,"ask")}/><button onClick={send} className="px-5 rounded-2xl bg-leaf text-white font-black">{t(lang.code,"send")}</button></div>
    </div>
  </div>
}

function Scan({lang}:{lang:Lang}){const [file,setFile]=useState<File|null>(null);const [result,setResult]=useState<any>(null);const [loading,setLoading]=useState(false);const [cameraOpen,setCameraOpen]=useState(false);const [cameraError,setCameraError]=useState("");const videoRef=useRef<HTMLVideoElement>(null);const streamRef=useRef<MediaStream|null>(null);const uploadRef=useRef<HTMLInputElement>(null);
  useEffect(()=>()=>{streamRef.current?.getTracks().forEach(track=>track.stop());},[]);
  useEffect(()=>{if(cameraOpen&&videoRef.current&&streamRef.current)videoRef.current.srcObject=streamRef.current;},[cameraOpen]);
  async function startCamera(){setCameraError("");if(!navigator.mediaDevices?.getUserMedia){setCameraError(t(lang.code,"cameraUnavailable"));return;}try{const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}},audio:false});streamRef.current=stream;setCameraOpen(true);}catch{setCameraError(t(lang.code,"cameraUnavailable"));}}
  function stopCamera(){streamRef.current?.getTracks().forEach(track=>track.stop());streamRef.current=null;setCameraOpen(false);}
  function capture(){const video=videoRef.current;if(!video)return;const canvas=document.createElement("canvas");canvas.width=video.videoWidth||1280;canvas.height=video.videoHeight||720;canvas.getContext("2d")?.drawImage(video,0,0,canvas.width,canvas.height);canvas.toBlob(blob=>{if(blob){setFile(new File([blob],`crop-${Date.now()}.jpg`,{type:"image/jpeg"}));stopCamera();}},"image/jpeg",.92);}
  async function analyze(){if(!file)return;setLoading(true);try{setResult(await api.diagnosis(file.name));}finally{setLoading(false);}}
  return <div className="max-w-3xl mx-auto"><h1 className="text-3xl font-black">{t(lang.code,"scan")}</h1><p className="text-gray-600">Take or upload a photo of a leaf, fruit, stem or whole plant.</p>
    <div className="card mt-5 p-7 border-dashed border-2"><div className="h-20 w-20 rounded-3xl bg-[#e8f4e7] text-leaf flex items-center justify-center mx-auto"><Camera size={36}/></div>
      {cameraOpen&&<div className="mt-5"><video ref={videoRef} autoPlay playsInline muted className="w-full max-h-[420px] rounded-2xl bg-black object-cover"/><div className="flex justify-center gap-3 mt-4"><button onClick={capture} className="big-btn bg-leaf text-white"><Camera size={20}/>{t(lang.code,"takePhoto")}</button><button onClick={stopCamera} className="big-btn bg-gray-100">{t(lang.code,"retake")}</button></div></div>}
      {!cameraOpen&&<div className="flex flex-col sm:flex-row justify-center gap-3 mt-5"><button onClick={startCamera} className="big-btn bg-leaf text-white"><Camera size={20}/>{t(lang.code,"useCamera")}</button><button onClick={()=>uploadRef.current?.click()} className="big-btn bg-[#e8f4e7] text-leaf">{t(lang.code,"uploadPhoto")}</button></div>}
      <input ref={uploadRef} type="file" accept="image/*" capture="environment" onChange={e=>setFile(e.target.files?.[0]||null)} className="hidden"/>
      {cameraError&&<p className="text-center mt-3 text-sm text-red-600">{cameraError}</p>}
      {file&&<p className="text-center mt-3 font-semibold">{file.name}</p>}
      <button disabled={!file||loading} onClick={analyze} className="big-btn bg-leaf text-white mx-auto mt-5 disabled:opacity-40">{loading?"Analyzing…":t(lang.code,"analyze")}</button>
    </div>
    {result&&<div className="card mt-5 p-6"><h2 className="text-xl font-black">{result.crop} · {result.problem}</h2><div className="mt-4 grid md:grid-cols-2 gap-3">{Object.entries(result.details).map(([k,v])=><div key={k} className="rounded-2xl bg-[#f5f7ef] p-4"><div className="text-xs uppercase text-gray-500 font-bold">{k}</div><div className="font-semibold mt-1">{String(v)}</div></div>)}</div><p className="text-xs text-gray-500 mt-5">{result.disclaimer}</p></div>}
  </div>
}

function DataPage({title,items}:{title:string,items:any[]}){return <div><h1 className="text-3xl font-black">{title}</h1><div className="grid md:grid-cols-2 gap-4 mt-5">{items.map((x,i)=><div className="card p-5" key={i}><h2 className="font-black text-xl">{x.name||x.market||x.title}</h2><p className="text-gray-600 mt-1">{x.description||x.crop||x.category||x.condition}</p><div className="mt-4 grid grid-cols-2 gap-2">{Object.entries(x).filter(([k])=>!["name","market","title","description","crop","category","condition","officialUrl","applicationSteps"].includes(k)).map(([k,v])=><div className="bg-[#f5f7ef] rounded-xl p-3" key={k}><div className="text-xs text-gray-500 uppercase">{k}</div><div className="font-bold">{String(v)}</div></div>)}</div>{Array.isArray(x.applicationSteps)&&<div className="mt-5"><div className="font-black">How to apply</div><ol className="mt-2 space-y-2 text-sm text-gray-700 list-decimal list-inside">{x.applicationSteps.map((step:string,index:number)=><li key={index}>{step}</li>)}</ol></div>}{x.officialUrl&&<a href={x.officialUrl} target="_blank" rel="noopener noreferrer" className="big-btn bg-leaf text-white w-full mt-5">Apply on official portal <ExternalLink size={18}/></a>}</div>)}</div></div>}

function Schemes({lang}:{lang:Lang}){const [items,setItems]=useState<any[]>([]);const [loading,setLoading]=useState(true);const [error,setError]=useState("");useEffect(()=>{api.schemes().then(setItems).catch(()=>setError("Unable to load schemes right now.")).finally(()=>setLoading(false));},[]);if(loading)return <div><h1 className="text-3xl font-black">{t(lang.code,"schemes")}</h1><p className="mt-5 text-gray-600">Loading official scheme information...</p></div>;if(error)return <div><h1 className="text-3xl font-black">{t(lang.code,"schemes")}</h1><p className="mt-5 text-red-600">{error}</p></div>;return <DataPage title={t(lang.code,"schemes")} items={items}/>}

function Profit(){const [v,setV]=useState({land:1,seed:3000,fert:5000,input:3000,labor:6000,irrigation:2000,other:1000,yield:20,price:2500});const total=Object.values(v).slice(1,8).reduce((a,b)=>a+Number(b),0);const revenue=Number(v.yield)*Number(v.land)*Number(v.price);return <div className="max-w-3xl"><h1 className="text-3xl font-black">Farm Profit Calculator</h1><div className="card p-6 mt-5 grid md:grid-cols-2 gap-4">{Object.entries(v).map(([k,val])=><label className="font-semibold capitalize" key={k}>{k}<input type="number" value={val} onChange={e=>setV({...v,[k]:Number(e.target.value)})} className="mt-1 w-full p-3 rounded-xl border"/></label>)}</div><div className="grid md:grid-cols-3 gap-4 mt-5"><div className="card p-5"><div className="text-sm">Total Investment</div><div className="text-2xl font-black">₹{total.toLocaleString()}</div></div><div className="card p-5"><div className="text-sm">Expected Revenue</div><div className="text-2xl font-black">₹{revenue.toLocaleString()}</div></div><div className="card p-5"><div className="text-sm">Estimated Profit</div><div className="text-2xl font-black text-leaf">₹{(revenue-total).toLocaleString()}</div></div></div><p className="text-xs text-gray-500 mt-4">All values are estimates, not guarantees.</p></div>}

function Profile({lang,onLang}:{lang:Lang,onLang:(l:Lang)=>void}){const [photo,setPhoto]=useState(()=>localStorage.getItem("dhartiProfilePhoto")||"");const photoInput=useRef<HTMLInputElement>(null);function selectPhoto(file?:File){if(!file)return;const reader=new FileReader();reader.onload=()=>{const value=String(reader.result);setPhoto(value);localStorage.setItem("dhartiProfilePhoto",value);};reader.readAsDataURL(file);}return <div className="max-w-2xl"><h1 className="text-3xl font-black">Profile & Settings</h1><div className="card mt-5 p-6"><div className="flex items-center gap-4"><div className="h-20 w-20 rounded-2xl bg-[#e8f4e7] text-leaf flex items-center justify-center overflow-hidden">{photo?<img src={photo} alt="Farmer profile" className="h-full w-full object-cover"/>:<CircleUserRound size={36}/>}</div><div><button type="button" onClick={()=>photoInput.current?.click()} className="big-btn bg-leaf text-white">{photo?"Change Photo":"Add Profile Photo"}</button><input ref={photoInput} type="file" accept="image/*" capture="user" onChange={e=>selectPhoto(e.target.files?.[0])} className="hidden"/><p className="text-xs text-gray-500 mt-2">Choose a photo from your device or camera.</p></div></div><h2 className="text-xl font-black mt-5">Farmer</h2><p className="text-gray-600">Keep only the information needed to personalize your farming assistant.</p><div className="mt-6"><label className="font-bold">Language</label><select value={lang.code} onChange={e=>onLang(languages.find(x=>x.code===e.target.value)!)} className="mt-2 w-full p-4 rounded-2xl border">{languages.map(x=><option key={x.code} value={x.code}>{x.native} — {x.name}</option>)}</select></div></div></div>}

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
    if(page==="schemes") return <Schemes lang={lang}/>;
    if(page==="shops") return <DataPage title={t(lang.code,"shops")} items={[{name:"Demo Seed & Fertilizer Store",category:"Seeds / fertilizer",distance:"2.4 km",phone:"Demo listing"},{name:"Demo Soil Testing Center",category:"Soil testing",distance:"4.1 km",phone:"Demo listing"}]} />;
    if(page==="advisor") return <DataPage title={t(lang.code,"advisor")} items={[{name:"Tomato",description:"Example crop recommendation",duration:"90–120 days",water:"Moderate",risk:"Pests/disease",cost:"Estimate required",profit:"Estimate only"}]} />;
    if(page==="crops") return <DataPage title={t(lang.code,"crops")} items={[{name:"Tomato",stage:"Vegetative",planted:"Demo date",harvest:"Estimated"}]} />;
    if(page==="alerts") return <DataPage title={t(lang.code,"alerts")} items={[{name:"Rain alert",description:"Rain may be expected tomorrow. Review spraying plans."},{name:"Market alert",description:"Check latest market prices before selling."}]} />;
    if(page==="calendar") return <DataPage title={t(lang.code,"calendar")} items={[{name:"Sowing",description:"Add crop-specific dates to your calendar."},{name:"Irrigation",description:"Set a reminder for irrigation."},{name:"Harvest",description:"Track expected harvest."}]} />;
    if(page==="reminders") return <DataPage title={t(lang.code,"reminders")} items={[{name:"Water crop",description:"Demo reminder — connect notifications for production use."}]} />;
    if(page==="profit") return <Profit/>;
    if(page==="profile") return <Profile lang={lang} onLang={setLang}/>;
    if(page==="assistant") return <Assistant lang={lang}/>;
    if(page==="scan") return <Scan lang={lang}/>;
    return <Dashboard lang={lang} setPage={setPage}/>;
  };
  return <Layout lang={lang} page={page} setPage={setPage}>{dataPage()}</Layout>
}
export default App;
