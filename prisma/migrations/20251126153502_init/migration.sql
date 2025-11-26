-- CreateTable
CREATE TABLE `SITCert` (
    `studentId` INTEGER NOT NULL,
    `certName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`studentId`, `certName`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SITCert` ADD CONSTRAINT `SITCert_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Students`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
