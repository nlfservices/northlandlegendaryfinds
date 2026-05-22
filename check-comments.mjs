import 'dotenv/config';

const token = process.env.FB_PAGE_ACCESS_TOKEN;
const pageId = process.env.FB_PAGE_ID;

const resp = await fetch(`https://graph.facebook.com/v24.0/${pageId}/posts?fields=id,message,created_time,comments{id,message,from,created_time}&limit=25&access_token=${token}`);
const data = await resp.json();

for (const post of data.data) {
  const snippet = post.message ? post.message.substring(0, 80) : '(no message)';
  console.log(`\n=== Post: ${post.id} (${post.created_time}) ===`);
  console.log(`Message: ${snippet}...`);
  
  if (post.comments && post.comments.data && post.comments.data.length > 0) {
    const userComments = post.comments.data.filter(c => c.from && c.from.id !== pageId);
    const pageComments = post.comments.data.filter(c => c.from && c.from.id === pageId);
    const noFromComments = post.comments.data.filter(c => c.from === undefined || c.from === null);
    console.log(`Total: ${post.comments.data.length} | User: ${userComments.length} | Page: ${pageComments.length} | NoFrom: ${noFromComments.length}`);
    
    for (const comment of userComments) {
      console.log(`  [USER] ${comment.from.name}: ${comment.message.substring(0, 150)}`);
      console.log(`    ID: ${comment.id} | Time: ${comment.created_time}`);
    }
    for (const comment of noFromComments) {
      console.log(`  [UNKNOWN] ${comment.message.substring(0, 150)}`);
      console.log(`    ID: ${comment.id} | Time: ${comment.created_time}`);
    }
  } else {
    console.log('No comments');
  }
}
