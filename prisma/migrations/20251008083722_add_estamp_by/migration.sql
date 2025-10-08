/*
  Warnings:

  - Added the required column `stampBy` to the `EStamp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `EStamp` ADD COLUMN `stampBy` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `EStamp` ADD CONSTRAINT `EStamp_stampBy_fkey` FOREIGN KEY (`stampBy`) REFERENCES `Staffs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
