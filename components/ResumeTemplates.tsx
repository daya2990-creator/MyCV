import React from 'react';
import { MapPin, Phone, Mail, Link as LinkIcon } from 'lucide-react';

// --- DATA TYPES ---
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
  isPremium?: boolean;
};

// --- STRICT CORPORATE FONT SCALING ---
const getThemeStyles = (size: 'small' | 'medium' | 'large' = 'medium') => {
  switch (size) {
    case 'small': // 12px Base
      return {
        name: 'text-3xl',
        job: 'text-sm',
        contact: 'text-xs',
        sectionTitle: 'text-sm',
        itemTitle: 'text-sm font-bold',
        itemSubtitle: 'text-xs',
        body: 'text-xs',
        date: 'text-xs',
        tag: 'text-xs',
        spacing: 'space-y-3',
        mb: 'mb-3'
      };
    case 'large': // 16px Base
      return {
        name: 'text-5xl',
        job: 'text-xl',
        contact: 'text-base',
        sectionTitle: 'text-xl',
        itemTitle: 'text-xl font-bold',
        itemSubtitle: 'text-lg',
        body: 'text-base',
        date: 'text-sm',
        tag: 'text-sm',
        spacing: 'space-y-5',
        mb: 'mb-5'
      };
    default: // Medium (14px Base - Standard)
      return {
        name: 'text-4xl',
        job: 'text-lg',
        contact: 'text-sm', 
        sectionTitle: 'text-base', 
        itemTitle: 'text-base font-bold', 
        itemSubtitle: 'text-sm', 
        body: 'text-sm', 
        date: 'text-sm',
        tag: 'text-sm',
        spacing: 'space-y-4',
        mb: 'mb-4'
      };
  }
};

