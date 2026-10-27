import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize Google GenAI if key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const SYSTEM_INSTRUCTION = `
[역할 정의]
당신은 고등학교 2학년 확률과 통계 단원 "우리 지역(강화군)의 고령화, 확률분포로 읽고 미래를 예측하라" 프로젝트를 지원하는 **'AI 융합 수학 탐구 튜터'**입니다.
학생들이 강화군 인구 데이터를 바탕으로 이항분포 B(n, p)를 설정하고, 정규분포 근사를 통해 지역 문제를 통계적으로 예측·해석할 수 있도록 조력합니다.

[수업 맥락 및 기초 정보]
1. 수업 주제: 강화군 고령화 데이터를 활용한 이항분포와 정규분포의 관계 탐구 (6차시 프로젝트)
2. 핵심 성취기준:
   - [12확통03-03] 이항분포의 뜻과 성질을 이해하고, 평균(np)과 표준편차(√(npq))를 구할 수 있다.
   - [12확통03-04] 정규분포의 뜻과 성질을 이해하고, n이 커질 때 이항분포와의 관계를 설명할 수 있다.
3. 문제 시나리오: "강화군청 경로당 프로그램 예산 수립을 위해 군민 n명(n=30, 100, 400)이 모이는 행사에서 65세 이상 참석자 수를 예측하라"
4. 핵심 탐구 절차: 3중 검증 (손계산 ↔ GeoGebra/시뮬레이션 ↔ AI 대조)

[강화군 실제 통계 맥락 (KOSIS 통계청)]
- 총인구: 약 69,800명
- 65세 이상 고령인구 비율(p): 약 0.367 (약 36.7% ~ 37.0%, 초고령사회)
- 비고령인구 비율(q = 1 - p): 약 0.633

[주요 답변 원칙 및 상호작용 지침 - 엄격 준수]
1. **정답 직접 제공 금지 (소크라테스식 발문)**
   - 계산 문제나 확률값을 직접 계산해서 숫자로 바로 답을 주지 마세요.
   - 학생이 "평균이 얼마야?", "확률 구해줘"라고 묻더라도 바로 "11입니다"라고 답하지 마세요.
   - 대신 "이항분포 B(n, p)에서 평균 m과 표준편차 σ를 구하는 공식은 무엇이었나요?", "선택하신 n과 p를 대입해보면 어떤 식이 되나요?"와 같이 단계적 질문을 던지세요.
   - 학생이 계산 실수를 했거나 오개념(예: 표준편차를 √(np)로 계산하거나 q=(1-p)를 빼먹음)이 보이면 친절하게 스스로 짚어볼 수 있는 반문형 힌트를 주세요.

2. **차시별 탐구 가이드**
   - **1차시 (데이터 및 질문 정의)**: KOSIS 연령별 인구 자료에서 65세 이상 비율 p를 구했는지 확인하고, 수학적 탐구가 가능한 하위 질문을 선별하도록 안내합니다.
   - **2~3차시 (이항분포 모델링)**: 모둠별 선택한 n(30, 100, 400)과 p를 바탕으로 평균 np, 분산 npq, 표준편차 √(npq)를 손계산하도록 가이드합니다. (오개념 예: √(np)로 잘못 알고 있다면 √(npq)임을 스스로 깨닫도록 짚어줍니다).
   - **4차시 (정규분포 변환 및 3중 검증)**:
     - 근사 조건(np ≥ 5, nq ≥ 5)을 만족하는지 확인하게 합니다.
     - 표준화 공식 Z = (X - m) / σ 를 적용하도록 가이드합니다.
     - 학생의 손계산 결과, GeoGebra/시뮬레이션 결과, AI 응답을 비교하는 **3중 검증**을 유도하세요.
     - AI가 잘못된 계산이나 해석을 제시할 수도 있음을 환기하고 비판적으로 오류를 찾도록 안내합니다.
   - **5~6차시 (시각화 해석 및 성찰)**:
     - n이 커짐(30 -> 100 -> 400)에 따라 이항분포 그래프가 좌우대칭인 정규분포 곡선에 가까워지는 성질을 수학적 용어로 설명하게 합니다.
     - 강화군청 경로당 예산 예측 맥락(참석자 수 상위 95% 신뢰구간, 예산 초과 확률 등)과 연결하여 지역 사회 문제 해결에 활용하도록 돕습니다.

3. **AI 활용 기록지 및 성찰 지원**
   - 답변 끝에는 항상 학생이 'AI 활용 기록지'에 기록할 수 있도록 다음 양식을 충실히 붙여주세요:
   ---
   📋 **[AI 활용 기록지 요약 카드]**
   - **탐구 질문**: (학생의 이번 질문 요약)
   - **AI 조언 & 핵심 단서**: (공식 및 생각할 단서)
   - **검증 포인트 (3중 검증)**: (손계산 ↔ 공학도구 ↔ AI 비교 시 주의점)
   - **성찰 질문**: (학생 스스로 답해볼 후속 수학적 질문)

4. **평가 루브릭 기준 인지**
   - 평가 4요소: ① 개념 이해 및 계산(7점), ② 통계적 모델링과 해석(8점), ③ 수학적 의사소통(5점), ④ AI 활용 검증 및 성찰(5점).
   - 학생이 용어(확률변수 X, 시행 횟수 n, 성공확률 p, 이항분포 B(n,p), 정규분포 N(m, σ²), 표준화 Z)나 기호를 정확히 사용하도록 안내합니다.

[답변 톤앤매너]
- 친절하고 격려하는 고등학교 튜터 어조 (예: "훌륭한 질문입니다!", "우리 강화군의 실제 통계를 바탕으로 잘 접근하고 있네요!")
- 공공 통계 출처(통계청 KOSIS) 표기 및 생성형 AI 윤리적 활용 강조.
`;

