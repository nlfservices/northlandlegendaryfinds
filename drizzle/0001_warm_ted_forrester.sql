CREATE TABLE `checklist_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`cardName` varchar(255) NOT NULL,
	`cardSet` varchar(255),
	`cardYear` varchar(10),
	`cardNumber` varchar(50),
	`parallel` varchar(100),
	`tier` enum('chase','hit','base','bonus') NOT NULL DEFAULT 'base',
	`estimatedValue` varchar(50),
	`isPulled` boolean NOT NULL DEFAULT false,
	`imageUrl` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `checklist_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pulls` (
	`id` int AUTO_INCREMENT NOT NULL,
	`checklistItemId` int NOT NULL,
	`productId` int NOT NULL,
	`showId` int,
	`packNumber` int,
	`pulledBy` varchar(100),
	`notes` text,
	`pulledAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pulls_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `repack_products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`imageUrl` text,
	`price` int,
	`totalPacks` int NOT NULL DEFAULT 500,
	`packsRemaining` int NOT NULL DEFAULT 500,
	`category` enum('marvel','starwars','sports','pokemon','other') NOT NULL DEFAULT 'marvel',
	`status` enum('draft','active','soldout','archived') NOT NULL DEFAULT 'draft',
	`isWhatnotExclusive` boolean NOT NULL DEFAULT false,
	`whatnotSeriesName` varchar(255),
	`packsPerShow` int,
	`shopifyUrl` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `repack_products_id` PRIMARY KEY(`id`),
	CONSTRAINT `repack_products_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `shows` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`productId` int NOT NULL,
	`showDate` bigint NOT NULL,
	`whatnotUrl` text,
	`status` enum('scheduled','live','completed','cancelled') NOT NULL DEFAULT 'scheduled',
	`packsOpened` int NOT NULL DEFAULT 0,
	`startingPackNumber` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `shows_id` PRIMARY KEY(`id`)
);
