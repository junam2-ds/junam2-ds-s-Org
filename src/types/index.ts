export interface EupMyeonData {
  name: string;
  totalPop: number;
  seniorPop: number;
  seniorRate: number; // percentage (e.g., 36.7)
  description: string;
}

export interface HandCalcState {
  n: number;
  p: number;
  q: number;
  meanFormula: string;
  meanValue: string;
  varianceFormula: string;
  varianceValue: string;
  stdFormula: string;
  stdValue: string;
  isCompleted: boolean;
}

export interface TripleVerificationRecord {
  scenarioName: string;
  n: number;
  p: number;
  targetX: number; // e.g., X >= 40
  condition: '>=' | '<=' | '=';
  handCalcProb: string;
  handCalcZ: string;
  simBinomialProb: number;
  simNormalProb: number;
  simNormalWithContinuityProb: number;
  aiResponseSummary: string;
  discrepancyAnalysis: string;
  conclusion: string;
}

export interface AiLogEntry {
  id: string;
  timestamp: string;
  session: number;
  prompt: string;
  aiResponse: string;
  verificationMethod: string;
  studentCorrection: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  source?: string;
  logCandidate?: {
    topic: string;
    advice: string;
    verification: string;
    reflection: string;
  };
}

export interface RubricCategory {
  id: string;
  title: string;
  maxScore: number;
  description: string;
  criteria: {
    score: number;
    level: '우수' | '보통' | '노력요함';
    desc: string;
  }[];
  selectedScore: number;
  selfNotes: string;
}
