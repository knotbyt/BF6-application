import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const clansFilePath = join(__dirname, '..', '..', 'public', 'data', 'clans.json');

function getTimeAgo(timestamp) {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now - time) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
}

async function addMemberToClan(clanNameOrId, username) {
  try {
    const clansData = JSON.parse(readFileSync(clansFilePath, 'utf8'));

    const clan = clansData.find(c => 
      c.name.toLowerCase() === clanNameOrId.toLowerCase() || 
      c.id.toLowerCase() === clanNameOrId.toLowerCase() ||
      c.tag.toLowerCase() === clanNameOrId.toLowerCase()
    );

    if (!clan) {
      console.error(`Error: Clan "${clanNameOrId}" not found`);
      console.log('Available clans:');
      clansData.forEach(c => console.log(`  - ${c.name} (${c.tag})`));
      process.exit(1);
    }

    if (!clan.memberList) {
      clan.memberList = [{ username: clan.owner, role: 'Leader' }];
    }
    if (!clan.activity) {
      clan.activity = [];
    }

    const isMember = clan.memberList.some(member => 
      member.username.toLowerCase() === username.toLowerCase()
    );

    if (isMember) {
      console.log(`User "${username}" is already a member of "${clan.name}"`);
      process.exit(0);
    }

    clan.memberList.push({
      username: username,
      role: 'Member'
    });

    clan.members = clan.memberList.length;

    const activityEntry = {
      type: 'member_joined',
      message: `${username} joined the clan`,
      timestamp: new Date().toISOString(),
      timeAgo: getTimeAgo(new Date())
    };
    clan.activity.push(activityEntry);

    if (clan.activity.length > 50) {
      clan.activity = clan.activity.slice(-50);
    }

    writeFileSync(clansFilePath, JSON.stringify(clansData, null, 2), 'utf8');

    console.log(`✓ Successfully added "${username}" to "${clan.name}"`);
    console.log(`  Total members: ${clan.members}`);
    console.log(`  Activity entry added: "${username} joined the clan"`);

    process.exit(0);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`Error: Could not find clans.json file at ${clansFilePath}`);
      console.error('Make sure the data/clans.json file exists.');
    } else {
      console.error('Error:', error.message);
    }
    process.exit(1);
  }
}

const args = process.argv.slice(2);

if (args.length < 2) {
  console.log('Usage: npm run add-member <clan-name-or-id> <username>');
  console.log('Example: npm run add-member "Knot" "player2"');
  console.log('Example: npm run add-member "KNOT" "player3"');
  process.exit(1);
}

const [clanNameOrId, username] = args;
addMemberToClan(clanNameOrId, username);
