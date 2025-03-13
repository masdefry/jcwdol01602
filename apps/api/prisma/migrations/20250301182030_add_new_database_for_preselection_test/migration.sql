/*
  Warnings:

  - You are about to drop the column `education` on the `applicant` table. All the data in the column will be lost.
  - You are about to drop the column `logo` on the `company` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[accountId]` on the table `Company` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `company` DROP FOREIGN KEY `Company_accountId_fkey`;

-- AlterTable
ALTER TABLE `applicant` DROP COLUMN `education`;

-- AlterTable
ALTER TABLE `company` DROP COLUMN `logo`,
    ADD COLUMN `website` VARCHAR(191) NULL,
    MODIFY `description` VARCHAR(300) NULL;

-- AlterTable
ALTER TABLE `job` MODIFY `isPublished` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `useredu` MODIFY `description` VARCHAR(300) NULL;

-- CreateTable
CREATE TABLE `Worker` (
    `id` VARCHAR(191) NOT NULL,
    `subsDataId` VARCHAR(191) NOT NULL,
    `companyId` VARCHAR(191) NULL,
    `companyName` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NULL,
    `description` VARCHAR(300) NULL,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CompReview` (
    `id` VARCHAR(191) NOT NULL,
    `companyId` VARCHAR(191) NOT NULL,
    `workerId` VARCHAR(191) NOT NULL,
    `salary` INTEGER NULL,
    `culture` INTEGER NULL,
    `wlb` INTEGER NULL,
    `facility` INTEGER NULL,
    `career` INTEGER NULL,
    `description` VARCHAR(300) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PreSelectionTest` (
    `id` VARCHAR(191) NOT NULL,
    `jobId` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PreSelectionTest_jobId_key`(`jobId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PreSelectionQuestion` (
    `id` VARCHAR(191) NOT NULL,
    `testId` VARCHAR(191) NOT NULL,
    `question` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `option_a` VARCHAR(191) NOT NULL,
    `option_b` VARCHAR(191) NOT NULL,
    `option_c` VARCHAR(191) NOT NULL,
    `option_d` VARCHAR(191) NOT NULL,
    `answer` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PreSelectionTestResult` (
    `id` VARCHAR(191) NOT NULL,
    `applicantId` VARCHAR(191) NOT NULL,
    `testId` VARCHAR(191) NOT NULL,
    `score` INTEGER NOT NULL,
    `total` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PreSelectionAnswer` (
    `id` VARCHAR(191) NOT NULL,
    `testResultId` VARCHAR(191) NOT NULL,
    `questionId` VARCHAR(191) NOT NULL,
    `selectedOption` VARCHAR(191) NOT NULL,
    `isCorrect` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Company_accountId_key` ON `Company`(`accountId`);

-- AddForeignKey
ALTER TABLE `Company` ADD CONSTRAINT `Company_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `Account`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Worker` ADD CONSTRAINT `Worker_subsDataId_fkey` FOREIGN KEY (`subsDataId`) REFERENCES `SubsData`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Worker` ADD CONSTRAINT `Worker_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompReview` ADD CONSTRAINT `CompReview_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompReview` ADD CONSTRAINT `CompReview_workerId_fkey` FOREIGN KEY (`workerId`) REFERENCES `Worker`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PreSelectionTest` ADD CONSTRAINT `PreSelectionTest_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PreSelectionQuestion` ADD CONSTRAINT `PreSelectionQuestion_testId_fkey` FOREIGN KEY (`testId`) REFERENCES `PreSelectionTest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PreSelectionTestResult` ADD CONSTRAINT `PreSelectionTestResult_applicantId_fkey` FOREIGN KEY (`applicantId`) REFERENCES `Applicant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PreSelectionTestResult` ADD CONSTRAINT `PreSelectionTestResult_testId_fkey` FOREIGN KEY (`testId`) REFERENCES `PreSelectionTest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PreSelectionAnswer` ADD CONSTRAINT `PreSelectionAnswer_testResultId_fkey` FOREIGN KEY (`testResultId`) REFERENCES `PreSelectionTestResult`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PreSelectionAnswer` ADD CONSTRAINT `PreSelectionAnswer_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `PreSelectionQuestion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
