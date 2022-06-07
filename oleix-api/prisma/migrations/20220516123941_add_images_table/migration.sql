-- CreateTable
CREATE TABLE "ImageOnAdvert" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "advertId" VARCHAR(36) NOT NULL,
    "imageId" VARCHAR(36) NOT NULL,

    CONSTRAINT "ImageOnAdvert_pkey" PRIMARY KEY ("advertId","imageId")
);

-- CreateTable
CREATE TABLE "Image" (
    "imageId" TEXT NOT NULL,
    "mimetype" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("imageId")
);

-- AddForeignKey
ALTER TABLE "ImageOnAdvert" ADD CONSTRAINT "ImageOnAdvert_advertId_fkey" FOREIGN KEY ("advertId") REFERENCES "Advert"("advertId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageOnAdvert" ADD CONSTRAINT "ImageOnAdvert_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("imageId") ON DELETE RESTRICT ON UPDATE CASCADE;
