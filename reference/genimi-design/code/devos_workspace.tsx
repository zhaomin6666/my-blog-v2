import React, { useState, useEffect } from 'react';
import { 
  Terminal, Layout, Maximize2, Minimize2, X, 
  Wifi, Battery, Search, ChevronRight, Hash 
} from 'lucide-react';

const AppleLike = ({ size = 16, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5h-2c0-3-1-4-2-5Z"/>
  </svg>
);

type WindowState = 'open' | 'minimized' | 'maximized' | 'closed';
type Theme = 'light' | 'dark';
type Lang = 'en' | 'zh';
type DesignStyle = 'styleA' | 'styleB'; // Style A: macOS Glass, Style B: Vercel Minimal

function StatusBar({ 
  theme, setTheme, lang, setLang, designStyle, setDesignStyle, setMainState, setConsoleState, focusWin
}: { 
  theme: Theme; setTheme: (t: Theme) => void;
  lang: Lang; setLang: (l: Lang) => void;
  designStyle: DesignStyle; setDesignStyle: (s: DesignStyle) => void;
  setMainState: (s: WindowState) => void;
  setConsoleState: (s: WindowState) => void;
  focusWin: (win: 'main' | 'console') => void;
}) {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (designStyle === 'styleA') {
    // Style A: macOS Glassmorphism
    return (
      <div className="h-7 flex-none bg-white/40 dark:bg-black/40 backdrop-blur-xl px-4 flex items-center justify-between z-50 text-[13px] font-medium select-none shadow-[0_1px_0_rgba(0,0,0,0.05)] dark:shadow-[0_1px_0_rgba(255,255,255,0.05)] text-zinc-900 dark:text-zinc-100">
        <div className="flex items-center gap-5">
          <div className="font-bold flex items-center gap-2 cursor-default"><AppleLike size={14} className="mb-0.5" /> <span className="hidden sm:inline">DevOS</span></div>
          <div className="hidden md:flex gap-4">
            <button className="hover:text-black dark:hover:text-white drop-shadow-sm font-semibold" onClick={() => { setMainState('open'); focusWin('main'); }}>Portfolio</button>
            <button className="hover:text-black dark:hover:text-white drop-shadow-sm" onClick={() => { setConsoleState('open'); focusWin('console'); }}>Terminal</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setDesignStyle('styleB')} className="text-blue-600 dark:text-blue-400 font-bold animate-pulse">Switch to B (Minimal)</button>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? 'Light' : 'Dark'}</button>
          <div className="hidden sm:flex items-center gap-3 ml-2"><Wifi size={14} /><Search size={14} /><Battery size={14} /></div>
          <div className="w-24 text-right drop-shadow-sm ml-2">{time ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '--:--'}</div>
        </div>
      </div>
    );
  }

  // Style B: Minimal Vercel Edge
  return (
    <div className="h-8 flex-none border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black px-4 flex items-center justify-between z-50 text-xs font-medium font-mono select-none">
      <div className="flex items-center gap-6">
        <div className="font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-100 tracking-tighter"><Hash size={12} /> DevOS</div>
        <div className="hidden md:flex gap-4 text-zinc-500 dark:text-zinc-400">
          <button className="hover:text-black dark:hover:text-white transition-colors" onClick={() => { setMainState('open'); focusWin('main'); }}>[Portfolio]</button>
          <button className="hover:text-black dark:hover:text-white transition-colors" onClick={() => { setConsoleState('open'); focusWin('console'); }}>[Console]</button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={() => setDesignStyle('styleA')} className="text-emerald-600 dark:text-emerald-400 font-bold animate-pulse">[Switch to A (macOS)]</button>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="hover:text-black dark:hover:text-white transition-colors">{theme === 'dark' ? 'LGT' : 'DRK'}</button>
        <div className="w-12 text-right text-zinc-500">{time ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '--:--'}</div>
      </div>
    </div>
  );
}

