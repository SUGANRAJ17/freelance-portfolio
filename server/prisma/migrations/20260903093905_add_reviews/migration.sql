-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientRole" TEXT,
    "rating" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "projectId" INTEGER,
    "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);
