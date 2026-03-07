CREATE TABLE `graded_cards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`gradingCompany` varchar(20) NOT NULL,
	`grade` varchar(30),
	`gradeNumeric` decimal(3,1),
	`autographGrade` varchar(30),
	`cardName` varchar(255) NOT NULL,
	`cardNumber` varchar(50),
	`cardSet` varchar(255),
	`subset` varchar(255),
	`parallel` varchar(255),
	`numberedTo` int,
	`certNumber` varchar(50),
	`invoiceNumber` varchar(50),
	`lineItem` varchar(20),
	`batchId` varchar(20),
	`status` enum('submitted','received','grading','shipped','delivered') NOT NULL DEFAULT 'submitted',
	`receivedDate` timestamp,
	`shippedDate` timestamp,
	`declaredValueCents` int,
	`marvelCardId` int,
	`errorType` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `graded_cards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `marvel_cards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`setId` int NOT NULL,
	`cardNumber` varchar(50) NOT NULL,
	`characterName` varchar(255) NOT NULL,
	`cardType` varchar(255),
	`parallels` text,
	`rarity` varchar(100),
	`imageUrl` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`sourceId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `marvel_cards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `marvel_sets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sourceId` int,
	`name` varchar(255) NOT NULL,
	`shortName` varchar(100),
	`slug` varchar(255) NOT NULL,
	`releaseYear` int,
	`totalCards` int,
	`description` text,
	`imageUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `marvel_sets_id` PRIMARY KEY(`id`),
	CONSTRAINT `marvel_sets_slug_unique` UNIQUE(`slug`)
);
