
export enum Tab {
  HOME = '首页',
  CONTRACT = '合同审查',
  DRAFT = '文书起草',
  TOOLS = '计算中心',
  MINE = '我的'
}

export interface LaborForm {
  region: string;
  hasContract: boolean;
  entryDate: string;
  leaveDate: string;
  monthlySalary: string;
  probation: string;
  salaryStatus: string;
  insurance: boolean;
  leaveStatus: string;
  demands: string;
}

export interface LegalReport {
  id: string;
  type: 'consultation' | 'contract' | 'draft';
  title: string;
  summary: string;
  content: string;
  isPaid: boolean;
  date: string;
}
