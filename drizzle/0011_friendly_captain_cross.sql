CREATE TABLE `articles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(500) NOT NULL,
	`slug` varchar(500) NOT NULL,
	`excerpt` text,
	`contentMarkdown` text NOT NULL,
	`featuredImageUrl` text,
	`category` enum('movie_news','show_news','casting','card_market','release_dates','rumors','analysis') NOT NULL DEFAULT 'movie_news',
	`tags` json,
	`cardMarketImpact` text,
	`relatedCharacters` json,
	`sources` json,
	`isFeatured` boolean NOT NULL DEFAULT false,
	`isPublished` boolean NOT NULL DEFAULT false,
	`authorName` varchar(255) DEFAULT 'NLF Team',
	`publishedAt` bigint,
	`metaDescription` varchar(320),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `articles_id` PRIMARY KEY(`id`),
	CONSTRAINT `articles_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
DROP TABLE `activity_logs`;--> statement-breakpoint
DROP TABLE `show_submissions`;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','subscriber') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `isActive`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `sessionToken`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `rememberMe`;