/*
  Warnings:

  - You are about to drop the column `activity_id` on the `Staffs` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Staffs` DROP FOREIGN KEY `Staffs_activity_id_fkey`;

-- DropIndex
DROP INDEX `Staffs_activity_id_fkey` ON `Staffs`;

-- AlterTable
ALTER TABLE `Activities` MODIFY `title` VARCHAR(1000) NOT NULL,
    MODIFY `description` VARCHAR(10000) NOT NULL;

-- AlterTable
ALTER TABLE `Staffs` DROP COLUMN `activity_id`;

-- CreateTable
CREATE TABLE `StaffMapping` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `staffId` INTEGER NOT NULL,
    `activityId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `StaffMapping_staffId_activityId_key`(`staffId`, `activityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StaffMapping` ADD CONSTRAINT `StaffMapping_staffId_fkey` FOREIGN KEY (`staffId`) REFERENCES `Staffs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StaffMapping` ADD CONSTRAINT `StaffMapping_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `Activities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
