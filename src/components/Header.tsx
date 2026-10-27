import React from 'react';
import { Sparkles, FileText, Award, MapPin, Users, Settings } from 'lucide-react';
import { PROJECT_SESSIONS, PRESET_SCENARIOS } from '../data/ganghwaData';

interface HeaderProps {
  currentSession: number;
  setCurrentSession: (session: number) => void;
  groupName: string;
  setGroupName: (name: string) => void;
  selectedScenarioId: string;
  setSelectedScenarioId: (id: string) => void;
  nValue: number;
  setNValue: (n: number) => void;
  pValue: number;
  onOpenAiTutor: () => void;
  onOpenAiLog: () => void;
  onOpenRubric: () => void;
  logCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentSession,
  setCurrentSession,
  groupName,
  setGroupName,
  selectedScenarioId,
  setSelectedScenarioId,
  setNValue,
  pValue,
  onOpenAiTutor,
  onOpenAiLog,
  onOpenRubric,
  logCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-xl backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Top Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 font-bold text-lg text-white">
              강화
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  고2 확률과 통계 6차시 융합 프로젝트
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  초고령화율 p = {(pValue * 100).toFixed(1)}% (KOSIS 통계청)
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                우리 지역(강화군)의 고령화, 확률분포로 읽고 미래를 예측하라
              </h1>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onOpenAiTutor}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white text-xs font-medium shadow-md shadow-indigo-600/30 transition transform hover:-translate-y-0.5 cursor-pointer"
              title="소크라테스식 발문 AI 융합 수학 탐구 튜터"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>AI 탐구 튜터</span>
            </button>

            <button
              onClick={onOpenAiLog}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition cursor-pointer"
              title="AI 활용 기록지 (3중 검증 및 성찰)"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>AI 활용 기록지</span>
              {logCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full font-bold">
                  {logCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenRubric}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition cursor-pointer"
              title="4대 평가 루브릭 (25점 만점)"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>평가 루브릭 (25점)</span>
            </button>
          </div>
        </div>

        {/* Bottom Row: Session Navigation & Group Settings */}
        <div className="pt-2.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Session Stepper */}
          <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {PROJECT_SESSIONS.map((session) => {
              const isActive = currentSession === session.id;
              const isPast = currentSession > session.id;
              return (
                <button
                  key={session.id}
                  onClick={() => setCurrentSession(session.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400'
                      : isPast
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isActive ? 'bg-white text-indigo-700' : isPast ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {isPast ? '✓' : session.id}
                  </span>
                  <span>{session.title.split(':')[0]}</span>
                  <span className="hidden xl:inline text-slate-300 text-[11px]">
                    {session.id === 1 && '인구&질문'}
                    {session.id === 2 && '이항분포'}
                    {session.id === 3 && '3중 검증'}
                    {session.id === 4 && '시각화&예산'}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Group & Scenario Config Bar */}
          <div className="flex items-center gap-2 text-xs flex-wrap bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-slate-400">모둠:</span>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="모둠명 입력"
                className="w-24 bg-slate-800/80 border border-slate-700 text-white rounded px-2 py-0.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <span className="text-slate-700">|</span>

            <div className="flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-slate-400">시나리오 규모:</span>
              <select
                value={selectedScenarioId}
                onChange={(e) => {
                  const id = e.target.value;
                  setSelectedScenarioId(id);
                  const matched = PRESET_SCENARIOS.find((s) => s.id === id);
                  if (matched) setNValue(matched.n);
                }}
                className="bg-slate-800/80 border border-slate-700 text-white rounded px-2 py-0.5 text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
              >
                {PRESET_SCENARIOS.map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    {sc.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
