/*
  Warnings:

  - You are about to drop the column `frequencyPenalty` on the `response` table. All the data in the column will be lost.
  - You are about to drop the column `maxTokens` on the `response` table. All the data in the column will be lost.
  - You are about to drop the column `presencePenalty` on the `response` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,modelId,prompt]` on the table `experiment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `maxCompletionTokens` to the `response` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."experiment_name_idx";

-- DropIndex
DROP INDEX "public"."experiment_tags_idx";

-- DropIndex
DROP INDEX "public"."experiment_userId_prompt_key";

-- AlterTable
ALTER TABLE "response" DROP COLUMN "frequencyPenalty",
DROP COLUMN "maxTokens",
DROP COLUMN "presencePenalty",
ADD COLUMN     "maxCompletionTokens" BIGINT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "experiment_userId_modelId_prompt_key" ON "experiment"("userId", "modelId", "prompt");
