import natural from "natural";
import Sentiment from "sentiment";
import { HUNDRED } from "../common/const";
import {
  AVG_SENTENCE_STD_TOLERANCE,
  COHERENCE_BASE_BONUS,
  CREATIVITY_LONG_WORD_WEIGHT,
  CREATIVITY_STARTER_DIVERSITY_WEIGHT,
  CREATIVITY_TYPE_TOKEN_WEIGHT,
  FLESCH_BASE_SCORE,
  FLESCH_SYLLABLES_PER_WORD_WEIGHT,
  FLESCH_WORDS_PER_SENTENCE_WEIGHT,
  IDEAL_WORDS_PER_SENTENCE,
  LONG_WORD_MIN_LENGTH,
  METRIC_WEIGHTS,
  MIN_ACCEPTABLE_WORDS_PER_SENTENCE,
  MIN_SYLLABLES,
  MIN_WORDS_IN_LAST_SENTENCE_FOR_FULL_SCORE,
  MIN_WORDS_IN_LAST_SENTENCE_FOR_PARTIAL_SCORE,
  PARTIAL_SCORE_BONUS,
  RELEVANCE_KEYWORD_WEIGHT,
  RELEVANCE_STEM_WEIGHT,
  SCORE_MAX,
  SCORE_MIN,
  SENTENCE_END_BONUS,
  SENTIMENT_NORMALIZATION_BASE,
  SHORT_CONTENT_THRESHOLD,
  SHORT_WORD_LENGTH_THRESHOLD,
  STOP_WORDS,
  TRANSITION_SCORE_MAX,
  TRANSITION_WORDS,
  VOWELS,
  WORD_COUNT_THRESHOLD,
} from "./const";
import {
  CAPITALIZED_START_REGEX,
  SENTENCE_DELIMITER_REGEX,
  SENTENCE_END_REGEX,
  WORD_SPLIT_REGEX,
} from "./regex";
import type { QualityMetrics } from "./types";

const sentiment = new Sentiment();
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

const normalize = (val: number, min: number, max: number) =>
  Math.max(
    SCORE_MIN,
    Math.min(SCORE_MAX, ((val - min) / (max - min)) * SCORE_MAX)
  );

const mean = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

const variance = (arr: number[]) => {
  const avg = mean(arr);
  return mean(arr.map((item) => (item - avg) ** 2));
};

const calculateCoherence = (content: string): number => {
  const sentences = content.split(SENTENCE_DELIMITER_REGEX).filter(Boolean);
  if (!sentences.length) {
    return SCORE_MIN;
  }

  const transitionCount = sentences.filter((sentence) =>
    TRANSITION_WORDS.some((word) => sentence.toLowerCase().includes(word))
  ).length;

  const transitionScore = Math.min(
    (transitionCount / sentences.length) * SCORE_MAX,
    TRANSITION_SCORE_MAX
  );

  const sentenceLengths = sentences.map(
    (sentence) => sentence.trim().split(WORD_SPLIT_REGEX).length
  );
  const stdDev = Math.sqrt(variance(sentenceLengths));
  const consistencyScore = Math.max(
    0,
    AVG_SENTENCE_STD_TOLERANCE -
      (stdDev / mean(sentenceLengths)) * AVG_SENTENCE_STD_TOLERANCE
  );

  const properPunctuation = SENTENCE_END_REGEX.test(content.trim()) ? 10 : 0;
  const hasCapitalization = CAPITALIZED_START_REGEX.test(content.trim())
    ? 10
    : 0;

  return Math.min(
    transitionScore +
      consistencyScore +
      properPunctuation +
      hasCapitalization +
      COHERENCE_BASE_BONUS,
    SCORE_MAX
  );
};

const calculateRelevance = (prompt: string, content: string): number => {
  const promptTokens = tokenizer
    .tokenize(prompt.toLowerCase())
    .filter((token) => !STOP_WORDS.has(token));
  const contentTokens = new Set(
    tokenizer
      .tokenize(content.toLowerCase())
      .filter((token) => !STOP_WORDS.has(token))
  );

  if (!promptTokens.length) {
    return SENTIMENT_NORMALIZATION_BASE;
  }

  const matchingKeywords = promptTokens.filter((keyword) =>
    contentTokens.has(keyword)
  ).length;
  const stemMatches = promptTokens
    .map((token) => stemmer.stem(token))
    .filter((stem) =>
      [...contentTokens].some(
        (contentToken) => stemmer.stem(contentToken) === stem
      )
    ).length;

  const relevanceScore =
    (matchingKeywords / promptTokens.length) *
      RELEVANCE_KEYWORD_WEIGHT *
      SCORE_MAX +
    (stemMatches / promptTokens.length) * RELEVANCE_STEM_WEIGHT * SCORE_MAX;

  return Math.min(relevanceScore, SCORE_MAX);
};

const calculateCreativity = (content: string): number => {
  const tokens = tokenizer.tokenize(content.toLowerCase());
  if (!tokens.length) {
    return SCORE_MIN;
  }

  const uniqueTokens = new Set(tokens);
  const typeTokenRatio = uniqueTokens.size / tokens.length;
  const longWordRatio =
    tokens.filter((token) => token.length > LONG_WORD_MIN_LENGTH).length /
    tokens.length;
  const sentences = content.split(SENTENCE_DELIMITER_REGEX).filter(Boolean);
  const starterDiversity =
    new Set(
      sentences.map((sentence) =>
        sentence.trim().split(WORD_SPLIT_REGEX)[0]?.toLowerCase()
      )
    ).size / Math.max(sentences.length, 1);

  return Math.min(
    typeTokenRatio * CREATIVITY_TYPE_TOKEN_WEIGHT * SCORE_MAX +
      longWordRatio * CREATIVITY_LONG_WORD_WEIGHT * SCORE_MAX +
      starterDiversity * CREATIVITY_STARTER_DIVERSITY_WEIGHT * SCORE_MAX,
    SCORE_MAX
  );
};

