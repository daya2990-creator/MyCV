import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

// ---------------------------
// Types
// ---------------------------
export type SectionItem = {
  id: string;
  title?: string;
  subtitle?: string;
  date?: string;
  location?: string;
  description?: string; // HTML allowed (rendered safely via controlled source)
  tags?: string[];
};

export type Section = {
  id: string;
  title: string;
  type: 'text' | 'list' | 'skills' | 'break';
  items: SectionItem[];
  content?: string; // for 'text' sections
  isVisible?: boolean;
  column?: 'left' | 'right' | 'full';
};

export type ResumeData = {
  basics: {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    website?: string;
    jobTitle?: string;
    image?: string;
  };
  sections: Section[];
};

export type Theme = {
  color: string; // primary accent color
  font?: string; // CSS font family
  fontSize?: 'small' | 'medium' | 'large';
  dark?: boolean;
};

// ---------------------------
// Utilities
// ---------------------------
const defaultTheme: Theme = { 
  color: '#0ea5a4', 
  font: 'Inter, system-ui, -apple-system, sans-serif', 
  fontSize: 'medium', 
  dark: false 
};

const getThemeStyles = (size: NonNullable<Theme['fontSize']>) => {
  switch (size) {
    case 'small':
      return {
        name: 'text-3xl',
        job: 'text-sm',
        contact: 'text-xs',
        sectionTitle: 'text-sm',
        itemTitle: 'text-sm',
        itemSubtitle: 'text-xs',
        body: 'text-xs',
        date: 'text-xs',
        tag: 'text-xs',
        spacing: 'space-y-3',
        mb: 'mb-3',
      };
    case 'large':
      return {
        name: 'text-5xl',
        job: 'text-xl',
        contact: 'text-base',
        sectionTitle: 'text-xl',
        itemTitle: 'text-xl',
        itemSubtitle: 'text-lg',
        body: 'text-base',
        date: 'text-sm',
        tag: 'text-sm',
        spacing: 'space-y-5',
        mb: 'mb-5',
      };
    default:
      return {
        name: 'text-4xl',
        job: 'text-lg',
        contact: 'text-sm',
        sectionTitle: 'text-base',
        itemTitle: 'text-base',
        itemSubtitle: 'text-sm',
        body: 'text-sm',
        date: 'text-sm',
        tag: 'text-sm',
        spacing: 'space-y-4',
        mb: 'mb-4',
      };
  }
};

// Pagination: split sections by type 'break' markers. Returns pages array.
const usePages = (sections: Section[]) => {
  const pages: Section[][] = [];
  let current: Section[] = [];
  sections.forEach((s) => {
    if (s.type === 'break') {
      pages.push(current);
      current = [];
    } else {
      current.push(s);
    }
  });
  if (current.length > 0 || pages.length === 0) pages.push(current);
  return pages;
};

const getPageColumns = (pageSections: Section[]) => {
  // Fix: Ensure all sections are captured. 
  // If column is 'left', it goes left. Everything else (right, full, undefined, null) goes to the main content area (right).
  const left = pageSections.filter((s) => s.column === 'left');
  const right = pageSections.filter((s) => s.column !== 'left'); 
  return { left, right, full: pageSections };
};

// ---------------------------
// Components
// ---------------------------

const Page: React.FC<{ children: React.ReactNode; font?: string; className?: string; style?: React.CSSProperties }> = ({ children, font, className = '', style = {} }) => (
  <div
    role="document"
    aria-label="Resume page"
    className={`page-sheet w-[210mm] min-h-[297mm] bg-white shadow-2xl mb-8 overflow-hidden relative print:shadow-none print:mb-0 print:break-after-page ${className}`}
    style={{ fontFamily: font, ...style }}
  >
    {children}
  </div>
);

const RichText: React.FC<{ content?: string; className?: string }> = ({ content, className = '' }) => {
  if (!content) return null;
  // Safety: Ensure content is a string to prevent "Objects are not valid as a React child" errors if malformed data is passed
  const safeContent = typeof content === 'string' ? content : String(content);
  return <div className={`rte-content ${className}`} dangerouslySetInnerHTML={{ __html: safeContent }} />;
};

