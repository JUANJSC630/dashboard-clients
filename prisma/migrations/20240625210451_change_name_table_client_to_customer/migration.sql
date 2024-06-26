/*
  Warnings:

  - You are about to drop the column `clientId` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `clientId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[customerId]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `customerId` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Invoice_clientId_idx";

-- DropIndex
DROP INDEX "Invoice_clientId_key";

-- DropIndex
DROP INDEX "Project_clientId_idx";

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "clientId",
ADD COLUMN     "customerId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "clientId",
ADD COLUMN     "customerId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Client";

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "registrationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE INDEX "Customer_email_idx" ON "Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_customerId_key" ON "Invoice"("customerId");

-- CreateIndex
CREATE INDEX "Invoice_customerId_idx" ON "Invoice"("customerId");

-- CreateIndex
CREATE INDEX "Project_customerId_idx" ON "Project"("customerId");
