-- CreateTable
CREATE TABLE
    `user` (
        `id` INTEGER NOT NULL AUTO_INCREMENT,
        `username` VARCHAR(191) NOT NULL,
        `email` VARCHAR(191) NOT NULL,
        `pwdHash` VARCHAR(191) NULL,
        `pwdSalt` VARCHAR(191) NULL,
        `avatarImageUrl` VARCHAR(191) NULL,
        `createdAt` INTEGER NULL,
        `updatedAt` INTEGER NULL,
        UNIQUE INDEX `user_username_key` (`username`),
        PRIMARY KEY (`id`)
    ) DEFAULT CHARACTER
SET
    utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE
    `profile` (
        `id` INTEGER NOT NULL AUTO_INCREMENT,
        `userId` INTEGER NOT NULL,
        `firstName` VARCHAR(191) NULL,
        `lastName` VARCHAR(191) NULL,
        `address` VARCHAR(191) NULL,
        UNIQUE INDEX `profile_userId_key` (`userId`),
        PRIMARY KEY (`id`)
    ) DEFAULT CHARACTER
SET
    utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE
    `track` (
        `id` INTEGER NOT NULL AUTO_INCREMENT,
        `spotifyTrackId` VARCHAR(22) NULL,
        `title` VARCHAR(191) NOT NULL,
        `artistNames` VARCHAR(191) NOT NULL,
        `audioId` INTEGER NOT NULL,
        `mainArtistId` INTEGER NOT NULL,
        `albumId` INTEGER NULL,
        `listenCount` INTEGER NOT NULL DEFAULT 0,
        UNIQUE INDEX `track_spotifyTrackId_key` (`spotifyTrackId`),
        UNIQUE INDEX `track_audioId_key` (`audioId`),
        INDEX `track_spotifyTrackId_index` (`spotifyTrackId`),
        PRIMARY KEY (`id`)
    ) DEFAULT CHARACTER
SET
    utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE
    `album` (
        `id` INTEGER NOT NULL AUTO_INCREMENT,
        `title` VARCHAR(191) NOT NULL,
        `spotifyAlbumId` VARCHAR(22) NULL,
        `artistId` INTEGER NULL,
        `coverImageUrl` VARCHAR(191) NULL,
        `albumGroup` ENUM ('single', 'album', 'appears_on', 'compilation') NULL,
        `albumType` ENUM ('album', 'single', 'compilation') NULL,
        `releasedAt` INTEGER NULL,
        `createdAt` INTEGER NULL,
        `updatedAt` INTEGER NULL,
        UNIQUE INDEX `album_spotifyAlbumId_key` (`spotifyAlbumId`),
        INDEX `album_spotifyAlbumId_index` (`spotifyAlbumId`),
        PRIMARY KEY (`id`)
    ) DEFAULT CHARACTER
SET
    utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE
    `artist` (
        `id` INTEGER NOT NULL AUTO_INCREMENT,
        `spotifyArtistId` VARCHAR(22) NULL,
        `name` VARCHAR(191) NULL,
        `introduction` VARCHAR(191) NULL,
        `userId` INTEGER NOT NULL,
        `avatarImageUrl` VARCHAR(191) NULL,
        `coverImageUrl` VARCHAR(191) NULL,
        `createdAt` INTEGER NULL,
        `updatedAt` INTEGER NULL,
        UNIQUE INDEX `artist_spotifyArtistId_key` (`spotifyArtistId`),
        UNIQUE INDEX `artist_userId_key` (`userId`),
        UNIQUE INDEX `artist_avatarImageUrl_key` (`avatarImageUrl`),
        UNIQUE INDEX `artist_coverImageUrl_key` (`coverImageUrl`),
        INDEX `artist_spotifyArtistId_index` (`spotifyArtistId`),
        PRIMARY KEY (`id`)
    ) DEFAULT CHARACTER
