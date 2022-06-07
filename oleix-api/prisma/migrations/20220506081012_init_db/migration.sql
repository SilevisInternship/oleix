-- CreateTable
CREATE TABLE "Advert" (
    "advertId" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "description" VARCHAR(5000) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Advert_pkey" PRIMARY KEY ("advertId")
);
