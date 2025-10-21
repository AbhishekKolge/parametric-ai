import { EXPECTED_OUTPUT_TOKENS_DEFAULT } from "../prompt/const";

export const MIN_EXPERIMENT_NAME_LENGTH = 2;
export const MAX_EXPERIMENT_NAME_LENGTH = 100;
export const MIN_EXPERIMENT_PROMPT_LENGTH = 5;
export const MIN_EXPERIMENT_TAG_LENGTH = 1;
export const MAX_EXPERIMENT_TAG_LENGTH = 10;
export const MAX_TAGS_LENGTH = 5;
export const MIN_EXPERIMENT_LIMIT = 1;
export const MAX_EXPERIMENT_QUERY_LIMIT = 50;
export const DEFAULT_EXPERIMENT_QUERY_LIMIT = 20;
export const MAX_EXPERIMENT_SEARCH_TERM_LENGTH = 500;
export const MIN_EXPERIMENT_PAGE = 1;
export const DEFAULT_EXPERIMENT_PAGE = 1;
export const MIN_TOP_P = 0.0;
export const MAX_TOP_P = 1.0;
export const DEFAULT_TOP_P = 0.95;
export const MIN_TEMPERATURE = 0.0;
export const MAX_TEMPERATURE = 2.0;
export const DEFAULT_TEMPERATURE = 0.6;
export const MIN_COMPLETION_TOKENS = 1024;
export const DEFAULT_COMPLETION_TOKENS = EXPECTED_OUTPUT_TOKENS_DEFAULT;
export const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "with",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "may",
  "might",
  "can",
  "this",
  "that",
  "these",
  "those",
]);
export const TRANSITION_WORDS = [
  "however",
  "therefore",
  "moreover",
  "furthermore",
  "additionally",
  "consequently",
  "thus",
  "hence",
  "meanwhile",
  "nevertheless",
  "similarly",
  "likewise",
  "in contrast",
  "on the other hand",
  "for example",
  "for instance",
  "specifically",
  "in particular",
];
export const METRIC_WEIGHTS = {
  coherence: 0.2,
  relevance: 0.25,
  creativity: 0.1,
  completeness: 0.15,
  readability: 0.15,
  sentimentBalance: 0.05,
  informationDensity: 0.1,
} as const;
export const SCORE_MAX = 100;
export const SCORE_MIN = 0;
export const SENTENCE_END_BONUS = 25;
export const WORD_COUNT_THRESHOLD = 50;
export const SHORT_CONTENT_THRESHOLD = 20;
export const IDEAL_WORDS_PER_SENTENCE = { min: 10, max: 30 } as const;
export const AVG_SENTENCE_STD_TOLERANCE = 25;
export const TRANSITION_SCORE_MAX = 30;
export const COHERENCE_BASE_BONUS = 25;
export const SENTIMENT_NORMALIZATION_BASE = 50;
export const RELEVANCE_KEYWORD_WEIGHT = 0.7;
export const RELEVANCE_STEM_WEIGHT = 0.3;
export const CREATIVITY_TYPE_TOKEN_WEIGHT = 0.4;
export const CREATIVITY_LONG_WORD_WEIGHT = 0.3;
export const CREATIVITY_STARTER_DIVERSITY_WEIGHT = 0.3;
export const LONG_WORD_MIN_LENGTH = 8;
export const MIN_ACCEPTABLE_WORDS_PER_SENTENCE = 5;
export const PARTIAL_SCORE_BONUS = 15;
export const MIN_WORDS_IN_LAST_SENTENCE_FOR_FULL_SCORE = 5;
export const MIN_WORDS_IN_LAST_SENTENCE_FOR_PARTIAL_SCORE = 3;
export const VOWELS = "aeiouy";
export const SHORT_WORD_LENGTH_THRESHOLD = 3;
export const MIN_SYLLABLES = 1;
export const FLESCH_BASE_SCORE = 206.835;
export const FLESCH_WORDS_PER_SENTENCE_WEIGHT = 1.015;
export const FLESCH_SYLLABLES_PER_WORD_WEIGHT = 84.6;
