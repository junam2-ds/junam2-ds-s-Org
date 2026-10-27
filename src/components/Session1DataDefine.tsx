import React, { useState } from 'react';
import { GANGHWA_TOTAL_DATA, EUP_MYEON_LIST } from '../data/ganghwaData';
import { Database, HelpCircle, ArrowRight, CheckCircle2, TrendingUp, Sparkles, Building2 } from 'lucide-react';

interface Session1Props {
  onNextSession: () => void;
  onAskAiTutor: (question: string) => void;
  selectedQuestions: string[];
  setSelectedQuestions: React.Dispatch<React.SetStateAction<string[]>>;
  customQuestion: string;
  setCustomQuestion: (q: string) => void;
}

export const Session1DataDefine: React.FC<Session1Props> = ({
  onNextSession,
  onAskAiTutor,
  selectedQuestions,
  setSelectedQuestions,
  customQuestion,
  setCustomQuestion,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'rateDesc' | 'rateAsc' | 'name'>('rateDesc');

  const filteredEupMyeons = EUP_MYEON_LIST.filter(
    (item) => item.name.includes(searchTerm) || item.description.includes(searchTerm)
  ).sort((a, b) => {
    if (sortBy === 'rateDesc') return b.seniorRate - a.seniorRate;
    if (sortBy === 'rateAsc') return a.seniorRate - b.seniorRate;
    return a.name.localeCompare(b.name);
  });

  const defaultQuestionCards = [
    {
      id: 'q1',
      title: '확률변수 X와 이항분포 모델링 질문',
      content: '강화군 행사 참석자 n명 중 65세 이상 어르신 참석자 수 X는 왜 확률변수이며, 어떤 조건 때문에 이항분포 B(n, p)로 모델링할 수 있는가?',
      tag: '개념 모델링',
    },
    {
      id: 'q2',
      title: '표본 크기(n)와 정규분포 근사 질문',
      content: '행사 규모가 n=30, 100, 400으로 커짐에 따라 평균 참석자 수와 표준편차(불확실성)는 어떻게 변하며, 언제 정규분포에 근사시킬 수 있는가?',
      tag: '정규분포 근사',
    },
    {
      id: 'q3',
      title: '강화군청 경로당 예산 안전 마진 질문',
      content: '1인당 2만 원 지원 시, 단순 평균 인원만큼만 예산을 편성하면 왜 50% 확률로 예산이 모자라는가? 예산 부족 확률을 5% 이하로 통제하려면 어떻게 해야 하는가?',
      tag: '정책 의사결정',
    },
  ];

  const toggleQuestion = (qText: string) => {
    if (selectedQuestions.includes(qText)) {
      setSelectedQuestions(selectedQuestions.filter((q) => q !== qText));
    } else {
      setSelectedQuestions([...selectedQuestions, qText]);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1차시 Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/50 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 mb-2">
              <Database className="w-3.5 h-3.5" />
              1차시 탐구 활동: 공공데이터와 가설 설정
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              KOSIS 인구자료 분석 및 수학적 탐구 질문 정의
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              통계청 KOSIS 행정안전부 주민등록인구 자료에서 강화군의 65세 이상 비율(p)을 도출하고,
              이를 바탕으로 모둠이 해결할 수학적 하위 질문을 선별합니다.
            </p>
          </div>
          <button
            onClick={onNextSession}
            className="self-start md:self-center flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
          >
            <span>2~3차시 (이항분포 모델링)로 이동</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Population Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-400">강화군 총인구 (N)</div>
          <div className="text-2xl font-bold text-white mt-1">
            {GANGHWA_TOTAL_DATA.totalPop.toLocaleString()}
            <span className="text-sm font-normal text-slate-400 ml-1">명</span>
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <Building2 className="w-3 h-3 text-indigo-400" />
            1읍 12개면 주민등록 기준
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-400">65세 이상 고령인구</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            {GANGHWA_TOTAL_DATA.seniorPop.toLocaleString()}
            <span className="text-sm font-normal text-slate-400 ml-1">명</span>
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            경로당 프로그램 지원 대상
          </div>
        </div>

        <div className="bg-slate-900 border border-indigo-800/60 rounded-xl p-4 shadow-sm bg-gradient-to-br from-indigo-950/40 to-slate-900">
          <div className="text-xs font-medium text-indigo-300">강화군 고령화율 (모비율 p)</div>
          <div className="text-2xl font-bold text-indigo-400 mt-1">
            {GANGHWA_TOTAL_DATA.seniorRate}%
            <span className="text-xs font-semibold px-2 py-0.5 ml-2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
              초고령사회
            </span>
          </div>
          <div className="text-xs text-indigo-200/80 mt-1">
            p = { (GANGHWA_TOTAL_DATA.seniorRate / 100).toFixed(3) }, q = {(1 - GANGHWA_TOTAL_DATA.seniorRate / 100).toFixed(3)}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-400">전국 / 인천 평균 대비</div>
          <div className="text-sm text-slate-300 mt-2 space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span>전국 평균</span>
              <span className="font-semibold text-slate-200">{GANGHWA_TOTAL_DATA.nationalSeniorRate}%</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span>인천광역시</span>
              <span className="font-semibold text-slate-200">{GANGHWA_TOTAL_DATA.incheonSeniorRate}%</span>
            </div>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1.5 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            전국 대비 약 1.9배 초고령화 심화
          </div>
        </div>
      </div>

      {/* Comparison & Eup-Myeon Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Bar comparison and demographic context */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              초고령사회 기준과 강화군의 위상
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              UN 기준에 따르면 65세 이상 인구가 7% 이상이면 고령화사회, 14% 이상이면 고령사회,
              <strong className="text-rose-400"> 20% 이상이면 초고령사회</strong>로 분류됩니다.
              강화군은 <strong>36.7%</strong>에 달하여 경로당 복지 예산과 어르신 돌봄 프로그램의
              통계적 예측이 지자체 행정의 핵심 과제입니다.
            </p>

            {/* Visual Bar Comparison */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span className="font-medium text-white">강화군 전체 (p=0.367)</span>
                  <span className="font-bold text-indigo-400">36.7%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-indigo-400 h-3 rounded-full" style={{ width: '36.7%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>UN 초고령사회 기준선</span>
                  <span className="text-rose-400 font-semibold">20.0%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-rose-500 h-2 rounded-full" style={{ width: '20.0%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>전국 평균</span>
                  <span>19.2%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-slate-600 h-2 rounded-full" style={{ width: '19.2%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>인천광역시 평균</span>
                  <span>16.8%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-slate-600 h-2 rounded-full" style={{ width: '16.8%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            📊 <strong>데이터 출처:</strong> {GANGHWA_TOTAL_DATA.dataSource}
          </div>
        </div>

        {/* Right: 13 Eup-Myeons Table & Interactive ranking */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">강화군 13개 읍·면별 고령화율 비교</h3>
              <p className="text-xs text-slate-400">읍·면별로 인구 구조와 고령화율의 편차가 큽니다.</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="읍·면 이름 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="rateDesc">고령화율 높은 순</option>
                <option value="rateAsc">고령화율 낮은 순</option>
                <option value="name">가나다순</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto max-h-72 overflow-y-auto border border-slate-800 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-300 uppercase sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">읍·면명</th>
                  <th className="py-2.5 px-3">총인구</th>
                  <th className="py-2.5 px-3">65세 이상</th>
                  <th className="py-2.5 px-3">고령화율 (p)</th>
                  <th className="py-2.5 px-3">지역 특징</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredEupMyeons.map((item) => (
                  <tr key={item.name} className="hover:bg-slate-800/40 transition">
                    <td className="py-2 px-3 font-medium text-white flex items-center gap-1.5">
                      <span>{item.name}</span>
                      {item.seniorRate >= 45 && (
                        <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded font-semibold">
                          초위험
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3">{item.totalPop.toLocaleString()}명</td>
                    <td className="py-2 px-3 text-amber-300">{item.seniorPop.toLocaleString()}명</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${
                              item.seniorRate >= 45
                                ? 'bg-rose-500'
                                : item.seniorRate >= 35
                                ? 'bg-amber-500'
                                : 'bg-indigo-500'
                            }`}
                            style={{ width: `${item.seniorRate}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold text-white">{item.seniorRate}%</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-slate-400 text-[11px]">{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Inquiry Question Selection Workspace */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              모둠 수학적 탐구 질문 선정 (가설 수립)
            </h3>
            <p className="text-xs text-slate-300">
              우리 모둠이 이번 6차시 동안 해결할 핵심 수학적 질문을 선택하고, 필요시 자유 탐구 질문을 추가하세요.
            </p>
          </div>
          <div className="text-xs text-indigo-300 font-medium">
            선택된 질문: {selectedQuestions.length}개
          </div>
        </div>

        {/* Preset Question Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {defaultQuestionCards.map((card) => {
            const isSelected = selectedQuestions.includes(card.content);
            return (
              <div
                key={card.id}
                onClick={() => toggleQuestion(card.content)}
                className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/10'
                    : 'bg-slate-850 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {card.tag}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                        isSelected ? 'bg-indigo-600 text-white' : 'border border-slate-600 text-transparent'
                      }`}
                    >
                      ✓
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1.5">{card.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{card.content}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800 flex justify-end">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAskAiTutor(`[1차시 질문 탐구] "${card.content}"에 대해 이항분포 관점에서 어떻게 접근하면 좋을지 힌트를 주세요.`);
                    }}
                    className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    AI 튜터 힌트 받기
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Question Input */}
        <div className="mt-4 pt-4 border-t border-slate-800">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            ✏️ 모둠 자체 정의 탐구 질문 (선택 작성):
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder="예: 우리 모둠은 교동면(고령화율 48.7%)의 특화 경로당 예산을 n=50 행사 기준으로 시뮬레이션해보고 싶다."
              className="flex-1 bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
            {customQuestion.trim() && (
              <button
                type="button"
                onClick={() => {
                  if (customQuestion.trim() && !selectedQuestions.includes(customQuestion.trim())) {
                    setSelectedQuestions([...selectedQuestions, customQuestion.trim()]);
                  }
                }}
                className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium cursor-pointer"
              >
                질문 목록에 등록
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                const qToSend = customQuestion.trim() || '강화군 고령화율 36.7%를 바탕으로 이항분포 모델을 세울 때 좋은 연구 질문에는 무엇이 있을까요?';
                onAskAiTutor(`[1차시 탐구질문 자문] "${qToSend}" 질문이 확률과 통계 이항분포-정규분포 융합 프로젝트 주제로 적합한지 평가하고 가이드해 주세요.`);
              }}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              AI에게 적합성 검토 요청
            </button>
          </div>
        </div>

        {/* Summary of Selected Inquiry Questions */}
        {selectedQuestions.length > 0 && (
          <div className="mt-4 p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-lg">
            <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5 mb-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              선정된 모둠 핵심 탐구 질문 ({selectedQuestions.length}개):
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
              {selectedQuestions.map((q, idx) => (
                <li key={idx} className="leading-relaxed">
                  {q}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
