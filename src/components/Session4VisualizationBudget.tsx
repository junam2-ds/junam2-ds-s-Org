import React, { useState, useMemo } from 'react';
import { binomialPMF, normalPDF } from '../utils/mathUtils';
import {
  TrendingUp,
  ArrowLeft,
  DollarSign,
  Sparkles,
  HelpCircle,
  FileCheck2,
  CheckCircle2,
} from 'lucide-react';
import { AiLogEntry } from '../types';

interface Session4Props {
  nValue: number;
  setNValue: (n: number) => void;
  pValue: number;
  onPrevSession: () => void;
  onAskAiTutor: (question: string) => void;
  onAddAiLogEntry: (entry: Omit<AiLogEntry, 'id' | 'timestamp'>) => void;
}

export const Session4VisualizationBudget: React.FC<Session4Props> = ({
  nValue,
  setNValue,
  pValue,
  onPrevSession,
  onAskAiTutor,
  onAddAiLogEntry,
}) => {
  const qValue = 1 - pValue;
  const mean = nValue * pValue;
  const variance = nValue * pValue * qValue;
  const std = Math.sqrt(variance);

  // Budget parameters
  const [costPerPerson, setCostPerPerson] = useState(20000); // 20,000 KRW
  const [policyNotes, setPolicyNotes] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Interactive range for visualizer
  const [hoveredK, setHoveredK] = useState<number | null>(null);

  // Distribution chart parameters
  const chartRange = useMemo(() => {
    const minK = Math.max(0, Math.floor(mean - 3.5 * std));
    const maxK = Math.min(nValue, Math.ceil(mean + 3.5 * std));
    const points: { k: number; bProb: number; nProb: number }[] = [];

    let maxProb = 0;
    for (let k = minK; k <= maxK; k++) {
      const bProb = binomialPMF(nValue, pValue, k);
      const nProb = normalPDF(k, mean, std);
      if (bProb > maxProb) maxProb = bProb;
      if (nProb > maxProb) maxProb = nProb;
      points.push({ k, bProb, nProb });
    }

    return { minK, maxK, points, maxProb };
  }, [nValue, pValue, mean, std]);

  // Budget Calculations
  // Case 1: Mean budget (50% risk of shortfall)
  const meanSeniors = Math.round(mean);
  const budgetMean = meanSeniors * costPerPerson;

  // Case 2: 95% confidence budget (Z = 1.645)
  const safe95Seniors = Math.ceil(mean + 1.645 * std);
  const budget95 = safe95Seniors * costPerPerson;

  // Case 3: 99% confidence budget (Z = 2.326)
  const safe99Seniors = Math.ceil(mean + 2.326 * std);
  const budget99 = safe99Seniors * costPerPerson;

  const handleSavePolicy = () => {
    onAddAiLogEntry({
      session: 5,
      prompt: `강화군청 경로당 행사(n=${nValue}, p=${pValue}) 1인당 단가 ${costPerPerson.toLocaleString()}원 시, 예산 부족 확률을 5% 이하로 낮추기 위한 최적 예산 규모는?`,
      aiResponse: `AI 응답 분석: 평균 인원(${mean.toFixed(1)}명) 기준 예산은 ${budgetMean.toLocaleString()}원이나 부족 확률이 50%에 달함. 상위 5% 단측 검정 Z=1.645를 적용하여 최소 ${safe95Seniors}명분(${budget95.toLocaleString()}원)을 편성해야 안정적임.`,
      verificationMethod: `이항분포 막대그래프와 정규분포 곡선의 수렴(n=400일 때 오차 최소화)을 시각적으로 확인하고, 표준정규분포 Z=1.645 임계값과 실제 누적확률을 대조 검증함.`,
      studentCorrection:
        policyNotes.trim() ||
        `단순한 과거 관행이나 평균치에 의존한 예산 편성은 50%의 위험을 내포함을 수학적으로 입증하였다. 1인당 ${(budget95 - budgetMean).toLocaleString()}원의 안전 마진을 추가하여 ${(safe95Seniors)}명분(${budget95.toLocaleString()}원)으로 예산을 건의함.`,
    });
    setIsSaved(true);
  };

  return (
    <div className="space-y-6">
      {/* 5~6차시 Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/50 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold border border-sky-500/30 mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              5~6차시 최종 활동: 시각화 해석 및 미래 예산 정책 수립
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              이항분포의 정규분포 수렴 시각화 & 강화군 경로당 예산 시뮬레이션
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              표본 크기 n(30 → 100 → 400)의 증가에 따른 확률분포 곡선의 일치성을 시각적으로 체감하고,
              강화군청 어르신 복지 프로그램 예산 부족 확률을 5% 이하로 통제하는 수학적 정책을 도출합니다.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <button
              onClick={onPrevSession}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs border border-slate-700 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>4차시 3중 검증</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Distribution Visualization Station */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>📊 이항분포 B(n, p) vs 정규분포 N(m, σ²) 겹침 시각화</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              막대: 이항분포 이산확률 P(X=k) | 곡선: 정규분포 확률밀도함수 f(x)
            </p>
          </div>

          {/* Quick toggle for n = 30, 100, 400 */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
            {[30, 100, 400].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setNValue(size)}
                className={`px-3 py-1 rounded-md text-xs font-mono font-bold cursor-pointer transition ${
                  nValue === size
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                n = {size}
              </button>
            ))}
          </div>
        </div>

        {/* Mathematical Convergence Explanation Badge */}
        <div className="mb-4 p-3 bg-indigo-950/40 rounded-xl border border-indigo-800/40 text-xs text-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <strong>💡 수학적 관찰 포인트: </strong>
            {nValue === 30 && (
              <span>
                n=30일 때 p=0.367로 인해 약간 오른쪽 꼬리가 긴 비대칭성(왜도)이 관찰됩니다. (라플라스 근사의 시작 단계)
              </span>
            )}
            {nValue === 100 && (
              <span>
                n=100일 때 좌우 대칭성이 뚜렷해지며, 막대의 높이가 정규분포 종 모양 곡선에 매우 잘 부합합니다.
              </span>
            )}
            {nValue === 400 && (
              <span>
                n=400일 때 이항분포 막대들의 윤곽선이 정규분포 곡선과 거의 완벽하게 일치합니다! (중심극한정리의 직관적 증명)
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() =>
              onAskAiTutor(
                `[5~6차시 시각화 해석] 행사 인원 n이 30에서 100, 400으로 커짐에 따라 이항분포 그래프가 정규분포 곡선에 수렴하는 이유를 '중심극한정리'와 '라플라스-드무아브르 정리' 관점에서 고등학생 수준으로 질문을 던져주세요.`
              )
            }
            className="text-[11px] text-sky-400 hover:text-sky-300 font-medium whitespace-nowrap flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3" />
            AI 튜터와 시각화 토론
          </button>
        </div>

        {/* SVG Chart */}
        <div className="w-full bg-slate-950 rounded-xl p-4 border border-slate-800">
          <div className="relative w-full h-64 sm:h-80">
            <svg
              className="w-full h-full"
              viewBox="0 0 800 320"
              preserveAspectRatio="none"
            >
              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                const y = 280 - ratio * 240;
                return (
                  <line
                    key={ratio}
                    x1="40"
                    y1={y}
                    x2="780"
                    y2={y}
                    stroke="#334155"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Mean vertical line */}
              {(() => {
                const meanX =
                  40 +
                  ((mean - chartRange.minK) /
                    (chartRange.maxK - chartRange.minK || 1)) *
                    740;
                return (
                  <g>
                    <line
                      x1={meanX}
                      y1="30"
                      x2={meanX}
                      y2="280"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      strokeDasharray="6 3"
                    />
                    <text
                      x={meanX}
                      y="25"
                      fill="#f59e0b"
                      fontSize="11"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      평균 m={mean.toFixed(1)}명
                    </text>
                  </g>
                );
              })()}

              {/* 95% Cutoff line */}
              {(() => {
                const cutX =
                  40 +
                  ((safe95Seniors - chartRange.minK) /
                    (chartRange.maxK - chartRange.minK || 1)) *
                    740;
                return (
                  <g>
                    <line
                      x1={cutX}
                      y1="40"
                      x2={cutX}
                      y2="280"
                      stroke="#10b981"
                      strokeWidth="2"
                    />
                    <text
                      x={cutX}
                      y="50"
                      fill="#10b981"
                      fontSize="10"
                      textAnchor="start"
                      fontWeight="bold"
                    >
                      상위 5% 기준 ({safe95Seniors}명)
                    </text>
                  </g>
                );
              })()}

              {/* Binomial Bars */}
              {chartRange.points.map((pt, idx) => {
                const totalBars = chartRange.points.length;
                const barWidth = Math.max(3, (740 / totalBars) * 0.75);
                const x =
                  40 +
                  ((pt.k - chartRange.minK) /
                    (chartRange.maxK - chartRange.minK || 1)) *
                    740 -
                  barWidth / 2;
                const barHeight =
                  chartRange.maxProb > 0
                    ? (pt.bProb / chartRange.maxProb) * 230
                    : 0;
                const y = 280 - barHeight;

                const isHovered = hoveredK === pt.k;
                const isOver95 = pt.k >= safe95Seniors;

                return (
                  <rect
                    key={pt.k}
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill={
                      isHovered
                        ? '#38bdf8'
                        : isOver95
                        ? '#f43f5e'
                        : '#6366f1'
                    }
                    opacity={isHovered ? 1 : 0.75}
                    rx="1.5"
                    className="cursor-pointer transition-colors"
                    onMouseEnter={() => setHoveredK(pt.k)}
                    onMouseLeave={() => setHoveredK(null)}
                  />
                );
              })}

              {/* Normal Density Curve (Smooth Polyline) */}
              {(() => {
                const polylinePoints = chartRange.points
                  .map((pt) => {
                    const x =
                      40 +
                      ((pt.k - chartRange.minK) /
                        (chartRange.maxK - chartRange.minK || 1)) *
                        740;
                    const y =
                      280 - (pt.nProb / chartRange.maxProb) * 230;
                    return `${x},${y}`;
                  })
                  .join(' ');
                return (
                  <polyline
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    points={polylinePoints}
                  />
                );
              })()}

              {/* X Axis Baseline */}
              <line
                x1="40"
                y1="280"
                x2="780"
                y2="280"
                stroke="#64748b"
                strokeWidth="1.5"
              />

              {/* X Axis Labels */}
              {[
                chartRange.minK,
                Math.round((chartRange.minK + mean) / 2),
                Math.round(mean),
                Math.round((chartRange.maxK + mean) / 2),
                chartRange.maxK,
              ].map((kVal, idx) => {
                const x =
                  40 +
                  ((kVal - chartRange.minK) /
                    (chartRange.maxK - chartRange.minK || 1)) *
                    740;
                return (
                  <text
                    key={idx}
                    x={x}
                    y="300"
                    fill="#94a3b8"
                    fontSize="11"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {kVal}명
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Hover Info & Legend */}
          <div className="mt-3 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-300 gap-2 border-t border-slate-800/80 pt-2">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-indigo-500 rounded"></span>
                이항확률 P(X=k)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-0.5 bg-sky-400"></span>
                정규분포 확률밀도곡선
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-rose-500 rounded"></span>
                상위 5% 초과 위험 구간 (예산 부족 위험)
              </span>
            </div>

            <div className="font-mono text-slate-300">
              {hoveredK !== null ? (
                <span>
                  참석자 {hoveredK}명: P(X = {hoveredK}) ={' '}
                  <strong className="text-sky-300">
                    {(binomialPMF(nValue, pValue, hoveredK) * 100).toFixed(3)}%
                  </strong>
                </span>
              ) : (
                <span className="text-slate-500">막대에 마우스를 올리면 개별 확률이 표시됩니다.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Real-World Ganghwa County Budget Simulation Station */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-800 pb-3">
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-1">
              <DollarSign className="w-3.5 h-3.5" />
              실생활 문제 해결: 강화군청 경로당 예산 수립
            </div>
            <h3 className="text-base font-bold text-white">
              행사 참가자 n={nValue}명 대상 어르신 복지 프로그램 예산 정책 시뮬레이터
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              1인당 다과 및 기념품 지원 단가를 설정하고, 예산 부족 위험 확률에 따른 3가지 정책안을 비교 분석합니다.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-300">1인당 단가:</span>
            <input
              type="number"
              step="5000"
              value={costPerPerson}
              onChange={(e) => setCostPerPerson(Math.max(5000, parseInt(e.target.value, 10) || 0))}
              className="w-24 bg-slate-900 border border-slate-700 text-white rounded px-2 py-1 text-xs font-mono font-bold text-right focus:outline-none"
            />
            <span className="text-xs text-slate-400">원</span>
          </div>
        </div>

        {/* 3 Budget Proposals Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Policy A: Simple Mean Budget */}
          <div className="bg-slate-850 border border-slate-700 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                  안안 A: 단순 평균안
                </span>
                <span className="text-xs text-rose-400 font-bold">부족 위험 50%</span>
              </div>
              <h4 className="text-sm font-bold text-white">기댓값 m 기준 편성</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                통계적 변동을 무시하고 평균 인원({meanSeniors}명)만 편성함.
              </p>

              <div className="my-4 p-3 bg-slate-900 rounded-lg border border-slate-800 text-center">
                <div className="text-xs text-slate-400">총 편성 예산</div>
                <div className="text-xl font-bold text-white font-mono mt-1">
                  {budgetMean.toLocaleString()}
                  <span className="text-xs font-normal text-slate-400 ml-1">원</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  ({meanSeniors}명 × {costPerPerson.toLocaleString()}원)
                </div>
              </div>

              <div className="p-2.5 bg-rose-950/40 rounded-lg border border-rose-800/40 text-[11px] text-rose-200 leading-relaxed">
                ⚠️ <strong>행정적 결함:</strong> 정규분포의 대칭성에 의해, 실제 참석자가 평균보다 많을 확률이 <strong>50%</strong>에 달해 2번 중 1번은 현장에서 예산이 바닥납니다.
              </div>
            </div>
          </div>

          {/* Policy B: 95% Safe Budget (Recommended) */}
          <div className="bg-gradient-to-b from-indigo-950/60 to-slate-900 border-2 border-indigo-500 rounded-xl p-4 flex flex-col justify-between shadow-lg shadow-indigo-500/10 relative">
            <div className="absolute -top-3 right-4 px-2 py-0.5 bg-indigo-500 text-white text-[10px] font-bold rounded-full shadow">
              강력 추천 (표준 행정)
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  안안 B: 95% 안전 마진안
                </span>
                <span className="text-xs text-emerald-400 font-bold">부족 위험 5% 이하</span>
              </div>
              <h4 className="text-sm font-bold text-white">Z = 1.645 신뢰 기준</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                m + 1.645σ를 반영하여 {safe95Seniors}명분 예산을 편성함.
              </p>

              <div className="my-4 p-3 bg-slate-900 rounded-lg border border-indigo-800/60 text-center">
                <div className="text-xs text-indigo-300 font-semibold">총 편성 예산</div>
                <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
                  {budget95.toLocaleString()}
                  <span className="text-xs font-normal text-slate-400 ml-1">원</span>
                </div>
                <div className="text-[11px] text-indigo-200/80 mt-0.5">
                  ({safe95Seniors}명 × {costPerPerson.toLocaleString()}원)
                </div>
              </div>

              <div className="p-2.5 bg-emerald-950/40 rounded-lg border border-emerald-800/40 text-[11px] text-emerald-200 leading-relaxed">
                ✅ <strong>최적의 균형:</strong> 단순 평균 대비{' '}
                <strong className="text-white">
                  +{(budget95 - budgetMean).toLocaleString()}원
                </strong>
                의 안전 마진만 추가하면, 예산 결손 위험을 <strong>5% 이하</strong>로 대폭 통제할 수 있습니다.
              </div>
            </div>
          </div>

          {/* Policy C: 99% Ultra-Safe Budget */}
          <div className="bg-slate-850 border border-slate-700 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  안안 C: 99% 초안전안
                </span>
                <span className="text-xs text-sky-400 font-bold">부족 위험 1% 이하</span>
              </div>
              <h4 className="text-sm font-bold text-white">Z = 2.326 신뢰 기준</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                m + 2.326σ를 반영하여 {safe99Seniors}명분 예산을 편성함.
              </p>

              <div className="my-4 p-3 bg-slate-900 rounded-lg border border-slate-800 text-center">
                <div className="text-xs text-slate-400">총 편성 예산</div>
                <div className="text-xl font-bold text-sky-300 font-mono mt-1">
                  {budget99.toLocaleString()}
                  <span className="text-xs font-normal text-slate-400 ml-1">원</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  ({safe99Seniors}명 × {costPerPerson.toLocaleString()}원)
                </div>
              </div>

              <div className="p-2.5 bg-sky-950/40 rounded-lg border border-sky-800/40 text-[11px] text-sky-200 leading-relaxed">
                💡 <strong>고려사항:</strong> 예산 결손 위험은 사실상 0%에 수렴하나, 참석자가 적을 경우 과다한 불용(미집행 잔여) 예산이 발생할 행정적 비효율이 있습니다.
              </div>
            </div>
          </div>
        </div>

        {/* Policy Proposal Note & AI Log Registration */}
        <div className="pt-4 border-t border-slate-800">
          <label className="block text-xs font-bold text-white mb-2 flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
            <span>모둠 최종 강화군청 정책 제언서 작성 (AI 활용 기록지 및 성찰):</span>
          </label>
          <textarea
            rows={3}
            value={policyNotes}
            onChange={(e) => setPolicyNotes(e.target.value)}
            placeholder={`예: 우리 모둠은 행사 참가자 n=${nValue}명일 때 단순 평균인 ${meanSeniors}명분(${budgetMean.toLocaleString()}원)만 준비하면 예산 부족 위험이 50%나 된다는 점을 통계적으로 입증하였다. 따라서 표준편차 σ=${std.toFixed(2)}를 고려하여 상위 5% 위험 기준인 ${safe95Seniors}명분(${budget95.toLocaleString()}원)을 최종 제안하며, 이는 추가비용 대비 복지 만족도를 극대화하는 최적안임을 제언한다.`}
            className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl p-3 focus:ring-1 focus:ring-indigo-500 focus:outline-none leading-relaxed"
          />

          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              * 최종 정책 제언을 AI 활용 기록지에 등록하여 프로젝트 종합 포트폴리오를 완성하세요.
            </span>

            <button
              type="button"
              onClick={handleSavePolicy}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition ${
                isSaved
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
              }`}
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>기록지에 정책 제언 등록 완료!</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>AI 활용 기록지에 등록</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
