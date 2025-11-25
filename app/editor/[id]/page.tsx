'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useParams, useRouter } from 'next/navigation'
import { 
  Loader2, ArrowLeft, Download, Sparkles, Palette, User, Briefcase, GraduationCap, 
  Wrench, Plus, Trash2, Check, Layout, Layers, Eye, Save, ArrowUp, ArrowDown, FileMinus,
  Globe, FolderGit2, Languages, ArrowRight, AlignLeft, Image as ImageIcon, Bold, Italic, Underline, List, Lock
} from 'lucide-react'
import { useReactToPrint } from 'react-to-print'
import Script from 'next/script'

import { 
  Template1, Template2, Template3, Template4, Template5, 
  Template6, Template7, Template8, Template9, Template10,
  Template11, Template12, Template13, Template14, Template15,
  Template16, Template17, Template18, Template19, Template20,
  ResumeData, Section, SectionItem 
} from '../../../components/ResumeTemplates'

const TEMPLATES: Record<string, any> = {
  't1':  { component: Template1, name: "Structure", category: 'modern', tier: 'free' },
  't2':  { component: Template2, name: "Clarity", category: 'modern', tier: 'free' },
  't3':  { component: Template3, name: "Balance", category: 'professional', tier: 'standard' },
  't4':  { component: Template4, name: "Profile", category: 'creative', tier: 'premium' },
  't5':  { component: Template5, name: "Vivid", category: 'creative', tier: 'premium' },
  't6':  { component: Template6, name: "Logic", category: 'professional', tier: 'free' },
  't7':  { component: Template7, name: "Timeline", category: 'creative', tier: 'premium' },
  't8':  { component: Template8, name: "Slate", category: 'modern', tier: 'premium' },
  't9':  { component: Template9, name: "Onyx", category: 'modern', tier: 'standard' },
  't10': { component: Template10, name: "Pike", category: 'modern', tier: 'standard' },
  't11': { component: Template11, name: "Kakuna", category: 'professional', tier: 'standard' },
  't12': { component: Template12, name: "Executive", category: 'professional', tier: 'free' },
  't13': { component: Template13, name: "Studio", category: 'modern', tier: 'premium' },
  't14': { component: Template14, name: "Classic", category: 'professional', tier: 'standard' },
  't15': { component: Template15, name: "Elevate", category: 'creative', tier: 'premium' },
  't16': { component: Template16, name: "Terminal", category: 'creative', tier: 'premium' },
  't17': { component: Template17, name: "Concise", category: 'professional', tier: 'standard' },
  't18': { component: Template18, name: "Impact", category: 'modern', tier: 'premium' },
  't19': { component: Template19, name: "Standard", category: 'professional', tier: 'standard' },
  't20': { component: Template20, name: "Frame", category: 'creative', tier: 'premium' },
};

const FONTS = [
  { id: 'Roboto', label: 'Roboto', family: "'Roboto', sans-serif" },
  { id: 'Open Sans', label: 'Open Sans', family: "'Open Sans', sans-serif" },
  { id: 'Lato', label: 'Lato', family: "'Lato', sans-serif" },
  { id: 'Montserrat', label: 'Montserrat', family: "'Montserrat', sans-serif" },
  { id: 'Oswald', label: 'Oswald', family: "'Oswald', sans-serif" },
  { id: 'Raleway', label: 'Raleway', family: "'Raleway', sans-serif" },
  { id: 'Merriweather', label: 'Merriweather', family: "'Merriweather', serif" },
  { id: 'Playfair Display', label: 'Playfair', family: "'Playfair Display', serif" },
  { id: 'Arial', label: 'Arial', family: "Arial, Helvetica, sans-serif" },
  { id: 'Georgia', label: 'Georgia', family: "Georgia, serif" },
  { id: 'Courier New', label: 'Courier', family: "'Courier New', monospace" },
  { id: 'Times New Roman', label: 'Times', family: "'Times New Roman', serif" }
];

const COLORS = ['#0f172a', '#3b82f6', '#0ea5e9', '#10b981', '#8b5cf6', '#f43f5e', '#d97706', '#000000'];
const FONT_SIZES = [{ id: 'small', label: 'Small' }, { id: 'medium', label: 'Standard' }, { id: 'large', label: 'Large' }];

