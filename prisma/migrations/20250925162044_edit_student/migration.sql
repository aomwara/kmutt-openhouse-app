/*
  Warnings:

  - You are about to alter the column `role` on the `Students` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `Students` ADD COLUMN `passport_id` VARCHAR(191) NULL,
    MODIFY `citizen_id` VARCHAR(191) NULL,
    MODIFY `role` ENUM('student', 'parent', 'teacher', 'guest') NOT NULL DEFAULT 'student';
