CREATE TABLE `top5_buzz_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`rank` int NOT NULL,
	`title` varchar(500) NOT NULL,
	`character` varchar(255) NOT NULL,
	`tagline` varchar(500) NOT NULL,
	`backstory` text NOT NULL,
	`cardImage` text NOT NULL,
	`cardLabel` varchar(255) NOT NULL,
	`cardLink` varchar(500) NOT NULL,
	`sources` json NOT NULL,
	`heatLevel` enum('blazing','hot','rising') NOT NULL DEFAULT 'rising',
	`category` varchar(100) NOT NULL DEFAULT 'Movie',
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `top5_buzz_items_id` PRIMARY KEY(`id`)
);
