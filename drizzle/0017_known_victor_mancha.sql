CREATE TABLE `loyalty_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`email` varchar(320) NOT NULL,
	`firstName` varchar(100),
	`lastName` varchar(100),
	`pointsBalance` int NOT NULL DEFAULT 0,
	`lifetimePoints` int NOT NULL DEFAULT 0,
	`tier` enum('collector','silver','gold','legendary') NOT NULL DEFAULT 'collector',
	`loyalty_status` enum('active','paused','banned') NOT NULL DEFAULT 'active',
	`birthday` varchar(5),
	`ghlContactId` varchar(100),
	`referralCode` varchar(20),
	`referredBy` varchar(20),
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `loyalty_members_id` PRIMARY KEY(`id`),
	CONSTRAINT `loyalty_members_email_unique` UNIQUE(`email`),
	CONSTRAINT `loyalty_members_referralCode_unique` UNIQUE(`referralCode`)
);
--> statement-breakpoint
CREATE TABLE `loyalty_redemptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`memberId` int NOT NULL,
	`rewardId` int NOT NULL,
	`pointsSpent` int NOT NULL,
	`redemption_status` enum('pending','fulfilled','cancelled','expired') NOT NULL DEFAULT 'pending',
	`code` varchar(50),
	`notes` text,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `loyalty_redemptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `loyalty_rewards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`pointsCost` int NOT NULL,
	`min_tier` enum('collector','silver','gold','legendary') NOT NULL DEFAULT 'collector',
	`reward_type` enum('discount_code','free_shipping','exclusive_repack','drawing_entry','early_access','merch','custom') NOT NULL,
	`rewardValue` varchar(100),
	`imageUrl` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`maxRedemptions` int,
	`redemptionCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `loyalty_rewards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `loyalty_transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`memberId` int NOT NULL,
	`transaction_type` enum('purchase','referral','signup_bonus','newsletter','social_follow','drawing_entry','birthday_bonus','admin_adjustment','redemption','tier_bonus') NOT NULL,
	`points` int NOT NULL,
	`balanceAfter` int NOT NULL,
	`description` varchar(500),
	`referenceId` varchar(255),
	`referenceType` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `loyalty_transactions_id` PRIMARY KEY(`id`)
);
