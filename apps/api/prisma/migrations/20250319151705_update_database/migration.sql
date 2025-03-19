/*
  Warnings:

  - You are about to drop the column `cvPath` on the `subsdata` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `subsdata` DROP COLUMN `cvPath`,
    ADD COLUMN `cvId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `cvData` (
    `id` VARCHAR(191) NOT NULL,
    `cvPath` VARCHAR(191) NOT NULL,
    `accountId` VARCHAR(191) NOT NULL,
    `uploadedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SubsData` ADD CONSTRAINT `SubsData_cvId_fkey` FOREIGN KEY (`cvId`) REFERENCES `cvData`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cvData` ADD CONSTRAINT `cvData_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `Account`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