// Socratic fallback generator if no API key or API call errors
function generateFallbackResponse(
  message: string,
  session: number,
  nValue: number,
  pValue: number
) {
  const pPercent = (pValue * 100).toFixed(1);
  const qValue = 1 - pValue;

  if (message.includes('평균') || message.includes('기댓값') || message.includes('np')) {
    return `좋은 질문입니다! 우리가 탐구 중인 강화군 시나리오에서 이항분포 $B(n, p)$는 참가자 수 $n=${nValue}$명, 65세 이상 비율 $p=${pValue}$($${pPercent}\\%$)를 따릅니다.

💡 **소크라테스식 튜터 힌트:**
1. 이항분포 $B(n, p)$에서 기댓값(평균) $E(X) = m$을 구하는 기본 공식은 무엇인가요?
2. 모둠에서 선택한 참가자 수 $n=${nValue}$에 $p=${pValue}$를 곱하면 약 몇 명의 어르신이 참석할 것으로 예상되나요?
3. 표준편차 $\\sigma = \\sqrt{npq}$를 구할 때, $q$는 어떤 확률을 의미할까요? ($q = 1 - p$)

직접 손으로 계산해 보시고, 구해진 평균과 표준편차를 알려주시면 함께 타당성을 검토해 보겠습니다!

---
📋 **[AI 활용 기록지 요약 카드]**
- **탐구 질문**: 이항분포 $B(${nValue}, ${pValue})$에서의 평균 및 분산/표준편차 도출
- **AI 조언 & 핵심 단서**: 평균 $m = np$, 분산 $V(X) = npq$, 표준편차 $\\sigma = \\sqrt{np(1-p)}$
- **검증 포인트 (3중 검증)**: $\\sigma$ 계산 시 $q=(1-p)$를 빠뜨리지 않았는지 손계산과 시뮬레이터 값을 대조해 보세요.
- **성찰 질문**: 구해진 평균 인원 수에 맞춰 강화군 경로당 다과 예산을 1인당 2만원으로 책정하면 충분할까요, 아니면 편차를 고려해야 할까요?`;
  }

  if (message.includes('정규분포') || message.includes('근사') || message.includes('표준화') || message.includes('Z')) {
    return `정규분포 변환과 표준화 단계에 도달하셨군요! 아주 중요한 수학적 단계입니다.

💡 **소크라테스식 튜터 힌트:**
1. 이항분포 $B(n, p)$가 정규분포 $N(m, \\sigma^2)$에 근사하려면 어떤 전제 조건이 만족되어야 할까요? ($np \\ge 5$와 $nq \\ge 5$가 모두 성립하는지 확인해 보셨나요?)
2. 현재 설정한 $n=${nValue}$일 때, $np$와 $n(1-p)$는 각각 얼마인가요?
3. 어떤 특정 인원 $X$명을 표준화할 때 사용하는 표준화 공식 $Z = \\frac{X - m}{\\sigma}$의 각 기호가 의미하는 바를 설명해 볼 수 있을까요?

앱의 [3중 검증 스테이션]에서 직접 손계산한 $Z$값과 표준정규분포표의 확률값을 확인해 보세요!

---
📋 **[AI 활용 기록지 요약 카드]**
- **탐구 질문**: 이항분포의 정규분포 근사 조건 및 표준화 $Z$ 변환
- **AI 조언 & 핵심 단서**: 근사 조건 $np \\ge 5, nq \\ge 5$, 표준화 $Z = \\frac{X - np}{\\sqrt{npq}}$
- **검증 포인트 (3중 검증)**: 손계산한 $Z$값과 GeoGebra/내장 시뮬레이터의 누적확률 값이 소수점 넷째 자리까지 일치하는지 비교하세요.
- **성찰 질문**: $n=30$일 때와 $n=400$일 때 중, 어느 쪽이 정규분포 곡선에 더 완벽하게 들어맞을까요? 그 이유는 무엇일까요?`;
  }

  if (message.includes('예산') || message.includes('경로당') || message.includes('군청')) {
    return `강화군 어르신 복지 예산과 직결되는 실생활 통계적 의사결정 질문이군요!

💡 **소크라테스식 튜터 힌트:**
1. 행사 참가자 $n=${nValue}$명 중 65세 이상 어르신 참석자 수가 평균 $m$명보다 많이 올 확률은 대략 얼마일까요? (정규분포의 대칭성을 떠올려 보세요)
2. 만약 평균 인원 수($m$명)만큼만 예산을 준비한다면, 어르신들이 예상보다 더 많이 오셔서 예산이 부족해질 위험(확률)은 몇 %나 될까요?
3. 군청 담당자로서 "예산 부족 확률을 5% 이하"로 줄이고 싶다면, 표준정규분포에서 상위 5%에 해당하는 $Z$값(약 $1.645$)을 고려하여 몇 명분의 예산을 준비해야 할까요?

직접 [예산 시뮬레이터] 탭에서 수치를 조정하며 안전 예산 인원을 계산해 보세요!

---
📋 **[AI 활용 기록지 요약 카드]**
- **탐구 질문**: 확률분포를 활용한 강화군 경로당 행사 복지 예산의 안전 마진 예측
- **AI 조언 & 핵심 단서**: 평균만 준비하면 부족 확률 50%, 상위 5% 위험 기준 $X_{safe} = m + 1.645\\sigma$
- **검증 포인트 (3중 검증)**: 시뮬레이터의 위험 확률 그래프와 본인이 계산한 안전 예산 규모를 대조하세요.
- **성찰 질문**: 통계적 예측 없이 과거 경험에만 의존해 예산을 짰을 때 발생할 수 있는 행정적 낭비나 결손은 무엇일까요?`;
  }

  return `안녕하세요! 강화군 고령화 데이터 기반 확률분포 탐구를 함께할 AI 수학 튜터입니다.
현재 모둠은 **${session}차시** 탐구를 진행 중이며, 행사 인원 **$n=${nValue}$명**, 65세 이상 비율 **$p=${pValue}$**를 기본값으로 설정해 두고 있습니다.

💡 **오늘의 탐구 길잡이:**
- 지금 어떤 부분(KOSIS 인구 비율 분석, $B(n, p)$ 손계산, 정규분포 근사 조건, 표준화 $Z$값, 예산 예측 시뮬레이션)을 고민하고 계신가요?
- 알고 계신 공식이나 현재까지 모둠에서 계산한 중간 결과를 적어주시면, 정답을 바로 알려주는 대신 올바른 방향으로 나아갈 수 있는 디딤돌 질문을 드릴게요!

---
📋 **[AI 활용 기록지 요약 카드]**
- **탐구 질문**: ${session}차시 ${message.slice(0, 30)}...
- **AI 조언 & 핵심 단서**: 개념 이해와 기호의 수학적 정의 점검 ($n, p, q, m, \\sigma, Z$)
- **검증 포인트 (3중 검증)**: 나의 직관 ↔ 손계산 ↔ 컴퓨터 시각화 그래프 비교
- **성찰 질문**: 우리 강화군의 고령화율($${pPercent}\\%$)은 전국 평균(약 19%)과 비교할 때 지역 복지 정책에 어떤 시사점을 던져줄까요?`;
}

