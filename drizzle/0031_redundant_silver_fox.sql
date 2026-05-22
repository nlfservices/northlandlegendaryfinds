CREATE TABLE `social_post_drafts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`articleId` int NOT NULL,
	`fbPostContent` text,
	`igCaption` text,
	`firstComment` text,
	`generatedImageUrl` text,
	`imagePrompt` text,
	`tone` varchar(50) DEFAULT 'hype',
	`socialPostStatus` enum('draft','ready','published','failed') NOT NULL DEFAULT 'draft',
	`fbPostId` varchar(255),
	`igMediaId` varchar(255),
	`fbCommentId` varchar(255),
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `social_post_drafts_id` PRIMARY KEY(`id`)
);
