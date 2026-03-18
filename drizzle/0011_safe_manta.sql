CREATE TABLE `activity_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`userEmail` varchar(320) NOT NULL,
	`userName` varchar(255) NOT NULL,
	`action` varchar(100) NOT NULL,
	`details` text,
	`ipAddress` varchar(45),
	`userAgent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activity_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('free','subscriber','admin') NOT NULL DEFAULT 'free';--> statement-breakpoint
ALTER TABLE `users` ADD `isActive` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `sessionToken` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD `rememberMe` boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX `activity_logs_userId_idx` ON `activity_logs` (`userId`);--> statement-breakpoint
CREATE INDEX `activity_logs_action_idx` ON `activity_logs` (`action`);--> statement-breakpoint
CREATE INDEX `activity_logs_createdAt_idx` ON `activity_logs` (`createdAt`);