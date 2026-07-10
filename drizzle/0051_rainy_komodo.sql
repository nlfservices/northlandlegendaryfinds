CREATE TABLE `repack_feedback` (
	`id` int AUTO_INCREMENT NOT NULL,
	`format` varchar(64) NOT NULL,
	`price_range` varchar(32) NOT NULL,
	`characters` text,
	`sets` text,
	`graded_preference` varchar(32),
	`suggestion` text,
	`email` varchar(255),
	`fingerprint` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `repack_feedback_id` PRIMARY KEY(`id`)
);
