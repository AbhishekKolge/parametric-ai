export type QualityMetrics = {
  coherence: number;
  relevance: number;
  creativity: number;
  completeness: number;
  readability: number;
  sentimentBalance: number;
  informationDensity: number;
  overallScore: number;
};

export type ResponseMetrics = QualityMetrics & {
  completionTokens: number;
  promptTime: number;
  completionTime: number;
  totalTokens: number;
  totalTime: number;
};
