
import React, { useState, useEffect } from 'react';

interface Props {
  paidIds: string[];
}

const MineView: React.FC<Props> = ({ paidIds }) => {
  const [history, setHistory] = useState<any[]>([]);
  useEffect(() => {
    const saved = localStorage.getItem('consult_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const menuItems = [
    { label: '我的已购文书', icon: 'auto_stories', count: paidIds.length, color: 'text-indigo-500' },
    { label: '案件进度跟踪', icon: 'timeline', count: 0, color: 'text-blue-500' },
    { label: '隐私安全中心', icon: 'verified_user', color: 'text-emerald-500' },
    { label: 'AI 免责声明', icon: 'gavel', color: 'text-orange-500' },
    { label: '建议与反馈', icon: 'maps_ugc', color: 'text-rose-500' },
    { label: '关于止鸣', icon: 'info', color: 'text-slate-400' }
  ];

  return (
    <div className="flex flex-col h-full bg-[#fdfbf9]">
      <div className="p-10 flex flex-col items-center border-b border-indigo-50 bg-white relative">
        <div className="relative">
          <div className="w-24 h-24 bg-slate-100 rounded-full mb-6 overflow-hidden border-4 border-white shadow-xl">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=LegalTrust&backgroundColor=f5f7ff" alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="absolute bottom-6 right-0 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center">
            <span className="material-icons text-[10px] text-white">done</span>
          </div>
        </div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">止鸣用户</h2>
        <div className="mt-2 px-3 py-1 bg-indigo-50 rounded-full">
          <p className="text-[10px] text-indigo-600 font-bold tracking-widest uppercase">TRUSTED USER</p>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-[10px] font-bold text-slate-400 mb-4 uppercase tracking-widest">咨询足迹 / RECENT ACTIVITY</h3>
        <div className="flex gap-3 overflow-x-auto pb-4 mb-4 no-scrollbar">
          {history.length > 0 ? history.map((h, i) => (
            <div key={i} className="min-w-[120px] p-4 bg-white rounded-2xl border border-indigo-50 shadow-sm text-center">
              <p className="text-[10px] font-bold text-indigo-600 mb-1">{h.title}</p>
              <p className="text-[8px] text-slate-400">{h.date.split(' ')[0]}</p>
            </div>
          )) : (
            <div className="w-full text-center py-4 text-[10px] text-slate-300 italic">暂无咨询记录</div>
          )}
        </div>

        <div className="space-y-4">
          {menuItems.map((item, idx) => (
            <button 
              key={idx}
              className="w-full soft-card flex items-center justify-between p-5 rounded-2xl border border-indigo-50 hover:bg-slate-50 transition-all active:scale-[0.98] group"
              onClick={() => {
                if (item.label === 'AI 免责声明') {
                  alert("【止鸣 AI 免责声明】\n1. AI 生成内容由模型推算得出，非正式执业律师意见。\n2. 法律条文具有时效性，请核实最新规定。\n3. “止鸣”不对基于 AI 报告所做的法律决策负连带责任。");
                }
              }}
            >
              <div className="flex items-center">
                <span className={`material-icons ${item.color} mr-4`}>{item.icon}</span>
                <span className="text-xs text-slate-700 font-bold">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.count !== undefined && (
                  <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                    {item.count}
                  </span>
                )}
                <span className="material-icons text-slate-200 group-hover:text-indigo-400 transition-colors">chevron_right</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-10 text-center opacity-30 mt-auto">
        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.3em]">
          止鸣 AI · 息纷止讼 V1.5<br/>
          JUSTICE & COMPOSURE
        </p>
      </div>
    </div>
  );
};

export default MineView;
