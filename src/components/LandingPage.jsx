import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smile, Meh, Frown, AlertCircle, CloudRain, ArrowRight, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

const moods = [
  { 
    id: 'happy', label: 'Happy / Okay', icon: Smile, baseColor: 'text-amber-500', bgHover: 'hover:bg-amber-500/10', borderHover: 'hover:border-amber-500/50',
    openers: ["I'm having a good day today.", "Things are going well.", "I just wanted to check in and share some good news."]
  },
  { 
    id: 'neutral', label: 'Neutral', icon: Meh, baseColor: 'text-slate-500', bgHover: 'hover:bg-slate-500/10', borderHover: 'hover:border-slate-500/50',
    openers: ["I'm just feeling okay today.", "Nothing much is going on.", "I don't have anything specific to talk about."]
  },
  { 
    id: 'anxious', label: 'Anxious', icon: AlertCircle, baseColor: 'text-red-400', bgHover: 'hover:bg-red-400/10', borderHover: 'hover:border-red-400/50',
    openers: ["I feel overwhelmed right now.", "I can't stop worrying about things.", "I just need to take a breath."]
  },
  { 
    id: 'stressed', label: 'Stressed', icon: CloudRain, baseColor: 'text-purple-400', bgHover: 'hover:bg-purple-400/10', borderHover: 'hover:border-purple-400/50',
    openers: ["I have too much on my plate.", "I'm feeling completely burnt out.", "I don't know how to handle all this pressure."]
  },
  { 
    id: 'sad', label: 'Sad / Low', icon: Frown, baseColor: 'text-blue-400', bgHover: 'hover:bg-blue-400/10', borderHover: 'hover:border-blue-400/50',
    openers: ["I'm feeling really down today.", "I just feel empty.", "Everything feels a bit hopeless right now."]
  }
];

