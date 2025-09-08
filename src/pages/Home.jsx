import React, { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Select from "react-select";
import { BsStars } from "react-icons/bs";
import { HiOutlineCode } from "react-icons/hi";
import Editor from "@monaco-editor/react";
import { IoCopy } from "react-icons/io5";
import { PiExportBold } from "react-icons/pi";
import { TbRefresh } from "react-icons/tb";
import { MdOpenInNew } from "react-icons/md";
import { GoogleGenAI } from "@google/genai";
import { PacmanLoader } from "react-spinners";
import { toast } from "react-toastify";

const Home = () => {
  const options = [
    { value: "html-css", label: "HTML + CSS" },
    { value: "html-tailwind", label: "HTML + Tailwind" },
    { value: "html-bootstrap", label: "HTML + Bootstrap" },
    { value: "react-materialui", label: "React + Material UI" },
    { value: "react-chakraui", label: "React + Chakra UI" },
    { value: "react-antdesign", label: "React + Ant Design" },
    { value: "react-mantine", label: "React + Mantine" },
    { value: "react-shadcn", label: "React + ShadCN UI" },
    { value: "react-daisyui", label: "React + DaisyUI" },
    { value: "react-flowbite", label: "React + Flowbite" },
  ];
  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [framework, setFramework] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // for iframe refresh
  const iframeRef = useRef(null);

  function extractCode(response) {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  }

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});
  async function getResponse() {
    setLoading(true);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: ` You are an experienced programmer with expertise in web development and UI/UX design. You create modern, animated, and fully responsive UI components. You are highly skilled in HTML, CSS, Tailwind CSS, Bootstrap, JavaScript, React, Next.js, Vue.js, Angular, and more.

Now, generate a UI component for: ${prompt}  
Framework to use: ${framework.value}  

Requirements:  
The code must be clean, well-structured, and easy to understand.  
Optimize for SEO where applicable.  
Focus on creating a modern, animated, and responsive UI design.  
Include high-quality hover effects, shadows, animations, colors, and typography.  
Return ONLY the code, formatted properly in **Markdown fenced code blocks**.  
Do NOT include explanations, text, comments, or anything else besides the code.  
And give the whole code in a single HTML file.
`,
    });

    console.log(response.text);
    setCode(extractCode(response.text));
    setOutputScreen(true);
    setLoading(false);
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code Copied Successfully");
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy");
    }
  };

  const downloadFile = () => {
    const fileName = "GenUI-code.html";
    const blob = new Blob([code], { type: "text/plain" });
    let url = URL.createObjectURL(blob);
    let link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded");
  };

  const refreshPreview = () => {
    setRefreshKey((prev) => prev + 1);
    toast.info("Preview refreshed");
  };

  const openInNewTab = () => {
    const newWindow = window.open();
    newWindow.document.open();
    newWindow.document.write(code);
    newWindow.document.close();
  };

  return (
    <>
      <Navbar />
      <div className="flex gap-[30px] items-center px-[100px] justify-between">
        <div className="left w-[50%] h-[auto] py-[30px] rounded-xl bg-[#141319] mt-5 p-[20px]">
          <h3 className="text-[25px] font-semibold sp-text">
            AI Component Generator
          </h3>
          <p className="text-[gray] mt-2 text-[16px]">
            Decribe your Component and Let AI Create it For you
          </p>
          <p className="text-[15px] font-[700] mt-4">Framework</p>
          <Select
            className="mt-2"
            options={options}
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "#1f2937",
                borderColor: "#374151",
                color: "white",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "#111827",
                color: "white",
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused ? "#374151" : "#111827",
                color: "white",
                cursor: "pointer",
              }),
              singleValue: (base) => ({
                ...base,
                color: "white",
              }),
            }}
            onChange={(e) => {
              setFramework(e.value);
            }}
          />
          <p className="text-[15px] font-[700] mt-5">Describe your Component</p>
          <textarea
            onChange={(e) => {
              setPrompt(e.target.value);
            }}
            value={prompt}
            placeholder="Decribe your Component in Detail"
            className="p-[10px] w-full min-h-[200px] rounded-xl mt-3 bg-[#09090B]"
          ></textarea>
          <div className="flex items-center justify-between">
            <p className="text-[gray]">
              Click on Generate button to generate your code
            </p>
            <button
              onClick={getResponse}
              className="generate flex items-center p-[15px] rounded-lg border-0 bg-gradient-to-r from-purple-400 to-purple-600 mt-3  px-[20px] gap-[10px] transition-all hover:opacity-[0.8] "
            >
              <i>
                <BsStars />
              </i>
              Generate
            </button>
          </div>
        </div>
        <div className="right relative mt-2 w-[50%] h-[80vh] bg-[#141319] rounded-xl ">
          {outputScreen === false ? (
            <>
              {loading === true ? (
                <div className="loader absolute left-0 top-0 w-full h-full flex items-center justify-center bg-[rgb(0,0,0,0.5)]">
                  <PacmanLoader color="#a855f7" />
                </div>
              ) : (
                <div className="skeleton w-full h-full flex items-center flex-col justify-center">
                  <div
                    className="circle flex items-center justify-center text-[30px] p-[20px] w-[70px] h-[70px] rounded-[50%] bg-gradient-to-r
                  from-purple-400
                  to-purple-600"
                  >
                    <HiOutlineCode />
                  </div>
                  <p className="text-[16px] text-[gray] mt-3">
                    Your Component and Code will appear here
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="top w-full h-[60px] bg-[#17171C] flex items-center gap-[15px] px-[20px]">
                <button
                  onClick={() => {
                    setTab(1);
                  }}
                  className={`btn w-[50%] p-[10px]  rounded-xl cursor-pointer transition-all ${
                    tab == 1 ? "bg-[#333]" : ""
                  } `}
                >
                  Code
                </button>
                <button
                  onClick={() => {
                    setTab(2);
                  }}
                  className={`btn w-[50%] p-[10px]  rounded-xl cursor-pointer transition-all ${
                    tab == 2 ? "bg-[#333]" : ""
                  } `}
                >
                  Preview
                </button>
              </div>
              <div className="top-2 w-full justify-between h-[60px] bg-[#17171C] flex items-center gap-[15px] px-[20px]">
                <div className="left ">
                  <p className="font-bold">Code Editor</p>
                </div>
                <div className="right flex items-center gap-10">
                  {tab === 1 ? (
                    <>
                      <button
                        onClick={copyCode}
                        className="copy h-[40px] w-[40px] rounded-xl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333] "
                      >
                        <IoCopy />
                      </button>
                      <button
                        onClick={downloadFile}
                        className="export h-[40px] w-[40px] rounded-xl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333] "
                      >
                        <PiExportBold />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={refreshPreview}
                        className="refresh h-[40px] w-[40px] rounded-xl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333] "
                      >
                        <TbRefresh />
                      </button>
                      <button
                        onClick={openInNewTab}
                        className="export h-[40px] w-[40px] rounded-xl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333] "
                      >
                        <MdOpenInNew />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="editor h-full">
                {tab === 1 ? (
                  <Editor
                    height="100%"
                    theme="vs-dark"
                    language="html"
                    value={code}
                  />
                ) : (
                  <iframe
                    key={refreshKey}
                    ref={iframeRef}
                    srcDoc={code}
                    className="preview w-full h-full bg-white text-black flex items-center justify-center"
                  ></iframe>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
