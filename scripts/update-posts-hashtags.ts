/**
 * Update live Facebook posts to add hashtags to the main post captions
 */

const API_VERSION = "v24.0";
const GRAPH_URL = `https://graph.facebook.com/${API_VERSION}`;
const token = process.env.FB_PAGE_ACCESS_TOKEN;

// Who Wins post (Scarlet Witch vs Phoenix)
const whoWinsPostId = "951323751392043_122125993929174463";
const whoWinsMessage = `🔴 SCARLET WITCH vs PHOENIX 🔥

Reality-warping chaos magic vs the most powerful cosmic force in the universe.

Wanda rewrote all of existence with three words. Jean Grey destroyed an entire star system as Dark Phoenix.

Who's taking this fight? Drop your pick in the comments 👇

Read more epic Marvel breakdowns:
https://northlandlegendaryfinds.com/mcu-news

#MarvelComics #ScarletWitch #Phoenix #WhoWins #MarvelDebate`;

// Fallen Son Part 2 post
const fallenSonPostId = "951323751392043_122125997619174463";
const fallenSonMessage = `The five stages of grief hit different when you're a superhero.

In Part 2 of our Fallen Son breakdown, we dig into Bargaining and Depression — Hawkeye's impossible choice and the moment Spider-Man hit rock bottom after Civil War.

These issues don't get talked about enough. If you've read them, you know.

Read the full breakdown:
https://northlandlegendaryfinds.com/mcu-news/fallen-son-part-2-bargaining-depression-hawkeye-spider-man

#FallenSon #MarvelComics #SpiderMan #Hawkeye #CivilWar`;

async function updatePost(postId: string, message: string, label: string) {
  if (!token) {
    console.error("No FB_PAGE_ACCESS_TOKEN found");
    process.exit(1);
  }

  console.log(`Updating ${label} (${postId})...`);

  const response = await fetch(`${GRAPH_URL}/${postId}?access_token=${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error(`❌ Failed to update ${label}:`, JSON.stringify(result, null, 2));
  } else {
    console.log(`✅ ${label} updated!`, result);
  }
}

async function main() {
  await updatePost(whoWinsPostId, whoWinsMessage, "Who Wins (Scarlet Witch vs Phoenix)");
  await updatePost(fallenSonPostId, fallenSonMessage, "Fallen Son Part 2");
}

main();
