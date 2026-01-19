
import React from 'react';

export const COLORS = {
  PRIMARY: '#4f46e5', // 睿智蓝
  SECONDARY: '#fdfbf9', // 暖白
  ACCENT: '#f59e0b', // 琥珀金
};

export const HOME_CATEGORIES = [
  { id: 'labor', title: '劳动维权', icon: 'handshake', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  { id: 'traffic', title: '交通理赔', icon: 'minor_crash', color: 'bg-orange-50 text-orange-600 border-orange-100' },
  { id: 'refund', title: '消费争议', icon: 'shopping_bag', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  { id: 'loan', title: '债务纠纷', icon: 'account_balance', color: 'bg-blue-50 text-blue-600 border-blue-100' }
];

export const DRAFT_TEMPLATES = [
  { id: 'complaint', title: '起诉状起草', desc: '用于向法院提起诉讼的基础文书' },
  { id: 'defense', title: '答辩状起草', desc: '针对被起诉情况的法律回应' },
  { id: 'evidence', title: '证据目录', desc: '系统梳理案件证据链条' },
  { id: 'power', title: '授权委托', desc: '确立代理关系的法律文件' }
];

export const TOOLS_LINKS = [
  { name: '诉讼费计算', icon: 'calculate', source: '法院标准' },
  { name: '律师费参考', icon: 'request_quote', source: '律协指引' },
  { name: '诚信查询', icon: 'verified', source: '司法部' },
  { name: '律所检索', icon: 'apartment', source: '官方名录' },
  { name: '网上立案', icon: 'cloud_upload', source: '人民法院' },
  { name: '法律法规', icon: 'menu_book', source: '国家法库' }
];
