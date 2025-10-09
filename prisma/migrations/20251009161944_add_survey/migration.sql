-- CreateTable
CREATE TABLE `PublicSurvey` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `participantType` VARCHAR(191) NOT NULL,
    `educationLevel` VARCHAR(191) NULL,
    `interestLevel` VARCHAR(191) NULL,
    `preferredFaculty` JSON NULL,
    `infoChannels` JSON NULL,
    `factors` JSON NULL,
    `creditTransferInterest` INTEGER NULL,
    `teachingMode` VARCHAR(191) NULL,
    `confusionRanking` JSON NULL,
    `interestKMUTT` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
