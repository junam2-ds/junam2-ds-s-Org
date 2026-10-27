import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, User, PlusCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { ChatMessage, AiLogEntry } from '../types';

interface AiTutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentSession: number;
  nValue: number;
  pValue: number;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  onAddAiLogEntry: (entry: Omit<AiLogEntry, 'id' | 'timestamp'>) => void;
}

export const AiTutorDrawer: React.FC<AiTutorDrawerProps> = ({
  isOpen,
  onClose,
  currentSession,
  nValue,
  pValue,
  messages,
  setMessages,
  onAddAiLogEntry,
}) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [addedMessageIds, setAddedMessageIds] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Session-specific quick prompts
  const sessionPromptMap: Record<number, string[]> = {
    1: [
      'KOSIS 고령화율 36.7%를 바탕으로 이항분포 모델을 세울 때 어떤 하위 질문이 좋은가요?',
      '강화군 행사 참석자 중 65세 이상 어르신 수는 왜 확률변수인가요?',
      '13개 읍·면별 고령화율 편차가 큰데, 전체 p=0.367을 적용해도 타당할까요?',
    ],
    2: [
      '이항분포 B(n, p)에서 평균 m과 표준편차 σ를 손계산하는 공식을 알려주세요.',
      '분산과 표준편차를 구할 때 왜 실패확률 q=(1-p)를 반드시 곱해야 하나요?',
      '선택한 n에서 표준편차를 계산해봤는데 맞는지 힌트를 주세요.',
    ],
    3: [
      '이항분포를 정규분포로 근사시킬 수 있는 조건(np≥5, nq≥5)은 무엇인가요?',
      '표준화 공식 Z=(X-m)/σ는 어떤 의미를 갖나요?',
      '컴퓨터 정밀 계산과 손계산 사이에 왜 1% 정도의 오차가 발생하나요?',
    ],
    4: [
      'n이 30에서 100, 400으로 커지면 왜 정규분포 곡선과 완벽하게 겹쳐지나요?',
      '단순 평균으로 예산을 짜면 왜 50% 확률로 부족해지나요?',
      '예산 부족 확률을 5% 이하로 낮추려면 상위 몇 %의 Z값을 적용해야 하나요?',
    ],
  };

  const quickPrompts = sessionPromptMap[currentSession] || sessionPromptMap[2];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsgId = Date.now().toString();
    const newUserMessage: ChatMessage = {
      id: userMsgId,
      role: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          session: currentSession,
          nValue: nValue,
          pValue: pValue,
          history: messages.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      const reply = data.reply || '답변을 불러오지 못했습니다. 다시 시도해 주세요.';

      // Extract Log candidate if format matches
      let logCandidate: ChatMessage['logCandidate'] = undefined;
      if (reply.includes('AI 활용 기록지 요약') || reply.includes('탐구 질문')) {
        const topicMatch = reply.match(/- \*\*탐구 질문.*?\*\*:\s*(.*?)(?=\n|$)/);
        const adviceMatch = reply.match(/- \*\*AI.*?\*\*:\s*(.*?)(?=\n|$)/);
        const verifMatch = reply.match(/- \*\*검증.*?\(3중 검증\).*?\*\*:\s*(.*?)(?=\n|$)/);
        const reflectMatch = reply.match(/- \*\*성찰.*?\*\*:\s*(.*?)(?=\n|$)/);

        if (topicMatch || adviceMatch) {
          logCandidate = {
            topic: topicMatch ? topicMatch[1] : text,
            advice: adviceMatch ? adviceMatch[1] : reply.slice(0, 150),
            verification: verifMatch ? verifMatch[1] : '손계산 ↔ 시뮬레이터 ↔ AI 응답 3중 대조',
            reflection: reflectMatch ? reflectMatch[1] : '수학적 타당성과 오차 원인 성찰',
          };
        }
      }

      const aiMsgId = (Date.now() + 1).toString();
      const newAiMessage: ChatMessage = {
        id: aiMsgId,
        role: 'model',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source,
        logCandidate,
      };

      setMessages((prev) => [...prev, newAiMessage]);
    } catch (err) {
      console.error('Failed to send message to AI tutor:', err);
      const aiErrorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: `죄송합니다. 네트워크 일시적 오류로 튜터 응답을 수신하지 못했습니다.\n\n💡 힌트: 이항분포 B(${nValue}, ${pValue})의 평균 m = np = ${(
          nValue * pValue
        ).toFixed(1)}, 표준편차 σ = √(npq) = ${Math.sqrt(
          nValue * pValue * (1 - pValue)
        ).toFixed(2)} 공식을 다시 한번 확인해 보세요!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiErrorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCardToLog = (msg: ChatMessage) => {
    if (!msg.logCandidate) {
      onAddAiLogEntry({
        session: currentSession,
        prompt: messages.find((m, i) => i > 0 && messages[i - 1]?.role === 'user')?.text || 'AI 튜터 수학 질의',
        aiResponse: msg.text.slice(0, 300),
        verificationMethod: '손계산 및 공학도구 시뮬레이션 대조',
        studentCorrection: 'AI의 조언을 바탕으로 공식 유도 및 계산 검토 완료',
      });
    } else {
      onAddAiLogEntry({
        session: currentSession,
        prompt: msg.logCandidate.topic,
        aiResponse: msg.logCandidate.advice,
        verificationMethod: msg.logCandidate.verification,
        studentCorrection: msg.logCandidate.reflection,
      });
    }
    setAddedMessageIds((prev) => new Set(prev).add(msg.id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col transition-all duration-300">
      {/* Drawer Header */}
      <div className="p-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center text-white shadow-md">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">AI 융합 수학 탐구 튜터</h3>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.2 rounded font-semibold">
                소크라테스식 발문
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {currentSession}차시 탐구 | n={nValue}명, p={pValue} (36.7%)
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Socratic Policy Banner */}
      <div className="px-4 py-2 bg-indigo-950/40 border-b border-indigo-900/40 text-[11px] text-indigo-200 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
        <span>
          <strong>수학 튜터 원칙:</strong> 정답을 바로 주지 않고, 스스로 공식을 유도할 수 있도록 단계별 디딤돌 질문을 드립니다.
        </span>
      </div>

      {/* Chat Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const isAlreadyAdded = addedMessageIds.has(msg.id);

          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600/80 flex items-center justify-center text-white shrink-0 mt-1">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div className={`max-w-[85%] space-y-2`}>
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20'
                      : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700/80 shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>

                {/* If AI message contains Log Candidate card, render quick add button */}
                {!isUser && (
                  <div className="flex items-center justify-between text-[11px] px-1">
                    <span className="text-[10px] text-slate-500">{msg.timestamp}</span>

                    <button
                      type="button"
                      onClick={() => handleAddCardToLog(msg)}
                      className={`flex items-center gap-1 text-[11px] font-medium transition cursor-pointer ${
                        isAlreadyAdded
                          ? 'text-emerald-400'
                          : 'text-sky-400 hover:text-sky-300'
                      }`}
                    >
                      {isAlreadyAdded ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>AI 활용 기록지에 등록됨</span>
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-3 h-3" />
                          <span>AI 활용 기록지에 등록</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-1">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-2.5 items-center text-slate-400 text-xs py-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/80 flex items-center justify-center text-white animate-spin">
              <RefreshCw className="w-3.5 h-3.5" />
            </div>
            <span>AI 탐구 튜터가 생각 질문을 구성하는 중입니다...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Recommended Quick Chips */}
      <div className="p-3 bg-slate-850/80 border-t border-slate-800 space-y-1.5">
        <div className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>{currentSession}차시 추천 질문:</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap transition cursor-pointer"
            >
              {prompt.length > 28 ? prompt.slice(0, 28) + '...' : prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-slate-850 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="공식이나 계산 과정을 물어보세요..."
          className="flex-1 bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3.5 py-2.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isLoading || !inputText.trim()}
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white transition shadow-md shadow-indigo-600/30 cursor-pointer disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
