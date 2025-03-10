/*
  Warnings:

  - You are about to alter the column `category` on the `job` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(3))`.
  - You are about to alter the column `location` on the `job` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(4))`.

*/
-- AlterTable
ALTER TABLE `job` MODIFY `category` ENUM('IT', 'education', 'HR', 'finance', 'healthcare', 'sales', 'design') NOT NULL,
    MODIFY `location` ENUM('Jakarta', 'Bandung', 'Surabaya', 'Bali', 'Remote') NOT NULL;
