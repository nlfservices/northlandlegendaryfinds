CREATE TABLE `bot_reply_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fbPostId` varchar(255) NOT NULL,
	`fbCommentId` varchar(255) NOT NULL,
	`commenterName` varchar(255),
	`commentText` text NOT NULL,
	`botReply` text,
	`sent` boolean NOT NULL DEFAULT false,
	`replyCommentId` varchar(255),
	`skipReason` text,
	`repliedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bot_reply_log_id` PRIMARY KEY(`id`),
	CONSTRAINT `bot_reply_log_fbCommentId_unique` UNIQUE(`fbCommentId`)
);
--> statement-breakpoint
CREATE TABLE `bot_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`enabled` boolean NOT NULL DEFAULT false,
	`replyMode` enum('auto','review') NOT NULL DEFAULT 'review',
	`replyDelayMs` int NOT NULL DEFAULT 30000,
	`personalityPrompt` text,
	`maxReplyLength` int NOT NULL DEFAULT 280,
	`replyWindowDays` int NOT NULL DEFAULT 7,
	`lastIndexedAt` timestamp,
	`indexerTaskUid` varchar(65),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bot_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `site_content_index` (
	`id` int AUTO_INCREMENT NOT NULL,
	`articleSlug` varchar(255) NOT NULL,
	`title` varchar(512) NOT NULL,
	`bodyText` text,
	`summary` text,
	`tags` json,
	`relatedCharacters` json,
	`category` varchar(100),
	`template` varchar(50),
	`publishedAt` timestamp,
	`indexedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_content_index_id` PRIMARY KEY(`id`),
	CONSTRAINT `site_content_index_articleSlug_unique` UNIQUE(`articleSlug`)
);
