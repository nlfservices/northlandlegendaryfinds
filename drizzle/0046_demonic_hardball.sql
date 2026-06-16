CREATE TABLE `sell_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(128) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(32) NOT NULL,
	`card_name` varchar(255) NOT NULL,
	`card_number` varchar(32) NOT NULL,
	`card_year` varchar(8),
	`set_name` varchar(255),
	`condition` varchar(64),
	`is_autograph` boolean NOT NULL DEFAULT false,
	`asking_price` varchar(64),
	`notes` text,
	`image_urls` varchar(2048) NOT NULL DEFAULT '',
	`status` varchar(32) NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sell_submissions_id` PRIMARY KEY(`id`)
);