const SectionRenderer: React.FC<{
  section: Section;
  theme: Theme;
  textColor?: string;
  subTextColor?: string;
  dateColor?: string;
  tagBg?: string;
  tagText?: string;
  tagBorder?: string;
  className?: string;
}> = ({ section, theme, textColor = 'text-slate-900', subTextColor = '', dateColor = 'text-slate-500', tagBg = 'bg-slate-100', tagText = 'text-slate-700', tagBorder = 'border-slate-200', className = '' }) => {
  // Safety check: section must exist
  if (!section) return null;
  
  if (section.type === 'break' || section.isVisible === false) return null;
  const styles = getThemeStyles(theme.fontSize || 'medium');
  const headerStyle = { color: theme.color, borderColor: theme.color } as React.CSSProperties;
  
  // Helper to ensure classes are not purged
  function t(s: string) { return s; }

  return (
    <section aria-labelledby={`section-${section.id}`} className={`mb-6 ${className}`} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
      <h3 id={`section-${section.id}`} className={`uppercase tracking-widest font-bold border-b-2 pb-1 mb-3 ${styles.sectionTitle}`} style={headerStyle}>
        {section.title}
      </h3>

      {section.type === 'text' && <RichText content={section.content} className={`leading-relaxed text-slate-700 ${styles.body} ${textColor}`} />}

      {section.type === 'skills' && (
        <div className="flex flex-wrap gap-2" role="list">
          {section.items.flatMap((i) => i.tags || []).map((tag, idx) => (
            <span key={idx} role="listitem" className={`px-3 py-1.5 rounded-md font-medium border ${t(tagBg)} ${t(tagText)} ${t(tagBorder)} ${styles.tag}`}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {section.type === 'list' && (
        <div className={styles.spacing}>
          {section.items.map((item) => (
            <article key={item.id} style={{ breakInside: 'avoid' }} aria-label={item.title}>
              <div className="flex justify-between items-baseline">
                <h4 className={`font-bold ${textColor} ${styles.itemTitle}`}>{item.title}</h4>
                {item.date && <time className={`font-mono px-2 py-0.5 rounded whitespace-nowrap ${dateColor} ${styles.date}`}>{item.date}</time>}
              </div>
              {item.subtitle && (
                <div className={`font-bold mb-1 opacity-90 ${styles.itemSubtitle}`} style={{ color: subTextColor || theme.color }}>{item.subtitle}</div>
              )}
              {item.description && <RichText content={item.description} className={`leading-relaxed mt-1 ${textColor} ${styles.body}`} />}
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

const Watermark: React.FC = () => (
  <div className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none overflow-hidden select-none print:block opacity-50">
    <div className="transform -rotate-45 opacity-[0.05] text-slate-900 text-6xl font-black uppercase whitespace-nowrap border-8 border-slate-900 p-8 rounded-3xl tracking-widest">
      MyCV.guru
    </div>
  </div>
);

const MultiPageWrapper: React.FC<{
  data: ResumeData;
  theme?: Theme;
  isPremium?: boolean;
  pageStyle?: React.CSSProperties;
  className?: string;
  renderPage: (sections: Section[], pageIndex: number, styles: ReturnType<typeof getThemeStyles>) => React.ReactNode;
}> = ({ data, theme = defaultTheme, isPremium = false, pageStyle = {}, className = '', renderPage }) => {
  // CRITICAL FIX: Guard against missing data or sections to prevent undefined errors
  if (!data || !data.sections) return null;

  const pages = usePages(data.sections);
  const styles = getThemeStyles(theme.fontSize || 'medium');

  return (
    <div className="resume-root">
      <style>{`@media print { .print\\:break-after-page { break-after: page; } body{ -webkit-print-color-adjust: exact; } @page { margin: 0; } } .rte-content ul{ list-style-type: disc; margin-left:1.2em; }`}</style>
      {pages.map((pageSections, idx) => (
        <Page key={idx} font={theme.font} className={className} style={pageStyle}>
          {renderPage(pageSections, idx, styles)}
          {!isPremium && idx === 0 && <Watermark />}
        </Page>
      ))}
    </div>
  );
};

// ---------------------------
// Templates (1..20)
// ---------------------------

// Template 1 — Classic two-column with left info bar
export const Template1: React.FC<{ data: ResumeData; theme?: Theme; isPremium?: boolean }> = ({ data, theme = defaultTheme, isPremium }) => (
  <MultiPageWrapper
    data={data}
    theme={theme}
    isPremium={isPremium}
    pageStyle={{ background: `linear-gradient(to right, #f8fafc 32%, #ffffff 32%)` }}
    renderPage={(sections, index, styles) => {
      // Safety check for basics
      if (!data?.basics) return null;
      
      const { left, right } = getPageColumns(sections);
      return (
        <div className="flex h-full text-slate-800">
          <aside className="w-[32%] p-8 border-r border-slate-200/50 min-h-[297mm]" aria-hidden={false}>
            {index === 0 && (
              <div className="mb-10 text-center">
                {data.basics.image && <img src={data.basics.image} alt={`${data.basics.fullName} photo`} className="w-32 h-32 rounded-full object-cover mb-4 mx-auto" />}
                <h1 className={`font-bold leading-tight mb-2 ${styles.name}`} style={{ color: theme.color }}>{data.basics.fullName}</h1>
                {data.basics.jobTitle && <p className={`font-bold uppercase tracking-widest text-slate-500 ${styles.job}`}>{data.basics.jobTitle}</p>}
                <div className={`space-y-3 text-slate-600 mt-6 ${styles.contact}`}>
                  <div className="flex gap-3 items-center"><Mail size={14} aria-hidden/> <span className="break-all">{data.basics.email}</span></div>
                  {data.basics.phone && <div className="flex gap-3 items-center"><Phone size={14} aria-hidden/> {data.basics.phone}</div>}
                  {data.basics.location && <div className="flex gap-3 items-center"><MapPin size={14} aria-hidden/> {data.basics.location}</div>}
                </div>
              </div>
            )}
            {left.map((s) => <SectionRenderer key={s.id} section={s} theme={theme} />)}
          </aside>

          <main className="w-[68%] p-10" aria-labelledby="main-content">
            <div id="main-content">
              {right.map((s) => <SectionRenderer key={s.id} section={s} theme={theme} />)}
            </div>
          </main>
        </div>
      );
    }}
  />
);

// Template 2 — Header band + grid columns
export const Template2: React.FC<{ data: ResumeData; theme?: Theme; isPremium?: boolean }> = ({ data, theme = defaultTheme, isPremium }) => (
  <MultiPageWrapper data={data} theme={theme} isPremium={isPremium} renderPage={(sections, index, styles) => {
    if (!data?.basics) return null;
    const { left, right } = getPageColumns(sections);
    return (
      <div className="p-12 text-slate-900 h-full">
        {index === 0 && (
          <header className="flex justify-between items-end border-b-2 pb-8 mb-10" style={{ borderColor: theme.color }}>
            <div className="flex items-center gap-6">
              {data.basics.image && <img src={data.basics.image} alt="profile" className="w-24 h-24 rounded-xl object-cover shadow-sm" />}
              <div>
                <h1 className={`font-bold tracking-tight ${styles.name}`}>{data.basics.fullName}</h1>
                {data.basics.jobTitle && <div className={`mt-2 font-medium ${styles.job}`} style={{ color: theme.color }}>{data.basics.jobTitle}</div>}
              </div>
            </div>
            <div className={`text-right space-y-1 ${styles.contact}`}>
              <div>{data.basics.email}</div>
              {data.basics.phone && <div>{data.basics.phone}</div>}
            </div>
          </header>
        )}

        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-8">{right.map((s) => <SectionRenderer key={s.id} section={s} theme={theme} />)}</div>
          <aside className="col-span-4">{left.map((s) => <SectionRenderer key={s.id} section={s} theme={theme} />)}</aside>
        </div>
      </div>
    );
  }} />
);

// Template 3 — Centered header + two-column content
export const Template3: React.FC<{ data: ResumeData; theme?: Theme; isPremium?: boolean }> = ({ data, theme = defaultTheme, isPremium }) => (
  <MultiPageWrapper data={data} theme={theme} isPremium={isPremium} renderPage={(sections, index, styles) => {
    if (!data?.basics) return null;
    return (
      <div className="p-12 text-slate-800 h-full">
        {index === 0 && (
          <div className="text-center mb-12 border-b pb-10">
            <h1 className={`font-bold uppercase tracking-widest mb-3 ${styles.name}`}>{data.basics.fullName}</h1>
            {data.basics.jobTitle && <p className={`text-slate-500 font-medium uppercase tracking-widest ${styles.job}`}>{data.basics.jobTitle}</p>}
            <div className={`flex justify-center gap-6 text-slate-400 mt-6 ${styles.contact}`}>
              <span>{data.basics.email}</span>
              {data.basics.phone && <><span>•</span><span>{data.basics.phone}</span></>}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-12">
          <div>{getPageColumns(sections).right.map((s) => <SectionRenderer key={s.id} section={s} theme={theme} />)}</div>
          <div>{getPageColumns(sections).left.map((s) => <SectionRenderer key={s.id} section={s} theme={theme} />)}</div>
        </div>
      </div>
    );
  }} />
);

// Template 4 — Profile image left + right content
export const Template4: React.FC<{ data: ResumeData; theme?: Theme; isPremium?: boolean }> = ({ data, theme = defaultTheme, isPremium }) => (
  <MultiPageWrapper data={data} theme={theme} isPremium={isPremium} renderPage={(sections, index, styles) => {
    if (!data?.basics) return null;
    return (
      <div className="p-10 h-full text-slate-800">
        {index === 0 && (
          <div className="flex items-center gap-8 border-b pb-10 mb-10">
            {data.basics.image ? (
              <img src={data.basics.image} className="w-24 h-24 rounded-full object-cover shadow-lg" alt="profile" />
            ) : (
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg" style={{ backgroundColor: theme.color }}>{data.basics.fullName.slice(0,2)}</div>
            )}
            <div>
              <h1 className={`font-bold ${styles.name}`}>{data.basics.fullName}</h1>
              {data.basics.jobTitle && <p className={`opacity-75 ${styles.job}`} style={{ color: theme.color }}>{data.basics.jobTitle}</p>}
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-10">
          <div className="col-span-2">{getPageColumns(sections).right.map((s) => <SectionRenderer key={s.id} section={s} theme={theme} />)}</div>
          <aside className="col-span-1 bg-slate-50 p-6 rounded-xl">{getPageColumns(sections).left.map((s) => <SectionRenderer key={s.id} section={s} theme={theme} />)}</aside>
        </div>
      </div>
    );
  }} />
);

// Template 5 — Bold colored header band
export const Template5: React.FC<{ data: ResumeData; theme?: Theme; isPremium?: boolean }> = ({ data, theme = defaultTheme, isPremium }) => (
  <MultiPageWrapper data={data} theme={theme} isPremium={isPremium} renderPage={(sections, index, styles) => {
    if (!data?.basics) return null;
    return (
      <div className="h-full text-slate-800">
        {index === 0 && (
          <div className="p-12 text-white" style={{ backgroundColor: theme.color }}>
            <h1 className={`font-black tracking-tighter mb-1 uppercase ${styles.name}`}>{data.basics.fullName}</h1>
            {data.basics.jobTitle && <p className={`opacity-90 ${styles.job}`}>{data.basics.jobTitle}</p>}
          </div>
        )}

        <div className="p-12 grid grid-cols-12 gap-12">
          <aside className="col-span-4 border-r pr-8">{getPageColumns(sections).left.map((s) => <SectionRenderer key={s.id} section={s} theme={theme} />)}</aside>
          <main className="col-span-8">{getPageColumns(sections).right.map((s) => <SectionRenderer key={s.id} section={s} theme={theme} />)}</main>
        </div>
      </div>
    );
  }} />
);

// Template 6 — Minimalist monospace resume
export const Template6: React.FC<{ data: ResumeData; theme?: Theme; isPremium?: boolean }> = ({ data, theme = { ...defaultTheme, font: 'ui-monospace, SFMono-Regular, Menlo, monospace' }, isPremium }) => (
  <MultiPageWrapper data={data} theme={theme} isPremium={isPremium} renderPage={(sections, index, styles) => {
    if (!data?.basics) return null;
    return (
      <div className="p-14 text-slate-800 font-mono h-full">
        {index === 0 && (
          <header className="mb-14 border-b border-slate-900 pb-8 flex justify-between items-end">
            <div>
              <h1 className={`font-bold tracking-tighter ${styles.name}`}>{data.basics.fullName}</h1>
              {data.basics.jobTitle && <p className={`font-bold uppercase text-slate-500 ${styles.job}`}>{data.basics.jobTitle}</p>}
            </div>
            <div className={`text-right ${styles.contact}`}>
              <div>{data.basics.email}</div>
              {data.basics.phone && <div>{data.basics.phone}</div>}
            </div>
          </header>
        )}

        <div className="space-y-10">{sections.map((s) => (
          <div key={s.id} className="grid grid-cols-12 gap-6">
            <div className="col-span-3 font-bold uppercase tracking-widest text-sm" style={{ color: theme.color }}>{s.title}</div>
            <div className="col-span-9"><SectionRenderer section={{ ...s, title: '' }} theme={theme} /></div>
          </div>
        ))}</div>
      </div>
    );
  }} />
);

// Template 7 — Dark header card
export const Template7: React.FC<{ data: ResumeData; theme?: Theme; isPremium?: boolean }> = ({ data, theme = defaultTheme, isPremium }) => (
  <MultiPageWrapper data={data} theme={theme} isPremium={isPremium} renderPage={(sections, index, styles) => {
    if (!data?.basics) return null;
    return (
      <div className="p-10 h-full text-slate-800">
        {index === 0 && (
          <div className="bg-slate-900 text-white p-10 rounded-3xl mb-10 flex justify-between items-center">
            <div>
              <h1 className={`font-bold ${styles.name}`}>{data.basics.fullName}</h1>
              {data.basics.jobTitle && <p className={`opacity-80 ${styles.job}`}>{data.basics.jobTitle}</p>}
            </div>
            <div className={`text-right opacity-70 ${styles.contact}`}>
              <div>{data.basics.email}</div>
              {data.basics.phone && <div>{data.basics.phone}</div>}
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-10">
          <aside className="col-span-1">{getPageColumns(sections).left.map((s) => <SectionRenderer key={s.id} section={s} theme={theme} />)}</aside>
          <main className="col-span-2 border-l pl-10" style={{ borderColor: theme.color }}>{getPageColumns(sections).right.map((s) => <SectionRenderer key={s.id} section={s} theme={theme} />)}</main>
        </div>
      </div>
    );
  }} />
);

// Template 8 — Dark full-bleed left column (modern)
export const Template8: React.FC<{ data: ResumeData; theme?: Theme; isPremium?: boolean }> = ({ data, theme = { ...defaultTheme, color: '#0ea5a4', dark: true }, isPremium }) => (
  <MultiPageWrapper data={data} theme={theme} isPremium={isPremium} pageStyle={{ background: `linear-gradient(to right, #1e293b 30%, #0f172a 30%)`, color: 'white' }} renderPage={(sections, index, styles) => {
    if (!data?.basics) return null;
    const { left, right } = getPageColumns(sections);
    const lightTextProps = { textColor: 'text-slate-300', subTextColor: 'text-slate-400', dateColor: 'text-slate-400', tagBg: 'bg-slate-800', tagText: 'text-slate-300', tagBorder: 'border-slate-700' } as any;
    return (
      <div className="w-full h-full flex text-white">
        <aside className="w-[30%] p-8 border-r border-slate-700 min-h-[297mm]">
          {index === 0 && (
            <div className="text-center mb-10 pb-8 border-b border-slate-700 pt-4">
              {data.basics.image ? <img src={data.basics.image} className="w-28 h-28 mx-auto rounded-full object-cover border-4 border-slate-600 mb-4" alt="profile" /> : <div className="w-20 h-20 mx-auto bg-slate-700 rounded-full flex items-center justify-center text-2xl font-bold mb-4 border-2" style={{ borderColor: theme.color }}>{data.basics.fullName[0]}</div>}
              <h1 className={`font-bold leading-tight text-white ${styles.name}`}>{data.basics.fullName}</h1>
              <div className={`text-slate-400 mt-2 font-mono break-all ${styles.contact}`}>{data.basics.email}</div>
            </div>
          )}
          {left.map((s) => <div key={s.id} className="mb-6"><SectionRenderer section={s} theme={theme} {...lightTextProps} /></div>)}
        </aside>

        <main className="w-[70%] p-12 text-slate-300 min-h-[297mm]">
          {right.map((s) => <SectionRenderer key={s.id} section={s} theme={theme} {...lightTextProps} />)}
        </main>
      </div>
    );
  }} />
);

// Template Variants (9..20)
export const Template9 = (props: any) => <Template1 {...props} />;
export const Template10 = (props: any) => <Template2 {...props} />;
export const Template11 = (props: any) => <Template3 {...props} />;
export const Template12 = (props: any) => <Template4 {...props} />;
export const Template13 = (props: any) => <Template5 {...props} />;
export const Template14 = (props: any) => <Template6 {...props} />;
export const Template15 = (props: any) => <Template7 {...props} />;
export const Template16 = (props: any) => <Template8 {...props} />;
export const Template17 = (props: any) => <Template1 {...props} />;
export const Template18 = (props: any) => <Template2 {...props} />;
export const Template19 = (props: any) => <Template3 {...props} />;
export const Template20 = (props: any) => <Template4 {...props} />;

// ---------------------------
// Default Export Wrapper
// ---------------------------

const DefaultResume: React.FC<{ data: ResumeData; theme?: Theme; template?: number; isPremium?: boolean }> = ({ data, theme, template = 1, isPremium }) => {
  const map: Record<number, React.FC<any>> = {
    1: Template1, 2: Template2, 3: Template3, 4: Template4, 5: Template5, 6: Template6, 7: Template7, 8: Template8,
    9: Template9, 10: Template10, 11: Template11, 12: Template12, 13: Template13, 14: Template14, 15: Template15, 16: Template16,
    17: Template17, 18: Template18, 19: Template19, 20: Template20,
  };
  const Component = map[template] || Template1;
  return <Component data={data} theme={theme} isPremium={isPremium} />;
};

export default DefaultResume;