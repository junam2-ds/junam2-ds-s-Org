/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { Session1DataDefine } from './components/Session1DataDefine';
import { Session2Binomial } from './components/Session2Binomial';
import { Session3NormalVerify } from './components/Session3NormalVerify';
import { Session4VisualizationBudget } from './components/Session4VisualizationBudget';
import { AiTutorDrawer } from './components/AiTutorDrawer';
import { AiLogModal } from './components/AiLogModal';
import { RubricModal } from './components/RubricModal';
import { INITIAL_RUBRIC_DATA } from './data/ganghwaData';
import { ChatMessage, AiLogEntry, RubricCategory } from './types';
import { Sparkles, MessageCircleQuestion } from 'lucide-react';

export default function App() {
  const [currentSession, setCurrentSession] = useState<number>(1);
  const [groupName, setGroupName] = useState<string>('강화탐구1모둠');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('n100');
  const [nValue, setNValue] = useState<number>(100);
  const pValue = 0.367; // Ganghwa County 65+ senior population rate from KOSIS (36.7%)

  // UI Modals / Drawers state
  const [isAiTutorOpen, setIsAiTutorOpen] = useState<boolean>(false);
  const [isAiLogOpen, setIsAiLogOpen] = useState<boolean>(false);
  const [isRubricOpen, setIsRubricOpen] = useState<boolean>(false);

  // Session 1 state
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([
    '강화군 행사 참석자 n명 중 65세 이상 어르신 참석자 수 X는 왜 확률변수이며, 어떤 조건 때문에 이항분포 B(n, p)로 모델링할 수 있는가?',
    '1인당 2만 원 지원 시, 단순 평균 인원만큼만 예산을 편성하면 왜 50% 확률로 예산이 모자라는가? 예산 부족 확률을 5% 이하로 통제하려면 어떻게 해야 하는가?',
  ]);
  const [customQuestion, setCustomQuestion] = useState<string>('');

  // AI Chat Messages state with pedagogical welcome message
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `반갑습니다, ${groupName} 여러분! 👋
저는 고2 확률과 통계 프로젝트 **"우리 지역(강화군)의 고령화, 확률분포로 읽고 미래를 예측하라"**를 함께할 **AI 융합 수학 탐구 튜터**입니다.

강화군은 65세 이상 고령인구 비율이 약 **36.7%**에 달하는 초고령사회입니다.
이번 프로젝트에서는 군민 n명이 모이는 경로당/군민 행사에서 65세 이상 참석자 수를 통계적으로 예측하고 예산 계획을 세우게 됩니다.

💡 **저와의 약속:**
저는 계산 결과를 숫자로 바로 알려드리지 않습니다. 대신 여러분이 스스로 이항분포와 정규분포의 원리를 깨달을 수 있도록 단계별 디딤돌 질문을 드립니다.

궁금한 공식이나 계산 과정, 검증 방법에 대해 언제든 질문해 주세요!`,
      timestamp: '방금 전',
      logCandidate: {
        topic: '강화군 고령화율(36.7%) 기반 프로젝트 탐구 방향 안내',
        advice: '이항분포 B(n, p) 모델링과 정규분포 근사 조건 np≥5, nq≥5 확인',
        verification: '손계산 ↔ 시뮬레이터 ↔ AI 응답 3중 대조',
        reflection: '통계적 예측을 통한 지자체 복지 예산 최적화 필요성 인식',
      },
    },
  ]);

  // AI Exploration Log state (seeded with authentic project entry)
  const [aiLogEntries, setAiLogEntries] = useState<AiLogEntry[]>([
    {
      id: 'log-seed-1',
      session: 1,
      timestamp: '사전 탐구',
      prompt: '강화군 13개 읍·면의 고령화율 편차가 큰데, 군 전체 평균인 p=0.367을 행사 모델링의 단일 확률로 써도 괜찮을까요?',
      aiResponse: '강화군 전체 행사(군민체육대회 등)에서는 군 전체 인구 비율인 p=0.367이 합리적이나, 특정 읍·면(예: 교동면 48.7% vs 강화읍 29.8%) 국한 행사라면 해당 면의 p를 적용하는 조건부 모델링이 더 타당함을 튜터가 질문으로 상기시킴.',
      verificationMethod: 'KOSIS 연령별 주민등록인구 표에서 교동면과 강화읍 인구수를 직접 추출하여 비교 검증함.',
      studentCorrection: '행사의 주최 성격(군 전체 행사 vs 마을 단위 소모임)에 따라 p를 유연하게 설정해야 한다는 결론을 도출함.',
    },
  ]);

  // Rubric categories state
  const [rubricCategories, setRubricCategories] = useState<RubricCategory[]>(INITIAL_RUBRIC_DATA);

  // Helper to add new AI Log entry
  const handleAddAiLogEntry = (entry: Omit<AiLogEntry, 'id' | 'timestamp'>) => {
    const newEntry: AiLogEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString([], {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setAiLogEntries((prev) => [newEntry, ...prev]);
  };

  // Helper to open AI Tutor with a prepopulated query
  const handleAskAiTutor = (question: string) => {
    setIsAiTutorOpen(true);
    // User message will be automatically triggered or prefilled
    const userMsgId = Date.now().toString();
    const newUserMessage: ChatMessage = {
      id: userMsgId,
      role: 'user',
      text: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newUserMessage]);

    fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: question,
        session: currentSession,
        nValue: nValue,
        pValue: pValue,
        history: messages.map((m) => ({ role: m.role, text: m.text })),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const reply = data.reply || '답변을 불러오지 못했습니다.';
        let logCandidate: ChatMessage['logCandidate'] = undefined;
        if (reply.includes('AI 활용 기록지 요약') || reply.includes('탐구 질문')) {
          const topicMatch = reply.match(/- \*\*탐구 질문.*?\*\*:\s*(.*?)(?=\n|$)/);
          const adviceMatch = reply.match(/- \*\*AI.*?\*\*:\s*(.*?)(?=\n|$)/);
          const verifMatch = reply.match(/- \*\*검증.*?\(3중 검증\).*?\*\*:\s*(.*?)(?=\n|$)/);
          const reflectMatch = reply.match(/- \*\*성찰.*?\*\*:\s*(.*?)(?=\n|$)/);
          if (topicMatch || adviceMatch) {
            logCandidate = {
              topic: topicMatch ? topicMatch[1] : question,
              advice: adviceMatch ? adviceMatch[1] : reply.slice(0, 150),
              verification: verifMatch ? verifMatch[1] : '손계산 ↔ 시뮬레이터 ↔ AI 응답 3중 대조',
              reflection: reflectMatch ? reflectMatch[1] : '수학적 타당성과 오차 원인 성찰',
            };
          }
        }

        const newAiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: data.source,
          logCandidate,
        };
        setMessages((prev) => [...prev, newAiMessage]);
      })
      .catch((err) => {
        console.error('Error asking tutor:', err);
      });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header
        currentSession={currentSession}
        setCurrentSession={setCurrentSession}
        groupName={groupName}
        setGroupName={setGroupName}
        selectedScenarioId={selectedScenarioId}
        setSelectedScenarioId={setSelectedScenarioId}
        nValue={nValue}
        setNValue={setNValue}
        pValue={pValue}
        onOpenAiTutor={() => setIsAiTutorOpen(true)}
        onOpenAiLog={() => setIsAiLogOpen(true)}
        onOpenRubric={() => setIsRubricOpen(true)}
        logCount={aiLogEntries.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentSession === 1 && (
          <Session1DataDefine
            onNextSession={() => setCurrentSession(2)}
            onAskAiTutor={handleAskAiTutor}
            selectedQuestions={selectedQuestions}
            setSelectedQuestions={setSelectedQuestions}
            customQuestion={customQuestion}
            setCustomQuestion={setCustomQuestion}
          />
        )}

        {currentSession === 2 && (
          <Session2Binomial
            nValue={nValue}
            setNValue={setNValue}
            pValue={pValue}
            onNextSession={() => setCurrentSession(3)}
            onPrevSession={() => setCurrentSession(1)}
            onAskAiTutor={handleAskAiTutor}
          />
        )}

        {currentSession === 3 && (
          <Session3NormalVerify
            nValue={nValue}
            pValue={pValue}
            onNextSession={() => setCurrentSession(4)}
            onPrevSession={() => setCurrentSession(2)}
            onAskAiTutor={handleAskAiTutor}
            onAddAiLogEntry={handleAddAiLogEntry}
          />
        )}

        {currentSession === 4 && (
          <Session4VisualizationBudget
            nValue={nValue}
            setNValue={setNValue}
            pValue={pValue}
            onPrevSession={() => setCurrentSession(3)}
            onAskAiTutor={handleAskAiTutor}
            onAddAiLogEntry={handleAddAiLogEntry}
          />
        )}
      </main>

      {/* Floating AI Tutor Quick Trigger Button */}
      {!isAiTutorOpen && (
        <button
          onClick={() => setIsAiTutorOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-sky-600 to-indigo-600 hover:from-indigo-500 hover:to-sky-500 text-white font-semibold text-xs shadow-2xl shadow-indigo-600/50 hover:shadow-indigo-500/60 transform hover:-translate-y-1 transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
          <span>AI 수학 튜터에게 질문하기</span>
        </button>
      )}

      {/* AI Tutor Drawer */}
      <AiTutorDrawer
        isOpen={isAiTutorOpen}
        onClose={() => setIsAiTutorOpen(false)}
        currentSession={currentSession}
        nValue={nValue}
        pValue={pValue}
        messages={messages}
        setMessages={setMessages}
        onAddAiLogEntry={handleAddAiLogEntry}
      />

      {/* AI Log Modal */}
      <AiLogModal
        isOpen={isAiLogOpen}
        onClose={() => setIsAiLogOpen(false)}
        entries={aiLogEntries}
        setEntries={setAiLogEntries}
        groupName={groupName}
      />

      {/* Rubric Evaluation Modal */}
      <RubricModal
        isOpen={isRubricOpen}
        onClose={() => setIsRubricOpen(false)}
        categories={rubricCategories}
        setCategories={setRubricCategories}
        groupName={groupName}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            고등학교 2학년 확률과 통계 프로젝트 [12확통03-03] [12확통03-04] | 강화군 고령화와 확률분포
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>자료출처: 통계청 KOSIS 행정안전부 주민등록인구</span>
            <span>|</span>
            <span>생성형 AI 윤리 및 3중 검증 준수</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
