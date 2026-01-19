
import React, { useState, useEffect } from 'react';
import { analyzeContract } from '../services/aiService';

interface Props {
  paidIds: string[];
  onPay: (id: string) => void;
}

const ContractView: React.FC<Props> = ({ paidIds, onPay }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const reportId = "contract_report_prod_001";
  const isPaid = paidIds.includes(reportId);

  const startAnalysis = async () => {
    if (!file) return;
    setLoading(true);
    try {
      // 模拟读取文件内容并分析
      const result = await analyzeContract("系统检测到这是一份标准的《房屋租赁合同》，正在通过 DeepSeek 进行深度风险扫描...");
      setReport(result);
    } catch (err) {
      alert("分析失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const exportToWord = () => {
    if (!report) return;
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + report.replace(/\n/g, "<br/>") + footer;
    const blob = new Blob(['\ufeff', sourceHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "止鸣AI-合同审查报告.doc";
    link.click();
  };

  const displayedContent = isPaid ? report : report?.slice(0, 200);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 text-serif">智能合同审查</h2>
        <p className="text-xs text-slate-400 mt-1">DeepSeek R1 引擎驱动 · 深度排查协议陷阱</p>
      </div>

      {!report ? (
        <div className="soft-card border-2 border-dashed border-indigo-100 rounded-3xl p-12 flex flex-col items-center justify-center text-center group transition-all relative">
          {loading && (
            <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center p-6 rounded-3xl">
              <span className="material-icons animate-spin text-indigo-600 text-4xl mb-4">gavel</span>
              <p className="text-xs font-bold text-indigo-600 animate-pulse">DeepSeek 正在逐句扫描条款...</p>
            </div>
          )}
          <input type="file" id="contract-upload" className="hidden" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
          <label htmlFor="contract-upload" className="cursor-pointer">
            <div className="bg-indigo-50 text-indigo-600 p-6 rounded-full mb-6">
              <span className="material-icons text-5xl">fact_check</span>
            </div>
            <p className="font-bold text-slate-700">{file ? file.name : '上传合同原件 (PDF/图片)'}</p>
          </label>
          {file && !loading && (
            <button onClick={startAnalysis} className="mt-8 w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 active:scale-95">开始深度审查</button>
          )}
        </div>
      ) : (
        <div className="animate-fadeIn">
          <div className={`soft-card rounded-2xl p-6 border border-slate-100 relative ${!isPaid ? 'max-h-[450px] overflow-hidden' : ''} printable`}>
             <div className="flex items-center gap-2 mb-4 text-indigo-600 font-bold border-b border-indigo-50 pb-3">
                <span className="material-icons text-sm">security</span>
                <span className="text-xs uppercase tracking-widest">DeepSeek 合规审查报告</span>
             </div>
             <div className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed">
                {displayedContent}
                {!isPaid && "......"}
             </div>
             
             {!isPaid && (
               <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-white via-white/90 to-transparent flex flex-col items-center justify-end pb-8 px-6 no-print">
                  <div className="bg-slate-900/95 backdrop-blur-md p-6 rounded-3xl text-center w-full shadow-2xl border border-white/10">
                     <h4 className="text-white font-bold">已为您发现多个合同隐患</h4>
                     <p className="text-slate-400 text-[10px] mt-2 mb-6">DeepSeek 已标注关键风险，解锁可查看全文并获取修改建议。</p>
                     <button onClick={() => onPay(reportId)} className="w-full py-3 bg-indigo-500 text-white rounded-xl font-bold text-sm shadow-xl active:scale-95">解锁全篇审查报告 (¥19.9)</button>
                  </div>
               </div>
             )}
          </div>

          {isPaid && (
            <div className="mt-6 grid grid-cols-2 gap-3 no-print">
              <button onClick={() => window.print()} className="py-3 bg-slate-800 text-white rounded-xl font-bold text-[10px] flex items-center justify-center gap-2">
                <span className="material-icons text-sm">picture_as_pdf</span> 导出 PDF
              </button>
              <button onClick={exportToWord} className="py-3 bg-indigo-600 text-white rounded-xl font-bold text-[10px] flex items-center justify-center gap-2">
                <span className="material-icons text-sm">description</span> 导出 Word
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContractView;
