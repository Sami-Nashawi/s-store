/*
  Warnings:

  - You are about to drop the column `note` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "note";

-- AlterTable
ALTER TABLE "Material" ADD COLUMN     "notes" TEXT;
