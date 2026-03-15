CREATE TABLE `character_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`characterName` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`setId` int,
	`historyMarkdown` text,
	`metaDescription` varchar(320),
	`keyFacts` json,
	`isApproved` boolean NOT NULL DEFAULT false,
	`status` enum('pending','generating','generated','approved','error') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `character_content_id` PRIMARY KEY(`id`)
);
