/*
  Warnings:

  - You are about to drop the column `downvotes` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `upvotes` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `downvotes` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `upvotes` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the `AnswerVote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuestionVote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AnswerVote" DROP CONSTRAINT "AnswerVote_answerId_fkey";

-- DropForeignKey
ALTER TABLE "AnswerVote" DROP CONSTRAINT "AnswerVote_userId_fkey";

-- DropForeignKey
ALTER TABLE "QuestionVote" DROP CONSTRAINT "QuestionVote_questionId_fkey";

-- DropForeignKey
ALTER TABLE "QuestionVote" DROP CONSTRAINT "QuestionVote_userId_fkey";

-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "downvotes",
DROP COLUMN "upvotes";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "downvotes",
DROP COLUMN "upvotes";

-- DropTable
DROP TABLE "AnswerVote";

-- DropTable
DROP TABLE "QuestionVote";
