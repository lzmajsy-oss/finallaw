
import React, { useState, useEffect } from 'react';
import { HOME_CATEGORIES } from '../constants';
import { LaborForm } from '../types';
import { getLaborAdvice, getTrafficAdvice, getConsumerAdvice, getDebtAdvice, getQuickAdvice } from '../services/aiService';

const HomeView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const [qaInput, setQaInput] = useState('');
  const [qaLoading, setQaLoading] = useState(false);
  const [qaResult, setQaResult] = useState<string | null>(null);

  const [history, setHistory] = useState<any[]>([]);
  useEffect(() => {
    const saved = localStorage.getItem('consult_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const [laborData, setLaborData] = useState<LaborForm>({
    region: '北京', hasContract: true, entryDate: '', leaveDate: '', monthlySalary: '', probation: '', salaryStatus: '按时足额', insurance: true, leaveStatus: '在职', demands: ''
  });
  const [trafficData, setTrafficData] = useState({ type: '机动车事故', responsibility: '对方全责', injury: '未达伤残', medicalCost: '', propertyLoss: '', region: '上海', insurance: '交强险+商险' });
  const [consumerData, setConsumerData] = useState({ platform: '', product: '', amount: '', issue: '虚假宣传', demands: '退一赔三', date: '' });
  const [debtData, setDebtData] = useState({ amount: '', date: '', evidence: '有借条+转账', status: '催收无果', interestRate: '', overdueDays: '' });

  const handleAnalysis = async (type: string) => {
    setLoading(true);
    try {
      let advice = "";
      if (type === 'labor') advice = await getLaborAdvice(laborData);
      else if (type === 'traffic') advice = await getTrafficAdvice(trafficData);
      else if (type === 'refund') advice = await getConsumerAdvice(consumerData);
      else if (type === 'loan') advice = await getDebtAdvice(debtData);
      
      setResult(advice);
      const newEntry = { type, date: new Date().toLocaleString(), title: `${HOME_CATEGORIES.find(c => c.id === type)?.title}咨询` };
      const updatedHistory = [newEntry, ...history].slice(0, 5);
      setHistory(updatedHistory);
      localStorage.setItem('consult_history', JSON.stringify(updatedHistory));
    } catch (err) {
      alert("AI 服务繁忙。");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQA = async () => {
    if (!qaInput.trim()) return;
    setQaLoading(true);
    try {
      const advice = await getQuickAdvice(qaInput);
      setQaResult(advice);
    } catch (err) {
      alert("AI 暂时离线。");
    } finally {
      setQaLoading(false);
    }
  };

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 100);
  };

  if (result) {
    return (
      <div className="p-4 animate-fadeIn">
        <div className="flex justify-between items-center mb-6 no-print">
          <button onClick={() => setResult(null)} className="flex items-center text-indigo-600 font-bold">
            <span className="material-icons mr-1">arrow_back</span> 返回
          </button>
          <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold">已生成法律建议书</div>
        </div>
        
        <div className="soft-card rounded-3xl p-8 border border-indigo-100 printable shadow-xl relative bg-white">
          <div className="flex flex-col items-center border-b border-indigo-50 pb-6 mb-6">
            <h2 className="text-xl font-bold text-slate-800 text-serif tracking-widest">止鸣 · 法律分析报告</h2>
            <p className="text-[10px] text-slate-400 mt-2 font-mono">编号: ZM-{Date.now().toString().slice(-8)} | 生成日期: {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-sm font-light space-y-4">
            {result}
          </div>

          <div className="mt-8 p-4 bg-orange-50/50 rounded-2xl border border-orange-100 no-print">
            <h4 className="text-xs font-bold text-orange-700 mb-2 flex items-center gap-1">
              <span className="material-icons text-sm">inventory_2</span> 建议保留证据清单
            </h4>
            <p className="text-[10px] text-orange-600 leading-relaxed">
              根据您的案情，建议务必保留：相关转账记录截图、合同或借条原件、关键聊天记录。
            </p>
          </div>

          <div className="mt-10 border-t border-indigo-50 pt-6 text-center text-[10px] text-slate-400 italic">
            本报告由止鸣 AI 生成，致力于以极简成本助您解决烦恼。
          </div>
          
          <button onClick={handlePrint} className="mt-8 w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold no-print shadow-lg hover:bg-indigo-700 transition-all active:scale-95">
            导出 PDF 分析文件
          </button>
        </div>
      </div>
    );
  }

  const renderForm = () => {
    switch (selectedCategory) {
      case 'labor':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label>涉及城市</label>
                <input type="text" value={laborData.region} onChange={e => setLaborData({...laborData, region: e.target.value})} className="input-line" />
              </div>
              <div className="form-group">
                <label>月薪 (元)</label>
                <input type="number" value={laborData.monthlySalary} onChange={e => setLaborData({...laborData, monthlySalary: e.target.value})} className="input-line" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label>入职日期</label>
                <input type="date" value={laborData.entryDate} onChange={e => setLaborData({...laborData, entryDate: e.target.value})} className="input-line text-xs" />
              </div>
              <div className="form-group">
                <label>离职日期</label>
                <input type="date" value={laborData.leaveDate} onChange={e => setLaborData({...laborData, leaveDate: e.target.value})} className="input-line text-xs" />
              </div>
            </div>
            <textarea placeholder="请描述核心诉求（如：未缴社保补缴、加班费等）" value={laborData.demands} onChange={e => setLaborData({...laborData, demands: e.target.value})} className="text-area" />
            <button onClick={() => handleAnalysis('labor')} className="btn-warm">开始劳动维权分析</button>
          </div>
        );
      case 'traffic':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label>责任划分</label>
                <select value={trafficData.responsibility} onChange={e => setTrafficData({...trafficData, responsibility: e.target.value})} className="input-line text-xs">
                  <option>对方全责</option><option>我方全责</option><option>同等责任</option><option>主次责任</option>
                </select>
              </div>
              <div className="form-group">
                <label>保险配置</label>
                <select value={trafficData.insurance} onChange={e => setTrafficData({...trafficData, insurance: e.target.value})} className="input-line text-xs">
                  <option>仅交强险</option><option>交强险+商险</option><option>无保险</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="number" placeholder="医疗费 (元)" value={trafficData.medicalCost} onChange={e => setTrafficData({...trafficData, medicalCost: e.target.value})} className="input-line" />
              <input type="number" placeholder="财损 (元)" value={trafficData.propertyLoss} onChange={e => setTrafficData({...trafficData, propertyLoss: e.target.value})} className="input-line" />
            </div>
            <textarea placeholder="伤情描述及理赔诉求..." value={trafficData.injury} onChange={e => setTrafficData({...trafficData, injury: e.target.value})} className="text-area" />
            <button onClick={() => handleAnalysis('traffic')} className="btn-warm">评估理赔方案</button>
          </div>
        );
      case 'refund':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="form-group">
              <label>平台或商家</label>
              <input type="text" placeholder="如：淘宝、拼多多" value={consumerData.platform} onChange={e => setConsumerData({...consumerData, platform: e.target.value})} className="input-line" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="number" placeholder="订单金额" value={consumerData.amount} onChange={e => setConsumerData({...consumerData, amount: e.target.value})} className="input-line" />
              <select value={consumerData.issue} onChange={e => setConsumerData({...consumerData, issue: e.target.value})} className="input-line text-xs">
                <option>虚假宣传</option><option>质量问题</option><option>拒绝退款</option><option>价格欺诈</option>
              </select>
            </div>
            <textarea placeholder="争议描述" value={consumerData.demands} onChange={e => setConsumerData({...consumerData, demands: e.target.value})} className="text-area" />
            <button onClick={() => handleAnalysis('consumer')} className="btn-warm">分析维权策略</button>
          </div>
        );
      case 'loan':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label>借款金额</label>
                <input type="number" value={debtData.amount} onChange={e => setDebtData({...debtData, amount: e.target.value})} className="input-line" />
              </div>
              <div className="form-group">
                <label>借款日期</label>
                <input type="date" value={debtData.date} onChange={e => setDebtData({...debtData, date: e.target.value})} className="input-line text-xs" />
              </div>
            </div>
            <select value={debtData.evidence} onChange={e => setDebtData({...debtData, evidence: e.target.value})} className="input-line text-xs">
              <option>有借条+转账</option><option>仅转账记录</option><option>仅口头借款</option><option>证据丢失</option>
            </select>
            <textarea placeholder="还款状态描述" value={debtData.status} onChange={e => setDebtData({...debtData, status: e.target.value})} className="text-area" />
            <button onClick={() => handleAnalysis('debt')} className="btn-warm">生成追偿建议</button>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="p-6">
      <div className="soft-card rounded-3xl p-6 mb-8 border-indigo-100 bg-gradient-to-br from-indigo-50 to-white">
        <div className="flex items-center gap-2 text-indigo-600 mb-3 font-bold tracking-widest text-[10px]">
          <span className="material-icons text-sm">verified</span> 止鸣 AI · 法律平权方案
        </div>
        <h2 className="text-2xl font-bold text-slate-800 text-serif">极简成本<br/>解决您的<span className="text-indigo-600">法律烦恼</span></h2>
      </div>

      <div className="mb-10">
        <h3 className="text-slate-400 text-[10px] font-bold mb-4 uppercase tracking-[0.2em]">止鸣快问 · 即刻回复</h3>
        <div className="soft-card p-2 rounded-2xl border-indigo-50/50 shadow-sm">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="输入您的疑问..." 
              value={qaInput} 
              onChange={e => setQaInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleQuickQA()}
              className="flex-1 bg-white rounded-xl px-4 py-3 text-sm outline-none"
            />
            <button onClick={handleQuickQA} disabled={qaLoading} className="bg-indigo-600 text-white px-4 rounded-xl">
              <span className="material-icons">{qaLoading ? 'sync' : 'bolt'}</span>
            </button>
          </div>
          {qaResult && (
            <div className="mt-3 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 animate-fadeIn relative">
              <button onClick={() => setQaResult(null)} className="absolute top-2 right-2 text-slate-300">
                <span className="material-icons text-sm">close</span>
              </button>
              <p className="text-xs text-slate-700 leading-relaxed">{qaResult}</p>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-slate-400 text-[10px] font-bold mb-4 uppercase tracking-[0.2em]">专业案情分析</h3>
        
        {selectedCategory ? (
          <div className="soft-card p-6 rounded-3xl border-indigo-100 animate-fadeIn">
            <button onClick={() => setSelectedCategory(null)} className="text-indigo-600 flex items-center gap-1 text-[10px] font-bold mb-6">
              <span className="material-icons text-sm">arrow_back</span> 返回
            </button>
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center text-indigo-600">
                <span className="material-icons animate-spin text-4xl mb-4">gavel</span>
                <p className="text-xs font-bold animate-pulse">DeepSeek 正在为您分析...</p>
              </div>
            ) : renderForm()}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {HOME_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`soft-card p-6 rounded-3xl flex flex-col items-center ${cat.color} group transition-all`}
              >
                <span className="material-icons text-3xl mb-3">{cat.icon}</span>
                <span className="text-xs font-bold text-slate-700">{cat.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .form-group label { display: block; font-size: 10px; font-weight: 700; color: #94a3b8; margin-bottom: 4px; }
        .input-line { width: 100%; border-bottom: 2px solid #f1f5f9; background: transparent; padding: 8px 0; font-size: 14px; outline: none; }
        .input-line:focus { border-color: #4f46e5; }
        .text-area { width: 100%; border: 2px solid #f1f5f9; border-radius: 16px; padding: 16px; font-size: 14px; outline: none; min-h: 120px; }
        .btn-warm { width: 100%; padding: 16px; background: #4f46e5; color: white; font-weight: 800; border-radius: 18px; }
      `}</style>
    </div>
  );
};

export default HomeView;
