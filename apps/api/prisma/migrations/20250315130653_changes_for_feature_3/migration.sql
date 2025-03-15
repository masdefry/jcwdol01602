/*
  Warnings:

  - A unique constraint covering the columns `[workerId]` on the table `CompReview` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[accountId]` on the table `SubsData` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[subsDataid]` on the table `UserProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `CompReview_workerId_key` ON `CompReview`(`workerId`);

-- CreateIndex
CREATE UNIQUE INDEX `SubsData_accountId_key` ON `SubsData`(`accountId`);

-- CreateIndex
CREATE UNIQUE INDEX `UserProfile_subsDataid_key` ON `UserProfile`(`subsDataid`);