SET
    utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE
    `playlist` (
        `id` INTEGER NOT NULL AUTO_INCREMENT,
        `name` VARCHAR(191) NULL,
        `description` VARCHAR(191) NULL,
        `ownerUserId` INTEGER NOT NULL,
        `coverImageUrl` VARCHAR(191) NOT NULL,
        `createdAt` INTEGER NULL,
        `updatedAt` INTEGER NULL,
        PRIMARY KEY (`id`)
    ) DEFAULT CHARACTER
SET
    utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE
    `secondary_artist_track_link` (
        `id` INTEGER NOT NULL AUTO_INCREMENT,
        `artistId` INTEGER NOT NULL,
        `trackId` INTEGER NOT NULL,
        `createdAt` INTEGER NOT NULL,
        PRIMARY KEY (`id`)
    ) DEFAULT CHARACTER
SET
    utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE
    `playlist_track_link` (
        `id` INTEGER NOT NULL AUTO_INCREMENT,
        `playlistId` INTEGER NOT NULL,
        `trackId` INTEGER NOT NULL,
        `no` INTEGER NOT NULL,
        `createdAt` INTEGER NOT NULL,
        PRIMARY KEY (`id`)
    ) DEFAULT CHARACTER
SET
    utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE
    `audio` (
        `id` INTEGER NOT NULL AUTO_INCREMENT,
        `label` VARCHAR(191) NULL,
        `path` VARCHAR(191) NULL,
        `s3ObjectKey` VARCHAR(191) NULL,
        `size` INTEGER NULL,
        `length` INTEGER NULL,
        `createdAt` INTEGER NULL,
        `updatedAt` INTEGER NULL,
        PRIMARY KEY (`id`)
    ) DEFAULT CHARACTER
SET
    utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE
    `user_listen_track` (
        `id` INTEGER NOT NULL AUTO_INCREMENT,
        `userId` INTEGER NOT NULL,
        `trackId` INTEGER NOT NULL,
        `listenCount` INTEGER NOT NULL DEFAULT 0,
        `createdAt` INTEGER NULL,
        `updatedAt` INTEGER NULL,
        UNIQUE INDEX `user_listen_track_userId_trackId_key` (`userId`, `trackId`),
        PRIMARY KEY (`id`)
    ) DEFAULT CHARACTER
SET
    utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE
    `user_listen_artist` (
        `id` INTEGER NOT NULL AUTO_INCREMENT,
        `userId` INTEGER NOT NULL,
        `artistId` INTEGER NOT NULL,
        `listenCount` INTEGER NOT NULL DEFAULT 0,
        `createdAt` INTEGER NULL,
        `updatedAt` INTEGER NULL,
        PRIMARY KEY (`id`)
    ) DEFAULT CHARACTER
SET
    utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE
    `user_favourite_track` (
        `id` INTEGER NOT NULL AUTO_INCREMENT,
        `userId` INTEGER NOT NULL,
        `trackId` INTEGER NOT NULL,
        `createdAt` INTEGER NULL,
        `updatedAt` INTEGER NULL,
        PRIMARY KEY (`id`)
    ) DEFAULT CHARACTER
SET
    utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE
    `user_listen_album` (
        `id` INTEGER NOT NULL AUTO_INCREMENT,
        `userId` INTEGER NOT NULL,
        `albumId` INTEGER NOT NULL,
        `createdAt` INTEGER NULL,
        `updatedAt` INTEGER NULL,
        PRIMARY KEY (`id`)
    ) DEFAULT CHARACTER
SET
    utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE
    `track_spotifySecondTrackId_link` (
        `id` INTEGER NOT NULL AUTO_INCREMENT,
        `trackId` INTEGER NOT NULL,
        `spotifySecondTrackId` VARCHAR(22) NOT NULL,
        PRIMARY KEY (`id`)
    ) DEFAULT CHARACTER
SET
    utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE
    `rbac_permission` (
        `uniqueName` VARCHAR(191) NOT NULL,
        `displayName` VARCHAR(191) NULL,
        `description` VARCHAR(191) NULL,
        PRIMARY KEY (`uniqueName`)
    ) DEFAULT CHARACTER
