/*
  Warnings:

  - You are about to drop the column `cvFile` on the `applicant` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `applicant` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `socialMedia` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `job` table. All the data in the column will be lost.
  - You are about to drop the column `subsDataId` on the `skillscore` table. All the data in the column will be lost.
  - You are about to drop the `admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `profile` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `subsDataId` to the `Applicant` table without a default value. This is not possible if the table is not empty.
  - Made the column `logo` on table `company` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `userSkillId` to the `SkillScore` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `admin` DROP FOREIGN KEY `Admin_accountId_fkey`;

-- DropForeignKey
ALTER TABLE `admin` DROP FOREIGN KEY `Admin_companyId_fkey`;

-- DropForeignKey
ALTER TABLE `applicant` DROP FOREIGN KEY `Applicant_userId_fkey`;

-- DropForeignKey
ALTER TABLE `profile` DROP FOREIGN KEY `Profile_accountId_fkey`;

-- DropForeignKey
ALTER TABLE `skillscore` DROP FOREIGN KEY `SkillScore_subsDataId_fkey`;

-- DropIndex
DROP INDEX `Applicant_userId_jobId_key` ON `applicant`;

-- DropIndex
DROP INDEX `Company_email_key` ON `company`;

-- DropIndex
DROP INDEX `Company_name_key` ON `company`;

-- AlterTable
ALTER TABLE `applicant` DROP COLUMN `cvFile`,
    DROP COLUMN `userId`,
    ADD COLUMN `subsDataId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `company` DROP COLUMN `email`,
    DROP COLUMN `name`,
    DROP COLUMN `socialMedia`,
    DROP COLUMN `website`,
    MODIFY `address` VARCHAR(191) NULL,
    MODIFY `logo` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `job` DROP COLUMN `tags`;

-- AlterTable
ALTER TABLE `skillscore` DROP COLUMN `subsDataId`,
    ADD COLUMN `userSkillId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `admin`;

-- DropTable
DROP TABLE `profile`;

-- CreateTable
CREATE TABLE `UserProfile` (
    `id` VARCHAR(191) NOT NULL,
    `subsDataid` VARCHAR(191) NOT NULL,
    `gender` ENUM('male', 'female') NOT NULL,
    `pob` VARCHAR(191) NOT NULL,
    `dob` DATETIME(3) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserEdu` (
    `id` VARCHAR(191) NOT NULL,
    `subsDataId` VARCHAR(191) NOT NULL,
    `level` ENUM('doctorate', 'master', 'bachelor', 'highschool') NOT NULL,
    `school` VARCHAR(191) NOT NULL,
    `discipline` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InterviewSchedule` (
    `id` VARCHAR(191) NOT NULL,
    `applicantId` VARCHAR(191) NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,
    `location` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserSkill` (
    `id` VARCHAR(191) NOT NULL,
    `subsDataId` VARCHAR(191) NOT NULL,
    `skillId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserProfile` ADD CONSTRAINT `UserProfile_subsDataid_fkey` FOREIGN KEY (`subsDataid`) REFERENCES `SubsData`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserEdu` ADD CONSTRAINT `UserEdu_subsDataId_fkey` FOREIGN KEY (`subsDataId`) REFERENCES `SubsData`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Applicant` ADD CONSTRAINT `Applicant_subsDataId_fkey` FOREIGN KEY (`subsDataId`) REFERENCES `SubsData`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InterviewSchedule` ADD CONSTRAINT `InterviewSchedule_applicantId_fkey` FOREIGN KEY (`applicantId`) REFERENCES `Applicant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SkillScore` ADD CONSTRAINT `SkillScore_userSkillId_fkey` FOREIGN KEY (`userSkillId`) REFERENCES `UserSkill`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserSkill` ADD CONSTRAINT `UserSkill_subsDataId_fkey` FOREIGN KEY (`subsDataId`) REFERENCES `SubsData`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserSkill` ADD CONSTRAINT `UserSkill_skillId_fkey` FOREIGN KEY (`skillId`) REFERENCES `Skill`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
