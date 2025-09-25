-- AlterTable
ALTER TABLE `Activities` ADD COLUMN `ownerId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Activities` ADD CONSTRAINT `Activities_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `Admins`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
