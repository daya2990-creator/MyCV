import React from 'react';
import { MapPin, Phone, Mail, Link as LinkIcon, Github, Linkedin } from 'lucide-react';

// --- DYNAMIC DATA TYPES ---
export type SectionItem = {
  id: string;
  title?: string;       
  subtitle?: string;    
  date?: string;        
  location?: string;    
  description?: string; 
  tags?: string[];      
};

export type Section = {
  id: string;
  title: string;
  type: 'text' | 'list' | 'skills' | 'break';
  items: SectionItem[];
  content?: string;
  isVisible: boolean;
  column?: 'left' | 'right' | 'full';
};

export type ResumeData = {
  basics: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    jobTitle: string;
    image?: string;
  };
  sections: Section[];
};

type TemplateProps = {
  data: ResumeData;
  theme: {
    color: string;
    font: string;
    fontSize?: 'small' | 'medium' | 'large';
  };
};

// --- STRICT CORPORATE FONT SCALING ---
const getThemeStyles = (size: 'small' | 'medium' | 'large' = 'medium') => {
  switch (size) {
    case 'small': // Compact (10px body)
      return {
        name: 'text-xl', // 20px
        job: 'text-xs',
        contact: 'text-[10px]',
        sectionTitle: 'text-xs',
        itemTitle: 'text-xs font-bold',
        itemSubtitle: 'text-[10px]',
        body: 'text-[10px]',
        date: 'text-[9px]',
        tag: 'text-[9px]',
        spacing: 'space-y-2',
        mb: 'mb-2'
      };
    case 'large': // Readable (12px body - Standard Corporate)
      return {
        name: 'text-3xl', // 30px
        job: 'text-base',
        contact: 'text-sm',
        sectionTitle: 'text-base',
        itemTitle: 'text-sm font-bold',
        itemSubtitle: 'text-sm',
        body: 'text-sm', // 14px
        date: 'text-xs',
        tag: 'text-xs',
        spacing: 'space-y-4',
        mb: 'mb-4'
      };
    default: // Medium (11px body - Safe Bet)
      return {
        name: 'text-2xl', // 24px
        job: 'text-sm',
        contact: 'text-xs', 
        sectionTitle: 'text-sm', // 14px
        itemTitle: 'text-sm font-bold', 
        itemSubtitle: 'text-xs', 
        body: 'text-xs', // 12px (Standard Resume Size)
        date: 'text-[10px]',
        tag: 'text-[10px]',
        spacing: 'space-y-3',
        mb: 'mb-3'
      };
  }
};

// --- HELPER: PAGINATION ---
const usePages = (sections: Section[]) => {
  const pages: Section[][] = [];
  let currentPage: Section[] = [];
  sections.forEach(section => {
    if (section.type === 'break') {
      pages.push(currentPage);
      currentPage = [];
    } else {
      currentPage.push(section);
    }
  });
  if (currentPage.length > 0 || pages.length === 0) pages.push(currentPage);
  return pages;
};

const getPageColumns = (pageSections: Section[]) => {
  return {
    left: pageSections.filter(s => s.column === 'left'),
    right: pageSections.filter(s => s.column !== 'left'),
    full: pageSections 
  };
};

// --- HELPER: RICH TEXT RENDERER ---
// This converts the HTML string from the editor into actual formatted text
const RichText = ({ content, className = "" }: { content?: string, className?: string }) => {
  if (!content) return null;
  return (
    <div 
      className={`rte-content ${className}`}
      dangerouslySetInnerHTML={{ __html: content }} 
    />
  );
};

// --- COMPONENT: PAGE ---
const Page = ({ children, font, className = "", style = {} }: { children: React.ReactNode, font: string, className?: string, style?: React.CSSProperties }) => (
  <div 
    className={`page-sheet w-[210mm] min-h-[297mm] bg-white shadow-xl mb-8 overflow-hidden relative print:shadow-none print:mb-0 print:break-after-page ${className}`}
    style={{ fontFamily: font, ...style }}
  >
    {children}
  </div>
);

