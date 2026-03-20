CREATE TABLE `matrix_attempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ipAddress` varchar(45) NOT NULL,
	`failedAttempts` int NOT NULL DEFAULT 0,
	`lockedUntil` timestamp,
	`lastAttemptAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `matrix_attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `matrix_bypass_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`token` varchar(64) NOT NULL,
	`requestedByIp` varchar(45) NOT NULL,
	`isUsed` boolean NOT NULL DEFAULT false,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `matrix_bypass_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `matrix_bypass_tokens_token_unique` UNIQUE(`token`)
);
