CREATE TABLE `api_keys` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`keyHash` varchar(128) NOT NULL,
	`keyPrefix` varchar(20) NOT NULL,
	`permissions` varchar(500) NOT NULL DEFAULT 'cards:read',
	`active` boolean NOT NULL DEFAULT true,
	`expiresAt` timestamp,
	`requestCount` int NOT NULL DEFAULT 0,
	`lastUsedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `api_keys_id` PRIMARY KEY(`id`),
	CONSTRAINT `api_keys_keyHash_unique` UNIQUE(`keyHash`)
);
--> statement-breakpoint
CREATE TABLE `api_usage_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`apiKeyId` int NOT NULL,
	`method` varchar(10) NOT NULL,
	`endpoint` varchar(200) NOT NULL,
	`statusCode` int NOT NULL,
	`responseTimeMs` int,
	`resourceId` varchar(100),
	`note` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `api_usage_logs_id` PRIMARY KEY(`id`)
);
