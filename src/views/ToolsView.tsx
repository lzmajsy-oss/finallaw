
import React, { useState } from 'react';
import { TOOLS_LINKS } from '../constants';

type ToolId = '诉讼费计算' | '律师费参考' | '诚信查询' | '律所检索' | '网上立案' | '法律法规' | null;
type CaseType = '财产案件' | '离婚案件' | '人格权案件' | '其他非财产案件';

const ToolsView: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolId>(null);
  const [amount, setAmount] = useState<string>('');
  const [caseType, setCaseType] = useState<CaseType>('财产案件');
  const [calcResults, setCalcResults] = useState<{ litigation: string; preservation: string; execution: string } | null>(null);

  const calculateAllFees = () => {
    const val = parseFloat(amount);
    
    // 逻辑：如果不是财产案件，通常是固定收费
    if (caseType !== '财产案件') {
      const lit = caseType === '离婚案件' ? '50-300元' : (caseType === '人格权案件' ? '100-500元' : '80-100元');
      setCalcResults({
        litigation: lit,
        preservation: '按保全额计算',
        execution: '50-500元'
      });
      return;
    }

    if (isNaN(val) || val <= 0) return;

    // 1. 诉讼费 (财产案件阶梯计算)
    let litigation = 0;
    if (val <= 10000) litigation = 50;
    else if (val <= 100000) litigation = val * 0.025 - 200;
    else if (val <= 200000) litigation = val * 0.02 + 300;
    else if (val <= 500000) litigation = val * 0.015 + 1300;
    else if (val <= 1000000) litigation = val * 0.01 + 3800;
    else litigation = val * 0.005 + 8800;

    // 2. 保全费 (阶梯，最高5000)
    let preservation = 0;
    if (val <= 1000) preservation = 30;
    else if (val <= 100000) preservation = (val - 1000) * 0.01 + 30;
    else preservation = (val - 100000) * 0.005 + 1020;
    preservation = Math.min(5000, preservation);

    // 3. 执行费 (阶梯)
    let execution = 0;
    if (val <= 10000) execution = 50;
    else if (val <= 500000) execution = (val - 10000) * 0.015 + 50;
    else if (val <= 5000000) execution = (val - 500000) * 0.01 + 7400;
    else execution = (val - 5000000) * 0.005 + 52400;

    setCalcResults({
      litigation: `¥${litigation.toFixed(2)}`,
      preservation: `¥${preservation.toFixed(2)}`,
      execution: `¥${execution.toFixed(2)}`
    });
  };

  const renderToolDetail = () => {
    switch (activeTool) {
      case '诉讼费计算':
        return (
          <div className="animate-fadeIn space-y-6">
            <h3 className="text-lg font-bold text-slate-800">全流程费用测算</h3>
            
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">选择案件类型</label>
              <div className="grid grid-cols-2 gap-2">
                {(['财产案件', '离婚案件', '人格权案件', '其他非财产案件'] as CaseType[]).map(t => (
                  <button 
                    key={t}
                    onClick={() => {setCaseType(t); setCalcResults(null);}}
                    className={`py-2 px-3 rounded-xl text-[10px] font-bold transition-all border ${caseType === t ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-400 border-slate-100'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {caseType === '财产案件' && (
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase">涉及标的金额 (元)</label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="请输入争议总额..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-slate-700 font-mono"
                />
              </div>
            )}

            <button 
              onClick={calculateAllFees}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 active:scale-95 transition-all"
            >
              开始计算
            </button>

            {calcResults && (
              <div className="grid grid-cols-1 gap-3 animate-fadeIn">
                <div className="p-4 bg-white border border-indigo-50 rounded-2xl flex justify-between items-center shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    <span className="text-xs font-bold text-slate-600">预估诉讼费</span>
                  </div>
                  <span className="text-sm font-bold text-indigo-600">{calcResults.litigation}</span>
                </div>
                <div className="p-4 bg-white border border-emerald-50 rounded-2xl flex justify-between items-center shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-bold text-slate-600">预估保全费</span>
                  </div>
                  <span className="text-sm font-bold text-emerald-600">{calcResults.preservation}</span>
                </div>
                <div className="p-4 bg-white border border-orange-50 rounded-2xl flex justify-between items-center shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    <span className="text-xs font-bold text-slate-600">预估执行费</span>
                  </div>
                  <span className="text-sm font-bold text-orange-600">{calcResults.execution}</span>
                </div>
                <p className="text-[9px] text-slate-400 text-center italic mt-2">注：执行费根据法院要求，通常在申请执行阶段产生</p>
              </div>
            )}
          </div>
        );
      case '律师费参考':
        return (
          <div className="animate-fadeIn space-y-4">
             <h3 className="text-lg font-bold text-slate-800">{activeTool}</h3>
             <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="请输入标的额..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
                />
              <button 
                onClick={() => {
                  const val = parseFloat(amount);
                  const min = Math.max(3000, val * 0.03);
                  const max = Math.max(8000, val * 0.08);
                  alert(`行业参考区间: ¥${min.toFixed(0)} - ¥${max.toFixed(0)}`);
                }}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold"
              >查询参考价</button>
          </div>
        );
      default:
        return (
          <div className="text-center py-8">
            <span className="material-icons text-5xl text-indigo-200 mb-4">public</span>
            <p className="mb-6 text-sm text-slate-500">正在为您打开官方服务入口</p>
            <a href={(TOOLS_LINKS.find(l => l.name === activeTool) as any)?.source || '#'} target="_blank" className="inline-block px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold">前往官网查看</a>
          </div>
        );
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 text-serif">法律计算中心</h2>
        <p className="text-xs text-slate-400 mt-1">权威公式计算，让维权成本公开透明</p>
      </div>

      {activeTool ? (
        <div className="soft-card p-6 rounded-3xl relative border-indigo-100">
          <button onClick={() => { setActiveTool(null); setCalcResults(null); }} className="absolute top-4 right-4 text-slate-300"><span className="material-icons">cancel</span></button>
          {renderToolDetail()}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {TOOLS_LINKS.map((tool, idx) => (
            <div 
              key={idx} 
              className="soft-card rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-all cursor-pointer group active:scale-95 border-transparent hover:border-indigo-100"
              onClick={() => setActiveTool(tool.name as ToolId)}
            >
              <div className="bg-indigo-50 text-indigo-600 p-3 rounded-2xl mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <span className="material-icons">{tool.icon}</span>
              </div>
              <h4 className="text-[11px] font-bold text-slate-700">{tool.name}</h4>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ToolsView;
