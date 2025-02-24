/*
  Warnings:

  - You are about to drop the column `address` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `birthDate` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `education` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `account` table. All the data in the column will be lost.
  - You are about to alter the column `roleId` on the `account` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `role` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the `subscriptioncat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `avatar` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isPublished` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `account` DROP FOREIGN KEY `Account_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_accountId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_subscriptionCatId_fkey`;

-- AlterTable
ALTER TABLE `account` DROP COLUMN `address`,
    DROP COLUMN `birthDate`,
    DROP COLUMN `education`,
    DROP COLUMN `gender`,
    DROP COLUMN `phoneNumber`,
    DROP COLUMN `profilePicture`,
    ADD COLUMN `avatar` VARCHAR(191) NOT NULL,
    MODIFY `roleId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `job` ADD COLUMN `deadline` DATETIME(3) NULL,
    ADD COLUMN `isPublished` BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE `role` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `subscriptioncat`;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `samples` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `samples_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Profile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `accountId` VARCHAR(191) NOT NULL,
    `gender` ENUM('MALE', 'FEMALE') NULL,
    `birthDate` DATETIME(3) NULL,
    `education` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubsCtg` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL DEFAULT 0,
    `cvGenerator` BOOLEAN NOT NULL DEFAULT false,
    `skillAssessment` BOOLEAN NOT NULL DEFAULT false,
    `priority` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubsData` (
    `id` VARCHAR(191) NOT NULL,
    `accountId` VARCHAR(191) NOT NULL,
    `subsCtgId` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NULL,
    `endDate` DATETIME(3) NULL,
    `isSubActive` BOOLEAN NOT NULL DEFAULT false,
    `cvPath` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `id` VARCHAR(191) NOT NULL,
    `accountId` VARCHAR(191) NOT NULL,
    `companyId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Applicant` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `jobId` VARCHAR(191) NOT NULL,
    `appliedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expectedSalary` INTEGER NULL,
    `education` VARCHAR(191) NULL,
    `cvFile` VARCHAR(191) NULL,

    UNIQUE INDEX `Applicant_userId_jobId_key`(`userId`, `jobId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` VARCHAR(191) NOT NULL,
    `subsDataId` VARCHAR(191) NOT NULL,
    `method` ENUM('transfer', 'midtrans') NULL,
    `proof` VARCHAR(191) NULL,
    `isApproved` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `Account`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubsData` ADD CONSTRAINT `SubsData_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `Account`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubsData` ADD CONSTRAINT `SubsData_subsCtgId_fkey` FOREIGN KEY (`subsCtgId`) REFERENCES `SubsCtg`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Admin` ADD CONSTRAINT `Admin_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `Account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Admin` ADD CONSTRAINT `Admin_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Applicant` ADD CONSTRAINT `Applicant_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `SubsData`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Applicant` ADD CONSTRAINT `Applicant_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_subsDataId_fkey` FOREIGN KEY (`subsDataId`) REFERENCES `SubsData`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