const SAMPLE_RESUME: ResumeData = {
  basics: { fullName: "Alex Morgan", email: "alex@example.com", phone: "+1 (555) 019-2834", location: "San Francisco, CA", website: "linkedin.com/in/alexmorgan", jobTitle: "Senior Product Manager", image: "" },
  sections: [
    { id: 'summary', title: 'Professional Summary', type: 'text', isVisible: true, column: 'full' as const, items: [], content: "Results-oriented Senior Product Manager..." },
    { id: 'experience', title: 'Work Experience', type: 'list', isVisible: true, column: 'full' as const, items: [{ id: 'j1', title: 'TechFlow Inc.', subtitle: 'Senior Product Manager', date: '2021 - Present', description: "• Led the launch of the 'Flow' analytics dashboard." }] },
    { id: 'education', title: 'Education', type: 'list', isVisible: true, column: 'left' as const, items: [{ id: 'e1', title: 'Stanford University', subtitle: 'MBA', date: '2018' }] },
    { id: 'skills', title: 'Skills', type: 'skills', isVisible: true, column: 'left' as const, items: [{ id: 's1', tags: ['Product Strategy', 'Agile', 'Jira', 'SQL'] }] }
  ]
};

const RichTextToolbar = ({ onAction }: { onAction: (tag: string) => void }) => (
  <div className="flex items-center gap-1 mb-2 bg-slate-100 p-1 rounded border border-slate-200 w-fit">
    <button onClick={() => onAction('b')} className="p-1.5 hover:bg-white rounded text-slate-700" title="Bold"><Bold size={14}/></button>
    <button onClick={() => onAction('i')} className="p-1.5 hover:bg-white rounded text-slate-700" title="Italic"><Italic size={14}/></button>
    <button onClick={() => onAction('u')} className="p-1.5 hover:bg-white rounded text-slate-700" title="Underline"><Underline size={14}/></button>
    <div className="w-px h-4 bg-slate-300 mx-1"></div>
    <button onClick={() => onAction('li')} className="p-1.5 hover:bg-white rounded text-slate-700" title="Bullet List"><List size={14}/></button>
    <button onClick={() => onAction('br')} className="p-1.5 hover:bg-white rounded text-slate-700 text-xs font-bold px-2" title="Line Break">BR</button>
  </div>
);

const Input = ({ label, value, onChange }: any) => (
  <div>
    <label className="text-[11px] uppercase font-bold text-slate-400 mb-1.5 block tracking-wider">{label}</label>
    <input className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300" value={value || ''} onChange={(e) => onChange(e.target.value)}/>
  </div>
)