// Chat API endpoint
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  try {
    const { message, session = 2, nValue = 100, pValue = 0.367, history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: '메시지를 입력해주세요.' });
      return;
    }

    if (!ai) {
      // Use intelligent pedagogical fallback
      const reply = generateFallbackResponse(message, session, nValue, pValue);
      res.json({ reply, source: 'socratic-engine' });
      return;
    }

    // Build contents from history
    const contents: any[] = [];

    // Append history
    if (Array.isArray(history)) {
      for (const h of history.slice(-6)) {
        if (h.role === 'user' || h.role === 'model') {
          contents.push({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }],
          });
        }
      }
    }

    // Add current context + message
    const promptWithContext = `[현재 학생의 탐구 상태]
- 진행 차시: ${session}차시
- 설정된 행사 인원(n): ${nValue}명
- 강화군 65세 이상 비율(p): ${pValue} (${(pValue * 100).toFixed(1)}%)
- 학생 질문: "${message}"

위 맥락에 맞추어 지침(소크라테스식 발문, 정답 직접 제공 금지, 3중 검증 안내, AI 활용 기록지 요약 카드 포함)을 충실히 지켜 한국어로 친절하게 답변해주세요.`;

    contents.push({
      role: 'user',
      parts: [{ text: promptWithContext }],
    });

    const apiCallPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI request timeout')), 3500)
    );

    const response = (await Promise.race([apiCallPromise, timeoutPromise])) as any;
    const reply = response.text || generateFallbackResponse(message, session, nValue, pValue);
    res.json({ reply, source: 'gemini-3.8-flash' });
  } catch (err: any) {
    console.error('Handled in /api/ai/chat:', err.message || err);
    // Graceful pedagogical fallback so user experience is never broken
    const { message, session = 2, nValue = 100, pValue = 0.367 } = req.body || {};
    const fallback = generateFallbackResponse(message || '', session, nValue, pValue);
    res.json({ reply: fallback, source: 'socratic-engine' });
  }
});

// Configure Vite middleware in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: port,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer();
