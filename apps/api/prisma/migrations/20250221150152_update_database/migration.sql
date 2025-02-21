/*
  Warnings:

  - You are about to drop the column `roleId` on the `account` table. All the data in the column will be lost.
  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `role` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subsCtgId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `account` DROP FOREIGN KEY `Account_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_subsDataId_fkey`;

-- AlterTable
ALTER TABLE `account` DROP COLUMN `roleId`,
    ADD COLUMN `role` ENUM('admin', 'developer', 'user') NOT NULL;

-- AlterTable
ALTER TABLE `payment` ADD COLUMN `approvalById` VARCHAR(191) NULL,
    ADD COLUMN `subsCtgId` VARCHAR(191) NOT NULL,
    MODIFY `isApproved` BOOLEAN NULL;

-- DropTable
DROP TABLE `role`;

-- CreateTable
CREATE TABLE `Skill` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Skill_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SkillQuestion` (
    `id` VARCHAR(191) NOT NULL,
    `skillId` VARCHAR(191) NOT NULL,
    `question` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `option_a` VARCHAR(191) NOT NULL,
    `option_b` VARCHAR(191) NOT NULL,
    `option_c` VARCHAR(191) NOT NULL,
    `option_d` VARCHAR(191) NOT NULL,
    `answer` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SkillScore` (
    `id` VARCHAR(191) NOT NULL,
    `subsDataId` VARCHAR(191) NOT NULL,
    `skillId` VARCHAR(191) NOT NULL,
    `score` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_subsDataId_fkey` FOREIGN KEY (`subsDataId`) REFERENCES `SubsData`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_subsCtgId_fkey` FOREIGN KEY (`subsCtgId`) REFERENCES `SubsCtg`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SkillQuestion` ADD CONSTRAINT `SkillQuestion_skillId_fkey` FOREIGN KEY (`skillId`) REFERENCES `Skill`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SkillScore` ADD CONSTRAINT `SkillScore_subsDataId_fkey` FOREIGN KEY (`subsDataId`) REFERENCES `SubsData`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SkillScore` ADD CONSTRAINT `SkillScore_skillId_fkey` FOREIGN KEY (`skillId`) REFERENCES `Skill`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
