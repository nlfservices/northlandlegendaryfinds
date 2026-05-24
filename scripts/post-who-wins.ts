/**
 * One-off script to post the Who Wins image to Facebook
 * Run with: npx tsx scripts/post-who-wins.ts
 */
import { publishPhotoPost, replyToComment } from "../server/facebook-api";

const imageUrl = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663027009739/nJzdMlAFSTxCwHnF.png";

const message = `🔴 SCARLET WITCH vs PHOENIX 🔥

Reality-warping chaos magic vs the most powerful cosmic force in the universe.

Wanda rewrote all of existence with three words. Jean Grey destroyed an entire star system as Dark Phoenix.

Who's taking this fight? Drop your pick in the comments 👇

Read more epic Marvel breakdowns:
https://northlandlegendaryfinds.com/mcu-news`;

const followUpComment = `This debate has been going on since the 90s and we're STILL not settled. 🔥

Wanda literally said "No more mutants" and erased millions of powers overnight. But Jean Grey as Phoenix is a cosmic-level entity that devours STARS.

We broke down more insane Marvel matchups and storylines — check them out and tell us who you think takes this one:
https://northlandlegendaryfinds.com/mcu-news

#MarvelComics #ScarletWitch #Phoenix #JeanGrey #WandaMaximoff #WhoWins #MarvelDebate #XMen #Avengers`;

async function main() {
  console.log("Posting Who Wins image to Facebook...");
  
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
