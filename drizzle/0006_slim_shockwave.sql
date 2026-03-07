CREATE TABLE `launch_subscribers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`productSlug` varchar(255) NOT NULL,
	`userId` int,
	`source` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `launch_subscribers_id` PRIMARY KEY(`id`)
);
