import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { ImMobile2, ImNewTab } from 'react-icons/im';
import { FaEyeSlash, FaTabletAlt } from 'react-icons/fa';
import { RiComputerLine } from 'react-icons/ri';
import { IoMdClose, IoMdDownload } from 'react-icons/io';
import { BiSolidShow } from 'react-icons/bi';
import { MdOutlineArrowUpward } from 'react-icons/md';
import { GoogleGenAI } from '@google/genai';
import { Editor } from '@monaco-editor/react';
import { FadeLoader } from 'react-spinners';

function App() {
    const [prompt, setPrompt] = useState("");
  const [isShowCode, setIsShowCode] = useState(false);
  const [isInNewTab, setIsInNewTab] = useState(false);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(
    `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="p-[10px]">
  <h1 class="text-[30px] font-[700]">Welcome to AIBuild</h1>
</body>
</html>
    `
  );
  
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_KEY });

  // ✅ Extract code safely
  function extractCode(response) {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  };
const downloadCode = ()=> {
    let filename = "webBuilderCode.html";
    let blob = new Blob([code], {type: "text/plain"});
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

   async function getResponse() {

    if (prompt === "") {
      toast.error("Please eneter a prompt!");
      return;
    };

    setLoading(true);
    const text_prompt = `You are an expert frontend developer and UI/UX designer. The user will provide a detailed prompt describing what kind of website they want. Based on the user's description, generate a fully working, production-ready website as a **single HTML file**. Use only **HTML, Tailwind CSS (via CDN)**, vanilla JavaScript, and GSAP (via CDN).  

Strict output rules:
- Return the website as a single fenced Markdown code block with the language tag.  
- Do NOT include any explanations, text, or extra code blocks outside that single block. Only the HTML file content.  

Technical requirements:
1. **Stack**: HTML + Tailwind CSS (via CDN) + vanilla JavaScript + GSAP (via CDN). Everything in one file.  
2. **Responsive**: Must be fully responsive (mobile, tablet, desktop) with modern grid and flex layouts.  
3. **Theme**: Default **dark mode**, but if the website type fits better in light mode, auto-select light mode. Include a **toggle button** to switch between dark and light themes.  
4. **Animations & Interactions**:  
   - GSAP scroll-based animations (fade, slide, stagger, parallax).  
   - Smooth hover effects with scale, shadow, and gradient transitions.  
   - Sticky navbar with subtle shadow on scroll.  
   - Animated gradient backgrounds or floating decorative shapes.  
5. **Visual richness**:  
   - Use high-quality **royalty-free images** (Unsplash via direct URLs).  
   - Apply **soft shadows, glassmorphism, or neumorphism** effects where suitable.  
   - Modern cards, rounded corners, gradient buttons, hover animations.  
6. **UI Sections** (as per user request):  
   - Sticky **Navbar** with logo + links + theme toggle.  
   - **Hero section** with headline, subheadline, CTA button, and background image/gradient.  
   - **Main content**: features grid, product showcase, gallery, blog cards, or whatever fits user's request.  
   - **Call to Action** with strong button.  
   - **Footer** with the text: "Made with WebBuilder"  
7. **Code quality**: Clean, semantic HTML5, ARIA labels for accessibility, well-indented, professional Tailwind usage.  
8. **Performance**: Optimized. No external CSS/JS frameworks beyond Tailwind + GSAP. Use responsive images, gradients, inline SVGs, or Unsplash placeholders.  

Final instruction: Output only the single fenced Markdown code block with the full HTML file content. Nothing else.  

Website prompt: ${prompt}`

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: text_prompt,
    });
    setCode(extractCode(response.text));
    console.log(response.text)
    setLoading(false);
  };

  return (
    <>
     <Navbar/>
        <div className="container">
        <h3 className='text-[30px] font-[700]'>Create beautiful websites with <span className='bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent'>AIBuild</span></h3>
        <p className='mt-2 text-[16px] text-slate-400'>Describe your website and ai will code for you.</p>

        <div className="inputBox">
          <textarea
           onChange={(e) => { setPrompt(e.target.value) }} 
          value={prompt} placeholder='describe your website in detail.'></textarea>
          {
            prompt !== "" ?
              <>
                <i 
                onClick={getResponse}
                 className='sendIcon text-[20px] w-[30px] h-[30px] flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-600 rounded-[50%] transition-all duration-300 hover:opacity-[.8] hover:scale-110'><MdOutlineArrowUpward /></i>
              </> : ""
          }
        </div>

        <p className='text-[20px] font-[700] mt-[10vh] text-slate-200'>Your AI-Generated Website will appear here.</p>

        <div className="preview">
          <div className="header w-full h-[70px]">
            <h3 className='font-bold text-[16px] text-slate-200'>Live Preview</h3>

            <div className="icons flex items-center gap-[15px]">
              <div
               onClick={() => { setIsInNewTab(true) }}
               className="icon !w-[auto] !p-[12px] flex items-center gap-[10px] bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-all duration-300 cursor-pointer">Open in new tab <ImNewTab /></div>
              <div onClick={downloadCode} className="icon !w-[auto] !p-[12px] flex items-center gap-[10px] bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all duration-300 cursor-pointer">Download <IoMdDownload /></div>
              <div
               onClick={() => { setIsShowCode(!isShowCode) }}
               className="icon !w-[auto] !p-[12px] flex items-center gap-[10px] bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-all duration-300 cursor-pointer">{isShowCode ? "Hide Code" : "Show Code"} {isShowCode ? <FaEyeSlash /> : <BiSolidShow />}</div>
            </div>
          </div>

          {
            isShowCode ? <>
              <Editor onChange={(code)=>{setCode(code)}} height="100%" theme='vs-dark' defaultLanguage="html" value={code} />
            </> : <>
              {
                loading ?
                  <div className='w-full h-full flex items-center justify-center flex-col'>
                    <FadeLoader color='#06b6d4'/>
                    <h3 className='text-[23px] mt-4 font-semibold'><span className='bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent'>Generating</span> your website...</h3>
                  </div> :
                  <>
                    <iframe srcDoc={code} className='w-full bg-[white] rounded-lg border border-slate-700'></iframe>
                  </>
              }
            </>
          }
        </div>

      </div>


      {
        isInNewTab ?
          <>
            <div className="modelCon">
              <div className="modelBox text-slate-200 bg-slate-800 border border-slate-700">
                <div className="header w-full px-[50px] h-[70px] flex items-center justify-between border-b border-slate-700">
                  <h3 className='font-[700] text-slate-200'>Preview</h3>

                  <div className="icons flex items-center gap-[15px]">
                    <div className="icon bg-slate-700 hover:bg-slate-600 p-3 rounded-lg transition-all duration-300 cursor-pointer"><RiComputerLine /></div>
                    <div className="icon bg-slate-700 hover:bg-slate-600 p-3 rounded-lg transition-all duration-300 cursor-pointer"><FaTabletAlt /></div>
                    <div className="icon bg-slate-700 hover:bg-slate-600 p-3 rounded-lg transition-all duration-300 cursor-pointer"><ImMobile2 /></div>
                  </div>

                  <div className="icons">
                    <div className="icon bg-red-600 hover:bg-red-500 p-3 rounded-lg transition-all duration-300 cursor-pointer" onClick={() => { setIsInNewTab(false) }}><IoMdClose /></div>
                  </div>
                </div>
                <iframe srcDoc={code} className='w-full newTabIframe bg-white rounded-b-lg'></iframe>
              </div>
            </div>
          </> : ""
      }
    </>
  )
}

export default App