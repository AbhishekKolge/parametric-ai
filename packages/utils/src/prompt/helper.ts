import { HUNDRED } from "../common/const";
import { getPercentage } from "../common/helper";
import {
  CHARS_PER_TOKEN,
  EXPECTED_OUTPUT_TOKENS_DEFAULT,
  SAFE_TOKEN_UTILIZATION_PERCENTAGE,
  SAFETY_MARGIN,
  WARNING_TOKEN_UTILIZATION_PERCENTAGE,
} from "./const";

export const getPromptLimits = ({
  contextWindow,
  expectedOutputTokens,
}: {
  contextWindow: number;
  expectedOutputTokens: number;
}) => {
  const availableTokens = contextWindow - expectedOutputTokens;
  const safeTokens = Math.floor(availableTokens * SAFETY_MARGIN);

  return {
    maxPromptTokens: safeTokens,
    maxPromptCharacters: Math.floor(safeTokens * CHARS_PER_TOKEN),
  };
};

export const estimateTokenCount = (text: string): number => {
  if (!text) {
    return 0;
  }

  return Math.ceil(text.length / CHARS_PER_TOKEN);
};

export const validatePrompt = ({
  prompt,
  contextWindow,
  expectedOutputTokens = EXPECTED_OUTPUT_TOKENS_DEFAULT,
}: {
  prompt: string;
  contextWindow: number;
  expectedOutputTokens?: number;
}): {
  estimatedTokens: number;
  maxPromptTokens: number;
  maxPromptCharacters: number;
  isWithinLimit: boolean;
  utilizationPercentage: number;
  remainingTokens: number;
  remainingCharacters: number;
} => {
  const limits = getPromptLimits({ contextWindow, expectedOutputTokens });
  const estimatedTokens = estimateTokenCount(prompt);
  const isWithinLimit = estimatedTokens <= limits.maxPromptTokens;
  const utilizationPercentage = getPercentage({
    part: estimatedTokens,
    total: limits.maxPromptTokens,
  });

  const remainingTokens = limits.maxPromptTokens - estimatedTokens;
  const remainingCharacters = limits.maxPromptCharacters - prompt.length;

  return {
    estimatedTokens,
    maxPromptTokens: limits.maxPromptTokens,
    maxPromptCharacters: limits.maxPromptCharacters,
    isWithinLimit,
    utilizationPercentage: Math.min(utilizationPercentage, HUNDRED),
    remainingTokens: Math.max(remainingTokens, 0),
    remainingCharacters: Math.max(remainingCharacters, 0),
  };
};

export const formatTokenDisplay = (count: number): string =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(count);

export const getTokenUtilizationLevel = (
  percentage: number
): "safe" | "warning" | "danger" => {
  if (percentage < SAFE_TOKEN_UTILIZATION_PERCENTAGE) {
    return "safe";
  }
  if (percentage < WARNING_TOKEN_UTILIZATION_PERCENTAGE) {
    return "warning";
  }
  return "danger";
};
