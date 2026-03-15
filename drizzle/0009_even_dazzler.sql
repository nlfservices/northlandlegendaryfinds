CREATE TABLE `card_detail_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cardId` int NOT NULL,
	`setSlug` varchar(255) NOT NULL,
	`cardNumber` varchar(50) NOT NULL,
	`contentMarkdown` text,
	`metaDescription` varchar(320),
	`status` enum('pending','generating','generated','error') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `card_detail_content_id` PRIMARY KEY(`id`)
);
