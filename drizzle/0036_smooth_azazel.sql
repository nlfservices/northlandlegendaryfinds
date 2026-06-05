CREATE TABLE `fb_monitored_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fbPostId` varchar(255) NOT NULL,
	`articleSlug` varchar(500),
	`postSummary` text,
	`active` boolean NOT NULL DEFAULT true,
	`lastPolledAt` timestamp,
	`commentCount` int NOT NULL DEFAULT 0,
	`replyCount` int NOT NULL DEFAULT 0,
	`publishedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `fb_monitored_posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `fb_monitored_posts_fbPostId_unique` UNIQUE(`fbPostId`)
);
