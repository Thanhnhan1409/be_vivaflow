-- DropForeignKey
ALTER TABLE `track` DROP FOREIGN KEY `track_audioId_fkey`;

-- AlterTable
ALTER TABLE `track` MODIFY `audioId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `track` ADD CONSTRAINT `track_audioId_fkey` FOREIGN KEY (`audioId`) REFERENCES `audio`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
