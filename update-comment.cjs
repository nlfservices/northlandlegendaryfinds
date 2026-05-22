const https = require('https');

// The comment ID from when we posted it
const COMMENT_ID = '122125891359174463_1004649945262780';

const PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;

const newMessage = `🎬 The MCU is building toward something massive. Wolverine's denial, the Avengers' rage — Fallen Son is the emotional foundation for Doomsday.

We break down every MCU story and what it means for collectors: https://northlandlegendaryfinds.com/mcu-news

Who hit harder emotionally — Wolverine's denial or the Avengers' rage? Drop your answer below 👇`;

// First, try to update the existing comment
function updateComment() {
  const postData = `message=${encodeURIComponent(newMessage)}&access_token=${PAGE_ACCESS_TOKEN}`;
  
  const options = {
    hostname: 'graph.facebook.com',
    port: 443,
    path: `/v21.0/${COMMENT_ID}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log('Update response status:', res.statusCode);
      console.log('Update response:', data);
      if (res.statusCode !== 200) {
        console.log('Update failed, trying delete + repost...');
        deleteAndRepost();
      } else {
        console.log('Comment updated successfully!');
        process.exit(0);
      }
    });
  });

  req.on('error', (e) => {
    console.error('Error:', e.message);
    process.exit(1);
  });

  req.write(postData);
  req.end();
}

function deleteAndRepost() {
  // Delete old comment
  const options = {
    hostname: 'graph.facebook.com',
    port: 443,
    path: `/v21.0/${COMMENT_ID}?access_token=${PAGE_ACCESS_TOKEN}`,
    method: 'DELETE'
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log('Delete response:', res.statusCode, data);
      // Now post new comment on the original post
      postNewComment();
    });
  });

  req.on('error', (e) => {
    console.error('Delete error:', e.message);
    process.exit(1);
  });

  req.end();
}

function postNewComment() {
  // Post ID from the Fallen Son post
  const POST_ID = '122125891359174463';
  const postData = `message=${encodeURIComponent(newMessage)}&access_token=${PAGE_ACCESS_TOKEN}`;
  
  const options = {
    hostname: 'graph.facebook.com',
    port: 443,
    path: `/v21.0/${POST_ID}/comments`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log('New comment response:', res.statusCode, data);
      process.exit(0);
    });
  });

  req.on('error', (e) => {
    console.error('Post error:', e.message);
    process.exit(1);
  });

  req.write(postData);
  req.end();
}

if (!PAGE_ACCESS_TOKEN) {
  console.error('FB_PAGE_ACCESS_TOKEN not set');
  process.exit(1);
}

updateComment();
