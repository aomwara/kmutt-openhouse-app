/*
  Warnings:

  - Made the column `uuid` on table `Students` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Students` MODIFY `uuid` VARCHAR(191) NOT NULL;
