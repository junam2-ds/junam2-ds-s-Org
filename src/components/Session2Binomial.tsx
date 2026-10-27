import React, { useState } from 'react';
import { PRESET_SCENARIOS } from '../data/ganghwaData';
import { Calculator, ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, Sparkles, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Session2Props {
  nValue: number;
  setNValue: (n: number) => void;
  pValue: number;
  onNextSession: () => void;
  onPrevSession: () => void;
  onAskAiTutor: (question: string) => void;
}

export const Session2Binomial: React.FC<Session2Props> = ({
  nValue,
  setNValue,
  pValue,
  onNextSession,
  onPrevSession,
  onAskAiTutor,
}) => {
  const qValue = 1 - pValue;

  // Expected true values
  const trueMean = nValue * pValue;
  const trueVariance = nValue * pValue * qValue;
  const trueStd = Math.sqrt(trueVariance);

  // Student inputs for hand-calculation
  const [inputMean, setInputMean] = useState('');
  const [inputVariance, setInputVariance] = useState('');
  const [inputStd, setInputStd] = useState('');
  const [hasChecked, setHasChecked] = useState(false);
  const [feedback, setFeedback] = useState<{
    meanMsg?: string;
    meanStatus?: 'correct' | 'wrong';
    varianceMsg?: string;
    varianceStatus?: 'correct' | 'wrong';
    stdMsg?: string;
    stdStatus?: 'correct' | 'wrong';
  }>({});

  const handleScenarioChange = (n: number) => {
    setNValue(n);
    setInputMean('');
    setInputVariance('');
    setInputStd('');
    setHasChecked(false);
    setFeedback({});
  };

  const checkCalculations = () => {
    setHasChecked(true);
    const mNum = parseFloat(inputMean);
    const vNum = parseFloat(inputVariance);
    const sNum = parseFloat(inputStd);

    const newFeedback: typeof feedback = {};

    // Check Mean
    if (isNaN(mNum)) {
      newFeedback.meanStatus = 'wrong';
      newFeedback.meanMsg = '평균값을 숫자로 입력해 주세요. (공식: m = np)';
    } else if (Math.abs(mNum - trueMean) <= 0.2) {
      newFeedback.meanStatus = 'correct';
      newFeedback.meanMsg = `정확합니다! m = ${nValue} × ${pValue} = ${trueMean.toFixed(2)}명입니다.`;
    } else {
      newFeedback.meanStatus = 'wrong';
      newFeedback.meanMsg = `계산값을 다시 확인해 보세요. 기댓값 m은 전체 인원 n과 고령자 비율 p를 곱한 값(np)입니다. (${nValue} × ${pValue})`;
    }

    // Check Variance
    if (isNaN(vNum)) {
      newFeedback.varianceStatus = 'wrong';
      newFeedback.varianceMsg = '분산값을 숫자로 입력해 주세요. (공식: V(X) = npq)';
    } else if (Math.abs(vNum - trueVariance) <= 0.2) {
      newFeedback.varianceStatus = 'correct';
      newFeedback.varianceMsg = `훌륭합니다! V(X) = np(1-p) = ${trueVariance.toFixed(2)}입니다.`;
    } else if (Math.abs(vNum - trueMean) <= 0.3) {
      // Misconception: forgot q
      newFeedback.varianceStatus = 'wrong';
      newFeedback.varianceMsg = '💡 오개념 주의: 분산 공식 V(X) = npq에서 실패확률 q=(1-p)를 곱했는지 확인해 보세요!';
    } else {
      newFeedback.varianceStatus = 'wrong';
      newFeedback.varianceMsg = `분산 계산을 다시 해보세요. V(X) = n × p × (1 - p) = ${nValue} × ${pValue} × ${qValue.toFixed(3)}`;
    }

    // Check Standard Deviation
    if (isNaN(sNum)) {
      newFeedback.stdStatus = 'wrong';
      newFeedback.stdMsg = '표준편차값을 숫자로 입력해 주세요. (공식: σ = √(npq))';
    } else if (Math.abs(sNum - trueStd) <= 0.2) {
      newFeedback.stdStatus = 'correct';
      newFeedback.stdMsg = `완벽합니다! σ = √${trueVariance.toFixed(2)} ≈ ${trueStd.toFixed(2)}명입니다.`;
    } else if (Math.abs(sNum - trueVariance) <= 0.3) {
      // Misconception: forgot square root
      newFeedback.stdStatus = 'wrong';
      newFeedback.stdMsg = '💡 오개념 주의: 구하신 값은 분산 V(X)입니다! 표준편차는 분산에 제곱근(루트 √)을 씌워야 합니다.';
    } else if (Math.abs(sNum - Math.sqrt(trueMean)) <= 0.3) {
      // Misconception: sqrt(np)
      newFeedback.stdStatus = 'wrong';
      newFeedback.stdMsg = '💡 오개념 주의: 혹시 σ = √(np)로 계산하셨나요? 표준편차 공식은 반드시 √(npq)로 q=(1-p)가 포함되어야 합니다!';
    } else {
      newFeedback.stdStatus = 'wrong';
      newFeedback.stdMsg = `표준편차는 분산의 제곱근입니다. σ = √V(X) = √(${trueVariance.toFixed(2)}) ≈ ${trueStd.toFixed(2)}`;
    }

    setFeedback(newFeedback);

    if (
      newFeedback.meanStatus === 'correct' &&
      newFeedback.varianceStatus === 'correct' &&
      newFeedback.stdStatus === 'correct'
    ) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  const isAllCorrect =
    feedback.meanStatus === 'correct' &&
    feedback.varianceStatus === 'correct' &&
    feedback.stdStatus === 'correct';

  return (
    <div className="space-y-6">
      {/* 2~3차시 Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/50 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 mb-2">
              <Calculator className="w-3.5 h-3.5" />
              2~3차시 탐구 활동: 이항분포 B(n, p) 수학적 모델링
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              이항분포 수립 및 모수 손계산 워크시트
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              행사 참가자 n명 중 65세 이상 참석자 수를 확률변수 X로 정의하고,
              이항분포 B(n, p)의 평균(np)과 표준편차(√(npq))를 단계별로 직접 계산하며 오개념을 점검합니다.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <button
              onClick={onPrevSession}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs border border-slate-700 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>1차시</span>
            </button>
            <button
              onClick={onNextSession}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              <span>4차시 (3중 검증)로 이동</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Probability Variable Definition & Independent Trials Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
          <HelpCircle className="w-4 h-4 text-indigo-400" />
          [수학적 모델링] 확률변수 X의 정의와 독립시행 조건
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700 space-y-2">
            <div className="font-semibold text-indigo-300 text-sm">확률변수 X의 정의</div>
            <p className="text-slate-300 leading-relaxed">
              강화군 경로당 행사 또는 군민 행사에 무작위로 모인 <strong>군민 n명 중 65세 이상 어르신 참석자의 수</strong>를 확률변수 <strong>X</strong>라 하자.
            </p>
            <div className="p-2 bg-indigo-950/60 rounded border border-indigo-700/50 text-indigo-200 font-mono text-center text-sm">
              X ~ B(n = {nValue}, p = {pValue})
            </div>
            <div className="text-[11px] text-slate-400">
              * p = 0.367 (강화군 65세 이상 인구비율), q = 1 - p = 0.633 (비고령 인구비율)
            </div>
          </div>

          <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700 space-y-2">
            <div className="font-semibold text-sky-300 text-sm">독립시행의 4가지 조건 검토</div>
            <ul className="space-y-1.5 text-slate-300">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">1.</span>
                <span><strong>동일 시행 반복:</strong> n명의 군민을 독립적으로 선정하여 참석 여부를 관찰함.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">2.</span>
                <span><strong>결과의 이분성:</strong> 각 참석자는 '65세 이상(성공)' 또는 '65세 미만(실패)' 중 하나임.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">3.</span>
                <span><strong>성공확률 불변:</strong> 강화군 전체 인구 규모(약 7만명)에 비해 n이 작으므로 p=0.367 일정.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">4.</span>
                <span><strong>상호 독립성:</strong> 한 군민의 연령 조건이 다른 참석자의 연령 조건에 영향을 주지 않음.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Scenario Selection Buttons */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-sm font-semibold text-white">탐구할 행사 표본 크기(n) 선택</h3>
            <p className="text-xs text-slate-400">시나리오에 따라 모둠이 손계산할 대상 n을 변경할 수 있습니다.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRESET_SCENARIOS.map((sc) => {
            const isSelected = nValue === sc.n;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => handleScenarioChange(sc.n)}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-950/70 border-indigo-500 shadow-md shadow-indigo-500/20 ring-1 ring-indigo-400'
                    : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">{sc.label}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                    isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-300'
                  }`}>
                    n = {sc.n}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{sc.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hand-Calculation Interactive Worksheet */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-400" />
              손계산 워크시트: 기댓값, 분산, 표준편차 유도
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              이항분포 B({nValue}, {pValue})의 성질을 이용하여 손계산한 값을 입력하고 오개념 여부를 검증받으세요.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onAskAiTutor(`[2~3차시 손계산 힌트] n=${nValue}, p=${pValue}일 때 평균 m과 표준편차 σ를 손으로 유도하는 과정을 소크라테스식으로 가이드해 주세요.`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-900/60 hover:bg-sky-800/60 text-sky-200 text-xs font-medium border border-sky-700/50 cursor-pointer self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            AI 튜터에게 계산 힌트 묻기
          </button>
        </div>

        {/* Input Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1: Mean m = np */}
          <div className="bg-slate-850 p-4 rounded-xl border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                1단계
              </span>
              <span className="text-xs text-slate-400 font-mono">m = E(X)</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">기댓값 (평균 m)</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">참석자 중 예상되는 65세 이상 인원 수</p>
            </div>
            <div className="text-xs font-mono bg-slate-900 p-2 rounded text-slate-300 border border-slate-800">
              공식: m = n × p
            </div>
            <div>
              <label className="block text-[11px] text-slate-300 mb-1">직접 계산한 값 (소수 둘째 자리까지):</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.01"
                  value={inputMean}
                  onChange={(e) => setInputMean(e.target.value)}
                  placeholder="예: 36.70"
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-sm font-mono focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
                <span className="text-xs text-slate-400">명</span>
              </div>
            </div>
            {feedback.meanStatus && (
              <div
                className={`p-2.5 rounded-lg text-xs leading-relaxed flex items-start gap-1.5 ${
                  feedback.meanStatus === 'correct'
                    ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/60'
                    : 'bg-amber-950/40 text-amber-300 border border-amber-800/60'
                }`}
              >
                {feedback.meanStatus === 'correct' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <span>{feedback.meanMsg}</span>
              </div>
            )}
          </div>

          {/* Step 2: Variance V(X) = npq */}
          <div className="bg-slate-850 p-4 rounded-xl border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                2단계
              </span>
              <span className="text-xs text-slate-400 font-mono">V(X) = npq</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">분산 V(X)</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">평균으로부터 흩어진 정도의 제곱</p>
            </div>
            <div className="text-xs font-mono bg-slate-900 p-2 rounded text-slate-300 border border-slate-800">
              공식: V(X) = n × p × (1 - p)
            </div>
            <div>
              <label className="block text-[11px] text-slate-300 mb-1">직접 계산한 값 (소수 둘째 자리까지):</label>
              <input
                type="number"
                step="0.01"
                value={inputVariance}
                onChange={(e) => setInputVariance(e.target.value)}
                placeholder="예: 23.23"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-sm font-mono focus:ring-1 focus:ring-sky-500 focus:outline-none"
              />
            </div>
            {feedback.varianceStatus && (
              <div
                className={`p-2.5 rounded-lg text-xs leading-relaxed flex items-start gap-1.5 ${
                  feedback.varianceStatus === 'correct'
                    ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/60'
                    : 'bg-amber-950/40 text-amber-300 border border-amber-800/60'
                }`}
              >
                {feedback.varianceStatus === 'correct' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <span>{feedback.varianceMsg}</span>
              </div>
            )}
          </div>

          {/* Step 3: Standard Deviation sigma = sqrt(npq) */}
          <div className="bg-slate-850 p-4 rounded-xl border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                3단계
              </span>
              <span className="text-xs text-slate-400 font-mono">σ = √(npq)</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">표준편차 σ</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">참석자 수의 실제적 변동성(명)</p>
            </div>
            <div className="text-xs font-mono bg-slate-900 p-2 rounded text-slate-300 border border-slate-800">
              공식: σ = √(V(X)) = √(npq)
            </div>
            <div>
              <label className="block text-[11px] text-slate-300 mb-1">직접 계산한 값 (소수 둘째 자리까지):</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.01"
                  value={inputStd}
                  onChange={(e) => setInputStd(e.target.value)}
                  placeholder="예: 4.82"
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-sm font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
                <span className="text-xs text-slate-400">명</span>
              </div>
            </div>
            {feedback.stdStatus && (
              <div
                className={`p-2.5 rounded-lg text-xs leading-relaxed flex items-start gap-1.5 ${
                  feedback.stdStatus === 'correct'
                    ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/60'
                    : 'bg-amber-950/40 text-amber-300 border border-amber-800/60'
                }`}
              >
                {feedback.stdStatus === 'correct' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <span>{feedback.stdMsg}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            * 오답이어도 즉시 정답을 알려주지 않고 오개념을 짚어주는 디딤돌 피드백이 제공됩니다.
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={checkCalculations}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-medium text-xs shadow-md shadow-indigo-600/30 cursor-pointer"
            >
              내 손계산 검증 및 오개념 확인
            </button>

            {isAllCorrect && (
              <button
                type="button"
                onClick={onNextSession}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md shadow-emerald-600/30 cursor-pointer animate-bounce"
              >
                <span>4차시 3중 검증으로 넘어가기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Misconception Guard Box */}
      <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-5 text-xs">
        <h4 className="font-semibold text-amber-300 flex items-center gap-1.5 mb-2">
          <AlertTriangle className="w-4 h-4" />
          고2 확률과 통계 자주 발생하는 핵심 오개념 체크리스트
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-300">
          <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
            <div className="text-amber-400 font-bold mb-1">❌ 오개념 1: σ = √(np) ?</div>
            <p className="text-[11px] leading-relaxed">
              분산과 표준편차에는 반드시 실패확률 q=(1-p)가 곱해져야 합니다. σ = √(npq)입니다!
            </p>
          </div>
          <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
            <div className="text-amber-400 font-bold mb-1">❌ 오개념 2: 표준편차에 루트 생략 ?</div>
            <p className="text-[11px] leading-relaxed">
              V(X) = npq는 단위가 [명²]입니다. 원래 확률변수의 단위인 [명]을 맞추기 위해 반드시 제곱근을 씌워야 합니다.
            </p>
          </div>
          <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
            <div className="text-amber-400 font-bold mb-1">❌ 오개념 3: n이 작아도 무조건 정규분포?</div>
            <p className="text-[11px] leading-relaxed">
              np와 nq가 충분히 크지 않으면(최소 5 이상) 좌우대칭 정규분포로 근사할 수 없습니다. (4차시에서 검증)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