// --- SECTION RENDERER ---
const SectionRenderer = ({ section, theme, className = "" }: { section: Section, theme: any, className?: string }) => {
  if (!section.isVisible) return null;
  if (section.type === 'break') return null;

  const styles = getThemeStyles(theme.fontSize || 'medium');
  const headerStyle = { color: theme.color, borderColor: theme.color };
  
  return (
    <div className={`mb-4 ${className}`} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
      <h3 className={`uppercase tracking-widest font-bold border-b pb-1 mb-2 ${styles.sectionTitle}`} style={headerStyle}>
        {section.title}
      </h3>
      
      {section.type === 'text' && (
        <RichText content={section.content} className={`leading-relaxed text-slate-700 ${styles.body}`} />
      )}

      {section.type === 'skills' && (
        <div className="flex flex-wrap gap-2">
          {section.items.flatMap(i => i.tags || []).map((tag, idx) => (
            <span key={idx} className={`px-2 py-1 bg-slate-100 rounded text-slate-700 font-medium border border-slate-200 print:border-slate-300 ${styles.tag}`}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {section.type === 'list' && (
        <div className={styles.spacing}>
          {section.items.map(item => (
            <div key={item.id} style={{ breakInside: 'avoid' }}>
              <div className="flex justify-between items-baseline">
                 <h4 className={`text-slate-900 ${styles.itemTitle}`}>{item.title}</h4>
                 <span className={`font-mono text-slate-500 whitespace-nowrap ${styles.date}`}>{item.date}</span>
              </div>
              {item.subtitle && <div className={`font-bold opacity-90 ${styles.itemSubtitle}`} style={{ color: theme.color }}>{item.subtitle}</div>}
              <RichText content={item.description} className={`text-slate-700 leading-relaxed mt-1 ${styles.body}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- WRAPPER ---
const MultiPageWrapper = ({ data, theme, renderPage, pageStyle }: { data: ResumeData, theme: any, renderPage: (pageSections: Section[], index: number, styles: any) => React.ReactNode, pageStyle?: React.CSSProperties }) => {
  const pages = usePages(data.sections);
  const styles = getThemeStyles(theme.fontSize || 'medium');
  
  return (
    <>
      <style>{`
        @media print { 
          .print\\:break-after-page { break-after: page; } 
          body { -webkit-print-color-adjust: exact; } 
          @page { margin: 0; } 
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
        /* RTE STYLES to ensure bold/italic show up */
        .rte-content b, .rte-content strong { font-weight: bold; }
        .rte-content i, .rte-content em { font-style: italic; }
        .rte-content u { text-decoration: underline; }
        .rte-content ul { list-style-type: disc; margin-left: 1.2em; }
        .rte-content ol { list-style-type: decimal; margin-left: 1.2em; }
        .rte-content li { margin-bottom: 0.2em; }
      `}</style>
      {pages.map((pageSections, index) => (
        <Page key={index} font={theme.font} style={pageStyle}>
          {renderPage(pageSections, index, styles)}
        </Page>
      ))}
    </>
  );
};

// =====================================================================
// TEMPLATE 1: MODERN GRID
// =====================================================================
export const Template1 = ({ data, theme }: TemplateProps) => (
  <MultiPageWrapper 
    data={data} 
    theme={theme} 
    pageStyle={{ background: `linear-gradient(to right, #f8fafc 32%, #ffffff 32%)` }} 
    renderPage={(sections, index, styles) => {
      const { left, right } = getPageColumns(sections);
      return (
        <div className="flex h-full text-slate-800">
          <div className="w-[32%] p-8 border-r border-slate-200/50 min-h-[297mm]">
            {index === 0 && (
              <div className="mb-6">
                {data.basics.image && <img src={data.basics.image} className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-white shadow-md mx-auto" alt="Profile"/>}
                <h1 className={`font-bold leading-tight mb-1 ${styles.name}`} style={{ color: theme.color }}>{data.basics.fullName}</h1>
                <p className={`font-bold uppercase tracking-widest text-slate-500 ${styles.job}`}>{data.basics.jobTitle}</p>
                <div className={`space-y-1 text-slate-600 mt-4 ${styles.contact}`}>
                   <div className="flex gap-2 items-center"><Mail size={12}/> <span className="break-all">{data.basics.email}</span></div>
                   <div className="flex gap-2 items-center"><Phone size={12}/> {data.basics.phone}</div>
                   {data.basics.location && <div className="flex gap-2 items-center"><MapPin size={12}/> {data.basics.location}</div>}
                </div>
              </div>
            )}
            {left.map(s => <SectionRenderer key={s.id} section={s} theme={theme} />)}
          </div>
          <div className="w-[68%] p-8">
             {right.map(s => <SectionRenderer key={s.id} section={s} theme={theme} />)}
          </div>
        </div>
      );
    }}
  />
);

// =====================================================================
// TEMPLATE 2: CLEAN RIGHT
// =====================================================================
export const Template2 = ({ data, theme }: TemplateProps) => (
  <MultiPageWrapper data={data} theme={theme} renderPage={(sections, index, styles) => {
    const { left, right } = getPageColumns(sections);
    return (
      <div className="p-10 text-slate-900 h-full">
        {index === 0 && (
          <header className="flex justify-between items-end border-b pb-6 mb-6" style={{ borderColor: theme.color }}>
             <div className="flex items-center gap-4">
               {data.basics.image && <img src={data.basics.image} className="w-16 h-16 rounded-lg object-cover shadow-sm" alt="Profile"/>}
               <div><h1 className={`font-bold tracking-tight ${styles.name}`}>{data.basics.fullName}</h1><div className={`mt-1 font-medium ${styles.job}`} style={{ color: theme.color }}>{data.basics.jobTitle}</div></div>
             </div>
             <div className={`text-right space-y-1 ${styles.contact}`}><div>{data.basics.email}</div><div>{data.basics.phone}</div></div>
          </header>
        )}
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-8">{right.map(s => <SectionRenderer key={s.id} section={s} theme={theme} />)}</div>
          <div className="col-span-4">{left.map(s => <SectionRenderer key={s.id} section={s} theme={theme} />)}</div>
        </div>
      </div>
    );
  }}/>
);

// --- TEMPLATE STUBS (All use SectionRenderer which now respects strict corporate sizing) ---
export const Template3 = ({data, theme}: TemplateProps) => <MultiPageWrapper data={data} theme={theme} renderPage={(s, i, styles) => <div className="p-10 text-slate-800 h-full">{i===0 && <div className="text-center mb-8 border-b pb-6"><h1 className={`font-bold uppercase tracking-widest mb-2 ${styles.name}`}>{data.basics.fullName}</h1><p className={`text-slate-500 font-medium uppercase tracking-widest ${styles.job}`}>{data.basics.jobTitle}</p><div className={`flex justify-center gap-4 text-slate-400 mt-4 ${styles.contact}`}><span>{data.basics.email}</span><span>•</span><span>{data.basics.phone}</span></div></div>}<div className="grid grid-cols-2 gap-8"><div>{getPageColumns(s).right.map(sec=><SectionRenderer key={sec.id} section={sec} theme={theme}/>)}</div><div>{getPageColumns(s).left.map(sec=><SectionRenderer key={sec.id} section={sec} theme={theme}/>)}</div></div></div>} />
export const Template4 = ({data, theme}: TemplateProps) => <MultiPageWrapper data={data} theme={theme} renderPage={(s, i, styles) => <div className="p-8 h-full text-slate-800">{i===0 && <div className="flex items-center gap-6 border-b pb-6 mb-6"><div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg" style={{ backgroundColor: theme.color }}>{data.basics.fullName.substring(0,2)}</div><div><h1 className={`font-bold ${styles.name}`}>{data.basics.fullName}</h1><p className={`opacity-75 ${styles.job}`} style={{color: theme.color}}>{data.basics.jobTitle}</p></div></div>}<div className="grid grid-cols-3 gap-8"><div className="col-span-2">{getPageColumns(s).right.map(sec=><SectionRenderer key={sec.id} section={sec} theme={theme}/>)}</div><div className="col-span-1 bg-slate-50 p-4 rounded-xl">{getPageColumns(s).left.map(sec=><SectionRenderer key={sec.id} section={sec} theme={theme}/>)}</div></div></div>} />
export const Template5 = ({data, theme}: TemplateProps) => <MultiPageWrapper data={data} theme={theme} renderPage={(s, i, styles) => <div className="h-full text-slate-800">{i===0 && <div className="p-10 text-white" style={{ backgroundColor: theme.color }}><h1 className={`font-black tracking-tighter mb-1 uppercase ${styles.name}`}>{data.basics.fullName}</h1><p className={`opacity-90 ${styles.job}`}>{data.basics.jobTitle}</p></div>}<div className="p-10 grid grid-cols-12 gap-8"><div className="col-span-4 border-r pr-6">{getPageColumns(s).left.map(sec=><SectionRenderer key={sec.id} section={sec} theme={theme} />)}</div><div className="col-span-8">{getPageColumns(s).right.map(sec=><SectionRenderer key={sec.id} section={sec} theme={theme} />)}</div></div></div>} />
export const Template6 = ({data, theme}: TemplateProps) => <MultiPageWrapper data={data} theme={theme} renderPage={(s, i, styles) => <div className="p-12 text-slate-800 font-mono h-full">{i===0 && <header className="mb-10 border-b border-slate-900 pb-6 flex justify-between items-end"><div><h1 className={`font-bold tracking-tighter ${styles.name}`}>{data.basics.fullName}</h1><p className={`font-bold uppercase text-slate-500 ${styles.job}`}>{data.basics.jobTitle}</p></div><div className={`text-right ${styles.contact}`}><div>{data.basics.email}</div><div>{data.basics.phone}</div></div></header>}<div className="space-y-8">{s.map(sec => <div key={sec.id} className="grid grid-cols-12 gap-4"><div className="col-span-3 font-bold uppercase tracking-widest text-xs" style={{color:theme.color}}>{sec.title}</div><div className="col-span-9"><SectionRenderer section={{...sec, title: ''}} theme={theme} /></div></div>)}</div></div>} />
export const Template7 = ({data, theme}: TemplateProps) => <MultiPageWrapper data={data} theme={theme} renderPage={(s, i, styles) => <div className="p-8 h-full text-slate-800">{i===0 && <div className="bg-slate-900 text-white p-8 rounded-2xl mb-8 flex justify-between items-center"><div><h1 className={`font-bold ${styles.name}`}>{data.basics.fullName}</h1><p className={`opacity-80 ${styles.job}`}>{data.basics.jobTitle}</p></div><div className={`text-right opacity-70 ${styles.contact}`}><div>{data.basics.email}</div><div>{data.basics.phone}</div></div></div>}<div className="grid grid-cols-3 gap-8"><div className="col-span-1">{getPageColumns(s).left.map(sec=><SectionRenderer key={sec.id} section={sec} theme={theme} />)}</div><div className="col-span-2 border-l pl-8" style={{borderColor: theme.color}}>{getPageColumns(s).right.map(sec=><SectionRenderer key={sec.id} section={sec} theme={theme} />)}</div></div></div>} />
export const Template8 = ({data, theme}: TemplateProps) => <MultiPageWrapper data={data} theme={theme} pageStyle={{ background: `linear-gradient(to right, #1e293b 30%, #ffffff 30%)` }} renderPage={(s, i, styles) => { const lightTextProps = { textColor: "text-slate-300", subTextColor: "text-slate-400", dateColor: "text-slate-400", tagBg: "bg-slate-800", tagText: "text-slate-300", tagBorder: "border-slate-700" }; return <div className="w-full h-full flex text-white"><div className="w-[30%] p-6 border-r border-slate-700 min-h-[297mm]">{i===0 && <div className="text-center mb-8 pb-6 border-b border-slate-700 pt-4"><h1 className={`font-bold leading-tight text-white ${styles.name}`}>{data.basics.fullName}</h1><div className={`text-slate-400 mt-2 font-mono break-all ${styles.contact}`}>{data.basics.email}</div></div>}{getPageColumns(s).left.map(sec=><div key={sec.id} className="mb-6"><SectionRenderer section={sec} theme={theme} /></div>)}</div><div className="w-[70%] p-10 text-slate-900 min-h-[297mm]">{getPageColumns(s).right.map(sec=><SectionRenderer key={sec.id} section={sec} theme={theme} />)}</div></div>}} />
export const Template9 = ({data, theme}: TemplateProps) => <MultiPageWrapper data={data} theme={theme} pageStyle={{ background: `linear-gradient(to right, #f1f5f9 30%, #ffffff 30%)` }} renderPage={(s, i, styles) => <div className="flex text-slate-700 h-full"><div className="w-[30%] p-6 min-h-[297mm]">{i===0 && <div className="mb-8"><h1 className={`font-bold text-slate-900 leading-none mb-1 break-words ${styles.name}`}>{data.basics.fullName}</h1><p className={`font-bold uppercase tracking-widest text-slate-500 ${styles.job}`}>{data.basics.jobTitle}</p><div className={`mt-6 space-y-1 ${styles.contact}`}><div className="font-bold text-slate-400 uppercase mb-1">CONTACT</div><div className="break-all">{data.basics.email}</div><div>{data.basics.phone}</div></div></div>}{getPageColumns(s).left.map(sec=><div key={sec.id} className="mb-6"><SectionRenderer section={sec} theme={theme}/></div>)}</div><div className="w-[70%] p-10">{getPageColumns(s).right.map(sec=><div key={sec.id} className="mb-6"><SectionRenderer section={sec} theme={theme}/></div>)}</div></div>} />
export const Template10 = ({data, theme}: TemplateProps) => <MultiPageWrapper data={data} theme={theme} renderPage={(s, i, styles) => <div className="p-10 text-slate-800 h-full">{i===0 && <header className="flex justify-between items-end border-b-2 border-slate-100 pb-8 mb-10"><div><h1 className={`font-bold tracking-tight text-slate-900 ${styles.name}`} style={{color:theme.color}}>{data.basics.fullName}</h1><p className={`font-medium text-slate-500 mt-1 ${styles.job}`}>{data.basics.jobTitle}</p></div><div className={`text-right text-slate-500 ${styles.contact}`}><div>{data.basics.email}</div><div>{data.basics.phone}</div></div></header>}<div className="grid grid-cols-12 gap-10"><div className="col-span-8">{getPageColumns(s).right.map(sec=><div key={sec.id} className="mb-8"><SectionRenderer section={sec} theme={theme}/></div>)}</div><div className="col-span-4">{getPageColumns(s).left.map(sec=><div key={sec.id} className="mb-8"><SectionRenderer section={sec} theme={theme}/></div>)}</div></div></div>} />
export const Template11 = ({data, theme}: TemplateProps) => <MultiPageWrapper data={data} theme={theme} renderPage={(s, i, styles) => <div className="p-12 text-center text-slate-900">{i===0 && <header className="mb-10 border-b-2 border-slate-100 pb-10"><h1 className={`font-bold tracking-widest uppercase mb-4 ${styles.name}`}>{data.basics.fullName}</h1><div className={`flex justify-center gap-6 font-bold uppercase text-slate-400 ${styles.contact}`}><span>{data.basics.email}</span><span>|</span><span>{data.basics.phone}</span></div></header>}<div className="text-left max-w-4xl mx-auto space-y-10">{s.map(sec=><div key={sec.id} className="text-center"><h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-4 pb-1 border-b inline-block">{sec.title}</h3><SectionRenderer section={{...sec, title:''}} theme={theme} className="text-center"/></div>)}</div></div>} />
export const Template12 = ({data, theme}: TemplateProps) => <MultiPageWrapper data={data} theme={theme} renderPage={(s, i, styles) => <div className="p-10 font-sans text-slate-900">{i===0 && <div className="text-center border-b border-slate-300 pb-6 mb-6"><h1 className={`font-bold uppercase ${styles.name}`}>{data.basics.fullName}</h1><div className={`mt-2 flex justify-center gap-4 ${styles.contact}`}><span>{data.basics.email}</span><span>|</span><span>{data.basics.phone}</span></div></div>}<div className="space-y-6"><div className="bg-slate-100 p-4 rounded text-center"><h2 className={`font-bold uppercase tracking-widest text-slate-700 ${styles.job}`}>{data.basics.jobTitle}</h2></div><div className="grid grid-cols-2 gap-6">{s.map(sec => <div key={sec.id} className={sec.column === 'full' ? 'col-span-2' : 'col-span-1'}><h3 className="font-bold uppercase text-xs border-b border-slate-300 mb-2" style={{color:theme.color}}>{sec.title}</h3><SectionRenderer section={{...sec, title:''}} theme={theme}/></div>)}</div></div></div>} />
export const Template13 = ({data, theme}: TemplateProps) => <MultiPageWrapper data={data} theme={theme} pageStyle={{ background: `linear-gradient(to right, #0f172a 80px, #ffffff 80px)` }} renderPage={(s, i, styles) => { const {left, right} = getPageColumns(s); return <div className="flex h-full font-sans text-slate-800"><div className="w-[80px] flex items-center justify-center text-white min-h-[297mm]">{i===0 && <div className="writing-vertical-lr transform rotate-180 text-5xl font-black tracking-widest opacity-20 uppercase whitespace-nowrap">{data.basics.fullName.split(' ')[0]}</div>}</div><div className="flex-1 p-10">{i===0 && <div className="mb-10"><h1 className="text-6xl font-black text-slate-900 mb-1 leading-none">{data.basics.fullName}</h1><p className={`font-medium text-slate-400 mb-8 ${styles.job}`}>{data.basics.jobTitle}</p></div>}<div className="grid grid-cols-2 gap-12"><div className="space-y-8">{right.map(sec=><SectionRenderer key={sec.id} section={sec} theme={theme}/>)}</div><div className="space-y-8">{i===0 && <div className="bg-slate-50 p-6 rounded-3xl space-y-2"><div className="text-[10px] font-bold uppercase text-slate-400">Contact</div><div className={`text-sm ${styles.contact}`}>{data.basics.email}<br/>{data.basics.phone}</div></div>}{left.map(sec=><SectionRenderer key={sec.id} section={sec} theme={theme}/>)}</div></div></div></div>}} />
export const Template14 = ({data, theme}: TemplateProps) => <MultiPageWrapper data={data} theme={theme} renderPage={(s, i, styles) => <div className="p-12 font-serif text-slate-900">{i===0 && <div className="border-b-2 border-black pb-6 mb-8 text-center"><h1 className={`font-bold uppercase ${styles.name}`}>{data.basics.fullName}</h1><p className={`italic text-slate-600 mt-1 ${styles.job}`}>{data.basics.jobTitle}</p><div className={`mt-2 ${styles.contact}`}>{data.basics.email} • {data.basics.phone}</div></div>}<div className="space-y-6">{s.map(sec=><section key={sec.id}><h3 className="font-bold uppercase text-xs border-b border-slate-300 mb-3">{sec.title}</h3><SectionRenderer section={{...sec, title:''}} theme={theme}/></section>)}</div></div>} />
export const Template15 = ({data, theme}: TemplateProps) => <MultiPageWrapper data={data} theme={theme} renderPage={(s, i, styles) => { const {left, right} = getPageColumns(s); return <div className="p-10 font-sans text-slate-800">{i===0 && <div className="flex justify-between items-start mb-12"><div><h1 className={`font-bold text-slate-900 tracking-tight ${styles.name}`}>{data.basics.fullName}</h1></div><div className={`text-right font-medium text-slate-400 space-y-1 ${styles.contact}`}><p>{data.basics.email}</p><p>{data.basics.phone}</p></div></div>}<div className="grid grid-cols-4 gap-10"><div className="col-span-1 space-y-10 pt-4 border-t border-slate-200">{left.map(sec=><SectionRenderer key={sec.id} section={sec} theme={theme}/>)}</div><div className="col-span-3 space-y-10 pt-4 border-t border-slate-900">{right.map(sec=><SectionRenderer key={sec.id} section={sec} theme={theme}/>)}</div></div></div>}} />
export const Template16 = ({data, theme}: TemplateProps) => <MultiPageWrapper data={data} theme={theme} pageStyle={{ background: '#000000', color: '#4ade80' }} renderPage={(s, i, styles) => { const lightTextProps = { textColor: "text-green-400", subTextColor: "text-green-600", dateColor: "text-green-600", tagBg: "bg-green-900/30", tagText: "text-green-400", tagBorder: "border-green-800" }; return <div className="bg-black text-green-400 p-8 font-mono text-xs h-full"><div className="border border-green-800 p-8 h-full">{i===0 && <header className="border-b border-green-800 pb-8 mb-8 flex justify-between"><div><h1 className={`font-bold mb-2 glitch-text ${styles.name}`}>{data.basics.fullName}</h1></div><div className={`text-right opacity-70 ${styles.contact}`}><div>{data.basics.email}</div></div></header>}<div className="grid grid-cols-2 gap-8"><div>{s.filter((_,idx)=>idx%2===0).map(sec=><div key={sec.id} className="mb-6"><h3 className="text-green-600 font-bold mb-3 text-sm">{`> ${sec.title.toUpperCase()}`}</h3><div className="border-l border-green-900 pl-4"><SectionRenderer section={{...sec, title:''}} theme={theme} {...lightTextProps}/></div></div>)}</div><div>{s.filter((_,idx)=>idx%2!==0).map(sec=><div key={sec.id} className="mb-6"><h3 className="text-green-600 font-bold mb-3 text-sm">{`> ${sec.title.toUpperCase()}`}</h3><SectionRenderer section={{...sec, title:''}} theme={theme} {...lightTextProps}/></div>)}</div></div></div></div>}} />
export const Template17 = ({data, theme}: TemplateProps) => <MultiPageWrapper data={data} theme={theme} renderPage={(s, i, styles) => { const {left, right} = getPageColumns(s); return <div className="p-6 font-sans text-slate-900">{i===0 && <div className="flex justify-between border-b-2 border-black pb-2 mb-4"><div className="flex gap-4 items-baseline"><h1 className={`font-bold uppercase ${styles.name}`}>{data.basics.fullName}</h1></div><div className={`flex gap-4 ${styles.contact}`}><span>{data.basics.email}</span></div></div>}<div className="grid grid-cols-12 gap-4 text-sm"><div className="col-span-3 space-y-6 border-r border-slate-200 pr-4">{left.map(sec=><div key={sec.id}><h3 className="font-bold border-b border-black mb-1 text-xs">{sec.title}</h3><SectionRenderer section={{...sec, title:''}} theme={theme}/></div>)}</div><div className="col-span-9 space-y-6">{right.map(sec=><div key={sec.id}><h3 className="font-bold border-b border-black mb-1 text-xs">{sec.title}</h3><SectionRenderer section={{...sec, title:''}} theme={theme}/></div>)}</div></div></div>}} />
export const Template18 = ({data, theme}: TemplateProps) => <MultiPageWrapper data={data} theme={theme} renderPage={(s, i, styles) => { const {left, right} = getPageColumns(s); return <div className="flex flex-col font-sans h-full">{i===0 && <div className="h-[200px] flex items-center justify-center text-white text-center p-8" style={{backgroundColor:theme.color}}><div><h1 className={`font-bold mb-4 ${styles.name}`}>{data.basics.fullName}</h1></div></div>}<div className="flex-1 p-10 grid grid-cols-2 gap-12 text-slate-800"><div className="space-y-8 text-center">{i===0 && <div className={styles.contact}>{data.basics.email}<br/>{data.basics.phone}</div>}{left.map(sec=><div key={sec.id}><div className="inline-block border-b-2 border-black pb-1 px-4 mb-4 font-bold uppercase tracking-widest text-xs">{sec.title}</div><SectionRenderer section={{...sec, title:''}} theme={theme}/></div>)}</div><div className="space-y-8 text-center border-l border-slate-100 pl-12">{right.map(sec=><div key={sec.id}><h3 className="font-bold text-lg mb-4">{sec.title}</h3><SectionRenderer section={{...sec, title:''}} theme={theme}/></div>)}</div></div></div>}} />
export const Template19 = ({data, theme}: TemplateProps) => <MultiPageWrapper data={data} theme={theme} renderPage={(s, i, styles) => <div className="p-10 font-sans text-slate-800">{i===0 && <div className="flex gap-8 mb-8"><div className="w-[120px] h-[150px] bg-slate-200 flex items-center justify-center text-slate-400 text-xs overflow-hidden">{data.basics.image ? <img src={data.basics.image} className="w-full h-full object-cover"/> : "PHOTO"}</div><div className="flex-1"><h1 className={`font-bold uppercase text-indigo-900 ${styles.name}`} style={{color:theme.color}}>{data.basics.fullName}</h1><div className={`space-y-1 mt-4 ${styles.contact}`}><div className="flex gap-2"><span className="w-20 font-bold text-slate-400">Email:</span>{data.basics.email}</div></div></div></div>}<div className="space-y-6">{s.map(sec=><section key={sec.id}><h3 className="text-sm font-bold uppercase bg-slate-100 p-2 mb-2" style={{borderLeft:`4px solid ${theme.color}`}}>{sec.title}</h3><SectionRenderer section={{...sec, title:''}} theme={theme}/></section>)}</div></div>} />
export const Template20 = ({data, theme}: TemplateProps) => <MultiPageWrapper data={data} theme={theme} renderPage={(s, i, styles) => { const {left, right} = getPageColumns(s); return <div className="bg-slate-100 p-8 font-sans text-slate-800 flex flex-col gap-4 h-full">{i===0 && <div className="bg-white p-6 rounded shadow-sm flex justify-between items-center"><div><h1 className={`font-bold ${styles.name}`}>{data.basics.fullName}</h1></div><div className={`text-right ${styles.contact}`}><div>{data.basics.email}</div></div></div>}<div className="flex gap-4 flex-1"><div className="w-1/3 flex flex-col gap-4"><div className="bg-white p-6 rounded shadow-sm flex-1">{left.map(sec=><div key={sec.id} className="mb-6"><h3 className="font-bold border-b pb-2 mb-4 text-xs">{sec.title}</h3><SectionRenderer section={{...sec, title:''}} theme={theme}/></div>)}</div></div><div className="w-2/3 bg-white p-6 rounded shadow-sm">{right.map(sec=><div key={sec.id} className="mb-6"><h3 className="font-bold border-b pb-2 mb-4 text-xs">{sec.title}</h3><SectionRenderer section={{...sec, title:''}} theme={theme}/></div>)}</div></div></div>}} />