const calculateCompleteness = (content: string): number => {
  const wordCount = content.split(WORD_SPLIT_REGEX).length;
  const sentences = content.split(SENTENCE_DELIMITER_REGEX).filter(Boolean);
  const avgWordsPerSentence = wordCount / Math.max(sentences.length, 1);

  let score = 0;
  if (SENTENCE_END_REGEX.test(content.trim())) {
    score += SENTENCE_END_BONUS;
  }

  if (wordCount >= WORD_COUNT_THRESHOLD) {
    score += SENTENCE_END_BONUS;
  } else if (wordCount >= SHORT_CONTENT_THRESHOLD) {
    score += (wordCount / WORD_COUNT_THRESHOLD) * SENTENCE_END_BONUS;
  }

  if (
    avgWordsPerSentence >= IDEAL_WORDS_PER_SENTENCE.min &&
    avgWordsPerSentence <= IDEAL_WORDS_PER_SENTENCE.max
  ) {
    score += SENTENCE_END_BONUS;
  } else if (avgWordsPerSentence >= MIN_ACCEPTABLE_WORDS_PER_SENTENCE) {
    score += PARTIAL_SCORE_BONUS;
  }

  const lastSentence =
    sentences.at(-1)?.trim().split(WORD_SPLIT_REGEX).length || 0;
  if (lastSentence >= MIN_WORDS_IN_LAST_SENTENCE_FOR_FULL_SCORE) {
    score += SENTENCE_END_BONUS;
  } else if (lastSentence >= MIN_WORDS_IN_LAST_SENTENCE_FOR_PARTIAL_SCORE) {
    score += PARTIAL_SCORE_BONUS;
  }

  return Math.min(score, SCORE_MAX);
};

const countSyllables = (string: string): number => {
  const word = string.toLowerCase();
  if (word.length <= SHORT_WORD_LENGTH_THRESHOLD) {
    return MIN_SYLLABLES;
  }

  let count = 0;
  let prevVowel = false;

  for (const char of word) {
    const isVowel = VOWELS.includes(char);
    if (isVowel && !prevVowel) {
      count++;
    }
    prevVowel = isVowel;
  }
  if (word.endsWith("e")) {
    count--;
  }
  return Math.max(count, MIN_SYLLABLES);
};

const calculateReadability = (content: string): number => {
  const sentences = content.split(SENTENCE_DELIMITER_REGEX).filter(Boolean);
  const words = content.split(WORD_SPLIT_REGEX).filter(Boolean);
  const syllables = words.reduce((sum, word) => sum + countSyllables(word), 0);

  if (!(sentences.length && words.length)) {
    return SCORE_MIN;
  }

  const flesch =
    FLESCH_BASE_SCORE -
    FLESCH_WORDS_PER_SENTENCE_WEIGHT * (words.length / sentences.length) -
    FLESCH_SYLLABLES_PER_WORD_WEIGHT * (syllables / words.length);

  return normalize(flesch, SCORE_MIN, SCORE_MAX);
};

const calculateSentimentBalance = (content: string): number => {
  const { score } = sentiment.analyze(content);
  const normalized =
    SENTIMENT_NORMALIZATION_BASE +
    (score / Math.max(Math.abs(score), 10)) * SENTIMENT_NORMALIZATION_BASE;
  return SCORE_MAX - Math.abs(SENTIMENT_NORMALIZATION_BASE - normalized);
};

const calculateInformationDensity = (content: string): number => {
  const tokens = tokenizer.tokenize(content.toLowerCase());
  if (!tokens.length) {
    return SCORE_MIN;
  }
  const contentWords = tokens.filter((token) => !STOP_WORDS.has(token));
  const ratio = contentWords.length / tokens.length;
  return normalize(ratio, 0, 1);
};

export const computeQualityMetrics = (
  prompt: string,
  content: string
): QualityMetrics => {
  const coherence = calculateCoherence(content);
  const relevance = calculateRelevance(prompt, content);
  const creativity = calculateCreativity(content);
  const completeness = calculateCompleteness(content);
  const readability = calculateReadability(content);
  const sentimentBalance = calculateSentimentBalance(content);
  const informationDensity = calculateInformationDensity(content);

  const overallScore =
    coherence * METRIC_WEIGHTS.coherence +
    relevance * METRIC_WEIGHTS.relevance +
    creativity * METRIC_WEIGHTS.creativity +
    completeness * METRIC_WEIGHTS.completeness +
    readability * METRIC_WEIGHTS.readability +
    sentimentBalance * METRIC_WEIGHTS.sentimentBalance +
    informationDensity * METRIC_WEIGHTS.informationDensity;

  return {
    coherence,
    relevance,
    creativity,
    completeness,
    readability,
    sentimentBalance,
    informationDensity,
    overallScore: Math.round(overallScore * HUNDRED) / HUNDRED,
  };
};
