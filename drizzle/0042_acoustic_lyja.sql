CREATE TABLE `article_pipeline_topics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`topic_key` varchar(255) NOT NULL,
	`topic_title` varchar(512) NOT NULL,
	`bucket` varchar(64) NOT NULL DEFAULT 'general_mcu',
	`art_style` varchar(64),
	`art_style_index` int NOT NULL DEFAULT 0,
	`article_id` int,
	`reddit_post_copy` text,
	`published` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`published_at` timestamp,
	CONSTRAINT `article_pipeline_topics_id` PRIMARY KEY(`id`),
	CONSTRAINT `article_pipeline_topics_topic_key_unique` UNIQUE(`topic_key`)
);
