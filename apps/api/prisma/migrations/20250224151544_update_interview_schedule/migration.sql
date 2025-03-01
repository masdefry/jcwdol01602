/*
  Warnings:

  - You are about to alter the column `status` on the `applicant` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(3))` to `Enum(EnumId(3))`.

*/
-- AlterTable
ALTER TABLE `applicant` MODIFY `status` ENUM('pending', 'interview', 'accepted', 'rejected') NOT NULL DEFAULT 'pending';
