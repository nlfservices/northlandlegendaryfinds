CREATE TABLE `article_votes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`articleId` int NOT NULL,
	`reaction` varchar(32) NOT NULL,
	`visitorId` varchar(128) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `article_votes_id` PRIMARY KEY(`id`)
);
