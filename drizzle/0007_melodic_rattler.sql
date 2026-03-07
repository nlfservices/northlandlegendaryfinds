ALTER TABLE `checklist_items` ADD `cardCondition` varchar(100);--> statement-breakpoint
ALTER TABLE `repack_products` ADD `checklistFinalizedAt` timestamp;--> statement-breakpoint
ALTER TABLE `repack_products` ADD `checklistStatement` text;