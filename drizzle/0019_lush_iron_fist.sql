CREATE TABLE `page_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`page` varchar(100) NOT NULL,
	`sectionKey` varchar(150) NOT NULL,
	`content` text NOT NULL,
	`label` varchar(255),
	`groupName` varchar(100),
	`sortOrder` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `page_content_id` PRIMARY KEY(`id`)
);
