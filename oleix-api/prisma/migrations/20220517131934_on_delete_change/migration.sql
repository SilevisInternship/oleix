-- DropForeignKey
ALTER TABLE "ImageOnAdvert" DROP CONSTRAINT "ImageOnAdvert_advertId_fkey";

-- DropForeignKey
ALTER TABLE "ImageOnAdvert" DROP CONSTRAINT "ImageOnAdvert_imageId_fkey";

-- AddForeignKey
ALTER TABLE "ImageOnAdvert" ADD CONSTRAINT "ImageOnAdvert_advertId_fkey" FOREIGN KEY ("advertId") REFERENCES "Advert"("advertId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageOnAdvert" ADD CONSTRAINT "ImageOnAdvert_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("imageId") ON DELETE CASCADE ON UPDATE CASCADE;