// --- PAGINATION HELPER ---
const usePages = (sections: Section[]) => {
  const pages: Section[][] = [];
  let currentPage: Section[] = [];
  sections.forEach(section => {
    if (section.type === 'break') { pages.push(currentPage); currentPage = []; } 
    else { currentPage.push(section); }
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

const Page = ({ children, font, className = "", style = {} }: { children: React.ReactNode, font: string, className?: string, style?: React.CSSProperties }) => (
  <div className={`page-sheet w-[210mm] min-h-[297mm] bg-white shadow-2xl mb-8 overflow-hidden relative print:shadow-none print:mb-0 print:break-after-page ${className}`} style={{ fontFamily: font, ...style }}>{children}</div>
);

const RichText = ({ content, className = "" }: { content?: string, className?: string }) => {
  if (!content) return null;
  return <div className={`rte-content ${className}`} dangerouslySetInnerHTML={{ __html: content }} />;
};

const SectionRenderer = ({ section, theme, className = "", textColor, subTextColor, dateColor, tagBg, tagText, tagBorder }: any) => {
  if (!section.isVisible) return null;
  if (section.type === 'break') return null;

  const styles = getThemeStyles(theme.fontSize || 'medium');
  const headerStyle = { color: theme.color, borderColor: theme.color };
  const txtColor = textColor || "text-slate-900";
  const dtColor = dateColor || "text-slate-500";
  const tBg = tagBg || "bg-slate-100";
  const tTxt = tagText || "text-slate-700";
  const tBorder = tagBorder || "border-slate-200";
  const subTxtColor = subTextColor || "";

  return (
    <div className={`mb-6 ${className}`} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
      <h3 className={`uppercase tracking-widest font-bold border-b-2 pb-1 mb-3 ${styles.sectionTitle}`} style={headerStyle}>{section.title}</h3>
      {section.type === 'text' && <RichText content={section.content} className={`leading-relaxed text-slate-700 ${styles.body} ${txtColor}`} />}
      {section.type === 'skills' && <div className="flex flex-wrap gap-2">{section.items.flatMap((i:any) => i.tags || []).map((tag:string, idx:number) => <span key={idx} className={`px-3 py-1.5 rounded-md font-medium border ${tBg} ${tTxt} ${tBorder} print:border-slate-300 ${styles.tag}`}>{tag}</span>)}</div>}
      {section.type === 'list' && <div className={styles.spacing}>{section.items.map((item:any) => <div key={item.id} style={{ breakInside: 'avoid' }}><div className="flex justify-between items-baseline"><h4 className={`font-bold ${txtColor} ${styles.itemTitle}`}>{item.title}</h4><span className={`font-mono px-2 py-0.5 rounded whitespace-nowrap ${dtColor} ${styles.date}`}>{item.date}</span></div>{item.subtitle && <div className={`font-bold mb-1 opacity-90 ${subTxtColor} ${styles.itemSubtitle}`} style={{ color: subTextColor ? undefined : theme.color }}>{item.subtitle}</div>}<RichText content={item.description} className={`leading-relaxed mt-1 ${txtColor} ${styles.body}`} /></div>)}</div>}
    </div>
  );
};

const Watermark = () => (
  <div className="absolute bottom-0 left-0 w-full p-2 bg-slate-100 border-t text-center opacity-50 pointer-events-none print:opacity-100">
     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Created with MyCV.guru</p>
  </div>
);

const MultiPageWrapper = ({ data, theme, renderPage, pageStyle, className = "", isPremium }: any) => {
  const pages = usePages(data.sections);
  const styles = getThemeStyles(theme.fontSize || 'medium');
  return (
    <>
      <style>{`@media print { .print\\:break-after-page { break-after: page; } body { -webkit-print-color-adjust: exact; } @page { margin: 0; } * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } } .rte-content b, .rte-content strong { font-weight: bold; } .rte-content i, .rte-content em { font-style: italic; } .rte-content u { text-decoration: underline; } .rte-content ul { list-style-type: disc; margin-left: 1.2em; } .rte-content ol { list-style-type: decimal; margin-left: 1.2em; } .rte-content li { margin-bottom: 0.2em; }`}</style>
      {pages.map((pageSections: any, index: number) => (
        <Page key={index} font={theme.font} style={pageStyle} className={className}>
          {renderPage(pageSections, index, styles)}
          {!isPremium && <Watermark />}
        </Page>
      ))}
    </>
  );
};

// --- TEMPLATES 1-20 ---

export const Template1 = ({ data, theme, isPremium }: TemplateProps) => (
  <MultiPageWrapper 
    data={data} 
    theme={theme}
    isPremium={isPremium} 
    pageStyle={{ background: `linear-gradient(to right, #f8fafc 32%, #ffffff 32%)` }} 
    renderPage={(sections: any, index: number, styles: any) => {
      const { left, right } = getPageColumns(sections);
      return (
        <div className="flex h-full text-slate-800">
          <div className="w-[32%] p-8 border-r border-slate-200/50 min-h-[297mm]">
            {index === 0 && <div className="mb-10">{data.basics.image && <img src={data.basics.image} className="w-32 h-32 rounded-full object-cover mb-6 border-4 border-white shadow-md mx-auto" alt="Profile"/>}<h1 className={`font-bold leading-tight mb-2 ${styles.name}`} style={{ color: theme.color }}>{data.basics.fullName}</h1><p className={`font-bold uppercase tracking-widest text-slate-500 ${styles.job}`}>{data.basics.jobTitle}</p><div className={`space-y-3 text-slate-600 mt-8 ${styles.contact}`}><div className="flex gap-3 items-center"><Mail size={14}/> <span className="break-all">{data.basics.email}</span></div><div className="flex gap-3 items-center"><Phone size={14}/> {data.basics.phone}</div>{data.basics.location && <div className="flex gap-3 items-center"><MapPin size={14}/> {data.basics.location}</div>}</div></div>}
            {left.map((s:any) => <SectionRenderer key={s.id} section={s} theme={theme} />)}
          </div>
          <div className="w-[68%] p-10">
            {right.map((s:any) => <SectionRenderer key={s.id} section={s} theme={theme} />)}
          </div>
        </div>
      );
    }}
  />
);

export const Template2 = ({ data, theme, isPremium }: TemplateProps) => (
  <MultiPageWrapper data={data} theme={theme} isPremium={isPremium} renderPage={(sections: any, index: number, styles: any) => {
    const { left, right } = getPageColumns(sections);
    return (
      <div className="p-12 text-slate-900 h-full">
        {index === 0 && <header className="flex justify-between items-end border-b-2 pb-8 mb-10" style={{ borderColor: theme.color }}><div className="flex items-center gap-6">{data.basics.image && <img src={data.basics.image} className="w-24 h-24 rounded-xl object-cover shadow-sm" alt="Profile"/>}<div><h1 className={`font-bold tracking-tight ${styles.name}`}>{data.basics.fullName}</h1><div className={`mt-2 font-medium ${styles.job}`} style={{ color: theme.color }}>{data.basics.jobTitle}</div></div></div><div className={`text-right space-y-1 ${styles.contact}`}><div>{data.basics.email}</div><div>{data.basics.phone}</div></div></header>}
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-8">{right.map((s:any) => <SectionRenderer key={s.id} section={s} theme={theme} />)}</div>
          <div className="col-span-4">{left.map((s:any) => <SectionRenderer key={s.id} section={s} theme={theme} />)}</div>
        </div>
      </div>
    );
  }}/>
);

export const Template3 = ({ data, theme, isPremium }: TemplateProps) => (
  <MultiPageWrapper data={data} theme={theme} isPremium={isPremium} renderPage={(sections: any, index: number, styles: any) => (
    <div className="p-12 text-slate-800 h-full">
       {index === 0 && <div className="text-center mb-12 border-b pb-10"><h1 className={`font-bold uppercase tracking-widest mb-3 ${styles.name}`}>{data.basics.fullName}</h1><p className={`text-slate-500 font-medium uppercase tracking-widest ${styles.job}`}>{data.basics.jobTitle}</p><div className={`flex justify-center gap-6 text-slate-400 mt-6 ${styles.contact}`}><span>{data.basics.email}</span><span>•</span><span>{data.basics.phone}</span></div></div>}
       <div className="grid grid-cols-2 gap-12">
         <div>{getPageColumns(sections).right.map((s:any) => <SectionRenderer key={s.id} section={s} theme={theme}/>)}</div>
         <div>{getPageColumns(sections).left.map((s:any) => <SectionRenderer key={s.id} section={s} theme={theme}/>)}</div>
       </div>
    </div>
  )}/>
);

export const Template4 = ({ data, theme, isPremium }: TemplateProps) => (
  <MultiPageWrapper data={data} theme={theme} isPremium={isPremium} renderPage={(sections: any, index: number, styles: any) => (
    <div className="p-10 h-full text-slate-800">
       {index === 0 && <div className="flex items-center gap-8 border-b pb-10 mb-10">
          {data.basics.image ? <img src={data.basics.image} className="w-24 h-24 rounded-full object-cover shadow-lg" alt="Profile"/> : <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg" style={{ backgroundColor: theme.color }}>{data.basics.fullName.substring(0,2)}</div>}
          <div><h1 className={`font-bold ${styles.name}`}>{data.basics.fullName}</h1><p className={`opacity-75 ${styles.job}`} style={{color: theme.color}}>{data.basics.jobTitle}</p></div>
       </div>}
       <div className="grid grid-cols-3 gap-10">
         <div className="col-span-2">{getPageColumns(sections).right.map((s:any)=><SectionRenderer key={s.id} section={s} theme={theme}/>)}</div>
         <div className="col-span-1 bg-slate-50 p-6 rounded-xl">{getPageColumns(sections).left.map((s:any)=><SectionRenderer key={s.id} section={s} theme={theme}/>)}</div>
       </div>
    </div>
  )}/>
);

export const Template5 = ({ data, theme, isPremium }: TemplateProps) => (
  <MultiPageWrapper data={data} theme={theme} isPremium={isPremium} renderPage={(sections: any, index: number, styles: any) => (
    <div className="h-full text-slate-800">
       {index === 0 && <div className="p-12 text-white" style={{ backgroundColor: theme.color }}><h1 className={`font-black tracking-tighter mb-1 uppercase ${styles.name}`}>{data.basics.fullName}</h1><p className={`opacity-90 ${styles.job}`}>{data.basics.jobTitle}</p></div>}
       <div className="p-12 grid grid-cols-12 gap-12">
         <div className="col-span-4 border-r pr-8">{getPageColumns(sections).left.map((s:any) => <SectionRenderer key={s.id} section={s} theme={theme} />)}</div>
         <div className="col-span-8">{getPageColumns(sections).right.map((s:any) => <SectionRenderer key={s.id} section={s} theme={theme} />)}</div>
       </div>
    </div>
  )}/>
);

export const Template6 = ({ data, theme, isPremium }: TemplateProps) => (
  <MultiPageWrapper data={data} theme={theme} isPremium={isPremium} renderPage={(sections: any, index: number, styles: any) => (
     <div className="p-14 text-slate-800 font-mono h-full">
        {index === 0 && <header className="mb-14 border-b border-slate-900 pb-8 flex justify-between items-end"><div><h1 className={`font-bold tracking-tighter ${styles.name}`}>{data.basics.fullName}</h1><p className={`font-bold uppercase text-slate-500 ${styles.job}`}>{data.basics.jobTitle}</p></div><div className={`text-right ${styles.contact}`}><div>{data.basics.email}</div><div>{data.basics.phone}</div></div></header>}
        <div className="space-y-10">{sections.map((s:any) => <div key={s.id} className="grid grid-cols-12 gap-6"><div className="col-span-3 font-bold uppercase tracking-widest text-sm" style={{color:theme.color}}>{s.title}</div><div className="col-span-9"><SectionRenderer section={{...s, title: ''}} theme={theme} /></div></div>)}</div>
     </div>
  )}/>
);

export const Template7 = ({ data, theme, isPremium }: TemplateProps) => (
  <MultiPageWrapper data={data} theme={theme} isPremium={isPremium} renderPage={(sections: any, index: number, styles: any) => (
    <div className="p-10 h-full text-slate-800">
       {index === 0 && <div className="bg-slate-900 text-white p-10 rounded-3xl mb-10 flex justify-between items-center"><div><h1 className={`font-bold ${styles.name}`}>{data.basics.fullName}</h1><p className={`opacity-80 ${styles.job}`}>{data.basics.jobTitle}</p></div><div className={`text-right opacity-70 ${styles.contact}`}><div>{data.basics.email}</div><div>{data.basics.phone}</div></div></div>}
       <div className="grid grid-cols-3 gap-10"><div className="col-span-1">{getPageColumns(sections).left.map((s:any) => <SectionRenderer key={s.id} section={s} theme={theme} />)}</div><div className="col-span-2 border-l pl-10" style={{borderColor: theme.color}}>{getPageColumns(sections).right.map((s:any) => <SectionRenderer key={s.id} section={s} theme={theme} />)}</div></div>
    </div>
  )}/>
);

export const Template8 = ({ data, theme, isPremium }: TemplateProps) => (
  <MultiPageWrapper 
    data={data} 
    theme={theme}
    isPremium={isPremium} 
    pageStyle={{ background: `linear-gradient(to right, #1e293b 30%, #0f172a 30%)`, color: 'white' }}
    renderPage={(sections: any, index: number, styles: any) => {
      const { left, right } = getPageColumns(sections);
      const lightTextProps = { textColor: "text-slate-300", subTextColor: "text-slate-400", dateColor: "text-slate-400", tagBg: "bg-slate-800", tagText: "text-slate-300", tagBorder: "border-slate-700" };
      return (
        <div className="w-full h-full flex text-white">
           <div className="w-[30%] p-8 border-r border-slate-700 min-h-[297mm]">
              {index === 0 && (
                 <div className="text-center mb-10 pb-8 border-b border-slate-700 pt-4">
                    {data.basics.image ? (
                       <img src={data.basics.image} className="w-28 h-28 mx-auto rounded-full object-cover border-4 border-slate-600 mb-4" alt="Profile"/>
                    ) : (
                       <div className="w-20 h-20 mx-auto bg-slate-700 rounded-full flex items-center justify-center text-2xl font-bold mb-4 border-2" style={{borderColor: theme.color}}>{data.basics.fullName[0]}</div>
                    )}
                    <h1 className={`font-bold leading-tight text-white ${styles.name}`}>{data.basics.fullName}</h1>
                    <div className={`text-slate-400 mt-2 font-mono break-all ${styles.contact}`}>{data.basics.email}</div>
                 </div>
              )}
              {left.map((s:any) => <div key={s.id} className="mb-8"><SectionRenderer section={s} theme={theme} {...lightTextProps} /></div>)}
           </div>
           <div className="w-[70%] p-12 text-slate-300 min-h-[297mm]">
              {right.map((s:any) => <SectionRenderer key={s.id} section={s} theme={theme} {...lightTextProps} />)}
           </div>
        </div>
      );
    }}
  />
);

export const Template9 = ({ data, theme, isPremium }: TemplateProps) => (
  <MultiPageWrapper 
    data={data} 
    theme={theme} 
    isPremium={isPremium}
    pageStyle={{ background: `linear-gradient(to right, #f1f5f9 30%, #ffffff 30%)` }}
    renderPage={(sections: any, index: number, styles: any) => {
      const { left, right } = getPageColumns(sections);
      return (
        <div className="flex text-slate-700 h-full">
           <div className="w-[30%] p-8 min-h-[297mm]">
             {index === 0 && (
               <div className="mb-10">
                  {data.basics.image && <img src={data.basics.image} className="w-24 h-24 rounded-lg object-cover shadow-sm mb-6" alt="Profile"/>}
                  <h1 className={`font-bold text-slate-900 leading-none mb-2 break-words ${styles.name}`}>{data.basics.fullName}</h1>
                  <p className={`font-bold uppercase tracking-widest text-slate-500 ${styles.job}`}>{data.basics.jobTitle}</p>
                  <div className={`mt-8 space-y-2 ${styles.contact}`}>
                     <div className="font-bold text-slate-400 uppercase mb-1" style={{fontSize: '10px'}}>CONTACT</div>
                     <div className="break-all">{data.basics.email}</div>
                     <div>{data.basics.phone}</div>
                  </div>
               </div>
             )}
             {left.map((s:any) => <div key={s.id} className="mb-8"><SectionRenderer section={s} theme={theme}/></div>)}
          </div>
          <div className="w-[70%] p-12">
             {right.map((s:any) => <div key={s.id} className="mb-8"><SectionRenderer section={s} theme={theme}/></div>)}
          </div>
        </div>
      );
    }}
  />
);

export const Template10 = ({ data, theme, isPremium }: TemplateProps) => (
  <MultiPageWrapper data={data} theme={theme} isPremium={isPremium} renderPage={(sections: any, index: number, styles: any) => {
    const { left, right } = getPageColumns(sections);
    return (
      <div className="p-12 text-slate-800 h-full">
         {index === 0 && <header className="flex justify-between items-end border-b-2 border-slate-100 pb-10 mb-12">
            <div><h1 className={`font-bold tracking-tight text-slate-900 ${styles.name}`} style={{color:theme.color}}>{data.basics.fullName}</h1><p className={`font-medium text-slate-500 mt-2 ${styles.job}`}>{data.basics.jobTitle}</p></div>
            <div className={`text-right text-slate-500 ${styles.contact}`}><div>{data.basics.email}</div><div>{data.basics.phone}</div></div>
         </header>}
         <div className="grid grid-cols-12 gap-12">
            <div className="col-span-8">{right.map((s:any) => <div key={s.id} className="mb-10"><SectionRenderer section={s} theme={theme}/></div>)}</div>
            <div className="col-span-4">{left.map((s:any) => <div key={s.id} className="mb-10"><SectionRenderer section={s} theme={theme}/></div>)}</div>
         </div>
      </div>
    );
  }}/>
);

export const Template11 = ({data, theme, isPremium}: TemplateProps) => (
  <MultiPageWrapper data={data} theme={theme} isPremium={isPremium} renderPage={(s: any, i: number, styles: any) => (
    <div className="p-14 text-center text-slate-900">
      {i===0 && <header className="mb-12 border-b-2 border-slate-100 pb-12"><h1 className={`font-bold tracking-widest uppercase mb-4 ${styles.name}`}>{data.basics.fullName}</h1><div className={`flex justify-center gap-6 font-bold uppercase text-slate-400 ${styles.contact}`}><span>{data.basics.email}</span><span>|</span><span>{data.basics.phone}</span></div></header>}
      <div className="text-left max-w-4xl mx-auto space-y-12">{s.map((sec:any)=><div key={sec.id} className="text-center"><h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-6 pb-2 border-b inline-block">{sec.title}</h3><SectionRenderer section={{...sec, title:''}} theme={theme} className="text-center"/></div>)}</div>
    </div>
  )}/>
);

export const Template12 = ({data, theme, isPremium}: TemplateProps) => (
  <MultiPageWrapper data={data} theme={theme} isPremium={isPremium} renderPage={(s: any, i: number, styles: any) => (
    <div className="p-12 font-sans text-slate-900">
      {i===0 && <div className="text-center border-b border-slate-300 pb-8 mb-8"><h1 className={`font-bold uppercase ${styles.name}`}>{data.basics.fullName}</h1><div className={`mt-3 flex justify-center gap-6 ${styles.contact}`}><span>{data.basics.email}</span><span>|</span><span>{data.basics.phone}</span></div></div>}
      <div className="space-y-8"><div className="bg-slate-100 p-5 rounded text-center"><h2 className={`font-bold uppercase tracking-widest text-slate-700 ${styles.job}`}>{data.basics.jobTitle}</h2></div><div className="grid grid-cols-2 gap-8">{s.map((sec:any) => <div key={sec.id} className={sec.column === 'full' ? 'col-span-2' : 'col-span-1'}><h3 className="font-bold uppercase text-sm border-b border-slate-300 mb-2" style={{color:theme.color}}>{sec.title}</h3><SectionRenderer section={{...sec, title:''}} theme={theme}/></div>)}</div></div>
    </div>
  )}/>
);

export const Template13 = ({data, theme, isPremium}: TemplateProps) => (
  <MultiPageWrapper data={data} theme={theme} isPremium={isPremium} pageStyle={{ background: `linear-gradient(to right, #0f172a 100px, #ffffff 100px)` }} renderPage={(s: any, i: number, styles: any) => { const {left, right} = getPageColumns(s); return <div className="flex h-full font-sans text-slate-800"><div className="w-[100px] flex items-center justify-center text-white min-h-[297mm]">{i===0 && <div className="writing-vertical-lr transform rotate-180 text-5xl font-black tracking-widest opacity-20 uppercase whitespace-nowrap">{data.basics.fullName.split(' ')[0]}</div>}</div><div className="flex-1 p-12">{i===0 && <div className="mb-12"><h1 className="text-7xl font-black text-slate-900 mb-2 leading-none">{data.basics.fullName}</h1><p className={`font-medium text-slate-400 mb-10 ${styles.job}`}>{data.basics.jobTitle}</p></div>}<div className="grid grid-cols-2 gap-16"><div className="space-y-10">{right.map((sec:any)=><SectionRenderer key={sec.id} section={sec} theme={theme}/>)}</div><div className="space-y-10">{i===0 && <div className="bg-slate-50 p-8 rounded-3xl space-y-3"><div className="text-xs font-bold uppercase text-slate-400">Contact</div><div className={`text-base ${styles.contact}`}>{data.basics.email}<br/>{data.basics.phone}</div></div>}{left.map((sec:any)=><SectionRenderer key={sec.id} section={sec} theme={theme}/>)}</div></div></div></div>}} />
);

export const Template14 = ({data, theme, isPremium}: TemplateProps) => (
  <MultiPageWrapper data={data} theme={theme} isPremium={isPremium} renderPage={(s: any, i: number, styles: any) => (
    <div className="p-14 font-serif text-slate-900">
      {i===0 && <div className="border-b-2 border-black pb-6 mb-10 text-center"><h1 className={`font-bold uppercase ${styles.name}`}>{data.basics.fullName}</h1><p className={`italic text-slate-600 mt-2 ${styles.job}`}>{data.basics.jobTitle}</p><div className={`mt-2 ${styles.contact}`}>{data.basics.email} • {data.basics.phone}</div></div>}
      <div className="space-y-8">{s.map((sec:any)=><section key={sec.id}><h3 className="font-bold uppercase text-sm border-b border-slate-300 mb-4">{sec.title}</h3><SectionRenderer section={{...sec, title:''}} theme={theme}/></section>)}</div>
    </div>
  )}/>
);

export const Template15 = ({data, theme, isPremium}: TemplateProps) => (
  <MultiPageWrapper data={data} theme={theme} isPremium={isPremium} renderPage={(s: any, i: number, styles: any) => { const {left, right} = getPageColumns(s); return <div className="p-12 font-sans text-slate-800">{i===0 && <div className="flex justify-between items-start mb-16"><div><h1 className={`font-bold text-slate-900 tracking-tight ${styles.name}`}>{data.basics.fullName}</h1></div><div className={`text-right font-medium text-slate-400 space-y-1 ${styles.contact}`}><p>{data.basics.email}</p><p>{data.basics.phone}</p></div></div>}<div className="grid grid-cols-4 gap-12"><div className="col-span-1 space-y-12 pt-4 border-t border-slate-200">{left.map((sec:any)=><SectionRenderer key={sec.id} section={sec} theme={theme}/>)}</div><div className="col-span-3 space-y-12 pt-4 border-t border-slate-900">{right.map((sec:any)=><SectionRenderer key={sec.id} section={sec} theme={theme}/>)}</div></div></div>}} />
);

export const Template16 = ({data, theme, isPremium}: TemplateProps) => (
  <MultiPageWrapper data={data} theme={theme} isPremium={isPremium} pageStyle={{ background: '#000000', color: '#4ade80' }} renderPage={(s: any, i: number, styles: any) => { const lightTextProps = { textColor: "text-green-400", subTextColor: "text-green-600", dateColor: "text-green-600", tagBg: "bg-green-900/30", tagText: "text-green-400", tagBorder: "border-green-800" }; return <div className="bg-black text-green-400 p-10 font-mono text-xs h-full"><div className="border border-green-800 p-10 h-full">{i===0 && <header className="border-b border-green-800 pb-10 mb-10 flex justify-between"><div><h1 className={`font-bold mb-2 glitch-text ${styles.name}`}>{data.basics.fullName}</h1></div><div className={`text-right opacity-70 ${styles.contact}`}><div>{data.basics.email}</div></div></header>}<div className="grid grid-cols-2 gap-10"><div>{s.filter((_:any,idx:number)=>idx%2===0).map((sec:any)=><div key={sec.id} className="mb-8"><h3 className="text-green-600 font-bold mb-4 text-base">{`> ${sec.title.toUpperCase()}`}</h3><div className="border-l border-green-900 pl-6"><SectionRenderer section={{...sec, title:''}} theme={theme} {...lightTextProps}/></div></div>)}</div><div>{s.filter((_:any,idx:number)=>idx%2!==0).map((sec:any)=><div key={sec.id} className="mb-8"><h3 className="text-green-600 font-bold mb-4 text-base">{`> ${sec.title.toUpperCase()}`}</h3><SectionRenderer section={{...sec, title:''}} theme={theme} {...lightTextProps}/></div>)}</div></div></div></div>}} />
);

export const Template17 = ({data, theme, isPremium}: TemplateProps) => (
  <MultiPageWrapper data={data} theme={theme} isPremium={isPremium} renderPage={(s: any, i: number, styles: any) => { const {left, right} = getPageColumns(s); return <div className="p-8 font-sans text-slate-900">{i===0 && <div className="flex justify-between border-b-2 border-black pb-4 mb-8"><div className="flex gap-6 items-baseline"><h1 className={`font-bold uppercase ${styles.name}`}>{data.basics.fullName}</h1></div><div className={`flex gap-6 ${styles.contact}`}><span>{data.basics.email}</span></div></div>}<div className="grid grid-cols-12 gap-6 text-sm"><div className="col-span-3 space-y-8 border-r border-slate-200 pr-6">{left.map((sec:any)=><div key={sec.id}><h3 className="font-bold border-b border-black mb-1">{sec.title}</h3><SectionRenderer section={{...sec, title:''}} theme={theme}/></div>)}</div><div className="col-span-9 space-y-8">{right.map((sec:any)=><div key={sec.id}><h3 className="font-bold border-b border-black mb-1">{sec.title}</h3><SectionRenderer section={{...sec, title:''}} theme={theme}/></div>)}</div></div></div>}} />
);

export const Template18 = ({data, theme, isPremium}: TemplateProps) => (
  <MultiPageWrapper data={data} theme={theme} isPremium={isPremium} renderPage={(s: any, i: number, styles: any) => { const {left, right} = getPageColumns(s); return <div className="flex flex-col font-sans h-full">{i===0 && <div className="h-[250px] flex items-center justify-center text-white text-center p-10" style={{backgroundColor:theme.color}}><div><h1 className={`font-bold mb-4 ${styles.name}`}>{data.basics.fullName}</h1></div></div>}<div className="flex-1 p-12 grid grid-cols-2 gap-16 text-slate-800"><div className="space-y-10 text-center">{i===0 && <div className={styles.contact}>{data.basics.email}<br/>{data.basics.phone}</div>}{left.map((sec:any)=><div key={sec.id}><div className="inline-block border-b-2 border-black pb-1 px-4 mb-4 font-bold uppercase tracking-widest">{sec.title}</div><SectionRenderer section={{...sec, title:''}} theme={theme}/></div>)}</div><div className="space-y-10 text-center border-l border-slate-100 pl-16">{right.map((sec:any)=><div key={sec.id}><h3 className="font-bold text-xl mb-6">{sec.title}</h3><SectionRenderer section={{...sec, title:''}} theme={theme}/></div>)}</div></div></div>}} />
);

export const Template19 = ({data, theme, isPremium}: TemplateProps) => (
  <MultiPageWrapper data={data} theme={theme} isPremium={isPremium} renderPage={(s: any, i: number, styles: any) => <div className="p-12 font-sans text-slate-800">{i===0 && <div className="flex gap-10 mb-10"><div className="w-[140px] h-[180px] bg-slate-200 flex items-center justify-center text-slate-400 text-xs overflow-hidden">{data.basics.image ? <img src={data.basics.image} className="w-full h-full object-cover"/> : "PHOTO"}</div><div className="flex-1"><h1 className={`font-bold uppercase text-indigo-900 ${styles.name}`} style={{color:theme.color}}>{data.basics.fullName}</h1><div className={`space-y-1 mt-6 ${styles.contact}`}><div className="flex gap-2"><span className="w-24 font-bold text-slate-400">Email:</span>{data.basics.email}</div></div></div></div>}<div className="space-y-8">{s.map((sec:any)=><section key={sec.id}><h3 className="text-base font-bold uppercase bg-slate-100 p-3 mb-4" style={{borderLeft:`6px solid ${theme.color}`}}>{sec.title}</h3><SectionRenderer section={{...sec, title:''}} theme={theme}/></section>)}</div></div>} />
);

export const Template20 = ({data, theme, isPremium}: TemplateProps) => (
  <MultiPageWrapper data={data} theme={theme} isPremium={isPremium} renderPage={(s: any, i: number, styles: any) => { const {left, right} = getPageColumns(s); return <div className="bg-slate-100 p-10 font-sans text-slate-800 flex flex-col gap-6 h-full">{i===0 && <div className="bg-white p-8 rounded shadow-sm flex justify-between items-center"><div><h1 className={`font-bold ${styles.name}`}>{data.basics.fullName}</h1></div><div className={`text-right ${styles.contact}`}><div>{data.basics.email}</div></div></div>}<div className="flex gap-6 flex-1"><div className="w-1/3 flex flex-col gap-6"><div className="bg-white p-8 rounded shadow-sm flex-1">{left.map((sec:any)=><div key={sec.id} className="mb-8"><h3 className="font-bold border-b pb-2 mb-4">{sec.title}</h3><SectionRenderer section={{...sec, title:''}} theme={theme}/></div>)}</div></div><div className="w-2/3 bg-white p-8 rounded shadow-sm">{right.map((sec:any)=><div key={sec.id} className="mb-8"><h3 className="font-bold border-b pb-2 mb-4">{sec.title}</h3><SectionRenderer section={{...sec, title:''}} theme={theme}/></div>)}</div></div></div>}} />
);