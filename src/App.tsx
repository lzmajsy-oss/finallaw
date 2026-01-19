import * as React from 'react'; 
import HomeView from './views/HomeView';
import ContractView from './views/ContractView';
import DraftingView from './views/DraftingView';
import ToolsView from './views/ToolsView';
import MineView from './views/MineView';
import { Tab } from './types';

const App: React.FC = () => {
  // 必须使用 React. 前缀，确保混淆后的代码依然能找到函数
  const [activeTab, setActiveTab] = React.useState<Tab>(Tab.HOME);
  const [paidIds, setPaidIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem('paid_documents');
    if (saved) setPaidIds(JSON.parse(saved));
  }, []);

  const handlePayment = (id: string) => {
    const newPaid = [...paidIds, id];
    setPaidIds(newPaid);
    localStorage.setItem('paid_documents', JSON.stringify(newPaid));
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.HOME: return <HomeView />;
      case Tab.CONTRACT: return <ContractView paidIds={paidIds} onPay={handlePayment} />;
      case Tab.DRAFT: return <DraftingView paidIds={paidIds} onPay={handlePayment} />;
      case Tab.TOOLS: return <ToolsView />;
      case Tab.MINE: return <MineView paidIds={paidIds} />;
      default: return <HomeView />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-[#fdfbf9] shadow-2xl overflow-hidden relative">
      <header className="bg-white/80 backdrop-blur-md border-b border-indigo-50 p-4 pt-8 sticky top-0 z-50 flex flex-col items-center no-print">
        <div className="flex items-center gap-2">
          <span className="material-icons text-indigo-600 text-2xl">balance</span>
          <h1 className="text-xl font-bold tracking-tight text-slate-800 text-serif">止鸣 AI</h1>
        </div>
        <p className="text-[10px] font-medium tracking-widest text-indigo-400 mt-1 uppercase">极简成本 · 守护您的合法权益</p>
      </header>
      <main className="flex-grow pb-24 overflow-y-auto scroll-smooth">
        {renderContent()}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-lg border-t border-indigo-50 flex justify-around py-3 px-2 no-print z-50">
        {Object.values(Tab).map((tab) => {
          const icons: Record<string, string> = {
            [Tab.HOME]: 'home_filled', [Tab.CONTRACT]: 'task', [Tab.DRAFT]: 'edit_square', [Tab.TOOLS]: 'grid_view', [Tab.MINE]: 'account_circle'
          };
          const isActive = activeTab === tab;
          return (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex flex-col items-center flex-1 transition-all duration-300 ${isActive ? 'text-indigo-600 scale-105' : 'text-slate-400 opacity-70'}`}>
              <span className="material-icons text-2xl">{icons[tab]}</span>
              <span className="text-[10px] mt-1 font-bold">{tab}</span>
              {isActive && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1 shadow-sm"></div>}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default App;