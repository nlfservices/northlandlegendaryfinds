CREATE TABLE `article_poll_votes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pollId` int NOT NULL,
	`optionIndex` int NOT NULL,
	`visitorId` varchar(128) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `article_poll_votes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `article_polls` (
	`id` int AUTO_INCREMENT NOT NULL,
	`articleSlug` varchar(255) NOT NULL,
	`question` varchar(512) NOT NULL,
	`options` json NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `article_polls_id` PRIMARY KEY(`id`)
);