function Desktop({ 
  designStyle, setMainState, setConsoleState, focusWin 
}: { 
  designStyle: DesignStyle;
  setMainState: (s: WindowState) => void;
  setConsoleState: (s: WindowState) => void;
  focusWin: (win: 'main' | 'console') => void;
}) {
  if (designStyle === 'styleA') {
    return (
      <div className="absolute inset-0 z-0 bg-[#f0f4f8] dark:bg-[#0f141e] overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-blue-400/30 dark:bg-indigo-600/30 blur-[120px] mix-blend-multiply dark:mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[80%] rounded-full bg-purple-400/30 dark:bg-fuchsia-600/30 blur-[120px] mix-blend-multiply dark:mix-blend-screen pointer-events-none"></div>
        
        <div className="absolute top-8 right-8 flex flex-col gap-6 z-10">
          <button onDoubleClick={() => { setMainState('open'); focusWin('main'); }} className="flex flex-col items-center gap-1.5 w-24 group outline-none">
            <div className="w-16 h-16 rounded-2xl bg-white/20 dark:bg-black/20 border border-white/40 dark:border-white/10 backdrop-blur-md shadow-lg flex items-center justify-center group-hover:bg-white/30 transition-all"><Layout size={32} className="text-zinc-800 dark:text-zinc-200 drop-shadow-md" /></div>
            <span className="text-[13px] text-zinc-900 dark:text-zinc-100 font-medium drop-shadow-md">Portfolio</span>
          </button>
          <button onDoubleClick={() => { setConsoleState('open'); focusWin('console'); }} className="flex flex-col items-center gap-1.5 w-24 group outline-none">
            <div className="w-16 h-16 rounded-2xl bg-white/20 dark:bg-black/20 border border-white/40 dark:border-white/10 backdrop-blur-md shadow-lg flex items-center justify-center group-hover:bg-white/30 transition-all"><Terminal size={32} className="text-zinc-800 dark:text-zinc-200 drop-shadow-md" /></div>
            <span className="text-[13px] text-zinc-900 dark:text-zinc-100 font-medium drop-shadow-md">Terminal</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0 bg-zinc-50 dark:bg-[#0A0A0A]">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-50"></div>
      
      <div className="absolute top-8 left-8 flex flex-col gap-6 z-10">
        <button onDoubleClick={() => { setMainState('open'); focusWin('main'); }} className="flex flex-col items-center gap-2 w-24 group outline-none">
          <div className="w-12 h-12 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-center group-hover:border-zinc-400 transition-colors"><Layout className="text-zinc-600 dark:text-zinc-400" size={20} /></div>
          <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Main App</span>
        </button>
        <button onDoubleClick={() => { setConsoleState('open'); focusWin('console'); }} className="flex flex-col items-center gap-2 w-24 group outline-none">
          <div className="w-12 h-12 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-center group-hover:border-zinc-400 transition-colors"><Terminal className="text-zinc-600 dark:text-zinc-400" size={20} /></div>
          <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Console</span>
        </button>
      </div>
    </div>
  );
}

function WindowFrame({ 
  title, icon, state, setState, isActive, onFocus, children, defaultClasses, maxClasses, designStyle, isDarkContent 
}: {
  title: string; icon: React.ReactNode; state: WindowState; setState: (s: WindowState) => void; isActive: boolean; onFocus: () => void; children: React.ReactNode; defaultClasses: string; maxClasses: string; designStyle: DesignStyle; isDarkContent?: boolean;
}) {
  if (state === 'closed' || state === 'minimized') return null;

  const isMax = state === 'maximized';
  const posClasses = isMax ? maxClasses : defaultClasses;
  const zIndex = isActive ? 'z-40' : 'z-30';

  if (designStyle === 'styleA') {
    const activeShadow = isActive ? 'shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]' : 'shadow-xl';
    return (
      <div onMouseDown={onFocus} className={`absolute flex flex-col bg-white/70 dark:bg-[#1e1e1e]/80 backdrop-blur-2xl border border-white/40 dark:border-white/10 overflow-hidden transition-all duration-300 ${posClasses} ${zIndex} ${activeShadow} ${isMax ? 'rounded-none border-0' : 'rounded-xl'}`}>
        <div className={`h-11 flex-none flex items-center justify-between px-4 select-none ${isActive ? '' : 'opacity-60'} border-b border-zinc-200/50 dark:border-zinc-800/50`}>
          <div className="flex gap-2 w-20 group/controls">
            <button onClick={(e) => { e.stopPropagation(); setState('closed'); }} className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] flex items-center justify-center"><span className="opacity-0 group-hover/controls:opacity-100 text-[#990000] text-[8px] font-bold">✕</span></button>
            <button onClick={(e) => { e.stopPropagation(); setState('minimized'); }} className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] flex items-center justify-center"><span className="opacity-0 group-hover/controls:opacity-100 text-[#995500] text-[8px] font-bold">−</span></button>
            <button onClick={(e) => { e.stopPropagation(); setState(isMax ? 'open' : 'maximized'); }} className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] flex items-center justify-center"><span className="opacity-0 group-hover/controls:opacity-100 text-[#006500] text-[8px] font-bold">＋</span></button>
          </div>
          <div className="flex-1 text-center flex items-center justify-center gap-2 text-[13px] font-semibold text-zinc-700 dark:text-zinc-300"><span className="opacity-60">{icon}</span> {title}</div>
          <div className="w-20"></div>
        </div>
        <div className={`flex-1 overflow-hidden relative ${isDarkContent ? 'bg-black/90' : 'bg-transparent'}`}>{children}</div>
      </div>
    );
  }

  // Style B Window Frame
  return (
    <div onMouseDown={onFocus} className={`absolute flex flex-col bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden transition-all duration-300 ${posClasses} ${zIndex} ${isMax ? 'rounded-none border-0' : 'rounded-md'}`}>
      <div className={`h-9 flex-none flex items-center justify-between px-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 select-none ${isActive ? '' : 'opacity-50 grayscale'}`}>
        <div className="flex gap-2 w-20">
          <button onClick={(e) => { e.stopPropagation(); setState('closed'); }} className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 flex items-center justify-center group"><X size={8} className="opacity-0 group-hover:opacity-100"/></button>
          <button onClick={(e) => { e.stopPropagation(); setState('minimized'); }} className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 flex items-center justify-center group"><Minimize2 size={8} className="opacity-0 group-hover:opacity-100"/></button>
          <button onClick={(e) => { e.stopPropagation(); setState(isMax ? 'open' : 'maximized'); }} className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 flex items-center justify-center group"><Maximize2 size={8} className="opacity-0 group-hover:opacity-100"/></button>
        </div>
        <div className="flex-1 text-center flex items-center justify-center gap-2 text-[11px] font-mono tracking-wider font-semibold text-zinc-600 dark:text-zinc-400 uppercase">{icon} {title}</div>
        <div className="w-20"></div>
      </div>
      <div className="flex-1 overflow-hidden relative bg-white dark:bg-black">{children}</div>
    </div>
  );
}

function MainApp({ designStyle }: { designStyle: DesignStyle }) {
  const isA = designStyle === 'styleA';
  const cardClass = isA 
    ? "bg-white/50 dark:bg-black/30 border border-white/40 dark:border-white/5 rounded-2xl shadow-sm"
    : "border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black rounded-md";
  const heroBg = isA ? "" : "bg-zinc-50 dark:bg-zinc-900/20";
  const pulseClass = isA ? "bg-black/5 dark:bg-white/10" : "bg-zinc-100 dark:bg-zinc-900/50";

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 scroll-smooth">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className={`p-8 md:p-12 ${cardClass} ${heroBg}`}>
           <div className="space-y-4 max-w-2xl">
             <div className={`h-10 md:h-16 rounded-md animate-pulse w-3/4 ${pulseClass}`}></div>
             <div className={`h-4 rounded-full animate-pulse w-full ${pulseClass}`}></div>
             <div className={`h-4 rounded-full animate-pulse w-5/6 ${pulseClass}`}></div>
           </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`md:col-span-2 p-6 h-48 flex flex-col gap-4 ${cardClass}`}>
             <div className={`h-4 w-24 rounded ${pulseClass}`}></div>
             <div className={`flex-1 rounded-md animate-pulse ${pulseClass}`}></div>
          </div>
          <div className={`p-6 h-48 flex flex-col gap-4 ${cardClass}`}>
             <div className={`h-4 w-24 rounded ${pulseClass}`}></div>
             <div className={`flex-1 rounded-md animate-pulse ${pulseClass}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConsoleApp({ designStyle }: { designStyle: DesignStyle }) {
  const [input, setInput] = useState('');
  const isA = designStyle === 'styleA';

  return (
    <div className={`h-full w-full font-mono text-[13px] p-4 overflow-y-auto cursor-text ${isA ? 'text-zinc-100' : 'bg-white dark:bg-black text-zinc-900 dark:text-zinc-100'}`}>
      <div className="max-w-4xl mx-auto space-y-2 pb-8">
        <div className={`mb-4 ${isA ? 'text-zinc-400' : 'text-zinc-500'}`}>
          {isA ? `Last login: ${new Date().toLocaleString()} on ttys001\nDevOS:~ visitor$ welcome\n` : ''}
          Personal DevOS Terminal v1.0.0{isA ? '' : <br/>} Type "help" to see available commands.
        </div>
        <div className="flex items-center">
          {isA ? <span className="text-green-400 mr-2">DevOS:~ visitor$</span> : <ChevronRight size={14} className="text-zinc-400 mr-2" />}
          <div className="relative flex-1 flex items-center">
             <input
               type="text" value={input} onChange={e => setInput(e.target.value)}
               className={`w-full bg-transparent outline-none caret-transparent absolute inset-0 ${isA ? 'text-zinc-100' : 'text-zinc-900 dark:text-zinc-100'}`}
               autoFocus spellCheck="false" autoComplete="off"
             />
             <div className="pointer-events-none flex whitespace-pre items-center h-full">
               <span>{input}</span>
               <span className={`inline-block animate-pulse ml-[1px] ${isA ? 'w-[8px] h-[15px] bg-zinc-400' : 'w-2 h-3.5 bg-zinc-900 dark:bg-zinc-100'}`}></span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [lang, setLang] = useState<Lang>('en');
  const [designStyle, setDesignStyle] = useState<DesignStyle>('styleA'); // Default to Style A

  const [mainState, setMainState] = useState<WindowState>('open');
  const [consoleState, setConsoleState] = useState<WindowState>('open');
  const [activeWin, setActiveWin] = useState<'main' | 'console'>('main');

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  const focusWin = (win: 'main' | 'console') => setActiveWin(win);

  return (
    <div className={`h-screen w-screen overflow-hidden flex flex-col font-sans transition-colors duration-200 ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <StatusBar 
        theme={theme} setTheme={setTheme} 
        lang={lang} setLang={setLang}
        designStyle={designStyle} setDesignStyle={setDesignStyle}
        setMainState={setMainState} setConsoleState={setConsoleState}
        focusWin={focusWin}
      />
      <div className="flex-1 relative overflow-hidden">
        <Desktop designStyle={designStyle} setMainState={setMainState} setConsoleState={setConsoleState} focusWin={focusWin} />
        
        <WindowFrame 
          title="Portfolio.app" icon={<Layout size={12} />}
          state={mainState} setState={setMainState} isActive={activeWin === 'main'} onFocus={() => focusWin('main')}
          defaultClasses={designStyle === 'styleA' 
            ? "top-4 left-4 right-4 bottom-80 md:left-[10%] md:right-[10%] md:top-[5%] md:bottom-[360px]" 
            : "top-4 left-4 right-4 bottom-80 md:left-8 md:right-8 md:top-6 md:bottom-[340px]"}
          maxClasses="inset-0" designStyle={designStyle}
        >
          <MainApp designStyle={designStyle} />
        </WindowFrame>

        <WindowFrame 
          title={designStyle === 'styleA' ? "visitor@DevOS: ~" : "Terminal.app"} icon={<Terminal size={12} />}
          state={consoleState} setState={setConsoleState} isActive={activeWin === 'console'} onFocus={() => focusWin('console')}
          defaultClasses={designStyle === 'styleA'
            ? "bottom-4 left-4 right-4 h-[300px] md:bottom-8 md:left-[15%] md:right-[15%]"
            : "bottom-0 left-0 right-0 h-[300px] border-b-0 rounded-b-none md:bottom-4 md:left-8 md:right-8 md:rounded-b-md md:border-b"}
          maxClasses="inset-0" designStyle={designStyle} isDarkContent={designStyle === 'styleA'}
        >
          <ConsoleApp designStyle={designStyle} />
        </WindowFrame>
      </div>
    </div>
  );
}