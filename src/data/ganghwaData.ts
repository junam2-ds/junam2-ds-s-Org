import { EupMyeonData, RubricCategory } from '../types';

export const GANGHWA_TOTAL_DATA = {
  countyName: '인천광역시 강화군',
  totalPop: 69824,
  seniorPop: 25625,
  seniorRate: 36.7, // 36.7% (2024~2025 KOSIS 기준 초고령사회)
  nationalSeniorRate: 19.2,
  incheonSeniorRate: 16.8,
  superAgedThreshold: 20.0,
  dataSource: '통계청 KOSIS 행정안전부 주민등록인구통계',
};

export const EUP_MYEON_LIST: EupMyeonData[] = [
  { name: '강화읍', totalPop: 22415, seniorPop: 6680, seniorRate: 29.8, description: '강화군의 중심지, 상업 및 행정 중심' },
  { name: '선원면', totalPop: 8120, seniorPop: 2606, seniorRate: 32.1, description: '주거 단지 및 전원주택 밀집' },
  { name: '불은면', totalPop: 4620, seniorPop: 1917, seniorRate: 41.5, description: '전형적 농촌 마을, 40% 이상 초고령' },
  { name: '길상면', totalPop: 6850, seniorPop: 2685, seniorRate: 39.2, description: '초지진 및 온수리 중심의 문화관광 거점' },
  { name: '화도면', totalPop: 4320, seniorPop: 1849, seniorRate: 42.8, description: '마니산과 동막해변 위치' },
  { name: '양도면', totalPop: 3780, seniorPop: 1629, seniorRate: 43.1, description: '진강산 인근 농업 중심지' },
  { name: '내가면', totalPop: 3210, seniorPop: 1419, seniorRate: 44.2, description: '고려저수지 및 외포항 부근' },
  { name: '하점면', totalPop: 3840, seniorPop: 1740, seniorRate: 45.3, description: '봉천산 및 고인돌 유적지 위치' },
  { name: '양사면', totalPop: 1750, seniorPop: 819, seniorRate: 46.8, description: '강화 북단 평화전망대 부근' },
  { name: '송해면', totalPop: 2890, seniorPop: 1303, seniorRate: 45.1, description: '북부 접경 인접 농업 지역' },
  { name: '교동면', totalPop: 2780, seniorPop: 1354, seniorRate: 48.7, description: '도서 접경지역, 최고 수준의 고령화율' },
  { name: '삼산면', totalPop: 2190, seniorPop: 1049, seniorRate: 47.9, description: '석모도 위치, 관광 및 어업 복합' },
  { name: '서도면', totalPop: 1069, seniorPop: 494, seniorRate: 46.2, description: '주문도/볼음도 등 서해 낙도 지역' },
];

export const PROJECT_SESSIONS = [
  {
    id: 1,
    title: '1차시: 데이터 분석 및 탐구 질문 정의',
    subtitle: 'KOSIS 연령별 인구 자료에서 65세 이상 비율 p를 도출하고 연구 가설 세우기',
    objective: '통계청 KOSIS 인구 데이터를 확인하고, 강화군의 초고령화 현실을 파악하여 수학적 탐구가 가능한 하위 질문을 선별합니다.',
  },
  {
    id: 2,
    title: '2~3차시: 이항분포 모델링 & 손계산',
    subtitle: '확률변수 X 설정과 B(n, p)의 평균(np)·표준편차(√(npq)) 손계산 워크시트',
    objective: 'n명(30, 100, 400) 행사에서 65세 이상 참석자 수를 확률변수 X로 두고 이항분포 B(n, p)의 평균과 표준편차를 직접 유도하고 오개념을 점검합니다.',
  },
  {
    id: 3,
    title: '4차시: 정규분포 변환 및 3중 검증',
    subtitle: '라플라스-드무아브르 정규분포 근사와 손계산↔시뮬레이션↔AI 3중 검증',
    objective: 'np ≥ 5, nq ≥ 5 근사 조건을 확인하고, 표준화 공식 Z=(X-m)/σ를 적용하여 손계산, 공학 시뮬레이션, AI 응답의 오차를 비판적으로 분석합니다.',
  },
  {
    id: 4,
    title: '5~6차시: 시각화 해석 및 미래 예산 예측',
    subtitle: 'n의 크기에 따른 분포 변화 관찰 및 강화군청 경로당 복지 예산 의사결정',
    objective: '이항분포가 정규분포에 수렴하는 시각적 성질을 수학적으로 설명하고, 예산 부족 확률을 5% 이하로 통제하는 안전 예산 편성을 통계적으로 수립합니다.',
  },
];

