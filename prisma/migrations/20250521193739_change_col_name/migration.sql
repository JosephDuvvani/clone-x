/*
  Warnings:

  - You are about to drop the column `content` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Post` table. All the data in the column will be lost.
  - Added the required column `body` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `body` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "content",
ADD COLUMN     "body" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "content",
ADD COLUMN     "body" JSONB NOT NULL;