SET
    utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE
    `rbac_role` (
        `uniqueName` VARCHAR(191) NOT NULL,
        `displayName` VARCHAR(191) NULL,
        `description` VARCHAR(191) NULL,
        PRIMARY KEY (`uniqueName`)
    ) DEFAULT CHARACTER
SET
    utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE
    `rbac_role_permission_link` (
        `id` INTEGER NOT NULL AUTO_INCREMENT,
        `roleId` VARCHAR(191) NOT NULL,
        `permissionId` VARCHAR(191) NOT NULL,
        PRIMARY KEY (`id`)
    ) DEFAULT CHARACTER
SET
    utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE
    `rbac_user_role_link` (
        `id` INTEGER NOT NULL AUTO_INCREMENT,
        `userId` INTEGER NOT NULL,
        `roleId` VARCHAR(191) NOT NULL,
        PRIMARY KEY (`id`)
    ) DEFAULT CHARACTER
SET
    utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `profile` ADD CONSTRAINT `profile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `track` ADD CONSTRAINT `track_mainArtistId_fkey` FOREIGN KEY (`mainArtistId`) REFERENCES `artist` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `track` ADD CONSTRAINT `track_albumId_fkey` FOREIGN KEY (`albumId`) REFERENCES `album` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `track` ADD CONSTRAINT `track_audioId_fkey` FOREIGN KEY (`audioId`) REFERENCES `audio` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `album` ADD CONSTRAINT `album_artistId_fkey` FOREIGN KEY (`artistId`) REFERENCES `artist` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `artist` ADD CONSTRAINT `artist_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `playlist` ADD CONSTRAINT `playlist_ownerUserId_fkey` FOREIGN KEY (`ownerUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `secondary_artist_track_link` ADD CONSTRAINT `secondary_artist_track_link_artistId_fkey` FOREIGN KEY (`artistId`) REFERENCES `artist` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `secondary_artist_track_link` ADD CONSTRAINT `secondary_artist_track_link_trackId_fkey` FOREIGN KEY (`trackId`) REFERENCES `track` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `playlist_track_link` ADD CONSTRAINT `playlist_track_link_playlistId_fkey` FOREIGN KEY (`playlistId`) REFERENCES `playlist` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `playlist_track_link` ADD CONSTRAINT `playlist_track_link_trackId_fkey` FOREIGN KEY (`trackId`) REFERENCES `track` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_listen_track` ADD CONSTRAINT `user_listen_track_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_listen_track` ADD CONSTRAINT `user_listen_track_trackId_fkey` FOREIGN KEY (`trackId`) REFERENCES `track` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_listen_artist` ADD CONSTRAINT `user_listen_artist_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_listen_artist` ADD CONSTRAINT `user_listen_artist_artistId_fkey` FOREIGN KEY (`artistId`) REFERENCES `artist` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_favourite_track` ADD CONSTRAINT `user_favourite_track_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_favourite_track` ADD CONSTRAINT `user_favourite_track_trackId_fkey` FOREIGN KEY (`trackId`) REFERENCES `track` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_listen_album` ADD CONSTRAINT `user_listen_album_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_listen_album` ADD CONSTRAINT `user_listen_album_albumId_fkey` FOREIGN KEY (`albumId`) REFERENCES `album` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `track_spotifySecondTrackId_link` ADD CONSTRAINT `track_spotifySecondTrackId_link_trackId_fkey` FOREIGN KEY (`trackId`) REFERENCES `track` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rbac_role_permission_link` ADD CONSTRAINT `rbac_role_permission_link_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `rbac_role` (`uniqueName`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rbac_role_permission_link` ADD CONSTRAINT `rbac_role_permission_link_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `rbac_permission` (`uniqueName`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rbac_user_role_link` ADD CONSTRAINT `rbac_user_role_link_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rbac_user_role_link` ADD CONSTRAINT `rbac_user_role_link_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `rbac_role` (`uniqueName`) ON DELETE RESTRICT ON UPDATE CASCADE;