export default function EditorPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClientComponentClient()
  
  const componentRef = useRef<HTMLDivElement>(null)
  const activeInputRef = useRef<HTMLTextAreaElement | null>(null); 

  const [viewMode, setViewMode] = useState<'preview' | 'edit'>('preview')
  const [activeTab, setActiveTab] = useState<'design' | 'structure'>('design')
  const [activeSectionId, setActiveSectionId] = useState('basics')
  const [templateCategory, setTemplateCategory] = useState<'all' | 'modern' | 'professional' | 'creative'>('all')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isPremium, setIsPremium] = useState(false) 
  const [showAddModal, setShowAddModal] = useState(false)
  const [credits, setCredits] = useState(0)
  
  const [newSectionName, setNewSectionName] = useState('')
  const [newSectionType, setNewSectionType] = useState<'text'|'list'|'skills'>('list')
  
  const [selectedTemplate, setSelectedTemplate] = useState('t1')
  const [design, setDesign] = useState<{ color: string; font: string; fontSize: 'small' | 'medium' | 'large' }>({ 
    color: '#3b82f6', 
    font: "'Roboto', sans-serif",
    fontSize: 'medium' 
  })
  
  const [resume, setResume] = useState<ResumeData>(SAMPLE_RESUME)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')
      const { data: profile } = await supabase.from('profiles').select('subscription_status, credits').eq('id', user.id).single()
      if (profile) {
         setIsPremium(profile.subscription_status === 'pro')
         setCredits(profile.credits || 0)
      }
      const { data } = await supabase.from('resumes').select('content, template_id').eq('id', params.id).single()
      if (data) {
         if (data.content && data.content.sections) setResume(data.content);
         if (data.template_id && TEMPLATES[data.template_id]) setSelectedTemplate(data.template_id)
      }
      setLoading(false)
    }
    init()
  }, [])

  const autoSave = useCallback((newData: ResumeData) => {
      setSaving(true)
      supabase.from('resumes').update({ content: newData, updated_at: new Date() }).eq('id', params.id).then(() => setTimeout(() => setSaving(false), 800))
  }, [params.id])

  const updateResume = (newData: ResumeData) => setResume(newData);
  const manualSave = () => { autoSave(resume); setViewMode('preview'); }
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file && file.size < 500000) { const reader = new FileReader(); reader.onloadend = () => { const newData = { ...resume, basics: { ...resume.basics, image: reader.result as string } }; updateResume(newData); autoSave(newData); }; reader.readAsDataURL(file); } else if (file) alert("Image too large (Max 500KB)"); };

  const handleFormat = (tag: string, sectionId: string, itemId?: string) => {
    const textarea = activeInputRef.current; if (!textarea) return;
    const start = textarea.selectionStart; const end = textarea.selectionEnd; const text = textarea.value;
    let insertText = tag === 'br' ? "<br/>" : tag === 'li' ? `<li>${text.slice(start, end)}</li>` : `<${tag}>${text.slice(start, end)}</${tag}>`;
    const newText = text.slice(0, start) + insertText + text.slice(end);
    if (itemId) updateSectionItem(sectionId, itemId, 'description', newText);
    else { const newSections = resume.sections.map(s => s.id === sectionId ? { ...s, content: newText } : s); updateResume({ ...resume, sections: newSections }); }
    setTimeout(() => textarea.focus(), 0);
  };

  // --- SECTION LOGIC ---
  const addSection = () => { 
      const id = Math.random().toString(36).substr(2, 9); 
      const newSection: Section = { id, title: newSectionName || 'New Section', type: newSectionType, isVisible: true, items: [], content: '', column: 'full' as const }; 
      const newData = { ...resume, sections: [...resume.sections, newSection] }; 
      updateResume(newData); autoSave(newData); setShowAddModal(false); setNewSectionName(''); setActiveSectionId(id); setViewMode('edit'); 
  }
  
  const moveSection = (index: number, direction: 'up' | 'down') => { const newSections = [...resume.sections]; if (direction === 'up' && index > 0) [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]]; else if (direction === 'down' && index < newSections.length - 1) [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]]; const newData = { ...resume, sections: newSections }; updateResume(newData); autoSave(newData); }
  const deleteSection = (id: string) => { if(!confirm('Delete section?')) return; const newData = { ...resume, sections: resume.sections.filter(s => s.id !== id) }; updateResume(newData); autoSave(newData); setActiveSectionId('basics'); }
  
  const addPageBreak = () => { 
      const id = Math.random().toString(36).substr(2, 9); 
      const breakSection: Section = { id, title: 'Page Break', type: 'break', isVisible: true, items: [], content: '', column: 'full' as const }; 
      const newData = { ...resume, sections: [...resume.sections, breakSection] }; 
      updateResume(newData); autoSave(newData); 
  }
  
  const updateSectionItem = (sectionId: string, itemId: string, field: string, value: any) => { const newSections = resume.sections.map(s => { if (s.id !== sectionId) return s; const newItems = s.items.map(i => i.id === itemId ? { ...i, [field]: value } : i); return { ...s, items: newItems }; }); updateResume({ ...resume, sections: newSections }); }
  const addSectionItem = (sectionId: string) => { const itemId = Math.random().toString(36).substr(2, 9); const newSections = resume.sections.map(s => { if (s.id !== sectionId) return s; const newItem: SectionItem = { id: itemId, title: 'New Item', date: '2024', subtitle: 'Subtitle', description: '' }; if (s.type === 'skills') newItem.tags = ['Skill 1']; return { ...s, items: [...s.items, newItem] }; }); updateResume({ ...resume, sections: newSections }); }
  const removeItem = (sectionId: string, itemId: string) => { const newSections = resume.sections.map(s => { if (s.id !== sectionId) return s; return { ...s, items: s.items.filter(i => i.id !== itemId) }; }); updateResume({ ...resume, sections: newSections }); }
  const loadSample = () => { if(confirm('Overwrite with sample data?')) { updateResume(SAMPLE_RESUME); autoSave(SAMPLE_RESUME); } }

  const handlePrint = useReactToPrint({ 
    contentRef: componentRef, 
    documentTitle: resume.basics.fullName || 'Resume' 
  });

  const onDownloadClick = async () => {
    if (isPremium) { handlePrint(); return; }
    
    if (credits > 0) {
        if (confirm(`Use 1 Credit to download? (${credits} remaining)`)) {
            try {
                const res = await fetch('/api/user/deduct-credit', { method: 'POST' });
                
                if (!res.ok) {
                    const err = await res.json();
                    alert(`Error: ${err.error || 'Failed to process request'}`);
                    return;
                }

                const json = await res.json();
                if (json.success) {
                    setCredits(json.remaining);
                    // Wait slightly for state update before printing
                    setTimeout(() => handlePrint(), 100);
                } else {
                    alert("Could not deduct credit.");
                }
            } catch (e) {
                console.error(e);
                alert("Network error. Please check your connection.");
            }
        }
    } else {
        if(confirm("You have 0 credits.\nPay ₹39 for this download?")) router.push('/pricing');
    }
  }

  const onSelectTemplate = (id: string) => {
      const template = TEMPLATES[id];
      if (!isPremium && template.tier === 'premium') {
         alert("This is a Premium template. Upgrade to use.");
         return;
      }
      setSelectedTemplate(id);
      autoSave(resume);
  }

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin"/></div>

  const CurrentTemplate = TEMPLATES[selectedTemplate].component;
  const pages: Section[][] = []; let currentPage: Section[] = []; 
  resume.sections.forEach(section => { if (section.type === 'break') { pages.push(currentPage); currentPage = []; } else { currentPage.push(section); } }); 
  if (currentPage.length > 0) pages.push(currentPage);

  return (
    <div className="h-screen flex flex-col bg-slate-100 font-sans text-slate-800 overflow-hidden">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <style jsx global>{` @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Merriweather:wght@400;700&family=Montserrat:wght@400;700&family=Open+Sans:wght@400;700&family=Oswald:wght@400;700&family=Playfair+Display:wght@400;700&family=Raleway:wght@400;700&family=Roboto:wght@400;700&display=swap'); @media print { @page { size: A4; margin: 0mm; } body { margin: 0; padding: 0; } .print-hide { display: none !important; } .print-break { display: block !important; } .print-spacer { display: block !important; } } `}</style>

      <header className="h-14 bg-white border-b flex items-center justify-between px-4 shrink-0 z-30">
         <div className="flex items-center gap-3">
            <button onClick={() => router.push('/dashboard')}><ArrowLeft size={18}/></button>
            <span className="font-bold">Editor</span>
            <div className="h-4 w-[1px] bg-slate-300 mx-2"></div>
            {isPremium ? <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-bold">PRO</span> : <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-bold">{credits} Credits</span>}
         </div>
         <div className="flex gap-2 items-center">
            {saving && <span className="text-xs text-slate-400 flex gap-1 items-center mr-2"><Loader2 size={12} className="animate-spin"/> Saving...</span>}
            {!isPremium && credits < 1 && <button onClick={() => router.push('/pricing')} className="bg-indigo-600 text-white px-3 py-1.5 rounded text-xs font-bold flex gap-1 hover:bg-indigo-700"><Sparkles size={12}/> Upgrade</button>}
            <button onClick={onDownloadClick} className="bg-slate-900 text-white px-3 py-1.5 rounded text-xs font-bold flex gap-2"><Download size={14}/> Download</button>
         </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT NAV */}
        <nav className="w-64 bg-white border-r flex flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
           <div className="p-4 border-b bg-slate-50 flex justify-between items-center"><span className="text-xs font-bold uppercase text-slate-400">Contents</span><button onClick={() => setShowAddModal(true)} className="text-xs bg-white border px-2 py-1 rounded hover:bg-indigo-50 text-indigo-600 flex items-center gap-1"><Plus size={12}/> Add</button></div>
           <div className="flex-1 overflow-y-auto p-2 space-y-1">
              <button onClick={() => { setActiveSectionId('basics'); setViewMode('edit'); }} className={`w-full text-left px-3 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-all ${activeSectionId === 'basics' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'hover:bg-slate-50 text-slate-600'}`}><User size={16} className={activeSectionId === 'basics' ? 'text-indigo-500' : 'text-slate-400'}/> Basics</button>
              <div className="my-2 border-t mx-2"></div>
              {resume.sections.filter(s => s.type !== 'break').map((section) => (
                 <button key={section.id} onClick={() => { setActiveSectionId(section.id); setViewMode('edit'); }} className={`w-full text-left px-3 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-all ${activeSectionId === section.id ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'hover:bg-slate-50 text-slate-600'}`}>
                    {section.type === 'skills' ? <Check size={16} className={activeSectionId === section.id ? 'text-indigo-500' : 'text-slate-400'}/> : section.type === 'list' ? <Briefcase size={16} className={activeSectionId === section.id ? 'text-indigo-500' : 'text-slate-400'}/> : <AlignLeft size={16} className={activeSectionId === section.id ? 'text-indigo-500' : 'text-slate-400'}/>} <span className="truncate">{section.title}</span>
                 </button>
              ))}
           </div>
        </nav>

        <div className="flex-1 bg-slate-100 relative z-10 flex flex-col overflow-hidden">
           {/* EDIT MODE */}
           <div className={`flex-1 flex flex-col h-full bg-white animate-in slide-in-from-bottom-4 fade-in duration-300 ${viewMode === 'edit' ? 'block' : 'hidden'}`}>
                <div className="p-4 border-b flex items-center justify-between bg-white"><button onClick={() => setViewMode('preview')} className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-2"><ArrowLeft size={16}/> Back to Preview</button><span className="font-bold text-slate-800 text-sm uppercase tracking-wider">Editing: {activeSectionId === 'basics' ? 'Basics' : resume.sections.find(s => s.id === activeSectionId)?.title}</span><div className="w-20"></div></div>
                <div className="flex-1 overflow-y-auto p-8">
                   <div className="max-w-2xl mx-auto">
                     {activeSectionId === 'basics' && (
                        <div className="space-y-6">
                           <div className="flex flex-col items-center mb-6 p-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                              <label className="relative cursor-pointer group flex flex-col items-center"><div className="w-24 h-24 rounded-full bg-white flex items-center justify-center border shadow-sm overflow-hidden group-hover:border-indigo-500 transition-all">{resume.basics.image ? <img src={resume.basics.image} className="w-full h-full object-cover" alt="Profile" /> : <ImageIcon className="text-slate-300" size={32} />}</div><input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} /><div className="text-xs text-center mt-3 text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-full group-hover:bg-indigo-100 transition-colors">{resume.basics.image ? "Change Photo" : "Upload Photo"}</div></label>
                              {resume.basics.image && <button onClick={() => updateResume({...resume, basics: {...resume.basics, image: ''}})} className="mt-2 text-[10px] text-red-500 hover:text-red-700 flex items-center gap-1"><Trash2 size={10} /> Remove</button>}
                           </div>
                           <div className="grid grid-cols-1 gap-4">
                              <Input label="Full Name" value={resume.basics.fullName} onChange={(v:string) => updateResume({...resume, basics: {...resume.basics, fullName: v}})} />
                              <Input label="Job Title" value={resume.basics.jobTitle} onChange={(v:string) => updateResume({...resume, basics: {...resume.basics, jobTitle: v}})} />
                              <div className="grid grid-cols-2 gap-4"><Input label="Email" value={resume.basics.email} onChange={(v:string) => updateResume({...resume, basics: {...resume.basics, email: v}})} /><Input label="Phone" value={resume.basics.phone} onChange={(v:string) => updateResume({...resume, basics: {...resume.basics, phone: v}})} /></div>
                              <Input label="Location" value={resume.basics.location} onChange={(v:string) => updateResume({...resume, basics: {...resume.basics, location: v}})} />
                              <Input label="Website / Link" value={resume.basics.website} onChange={(v:string) => updateResume({...resume, basics: {...resume.basics, website: v}})} />
                           </div>
                           <div className="pt-4 border-t"><button onClick={manualSave} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex justify-center items-center gap-2 transition-all"><Save size={16}/> Save Basics</button></div>
                        </div>
                     )}
                     {resume.sections.map(section => {
                        if (section.id !== activeSectionId) return null;
                        return (
                           <div key={section.id} className="space-y-6">
                              <div className="flex justify-between items-center border-b pb-4"><input className="text-xl font-bold text-slate-800 bg-transparent outline-none focus:bg-slate-50 rounded px-1 -ml-1" value={section.title} onChange={(e) => {const newSections = resume.sections.map(s => s.id === section.id ? { ...s, title: e.target.value } : s); updateResume({ ...resume, sections: newSections });}} /><button onClick={() => deleteSection(section.id)} className="text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"><Trash2 size={18}/></button></div>
                              <div className="flex gap-2 text-xs mb-4"><button onClick={() => {const newSections = resume.sections.map(s => s.id === section.id ? { ...s, column: 'left' as const } : s); updateResume({ ...resume, sections: newSections });}} className={`px-3 py-1 rounded border ${section.column === 'left' ? 'bg-slate-800 text-white' : 'bg-white'}`}>Sidebar</button><button onClick={() => {const newSections = resume.sections.map(s => s.id === section.id ? { ...s, column: 'right' as const } : s); updateResume({ ...resume, sections: newSections });}} className={`px-3 py-1 rounded border ${section.column !== 'left' ? 'bg-slate-800 text-white' : 'bg-white'}`}>Main Body</button></div>
                              {section.type === 'text' && <div><RichTextToolbar onAction={(tag) => handleFormat(tag, section.id)} /><textarea ref={(el) => { if(activeSectionId === section.id) activeInputRef.current = el; }} className="w-full h-48 p-4 border rounded-lg text-sm leading-relaxed focus:ring-2 focus:ring-indigo-500 outline-none resize-none font-mono" value={section.content} onChange={(e) => {const newSections = resume.sections.map(s => s.id === section.id ? { ...s, content: e.target.value } : s); updateResume({ ...resume, sections: newSections });}} /></div>}
                              {section.type === 'list' && <div className="space-y-6">{section.items.map(item => (<div key={item.id} className="p-5 border rounded-xl bg-slate-50/50 hover:bg-white hover:shadow-md transition-all relative group"><button onClick={() => removeItem(section.id, item.id)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button><div className="grid grid-cols-1 gap-3 mb-3"><Input label="Title (Company/School)" value={item.title} onChange={(v:string) => updateSectionItem(section.id, item.id, 'title', v)} /><div className="grid grid-cols-2 gap-3"><Input label="Subtitle (Role/Degree)" value={item.subtitle} onChange={(v:string) => updateSectionItem(section.id, item.id, 'subtitle', v)} /><Input label="Date" value={item.date} onChange={(v:string) => updateSectionItem(section.id, item.id, 'date', v)} /></div></div><div><RichTextToolbar onAction={(tag) => handleFormat(tag, section.id, item.id)} /><textarea ref={(el) => { if(activeSectionId === section.id) activeInputRef.current = el; }} className="w-full p-3 border rounded-lg text-sm min-h-[120px] focus:ring-indigo-500 outline-none resize-y font-mono" placeholder="Description..." value={item.description} onChange={(e) => updateSectionItem(section.id, item.id, 'description', e.target.value)} /></div></div>))}<button onClick={() => addSectionItem(section.id)} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all font-medium flex items-center justify-center gap-2">+ Add Item</button></div>}
                              {section.type === 'skills' && <div className="bg-slate-50 p-6 rounded-xl border"><label className="text-xs font-bold uppercase text-slate-500 mb-3 block">Skills (Comma Separated)</label><textarea className="w-full p-4 border rounded-lg text-sm h-32 focus:ring-2 focus:ring-indigo-500 outline-none resize-none bg-white" placeholder="React, Node.js..." value={section.items[0]?.tags?.join(', ')} onChange={(e) => {const tags = e.target.value.split(',').map(t => t.trim()); const newItems = [{ ...section.items[0], id: 'skills', tags }]; const newSections = resume.sections.map(s => s.id === section.id ? { ...s, items: newItems } : s); updateResume({ ...resume, sections: newSections });}}/></div>}
                              <div className="pt-6 border-t mt-8"><button onClick={manualSave} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex justify-center items-center gap-2 shadow-md shadow-indigo-200 transition-all active:scale-95"><Save size={18}/> Save {section.title}</button></div>
                           </div>
                        );
                     })}
                   </div>
                </div>
             </div>
           }

           {/* PREVIEW MODE */}
           <div className={`absolute inset-0 overflow-auto p-8 flex justify-center items-start bg-[#eef2f6] ${viewMode === 'preview' ? 'z-20 opacity-100' : 'z-0 opacity-0 pointer-events-none'}`}>
              <div className="absolute inset-0 opacity-[0.4] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              
              <div className="shadow-2xl origin-top transform scale-[0.55] sm:scale-[0.65] lg:scale-[0.80] transition-transform bg-transparent h-fit mb-20 mt-4 relative z-10 print:transform-none print:scale-100 print:shadow-none print:m-0">
                 <div ref={componentRef} className="text-slate-800">
                    <div style={{ fontFamily: design.font }}>
                       <CurrentTemplate data={resume} theme={design} isPremium={isPremium} />
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* COLUMN 3: RIGHT CONTROL CENTER */}
        <div className="w-[350px] bg-white border-l flex flex-col z-20 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
           <div className="flex border-b bg-slate-50"><button onClick={() => setActiveTab('design')} className={`flex-1 py-3 text-xs font-bold uppercase flex items-center justify-center gap-2 transition-colors ${activeTab === 'design' ? 'bg-white border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}><Palette size={14}/> Design</button><button onClick={() => setActiveTab('structure')} className={`flex-1 py-3 text-xs font-bold uppercase flex items-center justify-center gap-2 transition-colors ${activeTab === 'structure' ? 'bg-white border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}><Layers size={14}/> Structure</button></div>
           <div className="flex-1 overflow-hidden bg-slate-50/30 relative">
              {activeTab === 'design' && (
                 <div className="absolute inset-0 overflow-y-auto p-6 space-y-8 bg-white">
                    <div>
                       <label className="text-xs font-bold uppercase text-slate-400 mb-3 block">Templates</label>
                       <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                          {['all', 'modern', 'professional', 'creative'].map(cat => (
                             <button key={cat} onClick={() => setTemplateCategory(cat as any)} className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold border ${templateCategory === cat ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200'}`}>{cat}</button>
                          ))}
                       </div>
                       <div className="grid grid-cols-2 gap-3">
                          {Object.entries(TEMPLATES)
                             .filter(([_, conf]: any) => templateCategory === 'all' || conf.category === templateCategory)
                             .map(([id, conf]: [string, any]) => (
                             <button key={id} onClick={() => onSelectTemplate(id)} className={`relative p-3 border rounded-lg text-left transition-all hover:shadow-md ${selectedTemplate === id ? 'border-indigo-600 ring-1 ring-indigo-600 bg-indigo-50' : 'hover:border-gray-300 border-gray-200'} ${!isPremium && conf.tier === 'premium' ? 'opacity-70 bg-gray-50' : ''}`}>
                                <div className="flex items-center justify-between gap-2">
                                   <div className="flex items-center gap-2"><Layout size={14} className={selectedTemplate === id ? 'text-indigo-600' : 'text-slate-400'}/><span className={`text-xs font-bold truncate ${selectedTemplate === id ? 'text-indigo-700' : 'text-slate-600'}`}>{conf.name}</span></div>
                                   {conf.tier === 'premium' && !isPremium && <Lock size={12} className="text-amber-500"/>}
                                </div>
                             </button>
                          ))}
                       </div>
                    </div>
                    <div><label className="text-xs font-bold uppercase text-slate-400 mb-3 block">Font Size</label><div className="grid grid-cols-3 gap-2">{FONT_SIZES.map(s => (<button key={s.id} onClick={() => setDesign({...design, fontSize: s.id as any})} className={`py-2 text-xs border rounded-md transition-all ${design.fontSize === s.id ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold' : 'hover:bg-slate-50'}`}>{s.label}</button>))}</div></div>
                    <div><label className="text-xs font-bold uppercase text-slate-400 mb-3 block">Colors</label><div className="flex flex-wrap gap-3">{COLORS.map(c => (<button key={c} onClick={() => setDesign({...design, color: c})} className={`w-8 h-8 rounded-full border-2 transition-all shadow-sm ${design.color === c ? 'border-slate-800 scale-110' : 'border-transparent hover:scale-105'}`} style={{backgroundColor: c}} />))}</div></div>
                    <div><label className="text-xs font-bold uppercase text-slate-400 mb-3 block">Fonts</label><div className="space-y-2">{FONTS.map(f => (<button key={f.id} onClick={() => setDesign({...design, font: f.family})} className={`w-full p-3 text-left text-sm border rounded-lg flex items-center justify-between transition-all ${design.font === f.family ? 'border-indigo-600 text-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}><span style={{ fontFamily: f.family }}>{f.label}</span>{design.font === f.family && <Check size={14}/>}</button>))}</div></div>
                 </div>
              )}
              {activeTab === 'structure' && (
                 <div className="absolute inset-0 overflow-y-auto p-6 bg-white">
                    <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-slate-800">Page Layout</h3><button onClick={addPageBreak} className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded flex gap-1 items-center"><FileMinus size={12}/> Page Break</button></div>
                    <div className="space-y-6">{pages.map((pageSections, pageIdx) => (<div key={pageIdx} className="border rounded-lg overflow-hidden"><div className="bg-slate-100 px-4 py-2 text-xs font-bold text-slate-500 uppercase flex justify-between"><span>Page {pageIdx + 1}</span><span>{pageSections.length} Sections</span></div><div className="divide-y">{pageSections.map((section: Section) => { const globalIdx = resume.sections.findIndex(s => s.id === section.id); return (<div key={section.id} className="p-3 bg-white flex items-center justify-between group hover:bg-slate-50"><span className="text-sm font-medium text-slate-700 truncate w-40">{section.title}</span><div className="flex items-center gap-1 opacity-50 group-hover:opacity-100"><button onClick={() => moveSection(globalIdx, 'up')} disabled={globalIdx === 0} className="p-1 hover:bg-white border rounded disabled:opacity-30"><ArrowUp size={12}/></button><button onClick={() => moveSection(globalIdx, 'down')} disabled={globalIdx === resume.sections.length - 1} className="p-1 hover:bg-white border rounded disabled:opacity-30"><ArrowDown size={12}/></button>{section.type === 'break' && <button onClick={() => deleteSection(section.id)} className="p-1 text-red-500 hover:bg-red-50 rounded ml-2"><Trash2 size={12}/></button>}</div></div>); })}</div></div>))}</div>
                 </div>
              )}
           </div>
        </div>
      </div>
      {showAddModal && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"><div className="bg-white p-6 rounded-xl w-96 shadow-2xl animate-in zoom-in-95 duration-200"><h3 className="font-bold text-lg mb-1">Add Section</h3><p className="text-xs text-slate-500 mb-4">Choose a type for your new resume section.</p><input autoFocus placeholder="Section Title (e.g. Certifications)" className="w-full p-3 border rounded-lg mb-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500" value={newSectionName} onChange={(e) => setNewSectionName(e.target.value)} /><div className="grid grid-cols-3 gap-3 mb-6"><button onClick={() => setNewSectionType('list')} className={`p-3 border rounded-lg text-xs flex flex-col items-center gap-2 transition-all ${newSectionType === 'list' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500' : 'hover:bg-slate-50'}`}><Layout size={20}/> <span className="font-medium">List</span></button><button onClick={() => setNewSectionType('text')} className={`p-3 border rounded-lg text-xs flex flex-col items-center gap-2 transition-all ${newSectionType === 'text' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500' : 'hover:bg-slate-50'}`}><AlignLeft size={20}/> <span className="font-medium">Text</span></button><button onClick={() => setNewSectionType('skills')} className={`p-3 border rounded-lg text-xs flex flex-col items-center gap-2 transition-all ${newSectionType === 'skills' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500' : 'hover:bg-slate-50'}`}><Check size={20}/> <span className="font-medium">Tags</span></button></div><div className="flex justify-end gap-2 pt-2 border-t"><button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 rounded-lg">Cancel</button><button onClick={addSection} disabled={!newSectionName} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">Create Section</button></div></div></div>)}
    </div>
  )
}