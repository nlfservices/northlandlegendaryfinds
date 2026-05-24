/**
 * One-off script to post Fallen Son Part 2 to Facebook
 * Run with: npx tsx scripts/post-fallen-son.ts
 */
import { publishPhotoPost, replyToComment } from "../server/facebook-api";

const imageUrl = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/tOTZXvLXpMGJnkUz.webp";

const message = `The five stages of grief hit different when you're a superhero.

In Part 2 of our Fallen Son breakdown, we dig into Bargaining and Depression — Hawkeye's impossible choice and the moment Spider-Man hit rock bottom after Civil War.

These issues don't get talked about enough. If you've read them, you know.

Read the full breakdown:
https://northlandlegendaryfinds.com/mcu-news`;

const followUpComment = `Hawkeye went to the Savage Land looking for answers and found something way worse. And Spider-Man? The guy who never stops cracking jokes went completely silent.

Jeph Loeb wrote grief in a way that still hits 20 years later. We broke down every panel that matters — link's in the post above.

https://northlandlegendaryfinds.com/mcu-news

#MarvelComics #FallenSon #CivilWar #Hawkeye #SpiderMan #MarvelCollector #ComicBooks #MCU #Avengers`;

async function main() {
  console.log("Posting Fallen Son Part 2 to Facebook...");
  
  const result = await publishPhotoPost({
    message,
    photoUrl: imageUrl,
  });

  if (!result.success) {
    console.error("❌ Failed to post:", result.error);
    process.exit(1);
  }

  console.log("✅ Posted successfully!");
  console.log(`Photo ID: ${result.photoId}`);
  console.log(`Post ID: ${result.postId}`);

  // Post follow-up comment
  if (result.postId) {
    console.log("\nPosting follow-up comment...");
    const commentResult = await replyToComment(result.postId, followUpComment);
    if (commentResult.success) {
      console.log("✅ Comment posted! ID:", commentResult.replyId);
    } else {
      console.log("❌ Comment failed:", commentResult.error);
      console.log("\nFollow-up comment to post manually:");
      console.log("---");
      console.log(followUpComment);
      console.log("---");
    }
  }
}

main();
