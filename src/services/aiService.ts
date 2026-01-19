// services/aiService.ts
import { LaborForm } from "../types";

/**
 * 环境判断：
 * 如果是在本地开发模式 (npm run dev)，isDev 为 true
 * 如果是部署上线后的生产环境，isDev 为 false
 */
const isDev = import.meta.env.DEV;

/**
 * 核心逻辑：
 * 本地开发：直接请求 DeepSeek 官方接口 (为了调试方便)
 * 线上环境：请求我们自己的后端接口 /api/chat (为了隐藏 API Key)
 */
const API_URL = isDev 
  ? "https://api.deepseek.com/chat/completions" 
  : "/api/chat";

// 注意：这个 Key 仅在本地开发(isDev为true)时会被用到
// 线上环境会直接使用 Vercel 后端配置的环境变量，非常安全
const DEEPSEEK_KEY = "sk-2d94ecbf385a42469fc0cca4a70ff86e";

const callDeepSeek = async (role: string, prompt: string) => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // 只有在本地直接请求官方接口时，才在请求头里加 Key
    if (isDev) {
      headers['Authorization'] = `Bearer ${DEEPSEEK_KEY}`;
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: role },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
      })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "网络请求失败");
    }

    const data = await response.json();
    
    // 兼容官方格式和我们后端 API 的格式
    return data.choices ? data.choices[0].message.content : data.content;
  } catch (error) {
    console.error("AI Service Error:", error);
    throw new Error("法律 AI 引擎响应异常，请稍后重试。");
  }
};

// --- 以下是业务 Prompt 逻辑，保持不变 ---

const CONSULT_ROLE = "你是一位资深的法律咨询专家，擅长引用《民法典》、《劳动合同法》等中国法律。";

export const getLaborAdvice = async (data: LaborForm) => {
  const prompt = `【劳动维权咨询】地区：${data.region}，合同：${data.hasContract ? '有' : '无'}，入职：${data.entryDate}，月薪：${data.monthlySalary}，诉求：${data.demands}。请计算赔偿金并给出建议。`;
  return callDeepSeek(CONSULT_ROLE, prompt);
};

export const getTrafficAdvice = async (data: any) => {
  const prompt = `【交通理赔咨询】责任：${data.responsibility}，伤情：${data.injury}，医疗费：${data.medicalCost}。请分析理赔项目。`;
  return callDeepSeek(CONSULT_ROLE, prompt);
};

export const getConsumerAdvice = async (data: any) => {
  const prompt = `【消费维权咨询】平台：${data.platform}，核心争议：${data.issue}。请给出维权话术。`;
  return callDeepSeek(CONSULT_ROLE, prompt);
};

export const getDebtAdvice = async (data: any) => {
  const prompt = `【债务追偿分析】金额：${data.amount}元，证据：${data.evidence}。请分析风险。`;
  return callDeepSeek(CONSULT_ROLE, prompt);
};

export const getQuickAdvice = async (question: string) => {
  const prompt = `用户法律提问：${question}。`;
  return callDeepSeek("你是一位名为“止鸣”的法律快问助手，回答必须精准且包含法条索引。", prompt);
};

export const analyzeContract = async (content: string) => {
  const REVIEW_ROLE = "你是一位专注于合规审查的律师。请对合同进行风险扫描，给出摘要和建议。";
  return callDeepSeek(REVIEW_ROLE, `请审查以下合同：\n\n${content}`);
};

export const draftLegalDoc = async (type: string, details: string, requirement: string) => {
  const DRAFT_ROLE = "你是一位专业的法务，擅长起草起诉状、答辩状等法律文书。";
  const prompt = `类型：${type}\n背景：${details}\n要求：${requirement}`;
  return callDeepSeek(DRAFT_ROLE, prompt);
};