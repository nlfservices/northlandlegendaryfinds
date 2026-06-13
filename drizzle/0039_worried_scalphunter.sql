CREATE TABLE `user_invites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`role` enum('owner','super_admin','admin','subscriber','user') NOT NULL DEFAULT 'user',
	`token` varchar(64) NOT NULL,
	`invitedByUserId` int,
	`message` text,
	`accepted` boolean NOT NULL DEFAULT false,
	`acceptedAt` timestamp,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_invites_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_invites_token_unique` UNIQUE(`token`)
);