export const PRESET_SCENARIOS = [
  {
    id: 'n30',
    n: 30,
    label: '마을 경로당 소모임 (n = 30)',
    desc: '강화군 한 리(마을) 단위 경로당 소규모 행사. n이 비교적 작아 이산성이 두드러짐.',
    budgetPerSenior: 20000,
  },
  {
    id: 'n100',
    n: 100,
    label: '면민 건강 걷기 대회 (n = 100)',
    desc: '선원면 또는 길상면 면민 100명이 모이는 축제. 정규분포 근사 조건(np≥5, nq≥5)이 양호하게 충족.',
    budgetPerSenior: 20000,
  },
  {
    id: 'n400',
    n: 400,
    label: '강화군민 한마음 체육대회 (n = 400)',
    desc: '강화공설운동장에 모이는 대규모 군민 행사. n이 커서 정규분포와 완벽에 가깝게 일치.',
    budgetPerSenior: 20000,
  },
];

export const INITIAL_RUBRIC_DATA: RubricCategory[] = [
  {
    id: 'concept_calc',
    title: '① 개념 이해 및 계산',
    maxScore: 7,
    description: '이항분포의 뜻과 평균 m=np, 표준편차 σ=√(npq) 및 정규분포 표준화 공식 Z=(X-m)/σ의 정확한 적용',
    criteria: [
      { score: 7, level: '우수', desc: '이항분포의 평균, 분산, 표준편차 공식을 정확히 이해하고 정규분포 근사 조건 및 표준화 과정을 오류 없이 손계산함' },
      { score: 5, level: '보통', desc: '공식을 알고 대입하였으나 사소한 연산 실수(예: 소수점 반올림 오차)가 일부 있음' },
      { score: 3, level: '노력요함', desc: '표준편차에서 q를 누락하거나 루트를 씌우지 않는 등 공식 오개념이 있고 표준화 과정을 혼동함' },
    ],
    selectedScore: 7,
    selfNotes: 'q=(1-p)를 반드시 곱하고 루트를 씌워 정확히 계산하였음.',
  },
  {
    id: 'modeling_interpretation',
    title: '② 통계적 모델링과 해석',
    maxScore: 8,
    description: '강화군 고령화 KOSIS 데이터를 바탕으로 한 모형 수립 및 경로당 복지 예산 예측의 현실적 해석력',
    criteria: [
      { score: 8, level: '우수', desc: '강화군 실제 고령화율(36.7%)을 확률 p로 타당하게 모델링하고, 예산 부족 위험(상위 5% 등)을 통계적 신뢰구간으로 명쾌히 해석함' },
      { score: 6, level: '보통', desc: '모델링은 적절하나 복지 예산 편성 시 위험률(단순 평균 예산의 50% 결손 위험 등)에 대한 구체적 해석이 다소 평이함' },
      { score: 4, level: '노력요함', desc: '인구 데이터와 확률 모형의 연계가 미흡하고 단순 수치 계산에 그쳐 지역 문제 해결로 연결하지 못함' },
    ],
    selectedScore: 8,
    selfNotes: '평균만 준비하면 예산 부족 위험이 50%나 된다는 사실을 발견하고 95% 안전 예산안을 제안함.',
  },
  {
    id: 'communication',
    title: '③ 수학적 의사소통',
    maxScore: 5,
    description: '확률변수, 기호(B(n,p), N(m,σ²), Z), 수식 전개 과정 및 모둠 토의 결과의 논리적 서술',
    criteria: [
      { score: 5, level: '우수', desc: '확률변수 X의 정의, 분포 기호 B, N, 표준화 Z 등 수학적 기호와 용어를 명확하고 엄밀하게 구사함' },
      { score: 4, level: '보통', desc: '대체로 수학적 용어를 올바르게 썼으나 일부 기호 표현(예: B(n,p) 표기 생략)이 불완전함' },
      { score: 2, level: '노력요함', desc: '수학적 기호 없이 일상어로만 기술하거나 수학적 용어(독립시행, 연속성 등)를 부적절하게 사용함' },
    ],
    selectedScore: 5,
    selfNotes: '확률변수 X: 강화군민 n명 중 65세 이상 참석자 수로 명확히 정의함.',
  },
  {
    id: 'ai_verification',
    title: '④ AI 활용 검증 및 성찰',
    maxScore: 5,
    description: 'AI 튜터 응답에 대한 맹종을 지양하고 손계산 ↔ 공학도구 ↔ AI 3중 검증을 주도적으로 수행 및 성찰',
    criteria: [
      { score: 5, level: '우수', desc: 'AI 활용 기록지를 충실히 작성하고, AI의 환각/오차 가능성을 인지하여 손계산 및 시뮬레이터와 3중 대조하여 비판적으로 성찰함' },
      { score: 3, level: '보통', desc: 'AI 활용 기록을 남겼으나 3중 대조 분석이 피상적이며 AI 응답 검증 노력이 부분적임' },
      { score: 1, level: '노력요함', desc: 'AI의 답변을 무비판적으로 수용하거나 검증 기록을 거의 작성하지 않음' },
    ],
    selectedScore: 5,
    selfNotes: '이항분포 이산확률과 정규분포 연속근사 간의 연속성 수정(0.5) 차이를 AI 응답과 대조하여 성찰함.',
  },
];
