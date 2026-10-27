import React, { useState } from 'react';
import { X, FileText, Download, Copy, Plus, Trash2, Check, ExternalLink, Printer } from 'lucide-react';
import { AiLogEntry } from '../types';

interface AiLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: AiLogEntry[];
  setEntries: React.Dispatch<React.SetStateAction<AiLogEntry[]>>;
  groupName: string;
}

export const AiLogModal: React.FC<AiLogModalProps> = ({
  isOpen,
  onClose,
  entries,
  setEntries,
  groupName,
}) => {
  const [copied, setCopied] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New entry form state
  const [newSession, setNewSession] = useState(2);
  const [newPrompt, setNewPrompt] = useState('');
  const [newAiResponse, setNewAiResponse] = useState('');
  const [newVerification, setNewVerification] = useState('');
  const [newCorrection, setNewCorrection] = useState('');

  if (!isOpen) return null;

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrompt.trim()) return;

    const newEntry: AiLogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString([], {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      session: newSession,
      prompt: newPrompt.trim(),
      aiResponse: newAiResponse.trim(),
      verificationMethod: newVerification.trim(),
      studentCorrection: newCorrection.trim(),
    };

    setEntries((prev) => [newEntry, ...prev]);
    setIsAddingNew(false);
    setNewPrompt('');
    setNewAiResponse('');
    setNewVerification('');
    setNewCorrection('');
  };

  const generateMarkdown = () => {
    let md = `# [AI 활용 기록지] 우리 지역(강화군)의 고령화, 확률분포로 읽고 미래를 예측하라\n`;
    md += `- 모둠명: ${groupName || '미지정 모둠'}\n`;
    md += `- 작성 일시: ${new Date().toLocaleDateString()}\n`;
    md += `- 총 기록 건수: ${entries.length}건\n\n`;
    md += `---\n\n`;

    entries.forEach((item, idx) => {
      md += `### [기록 #${idx + 1}] ${item.session}차시 (${item.timestamp})\n`;
      md += `1. **탐구 질문 (내가 입력한 프롬프트)**:\n   ${item.prompt}\n\n`;
      md += `2. **AI의 응답 및 제시 힌트**:\n   ${item.aiResponse}\n\n`;
      md += `3. **3중 검증 방법 (손계산 ↔ 공학도구 ↔ AI 대조)**:\n   ${item.verificationMethod}\n\n`;
      md += `4. **발견한 오차 및 내가 수정한 최종 수학적 결론**:\n   ${item.studentCorrection}\n\n`;
      md += `---\n\n`;
    });

    return md;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const md = generateMarkdown();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `강화군_확률분포_AI활용기록지_${groupName || '모둠'}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  수행평가 제출용 [AI 활용 기록지]
                </h3>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-semibold border border-emerald-500/30">
                  평가요소 ④ 성찰 5점
                </span>
              </div>
              <p className="text-xs text-slate-400">
                모둠: <strong className="text-white">{groupName || '미지정'}</strong> | 총 {entries.length}개의 3중 검증 및 성찰 기록
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition cursor-pointer"
              title="클립보드에 보고서 양식 복사"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '복사됨!' : '마크다운 복사'}</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition cursor-pointer"
              title="마크다운 파일 다운로드"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">다운로드</span>
            </button>

            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition cursor-pointer"
              title="인쇄 및 PDF 저장"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>인쇄/PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Top Banner: Rubric alignment guide */}
          <div className="p-3 bg-slate-850 rounded-xl border border-slate-700/80 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <strong>📌 루브릭 4요소 안내:</strong> 질문-AI응답-검증방법-수정내용의 4단계를 충실히 작성하고,
              AI 응답의 오차(연속성 수정 생략, 반올림 오차 등)를 3중 대조하여 성찰한 내용이 반영됩니다.
            </div>
            <button
              type="button"
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>기록 수동 추가</span>
            </button>
          </div>

          {/* Add New Entry Form (Collapsible) */}
          {isAddingNew && (
            <form
              onSubmit={handleAddNew}
              className="p-4 bg-slate-800/80 rounded-xl border border-emerald-500/40 space-y-3 text-xs animate-fade-in"
            >
              <div className="font-bold text-emerald-300 text-sm flex items-center justify-between">
                <span>➕ 새 AI 활용 기록지 작성</span>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="text-slate-400 hover:text-white"
                >
                  취소
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">탐구 차시:</label>
                  <select
                    value={newSession}
                    onChange={(e) => setNewSession(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value={1}>1차시 (데이터/질문)</option>
                    <option value={2}>2~3차시 (이항분포)</option>
                    <option value={4}>4차시 (3중 검증)</option>
                    <option value={5}>5~6차시 (시각화/예산)</option>
                  </select>
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-slate-300 mb-1">탐구 질문 (내가 던진 프롬프트):</label>
                  <input
                    type="text"
                    required
                    value={newPrompt}
                    onChange={(e) => setNewPrompt(e.target.value)}
                    placeholder="예: n=100, p=0.367에서 정규분포 표준화 공식 대입 질문"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">AI의 응답 및 제시 힌트:</label>
                <textarea
                  rows={2}
                  value={newAiResponse}
                  onChange={(e) => setNewAiResponse(e.target.value)}
                  placeholder="AI가 제시한 수식 전개 또는 힌트 요약"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">3중 검증 방법 (손계산↔공학도구↔AI):</label>
                  <textarea
                    rows={2}
                    value={newVerification}
                    onChange={(e) => setNewVerification(e.target.value)}
                    placeholder="예: 손계산 Z값과 시뮬레이터 누적확률을 대조함"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">발견한 오차 및 내가 수정한 최종 결론:</label>
                  <textarea
                    rows={2}
                    value={newCorrection}
                    onChange={(e) => setNewCorrection(e.target.value)}
                    placeholder="예: AI가 연속성 수정을 누락하여 1%p 오차가 있었음을 발견하고 보정함"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium cursor-pointer"
                >
                  기록지에 저장하기
                </button>
              </div>
            </form>
          )}

          {/* Entries List */}
          {entries.length === 0 ? (
            <div className="p-8 text-center text-slate-400 bg-slate-850 rounded-xl border border-slate-800">
              <FileText className="w-10 h-10 mx-auto text-slate-500 mb-2 opacity-50" />
              <p className="text-sm font-medium text-slate-300">아직 등록된 AI 활용 기록이 없습니다.</p>
              <p className="text-xs text-slate-500 mt-1">
                각 차시의 [3중 검증 등록] 버튼이나 AI 튜터 응답 카드의 [등록] 버튼을 누르면 자동으로 기록됩니다.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((item, idx) => (
                <div
                  key={item.id}
                  className="bg-slate-850 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm space-y-3 relative group"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {item.session}차시
                      </span>
                      <span className="text-[11px] text-slate-400">{item.timestamp}</span>
                    </div>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded transition cursor-pointer"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 4 Pillars display */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800/80">
                      <div className="text-[11px] font-bold text-slate-400 mb-1 flex items-center gap-1">
                        <span>1. 탐구 질문 (프롬프트):</span>
                      </div>
                      <p className="text-slate-200 leading-relaxed">{item.prompt}</p>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800/80">
                      <div className="text-[11px] font-bold text-indigo-400 mb-1 flex items-center gap-1">
                        <span>2. AI 응답 및 제시 힌트:</span>
                      </div>
                      <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{item.aiResponse}</p>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800/80">
                      <div className="text-[11px] font-bold text-sky-400 mb-1 flex items-center gap-1">
                        <span>3. 3중 검증 방법:</span>
                      </div>
                      <p className="text-slate-200 leading-relaxed">{item.verificationMethod}</p>
                    </div>

                    <div className="p-3 bg-emerald-950/20 rounded-lg border border-emerald-800/40">
                      <div className="text-[11px] font-bold text-emerald-300 mb-1 flex items-center gap-1">
                        <span>4. 발견한 오차 및 최종 결론:</span>
                      </div>
                      <p className="text-emerald-100 leading-relaxed">{item.studentCorrection}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-850 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>* 프로젝트 발표 시 포트폴리오 산출물로 제출됩니다.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
