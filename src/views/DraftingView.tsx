
import React, { useState } from 'react';
import { DRAFT_TEMPLATES } from '../constants';
import { draftLegalDoc } from '../services/aiService';

interface Props {
  paidIds: string[];
  onPay: (id: string) => void;
}

const DraftingView: React.FC<Props> = ({ paidIds, onPay }) => {
  const [userInput, setUserInput] = useState('');
  const [activeTemplate, setActiveTemplate] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [docContent, setDocContent] = useState<string | null>(null);
  const [formData, setFormData] = useState({ plaintiff: '', defendant: '', claims: '', facts: '' });
  
  const docId = `draft_${activeTemplate?.id || 'custom'}_${Date.now().toString().slice(-4)}`;
  const isPaid = paidIds.includes(docId);

  const handleStartDraft = async (type: string, details: string) => {
    setLoading(true);
    try {
      const result = await draftLegalDoc(type, details, "请务必包含中国法院认可的起诉状/文书正式格式。");
      setDocContent(result);
    } catch (err) {
      alert("AI 服务响应忙，请检查描述后重试。");
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSubmit = () => {
    const combinedFacts = `原告：${formData.plaintiff}\n被告：${formData.defendant}\n诉讼请求：${formData.claims}\n事实理由：${formData.facts}`;
    handleStartDraft(activeTemplate?.title || '法律文书', combinedFacts);
  };

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const exportToWord = () => {
    if (!docContent) return;
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>法律文书</title><style>body{font-family:'SimSun';line-height:1.5;}</style></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + "<h1>" + (activeTemplate?.title || '法律文书') + "</h1>" + docContent.replace(/\n/g, "<br/>") + footer;
    const blob = new Blob(['\ufeff', sourceHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `止鸣AI-${activeTemplate?.title || '文书'}.doc`;
    link.click();
  };

  // 渲染生成后的结果
  if (docContent) {
    const displayed = isPaid ? docContent : docContent.slice(0, 200);
    return (
      <div className="p-4 animate-fadeIn">
        <button onClick={() => setDocContent(null)} className="flex items-center text-indigo-600 mb-6 font-bold text-xs no-print">
          <span className="material-icons text-sm mr-1">arrow_back</span> 返回编辑信息
        </button>
        
        <div className="relative">
          <div className={`soft-card rounded-2xl p-8 border border-slate-100 ${!isPaid ? 'max-h-[500px] overflow-hidden' : ''} printable shadow-xl bg-white`}>
             <div className="text-center mb-10 border-b border-slate-50 pb-6">
                <h3 className="text-2xl font-bold text-slate-800 text-serif tracking-[0.2em]">{activeTemplate?.title || '法律文书'}</h3>
                <p className="text-[10px] text-slate-400 mt-3 font-mono">止鸣 AI · DeepSeek 智慧法务引擎驱动</p>
             </div>
             <div className="whitespace-pre-wrap text-sm text-slate-700 leading-[2] font-sans text-justify">
                {displayed}
                {!isPaid && (
                  <span className="text-transparent bg-clip-text bg-gradient-to-b from-slate-400 to-transparent">
                    {docContent.slice(200, 350)}......
                  </span>
                )}
             </div>
             
             {!isPaid && (
               <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-white via-white/95 to-transparent flex flex-col items-center justify-end pb-10 px-8 no-print">
                  <div className="bg-slate-900/90 backdrop-blur-xl p-8 rounded-[32px] text-center w-full shadow-2xl border border-white/10 scale-up">
                     <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-icons text-white">lock</span>
                     </div>
                     <h4 className="text-white font-bold text-lg tracking-wide">起草完成 · 待解锁</h4>
                     <p className="text-slate-400 text-[10px] mt-2 mb-8 leading-relaxed">
                        全文共 {docContent.length} 字。付费解锁后可查看全文建议、复制文字并支持 Word/PDF 导出。
                     </p>
                     <button onClick={() => onPay(docId)} className="w-full py-4 bg-indigo-500 text-white rounded-2xl font-bold shadow-xl active:scale-95 transition-all text-sm">
                        支付 19.9 元立即解锁
                     </button>
                  </div>
               </div>
             )}
          </div>
          
          {isPaid && (
            <div className="mt-8 flex gap-3 no-print">
              <button onClick={handlePrint} className="flex-1 py-4 bg-slate-800 text-white rounded-2xl font-bold text-xs shadow-lg active:scale-95 flex items-center justify-center gap-2">
                <span className="material-icons text-sm">picture_as_pdf</span> 导出 PDF
              </button>
              <button onClick={exportToWord} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-xs shadow-lg active:scale-95 flex items-center justify-center gap-2">
                <span className="material-icons text-sm">description</span> 导出 Word
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 渲染模板信息填写表单
  if (activeTemplate) {
    return (
      <div className="p-6 animate-fadeIn">
        <button onClick={() => setActiveTemplate(null)} className="flex items-center text-indigo-600 mb-8 font-bold text-xs">
          <span className="material-icons text-sm mr-1">arrow_back</span> 返回选择模板
        </button>
        
        <div className="soft-card p-6 rounded-3xl border-indigo-50">
          <h2 className="text-xl font-bold text-slate-800 mb-2">{activeTemplate.title}</h2>
          <p className="text-[10px] text-slate-400 mb-8">{activeTemplate.desc}</p>
          
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">原告基本信息</label>
              <input 
                type="text" 
                placeholder="姓名/名称、住址、联系方式" 
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:bg-white focus:border-indigo-400"
                value={formData.plaintiff}
                onChange={e => setFormData({...formData, plaintiff: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">被告基本信息</label>
              <input 
                type="text" 
                placeholder="姓名/名称、住址、联系方式" 
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:bg-white focus:border-indigo-400"
                value={formData.defendant}
                onChange={e => setFormData({...formData, defendant: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">核心诉讼请求</label>
              <textarea 
                placeholder="例如：判令被告向原告支付货款10000元..." 
                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm min-h-[100px] outline-none focus:bg-white focus:border-indigo-400"
                value={formData.claims}
                onChange={e => setFormData({...formData, claims: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">案情描述 (事实与理由)</label>
              <textarea 
                placeholder="请详细描述争议发生的过程及您的法律依据理由..." 
                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm min-h-[150px] outline-none focus:bg-white focus:border-indigo-400"
                value={formData.facts}
                onChange={e => setFormData({...formData, facts: e.target.value})}
              />
            </div>
            
            <button 
              onClick={handleTemplateSubmit}
              disabled={loading || !formData.facts || !formData.plaintiff}
              className={`w-full py-5 rounded-2xl font-bold text-white shadow-xl transition-all ${loading ? 'bg-indigo-300' : 'bg-indigo-600 active:scale-95'}`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="material-icons animate-spin text-sm">sync</span>
                  <span>AI 正在为您检索相关法理逻辑...</span>
                </div>
              ) : '开始起草正式文书'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 渲染初始选择列表
  return (
    <div className="p-6">
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800 text-serif">法律文书起草</h2>
        <p className="text-xs text-slate-400 mt-2">点击下方模板或直接输入需求，DeepSeek 为您构建专业文书</p>
      </div>

      <div className="soft-card p-5 rounded-3xl border-indigo-100 bg-gradient-to-br from-indigo-50/30 to-white mb-10">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                <span className="material-icons text-white text-xs">psychology</span>
             </div>
             <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">直接描述需求</span>
          </div>
          <textarea 
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            placeholder="例如：我想要起草一份给租房中介的催告函，要求他们退回押金..."
            className="w-full bg-white border border-indigo-50 rounded-2xl p-4 text-xs min-h-[100px] shadow-sm outline-none focus:ring-2 focus:ring-indigo-100"
          />
          <button 
            onClick={() => handleStartDraft("根据描述起草", userInput)}
            disabled={!userInput.trim() || loading}
            className="mt-4 w-full py-4 bg-indigo-600 text-white rounded-2xl text-xs font-bold active:scale-95 shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? <span className="material-icons animate-spin text-sm">sync</span> : <span className="material-icons text-sm">auto_fix_high</span>}
            {loading ? 'AI 起草中...' : '立即描述起草'}
          </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">常用标准起诉模板</h3>
        {DRAFT_TEMPLATES.map(item => (
          <button key={item.id} onClick={() => setActiveTemplate(item)} className="soft-card p-5 rounded-2xl flex items-center text-left hover:border-indigo-200 group transition-all">
            <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl mr-4 group-hover:bg-indigo-600 group-hover:text-white"><span className="material-icons">history_edu</span></div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
              <p className="text-[10px] text-slate-400 mt-1">{item.desc}</p>
            </div>
            <span className="material-icons text-slate-200 group-hover:text-indigo-600">arrow_forward</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DraftingView;
