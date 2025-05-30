/*
  Warnings:

  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CommentLikes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "_CommentLikes" DROP CONSTRAINT "_CommentLikes_A_fkey";

-- DropForeignKey
ALTER TABLE "_CommentLikes" DROP CONSTRAINT "_CommentLikes_B_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "replyToId" TEXT;

-- DropTable
DROP TABLE "Comment";

-- DropTable
DROP TABLE "_CommentLikes";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
