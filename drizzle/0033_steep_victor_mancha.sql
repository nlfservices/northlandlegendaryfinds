CREATE TABLE `facebook_comment_replies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` varchar(255) NOT NULL,
	`commentId` varchar(255) NOT NULL,
	`commenterName` varchar(255) NOT NULL,
	`commentText` text NOT NULL,
	`commentedAt` timestamp,
	`generatedReply` text,
	`commentReplyStatus` enum('pending','approved','rejected','sent','skipped') NOT NULL DEFAULT 'pending',
	`repliedAt` timestamp,
	`replyCommentId` varchar(255),
	`note` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `facebook_comment_replies_id` PRIMARY KEY(`id`),
	CONSTRAINT `facebook_comment_replies_commentId_unique` UNIQUE(`commentId`)
);
