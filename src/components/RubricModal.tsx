import React, { useState } from 'react';
import { X, Award, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';
import { RubricCategory } from '../types';

interface RubricModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: RubricCategory[];
  setCategories: React.Dispatch<React.SetStateAction<RubricCategory[]>>;
  groupName: string;
}

export const RubricModal: React.FC<RubricModalProps> = ({
  isOpen,
  onClose,
  categories,
  setCategories,
  groupName,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const totalScore = categories.reduce((sum, c) => sum + c.selectedScore, 0);
  const maxTotalScore = categories.reduce((sum, c) => sum + c.maxScore, 0);

  const handleSelectScore = (catId: string, score: number) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, selectedScore: score } : c))
    );
  };

  const handleNotesChange = (catId: string, notes: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, selfNotes: notes } : c))
    );
  };

  const handleCopySummary = () => {
    let summary = `[강화군 고령화와 확률분포 프로젝트 - 4대 평가 루브릭 자가점검표]\n`;
    summary += `- 모둠명: ${groupName || '미지정'}\n`;
    summary += `- 종합 자가진단 점수: ${totalScore}점 / ${maxTotalScore}점\n\n`;

    categories.forEach((cat) => {
      summary += `■ ${cat.title} (${cat.selectedScore}점 / ${cat.maxScore}점)\n`;
      summary += `  - 세부 설명: ${cat.description}\n`;
      summary += `  - 모둠 자가성찰 근거: ${cat.selfNotes}\n\n`;
    });

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  수행평가 4대 영역 루브릭 & 자가점검표
                </h3>
                <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-500/30">
                  총 {maxTotalScore}점 만점
                </span>
              </div>
              <p className="text-xs text-slate-400">
                개념이해(7) + 통계적모델링(8) + 수학적의사소통(5) + AI검증성찰(5)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-indigo-950/80 border border-indigo-700/60 text-indigo-200 font-mono text-sm font-bold">
              자가진단: <span className="text-amber-400">{totalScore}</span> / {maxTotalScore}점
            </div>

            <button
              onClick={handleCopySummary}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '복사됨!' : '점검표 복사'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-slate-850 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm space-y-4"
            >
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{cat.title}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-normal">
                      배점 {cat.maxScore}점
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">{cat.description}</p>
                </div>

                <div className="text-xs font-bold text-amber-400 bg-amber-950/40 px-3 py-1 rounded-lg border border-amber-800/40 self-start sm:self-auto">
                  선택 점수: {cat.selectedScore}점
                </div>
              </div>

              {/* Levels Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {cat.criteria.map((level) => {
                  const isSelected = cat.selectedScore === level.score;
                  return (
                    <div
                      key={level.score}
                      onClick={() => handleSelectScore(cat.id, level.score)}
                      className={`p-3.5 rounded-xl border text-xs transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-950/30 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-400'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                              level.level === '우수'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : level.level === '보통'
                                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                : 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            {level.level} ({level.score}점)
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-amber-400" />
                          )}
                        </div>
                        <p className="text-slate-300 leading-relaxed text-[11px] mt-1">
                          {level.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Self Reflection Notes */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  모둠 자가진단 및 성찰 근거:
                </label>
                <input
                  type="text"
                  value={cat.selfNotes}
                  onChange={(e) => handleNotesChange(cat.id, e.target.value)}
                  placeholder="선택한 점수의 구체적 근거를 작성하세요."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-850 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>* 교사 평가 시 본 루브릭 자가진단표와 AI 활용 기록지가 함께 제출됩니다.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold cursor-pointer"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
