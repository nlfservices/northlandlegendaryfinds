CREATE TABLE IF NOT EXISTS `slab_pack_cards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`packId` int NOT NULL,
	`characterName` varchar(255) NOT NULL,
	`cardSet` varchar(255) NOT NULL,
	`cardNumber` varchar(50),
	`year` varchar(10),
	`parallel` varchar(255),
	`gradingCompany` varchar(50) DEFAULT 'BGS',
	`grade` varchar(20),
	`serialNumber` varchar(100),
	`rarity` enum('grail','chase','lineup') NOT NULL DEFAULT 'lineup',
	`estimatedValue` int,
	`frontImageUrl` text,
	`backImageUrl` text,
	`slab_card_status` enum('available','reserved','pulled','removed') NOT NULL DEFAULT 'available',
	`pulledAt` bigint,
	`pulledByUserId` int,
	`pullMethod` enum('digital','in_person'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `slab_pack_cards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `slab_pack_order_cards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`cardId` int NOT NULL,
	`revealOrder` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `slab_pack_order_cards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `slab_pack_orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`packId` int NOT NULL,
	`userId` int,
	`order_status` enum('pending','paid','revealed','shipped') NOT NULL DEFAULT 'pending',
	`stripePaymentIntentId` varchar(255),
	`revealedAt` bigint,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `slab_pack_orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `slab_packs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`tier` enum('silver','gold','diamond','infinity') NOT NULL DEFAULT 'silver',
	`price` int NOT NULL,
	`description` text,
	`imageUrl` text,
	`cardsPerPack` int NOT NULL DEFAULT 1,
	`totalPacks` int NOT NULL DEFAULT 100,
	`soldCount` int NOT NULL DEFAULT 0,
	`status` enum('draft','active','sold_out','archived') NOT NULL DEFAULT 'draft',
	`launchDate` bigint,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `slab_packs_id` PRIMARY KEY(`id`)
);
