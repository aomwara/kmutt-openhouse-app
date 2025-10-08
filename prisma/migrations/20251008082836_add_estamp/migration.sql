/*
  Warnings:

  - You are about to drop the column `created_by` on the `Staffs` table. All the data in the column will be lost.
  - Added the required column `create_by` to the `Staffs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Staffs` DROP FOREIGN KEY `Staffs_created_by_fkey`;

-- DropIndex
DROP INDEX `Staffs_created_by_fkey` ON `Staffs`;

-- AlterTable
ALTER TABLE `Staffs` DROP COLUMN `created_by`,
    ADD COLUMN `create_by` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `EStamp` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `activityId` INTEGER NOT NULL,
    `issued_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `rating` INTEGER NULL,
    `feedback` VARCHAR(1000) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Staffs` ADD CONSTRAINT `Staffs_create_by_fkey` FOREIGN KEY (`create_by`) REFERENCES `Admins`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EStamp` ADD CONSTRAINT `EStamp_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Students`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EStamp` ADD CONSTRAINT `EStamp_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `Activities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
