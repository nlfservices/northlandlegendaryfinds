CREATE TABLE `community_polls` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`category` enum('product','feature','set','format','other') NOT NULL DEFAULT 'product',
	`status` enum('active','closed','draft') NOT NULL DEFAULT 'draft',
	`isPinned` boolean DEFAULT false,
	`allowMultiple` boolean DEFAULT false,
	`showResults` boolean DEFAULT true,
	`endsAt` timestamp,
	`totalVotes` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `community_polls_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `community_suggestions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`displayName` varchar(100),
	`suggestion` text NOT NULL,
	`category` enum('product','feature','set','format','other') NOT NULL DEFAULT 'product',
	`status` enum('new','reviewed','planned','declined') NOT NULL DEFAULT 'new',
	`upvotes` int NOT NULL DEFAULT 0,
	`adminNote` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `community_suggestions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `poll_options` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pollId` int NOT NULL,
	`label` varchar(255) NOT NULL,
	`description` varchar(500),
	`imageUrl` varchar(500),
	`voteCount` int NOT NULL DEFAULT 0,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `poll_options_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `poll_votes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pollId` int NOT NULL,
	`optionId` int NOT NULL,
	`userId` int,
	`fingerprint` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `poll_votes_id` PRIMARY KEY(`id`)
);
