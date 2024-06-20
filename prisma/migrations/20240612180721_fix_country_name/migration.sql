/*
  Warnings:

  - You are about to drop the column `cuntry` on the `Company` table. All the data in the column will be lost.
  - Added the required column `country` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "cuntry",
ADD COLUMN     "country" TEXT NOT NULL;
