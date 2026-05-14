CREATE TABLE `affiliate_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`url` text NOT NULL,
	`imageUrl` text,
	`category` enum('cards','toys','clothing','collectibles','comics','other') NOT NULL DEFAULT 'cards',
	`characterTags` json,
	`pinnedArticleIds` json,
	`active` boolean NOT NULL DEFAULT true,
	`position` int NOT NULL DEFAULT 0,
	`priceDisplay` varchar(50),
	`retailer` varchar(100),
	`isAffiliate` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `affiliate_links_id` PRIMARY KEY(`id`)
);
