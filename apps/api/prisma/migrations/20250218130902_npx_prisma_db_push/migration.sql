/*
  Warnings:

  - Added the required column `tags` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `applicant` ADD COLUMN `status` ENUM('PENDING', 'INTERVIEW', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `job` ADD COLUMN `tags` VARCHAR(191) NOT NULL;
