/*
  Warnings:

  - Added the required column `modelMetadata` to the `experiment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "experiment" ADD COLUMN     "modelMetadata" JSONB NOT NULL;
