-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "fundInvestmentId" TEXT;

-- CreateTable
CREATE TABLE "FundInvestment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "rate" DOUBLE PRECISION NOT NULL,
    "rateType" TEXT NOT NULL,
    "minimumInvestment" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FundInvestment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_fundInvestmentId_fkey" FOREIGN KEY ("fundInvestmentId") REFERENCES "FundInvestment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