const LandingPage = ({ userName, setUserName }) => {
  const navigate = useNavigate();
  const [nameInput, setNameInput] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);
  const [isStickyOpen, setIsStickyOpen] = useState(true);
  const [isSticky2Open, setIsSticky2Open] = useState(false);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
      localStorage.setItem('counselor_userName', nameInput.trim());
    }
  };

  const handleSkip = () => {
    navigate('/chat');
  };

  const handleOpenerSelect = (opener) => {
    // Save mood history for the sparkline
    const historyStr = localStorage.getItem(`counselor_mood_history_${userName}`) || '[]';
    const history = JSON.parse(historyStr);
    history.push({ date: new Date().toISOString(), mood: selectedMood.id });
    localStorage.setItem(`counselor_mood_history_${userName}`, JSON.stringify(history));

    // To auto-send, we pass it via state
    navigate('/chat', { state: { initialMessage: opener, initialMood: selectedMood.id } });
  };

  if (!userName) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-500 relative overflow-hidden">
        {/* Background gradients */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl opacity-50 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/15 rounded-full blur-3xl opacity-50 -translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="bg-card/60 backdrop-blur-xl border border-border p-8 rounded-3xl shadow-2xl max-w-md w-full text-center z-10">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="text-primary w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Welcome to Haven.</h1>
          <p className="text-muted-foreground mb-8">Your private, AI-powered space to reflect and find balance. What should I call you?</p>
          <form onSubmit={handleNameSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Your preferred name..."
              className="px-6 py-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:outline-none text-lg text-center"
              autoFocus
            />
            <button
              type="submit"
              disabled={!nameInput.trim()}
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </form>
        </div>

        {/* Sticky Notes Container */}
        <div className="absolute top-4 left-4 right-4 lg:left-8 lg:top-8 lg:right-auto lg:w-[24rem] z-50 flex flex-col gap-4 hidden lg:flex">
          
          {/* Sticky Note 1 */}
          <div className={`bg-yellow-100 border border-yellow-300 rounded-lg text-left text-xs text-yellow-900 transition-all duration-500 ease-in-out transform origin-top ${isStickyOpen ? 'max-h-[85vh] overflow-y-auto shadow-2xl' : 'max-h-12 overflow-hidden shadow-md hover:scale-105 hover:shadow-xl hover:-translate-y-1'}`}>
            <div 
              className={`flex items-center justify-between cursor-pointer p-3 border-yellow-300 hover:bg-yellow-200/50 transition-colors sticky top-0 bg-yellow-100 z-10 ${isStickyOpen ? 'border-b' : ''}`}
              onClick={() => {
                setIsStickyOpen(!isStickyOpen);
                if (!isStickyOpen) setIsSticky2Open(false);
              }}
            >
              <h3 className="font-bold text-sm">✅ Inside the App: AI & Architecture</h3>
              {isStickyOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            
            <div className={`p-6 pt-2 transition-opacity duration-300 ${isStickyOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
              <h4 className="font-bold mt-2 text-yellow-950">AI & Prompting Concepts</h4>
              <ul className="list-disc pl-4 mb-2 space-y-1">
                <li><strong>LLM Applications:</strong> Yes. The application is a direct LLM-powered chatbot application utilizing Google's Gemini model.</li>
                <li><strong>Prompt Engineering:</strong> Yes. The backend dynamically constructs system instructions based on the AI's persona (aiName, aiTone) and situational triggers (via getBaseSystemPrompt and crisisSystemPromptAddendum).</li>
                <li><strong>Context Engineering:</strong> Yes. The system alters the context on the fly; if user input matches a crude crisis keyword heuristic, it appends emergency context to the prompt before hitting the LLM.</li>
                <li><strong>Fine-Tuning:</strong> Yes (For demonstration purposes).</li>
              </ul>

              <h4 className="font-bold mt-2 text-yellow-950">Frameworks & SDKs</h4>
              <ul className="list-disc pl-4 mb-2 space-y-1">
                <li><strong>Google ADK:</strong> Yes. The backend uses the @google/genai SDK (GoogleGenAI client) to communicate with gemini-3.6-flash.</li>
              </ul>

              <h4 className="font-bold mt-2 text-yellow-950">Programming</h4>
              <ul className="list-disc pl-4 mb-2 space-y-1">
                <li><strong>JavaScript:</strong> Yes. This is the primary language used across both the React frontend (.jsx) and Express backend (.js).</li>
              </ul>

              <h4 className="font-bold mt-2 text-yellow-950">Architecture</h4>
              <ul className="list-disc pl-4 mb-2 space-y-1">
                <li><strong>REST APIs:</strong> Yes. The backend exposes standard REST endpoints like /api/health and /api/crisis-resources.</li>
                <li><strong>Async APIs:</strong> Yes. The application handles asynchronous fetch requests and streams LLM responses back to the frontend using Server-Sent Events (SSE).</li>
                <li><strong>Monolithic Architecture Understanding:</strong> Yes. The frontend and backend live within the same repository, with the Express backend directly serving API requests in a monolithic fashion.</li>
              </ul>

              <h4 className="font-bold mt-2 text-yellow-950">UI & Styling</h4>
              <ul className="list-disc pl-4 mb-2 space-y-1">
                <li><strong>Tailwind CSS & Animations:</strong> Yes. Used extensively for responsive design and micro-animations.</li>
                <li><strong>Framer Motion:</strong> Yes. Included for complex declarative UI animations.</li>
              </ul>

              <h4 className="font-bold mt-2 text-yellow-950">Testing & QA</h4>
              <ul className="list-disc pl-4 mb-2 space-y-1">
                <li><strong>Unit Testing:</strong> Yes. Configured using Vitest, React Testing Library, and JSDOM.</li>
                <li><strong>Linting:</strong> Yes. Oxlint is configured for fast code quality checks.</li>
              </ul>

              <h4 className="font-bold mt-2 text-yellow-950">Build & Deployment</h4>
              <ul className="list-disc pl-4 mb-2 space-y-1">
                <li><strong>Build Tool:</strong> Yes. Vite is used for rapid frontend bundling.</li>
                <li><strong>Deployment:</strong> Yes. Vercel configuration is included for cloud hosting.</li>
              </ul>

              <h4 className="font-bold mt-2 text-yellow-950">Additional Skills</h4>
              <ul className="list-disc pl-4 mb-2 space-y-1">
                <li><strong>Git:</strong> Yes. The project uses version control (as evidenced by the .git directory and .gitignore).</li>
                <li><strong>AI Security:</strong> Yes, in a basic form. A crude keyword scan acts as a guardrail/heuristic to detect crisis situations and enforce safe AI boundaries by providing crisis resources.</li>
              </ul>

              <h3 className="font-bold text-sm mt-4 border-b border-yellow-300 pb-1">⚠️ Present but Unused</h3>
              <ul className="list-disc pl-4 mt-2">
                <li><strong>OpenAI / Azure OpenAI:</strong> The openai package is listed in package.json dependencies, but the backend implementation (api/index.js) exclusively uses Google GenAI.</li>
              </ul>
            </div>
          </div>

          {/* Sticky Note 2 */}
          <div className={`bg-blue-100 border border-blue-300 rounded-lg text-left text-xs text-blue-900 transition-all duration-500 ease-in-out transform origin-top ${isSticky2Open ? 'max-h-[85vh] overflow-y-auto shadow-2xl' : 'max-h-12 overflow-hidden shadow-md hover:scale-105 hover:shadow-xl hover:-translate-y-1'}`}>
            <div 
              className={`flex items-center justify-between cursor-pointer p-3 border-blue-300 hover:bg-blue-200/50 transition-colors sticky top-0 bg-blue-100 z-10 ${isSticky2Open ? 'border-b' : ''}`}
              onClick={() => {
                setIsSticky2Open(!isSticky2Open);
                if (!isSticky2Open) setIsStickyOpen(false);
              }}
            >
              <h3 className="font-bold text-sm">💡 Advanced AI Capabilities</h3>
              {isSticky2Open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            
            <div className={`p-6 pt-2 transition-opacity duration-300 ${isSticky2Open ? 'opacity-100' : 'opacity-0 hidden'}`}>
              <p className="mb-4 text-[13px]">For demonstrations of the advanced AI capabilities listed below, please contact <strong>Ashutosh Mondal</strong> at <strong>a_s_hu@yahoo.com</strong> or <strong>+91-7204723222</strong>.</p>
              
              <h4 className="font-bold mt-2 text-blue-950">Advanced AI & Agentic Concepts</h4>
              <p className="mb-2 text-[11px]">AI Agents, Agentic AI, A2A, MCP, Function Calling / Tool Calling, Structured Outputs.</p>

              <h4 className="font-bold mt-2 text-blue-950">Data Processing & ML</h4>
              <p className="mb-2 text-[11px]">RAG, Embeddings, Vector Databases.</p>

              <h4 className="font-bold mt-2 text-blue-950">AI Frameworks</h4>
              <p className="mb-2 text-[11px]">LangChain, LangGraph, AutoGen, CrewAI, OpenAI Agents SDK, Pydantic.</p>

              <h4 className="font-bold mt-2 text-blue-950">Programming Languages</h4>
              <p className="mb-2 text-[11px]">Python, TypeScript, SQL, Java.</p>

              <h4 className="font-bold mt-2 text-blue-950">Cloud, Infrastructure & CI/CD</h4>
              <p className="mb-2 text-[11px]">Azure AI Foundry, Azure OpenAI Service, AWS, Azure, GCP, Docker, Kubernetes, OpenShift, CI/CD pipelines.</p>

              <h4 className="font-bold mt-2 text-blue-950">Data Engineering</h4>
              <p className="mb-2 text-[11px]">PyTorch, TensorFlow, MLflow, Airflow, Databricks, Snowflake, MLOps, Data Pipelines.</p>

              <h4 className="font-bold mt-2 text-blue-950">Advanced Architecture</h4>
              <p className="mb-2 text-[11px]">FastAPI, PostgreSQL, Microservices, Event-driven Architecture, Scalable Systems.</p>

              <h4 className="font-bold mt-2 text-blue-950">Other Additional Skills</h4>
              <p className="mb-2 text-[11px]">Postman, ServiceNow AI, Insurance Domain Knowledge, GPU Architecture, InfiniBand, High-Performance Storage.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in duration-500 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl opacity-50 -translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      
      {!selectedMood ? (
        <div className="flex flex-col items-center justify-center w-full max-w-2xl animate-in zoom-in-95 duration-300 z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Hi, {userName}.</h2>
            <p className="text-lg text-muted-foreground">How are you feeling right now?</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12 w-full">
            {moods.map((mood) => {
              const Icon = mood.icon;
              return (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood)}
                  className={`flex flex-col items-center justify-center gap-4 w-28 h-32 md:w-32 md:h-36 bg-card border border-border rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${mood.bgHover} ${mood.borderHover} group`}
                >
                  <div className={`p-4 rounded-full bg-foreground/5 flex items-center justify-center transition-colors ${mood.baseColor} group-hover:bg-foreground/10`}>
                    <Icon size={36} />
                  </div>
                  <span className="font-medium text-muted-foreground group-hover:text-foreground transition-colors text-sm md:text-base">
                    {mood.label}
                  </span>
                </button>
              );
            })}
          </div>

          <button 
            onClick={handleSkip}
            className="text-muted-foreground hover:text-foreground underline underline-offset-4 text-sm font-medium transition-colors"
          >
            Skip check-in
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full max-w-xl animate-in slide-in-from-bottom-8 duration-500 z-10">
          <button 
            onClick={() => setSelectedMood(null)}
            className="self-start mb-6 text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <ArrowRight className="rotate-180" size={16} /> Back to moods
          </button>
          
          <div className="w-full bg-card/60 backdrop-blur-xl border border-border p-6 md:p-8 rounded-3xl shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <selectedMood.icon className={selectedMood.baseColor} size={28} />
              <h3 className="text-xl font-semibold">Starting points</h3>
            </div>
            <p className="text-muted-foreground mb-6">Tap a thought to send it to Haven and start your session, or skip to type your own.</p>
            
            <div className="flex flex-col gap-3 mb-8">
              {selectedMood.openers.map((opener, i) => (
                <button
                  key={i}
                  onClick={() => handleOpenerSelect(opener)}
                  className="text-left w-full p-4 rounded-xl border border-border bg-background hover:border-primary hover:bg-primary/5 transition-all group flex items-center justify-between"
                >
                  <span className="text-foreground group-hover:text-primary transition-colors">{opener}</span>
                  <ArrowRight size={18} className="text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all -translate-x-2 group-hover:translate-x-0" />
                </button>
              ))}
            </div>

            <button 
              onClick={handleSkip}
              className="w-full text-center text-muted-foreground hover:text-foreground underline underline-offset-4 text-sm font-medium transition-colors"
            >
              Skip and type my own message
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
