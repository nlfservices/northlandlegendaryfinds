/**
 * Post Fallen Son Part 2 to Facebook with direct article links
 */
import { publishPhotoPost, replyToComment } from "../server/facebook-api";

const imageUrl = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/tOTZXvLXpMGJnkUz.webp";

const message = `The five stages of grief hit different when you're a superhero.

In Part 2 of our Fallen Son breakdown, we dig into Bargaining and Depression — Hawkeye's impossible choice and the moment Spider-Man hit rock bottom after Civil War.

These issues don't get talked about enough. If you've read them, you know.

Read the full breakdown:
https://northlandlegendaryfinds.com/mcu-news/fallen-son-part-2-bargaining-depression-hawkeye-spider-man`;

const followUpComment = `Missed Part 1? Wolverine literally went to the Savage Land to see the body himself because he didn't believe it. And when the Avengers found out — it got ugly.

Start from the beginning:
https://northlandlegendaryfinds.com/mcu-news/fallen-son-part-1-denial-anger-wolverine-avengers-captain-america

#MarvelComics #FallenSon #CivilWar #CaptainAmerica #Hawkeye #SpiderMan #Wolverine #MarvelCollector #MCU`;

async function main() {
  console.log("Posting Fallen Son Part 2 (v2 with direct links) to Facebook...");
  
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

  if (result.postId) {
    console.log("\nPosting follow-up comment with Part 1 link...");
    const commentResult = await replyToComment(result.postId, followUpComment);
    if (commentResult.success) {
      console.log("✅ Comment posted! ID:", commentResult.replyId);
    } else {
      console.log("❌ Comment failed:", commentResult.error);
    }
  }
}

main();
