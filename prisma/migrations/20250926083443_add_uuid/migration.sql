/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Students` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Students` ADD COLUMN `uuid` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Students_uuid_key` ON `Students`(`uuid`);
