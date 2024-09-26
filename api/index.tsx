// File: api/index.js
import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import { Frog } from 'frog';
import { handle } from 'frog/vercel';

// Initialize the Frog app
export const app = new Frog({
  basePath: '/api',
  // Supply your own secret and supply your own verify function
  // see https://frog.fm for more information
});

// Make sure to set your NEYNAR_API_KEY in the environment
const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY);

//app.get('/', (c) => {
 //return c.text('Farcaster Frame API is running!');
//});

// Frame route
app.frame('/', (c) => {
  const { buttonValue } = c;
  
  if (buttonValue === 'get_user') {
    return c.handleGetUser();
  }
  
  // Initial frame
  return c.res({
    image: 'https://placehold.co/600x400?text=Welcome+to+Farcaster+Frame',
    intents: [
      { label: 'Get Random User', id: 'get_user' }
    ]
  });
});

// Handle getting a random user
async function handleGetUser(c) {
  try {
    const response = await fetch('https://api.neynar.com/v2/farcaster/user/bulk', {
      headers: {
        'Authorization': `Bearer ${process.env.NEYNAR_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();

    // Pick a random user from the list
    const users = data.users;
    const randomIndex = Math.floor(Math.random() * users.length);
    const randomUser = users[randomIndex];

    return c.res({
      image: `https://placehold.co/600x400?text=User:+${randomUser.name}`,
      intents: [
        { label: 'Get Another User', id: 'get_user' }
      ]
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return c.res({
      image: 'https://placehold.co/600x400?text=Error+fetching+user+data',
      intents: [
        { label: 'Try Again', id: 'get_user' }
      ]
    });
  }
}

export const GET = handle(app)
export const POST = handle(app)