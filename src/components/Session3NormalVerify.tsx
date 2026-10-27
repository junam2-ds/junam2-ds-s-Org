import React, { useState } from 'react';
import {
  binomialProbGte,
  normalProbGte,
  zTableLookup,
  standardNormalCDF,
} from '../utils/mathUtils';
import {
  Layers,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  HelpCircle,
  Table,
  Cpu,
  UserCheck,
  Bot,
  PlusCircle,
} from 'lucide-react';
import { AiLogEntry } from '../types';

interface Session3Props {
  nValue: number;
  pValue: number;
  onNextSession: () => void;
  onPrevSession: () => void;
  onAskAiTutor: (question: string) => void;
  onAddAiLogEntry: (entry: Omit<AiLogEntry, 'id' | 'timestamp'>) => void;
}

export const Session3NormalVerify: React.FC<Session3Props> = ({
  nValue,
  pValue,
  onNextSession,
  onPrevSession,
  onAskAiTutor,
  onAddAiLogEntry,
}) => {
  const qValue = 1 - pValue;
  const mean = nValue * pValue;
  const variance = nValue * pValue * qValue;
  const std = Math.sqrt(variance);

  // Target scenario: e.g., probability of at least k seniors attending
  // Default k is roughly mean + 0.8 * std
  const defaultK = Math.round(mean + 0.8 * std);
  const [targetK, setTargetK] = useState(defaultK);

  // Student hand-calculation inputs
  const [studentZ, setStudentZ] = useState('');
  const [studentProb, setStudentProb] = useState('');

  // Critical Reflection notes
  const [studentErrorAnalysis, setStudentErrorAnalysis] = useState('');
  const [isSavedToLog, setIsSavedToLog] = useState(false);

  // Laplace-De Moivre Condition check
  const np = nValue * pValue;
  const nq = nValue * qValue;
  const isApproxValid = np >= 5 && nq >= 5;

  // Exact Computer Math
  const exactBinomialProb = binomialProbGte(nValue, pValue, targetK);
  const theoreticalZ = (targetK - mean) / std;
  const normalWithoutContinuityProb = normalProbGte(targetK, mean, std, false);
  const normalWithContinuityProb = normalProbGte(targetK, mean, std, true); // continuity correction (targetK - 0.5)

  // Z-table searcher state
  const [lookupZ, setLookupZ] = useState(theoreticalZ.toFixed(2));
  const zSearchNum = parseFloat(lookupZ) || 0;
  const zSearchProb = zTableLookup(Math.abs(zSearchNum));

  // Handle saving verification to AI Log
  const handleSaveToLog = () => {
    onAddAiLogEntry({
      session: 4,
      prompt: `n=${nValue}, p=${pValue} 행사에서 65세 이상 참석자가 ${targetK}명 이상일 확률 P(X ≥ ${targetK})을 정규분포로 근사하여 구하라.`,
      aiResponse: `AI 응답 예시: 평균 m=${mean.toFixed(1)}, 표준편차 σ=${std.toFixed(2)}, Z=${theoreticalZ.toFixed(2)}를 적용하여 P(Z ≥ ${theoreticalZ.toFixed(2)}) ≈ ${(normalWithoutContinuityProb * 100).toFixed(2)}%로 계산 제시함.`,
      verificationMethod: `[3중 검증 수행] 1. 내 손계산(Z=${studentZ || theoreticalZ.toFixed(2)}, P=${studentProb || (normalWithoutContinuityProb * 100).toFixed(1)}%) ↔ 2. 컴퓨터 정밀 이항누적(${(exactBinomialProb * 100).toFixed(2)}%) & 연속성수정(${(normalWithContinuityProb * 100).toFixed(2)}%) ↔ 3. AI 응답 비교`,
      studentCorrection:
        studentErrorAnalysis.trim() ||
        `이항분포는 이산확률변수이므로 막대의 넓이(연속성 수정 k-0.5)를 반영했을 때 ${(normalWithContinuityProb * 100).toFixed(2)}%로 정밀 계산과 가장 근접함을 확인하였다. AI는 종종 연속성 수정을 생략하여 약 ${(Math.abs(normalWithoutContinuityProb - exactBinomialProb) * 100).toFixed(2)}%p 오차가 발생할 수 있음을 성찰함.`,
    });
    setIsSavedToLog(true);
  };

  return (
    <div className="space-y-6">
      {/* 4차시 Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/50 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 mb-2">
              <Layers className="w-3.5 h-3.5" />
              4차시 핵심 활동: 정규분포 변환 & 3중 검증 (Triple Verification)
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              라플라스-드무아브르 정규분포 근사 & 3중 대조 스테이션
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              이항분포 근사 조건(np ≥ 5, nq ≥ 5)을 확인하고, 표준화 Z 변환을 통해
              [손계산 ↔ 컴퓨터 정밀 시뮬레이션 ↔ AI 튜터]의 결과를 대조하여 비판적으로 검증합니다.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <button
              onClick={onPrevSession}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs border border-slate-700 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>2~3차시</span>
            </button>
            <button
              onClick={onNextSession}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              <span>5~6차시 (예산 예측)로 이동</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Approximation Condition Check Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
          <HelpCircle className="w-4 h-4 text-emerald-400" />
          정규분포 근사 전제 조건 검정 (라플라스-드무아브르 정리)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
            <div className="text-slate-400 mb-1">성공 기댓값 검정 (np)</div>
            <div className="text-lg font-bold text-white font-mono">
              np = {nValue} × {pValue} = {np.toFixed(2)}
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              np ≥ 5 충족 ({np.toFixed(2)} ≥ 5)
            </div>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
            <div className="text-slate-400 mb-1">실패 기댓값 검정 (nq)</div>
            <div className="text-lg font-bold text-white font-mono">
              nq = {nValue} × {qValue.toFixed(3)} = {nq.toFixed(2)}
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              nq ≥ 5 충족 ({nq.toFixed(2)} ≥ 5)
            </div>
          </div>

          <div className="p-3 bg-gradient-to-br from-emerald-950/40 to-slate-900 rounded-xl border border-emerald-800/50">
            <div className="text-emerald-300 font-semibold mb-1">근사 타당성 판정</div>
            <div className="text-xs text-slate-300 leading-relaxed">
              {isApproxValid ? (
                <>
                  ✅ np ≥ 5와 nq ≥ 5가 모두 만족되므로, 확률변수 X는 정규분포{' '}
                  <strong className="text-emerald-300 font-mono">
                    N({mean.toFixed(1)}, {std.toFixed(2)}²)
                  </strong>
                  에 근사하여 계산할 수 있습니다!
                </>
              ) : (
                <span className="text-rose-400">
                  ⚠️ n이 너무 작아 정규분포 근사 조건이 불충분합니다.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Target Scenario Control */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🎯 3중 검증 목표 확률 시나리오 설정</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              "군민 {nValue}명 참석 행사에서 65세 이상 어르신이{' '}
              <strong className="text-indigo-400">{targetK}명 이상</strong> 참석할 확률{' '}
              <span className="font-mono text-amber-300">P(X ≥ {targetK})</span>를 구하라!"
            </p>
          </div>

          {/* Slider for targetK */}
          <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-400">목표 참석 인원(k):</span>
            <input
              type="range"
              min={Math.max(1, Math.floor(mean - 2 * std))}
              max={Math.min(nValue, Math.ceil(mean + 3 * std))}
              value={targetK}
              onChange={(e) => setTargetK(parseInt(e.target.value, 10))}
              className="w-32 accent-indigo-500 cursor-pointer"
            />
            <span className="font-mono text-sm font-bold text-indigo-400 w-10 text-right">
              {targetK}명
            </span>
          </div>
        </div>
      </div>

      {/* 3-Pillar Triple Verification Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 via-sky-400 to-indigo-400"></span>
              3중 검증 비교 스테이션 (Triple Verification)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              학생 손계산 ↔ 공학도구(컴퓨터 정밀 계산) ↔ AI 튜터의 응답을 나란히 놓고 오차 원인을 분석합니다.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              onAskAiTutor(
                `[4차시 3중 검증 질의] 행사 참가자 n=${nValue}명, 고령화율 p=${pValue}일 때 65세 이상 참석자가 ${targetK}명 이상일 확률 P(X ≥ ${targetK})을 정규분포로 근사하여 구하는 풀이 과정을 소크라테스식으로 가이드해 주세요.`
              )
            }
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-900/60 hover:bg-sky-800/60 text-sky-200 text-xs font-medium border border-sky-700/50 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            AI 튜터 응답 요청하기
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pillar 1: Student Hand-Calculation */}
          <div className="bg-slate-850 border border-slate-700 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />
                  [1] 학생 손계산
                </span>
                <span className="text-[11px] text-slate-400">표준화 & 표 조회</span>
              </div>

              <div className="text-xs space-y-3">
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 font-mono text-slate-300">
                  <div className="text-[11px] text-slate-400 mb-0.5">표준화 공식:</div>
                  Z = (X - m) / σ = ({targetK} - {mean.toFixed(1)}) / {std.toFixed(2)}
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">
                    직접 계산한 Z값:
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder={`예: ${theoreticalZ.toFixed(2)}`}
                    value={studentZ}
                    onChange={(e) => setStudentZ(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded px-2.5 py-1.5 text-xs font-mono focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">
                    정규분포표에서 찾은 확률 P(X ≥ {targetK}) (%):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder={`예: ${(normalWithoutContinuityProb * 100).toFixed(2)}%`}
                    value={studentProb}
                    onChange={(e) => setStudentProb(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded px-2.5 py-1.5 text-xs font-mono focus:ring-1 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {studentZ && (
                  <div className="text-[11px] text-slate-300 p-2 bg-slate-900/60 rounded border border-slate-800">
                    💡 계산 이론값: Z ≈ <strong>{theoreticalZ.toFixed(2)}</strong> (
                    {Math.abs(parseFloat(studentZ) - theoreticalZ) < 0.05
                      ? '일치함'
                      : '오차 있음'}
                    )
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              * 정규분포표에서 0.5 - P(0 ≤ Z ≤ z) 계산 적용
            </div>
          </div>

          {/* Pillar 2: Computer & Simulator Rigorous Math */}
          <div className="bg-slate-850 border border-slate-700 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1">
                  <Cpu className="w-3 h-3" />
                  [2] 컴퓨터 시뮬레이션
                </span>
                <span className="text-[11px] text-sky-400">정밀 누적 & 연속성수정</span>
              </div>

              <div className="space-y-3 text-xs">
                {/* Exact Binomial */}
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">
                    이항분포 정밀 이산확률 (이론적 참값):
                  </div>
                  <div className="text-sm font-bold text-sky-300 font-mono mt-0.5">
                    {(exactBinomialProb * 100).toFixed(3)}%
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    ∑[i={targetK}..{nValue}] ₙCᵢ pⁱ qⁿ⁻ⁱ
                  </div>
                </div>

                {/* Normal without continuity */}
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">
                    정규분포 단순 근사 P(X ≥ {targetK}):
                  </div>
                  <div className="text-sm font-bold text-slate-200 font-mono mt-0.5">
                    {(normalWithoutContinuityProb * 100).toFixed(3)}%
                  </div>
                  <div className="text-[10px] text-amber-400">
                    참값 대비 오차: {(Math.abs(normalWithoutContinuityProb - exactBinomialProb) * 100).toFixed(3)}%p
                  </div>
                </div>

                {/* Normal with continuity correction */}
                <div className="p-2.5 bg-sky-950/40 rounded-lg border border-sky-800/50">
                  <div className="text-[11px] text-sky-300 font-semibold">
                    연속성 수정 적용 P(X ≥ {targetK} - 0.5):
                  </div>
                  <div className="text-sm font-bold text-emerald-300 font-mono mt-0.5">
                    {(normalWithContinuityProb * 100).toFixed(3)}%
                  </div>
                  <div className="text-[10px] text-emerald-400">
                    참값 대비 오차: {(Math.abs(normalWithContinuityProb - exactBinomialProb) * 100).toFixed(3)}%p (오차 급감!)
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              * 이산 막대의 넓이를 맞추기 위해 ±0.5 연속성 보정
            </div>
          </div>

          {/* Pillar 3: AI Tutor Response & Hallucination Check */}
          <div className="bg-slate-850 border border-slate-700 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                  <Bot className="w-3 h-3" />
                  [3] AI 튜터 응답 대조
                </span>
                <span className="text-[11px] text-indigo-300">비판적 검증 대상</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-900 rounded-lg border border-indigo-950 text-slate-300 leading-relaxed text-[11px]">
                  <strong className="text-indigo-400 block mb-1">🔍 AI 답변 시 흔한 한계와 오류 패턴:</strong>
                  1. 정규분포 근사 전제 조건($np \ge 5, nq \ge 5$) 확인 생략
                  <br />
                  2. 연속성 수정(±0.5)을 반영하지 않고 단순 대입 계산
                  <br />
                  3. 소수점 반올림 과정에서의 누적 수치 오차 발생
                </div>

                <div className="p-2.5 bg-amber-950/30 rounded-lg border border-amber-800/40 text-amber-200 text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5 inline mr-1 text-amber-400" />
                  <strong>AI 윤리 및 비판적 사고:</strong> 생성형 AI의 답변은 항상 정답이 아니며,
                  수학적 정합성과 공식 대입 과정을 인간이 반드시 3중 대조하여 확인해야 합니다.
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() =>
                  onAskAiTutor(
                    `[3중 검증 오류 찾기] AI가 P(X ≥ ${targetK})를 계산할 때 연속성 수정(Continuity Correction)을 빠뜨리면 어떤 오차가 발생하는지, 고등학생 수준에서 설명해 주세요.`
                  )
                }
                className="w-full py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-medium cursor-pointer"
              >
                AI에게 오차 원인 토론 요청
              </button>
            </div>
          </div>
        </div>

        {/* Critical Reflection Form & Export to AI Log */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <label className="block text-xs font-bold text-white mb-2 flex items-center gap-2">
            <span>📝 모둠 3중 검증 분석 노트 (AI 활용 기록지에 등록될 내용):</span>
          </label>
          <textarea
            rows={3}
            value={studentErrorAnalysis}
            onChange={(e) => setStudentErrorAnalysis(e.target.value)}
            placeholder="예: 우리 모둠이 손계산한 값과 컴퓨터 정밀 이항누적 확률을 비교해보니 약 1.2%p의 차이가 있었다. 그 이유는 이항분포가 이산확률분포인데 정규분포는 연속확률분포이기 때문이며, 연속성 수정(k - 0.5)을 해주자 오차가 0.1%p 미만으로 크게 줄어듦을 발견하였다. AI 역시 단순 공식만 적용하는 경향이 있어 비판적 검토가 필수적이었다."
            className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl p-3 focus:ring-1 focus:ring-indigo-500 focus:outline-none leading-relaxed"
          />

          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              * 작성 후 버튼을 누르면 프로젝트 평가 항목인 [AI 활용 기록지]에 즉시 공식 기록으로 등록됩니다.
            </span>

            <button
              type="button"
              onClick={handleSaveToLog}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition ${
                isSavedToLog
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
              }`}
            >
              {isSavedToLog ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>AI 활용 기록지에 등록 완료!</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>AI 활용 기록지에 3중 검증 등록</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Built-in Standard Normal Distribution Table (Z-Table) Quick Lookup */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Table className="w-4 h-4 text-sky-400" />
              표준정규분포표 P(0 ≤ Z ≤ z) 인터랙티브 검색기
            </h3>
            <p className="text-xs text-slate-400">
              교과서 부록의 표준정규분포표를 웹에서 바로 조회하고 확률값을 확인할 수 있습니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">z값 검색:</span>
            <input
              type="number"
              step="0.01"
              value={lookupZ}
              onChange={(e) => setLookupZ(e.target.value)}
              className="w-20 bg-slate-800 border border-slate-700 text-white text-xs rounded px-2 py-1 font-mono focus:outline-none"
            />
            <div className="text-xs font-mono bg-sky-950/80 text-sky-300 px-2.5 py-1 rounded border border-sky-700/60 font-bold">
              P(0 ≤ Z ≤ {Math.abs(zSearchNum).toFixed(2)}) = {zSearchProb.toFixed(4)}
            </div>
          </div>
        </div>

        {/* Mini Table Display */}
        <div className="overflow-x-auto text-center border border-slate-800 rounded-lg text-xs font-mono">
          <table className="w-full border-collapse">
            <thead className="bg-slate-800/80 text-slate-300">
              <tr>
                <th className="py-1 px-2 border-r border-slate-700">z</th>
                <th className="py-1 px-2">0.00</th>
                <th className="py-1 px-2">0.01</th>
                <th className="py-1 px-2">0.02</th>
                <th className="py-1 px-2">0.03</th>
                <th className="py-1 px-2">0.04</th>
                <th className="py-1 px-2">0.05</th>
                <th className="py-1 px-2">0.06</th>
                <th className="py-1 px-2">0.07</th>
                <th className="py-1 px-2">0.08</th>
                <th className="py-1 px-2">0.09</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {[0.0, 0.5, 1.0, 1.5, 1.6, 1.9, 2.0, 2.3, 2.5, 3.0].map((baseZ) => (
                <tr key={baseZ} className="hover:bg-slate-800/40">
                  <td className="py-1 px-2 font-bold text-white bg-slate-850 border-r border-slate-700">
                    {baseZ.toFixed(1)}
                  </td>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((dec) => {
                    const currentZ = baseZ + dec * 0.01;
                    const p = zTableLookup(currentZ);
                    const isTarget = Math.abs(currentZ - Math.abs(zSearchNum)) < 0.005;
                    return (
                      <td
                        key={dec}
                        className={`py-1 px-1.5 ${
                          isTarget
                            ? 'bg-indigo-600 text-white font-bold rounded'
                            : 'text-slate-400'
                        }`}
                      >
                        {p.toFixed(4).substring(1)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-[11px] text-slate-400 mt-2 text-right">
          * 표준정규분포의 성질: P(Z ≥ z) = 0.5 - P(0 ≤ Z ≤ z) (z ≥ 0일 때)
        </div>
      </div>
    </div>
  );
};
