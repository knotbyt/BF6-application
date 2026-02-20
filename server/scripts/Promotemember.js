import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const clansFilePath = join(__dirname, '..', '..', 'public', 'data', 'clans.json');

const ROLE_HIERARCHY = ['Member', 'Officer', 'Leader'];

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

function promoteMember(clanNameOrId, username) {
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

    const member = clan.memberList.find(m =>
      m.username.toLowerCase() === username.toLowerCase()
    );

    if (!member) {
      console.error(`Error: User "${username}" is not a member of "${clan.name}"`);
      console.log('Current members:');
      clan.memberList.forEach(m => console.log(`  - ${m.username} (${m.role})`));
      process.exit(1);
    }

    const currentRoleIndex = ROLE_HIERARCHY.indexOf(member.role);

    if (currentRoleIndex === -1) {
      member.role = 'Member';
    }

    if (member.role === 'Leader') {
      console.log(`"${username}" is already the Leader of "${clan.name}" — cannot promote further`);
      process.exit(0);
    }

    const oldRole = member.role;
    const newRoleIndex = ROLE_HIERARCHY.indexOf(oldRole) + 1;
    const newRole = ROLE_HIERARCHY[newRoleIndex];

    // If promoting to Leader, demote the current leader to Officer
    if (newRole === 'Leader') {
      const currentLeader = clan.memberList.find(m => m.role === 'Leader');
      if (currentLeader) {
        currentLeader.role = 'Officer';
        clan.owner = username;
        console.log(`  Previous leader "${currentLeader.username}" demoted to Officer`);

        clan.activity.push({
          type: 'other',
          message: `${currentLeader.username} was demoted to Officer`,
          timestamp: new Date().toISOString(),
          timeAgo: getTimeAgo(new Date())
        });
      }
    }

    member.role = newRole;

    clan.activity.push({
      type: 'other',
      message: `${username} was promoted to ${newRole}`,
      timestamp: new Date().toISOString(),
      timeAgo: getTimeAgo(new Date())
    });

    if (clan.activity.length > 50) {
      clan.activity = clan.activity.slice(-50);
    }

    writeFileSync(clansFilePath, JSON.stringify(clansData, null, 2), 'utf8');

    console.log(`✓ Successfully promoted "${username}" in "${clan.name}"`);
    console.log(`  ${oldRole} → ${newRole}`);

    process.exit(0);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`Error: Could not find clans.json file at ${clansFilePath}`);
      console.error('Make sure the public/data/clans.json file exists.');
    } else {
      console.error('Error:', error.message);
    }
    process.exit(1);
  }
}

const args = process.argv.slice(2);

if (args.length < 2) {
  console.log('Usage: npm run promote <clan-name-or-id> <username>');
  console.log('');
  console.log('Role hierarchy: Member → Officer → Leader');
  console.log('Promoting to Leader will demote the current leader to Officer.');
  console.log('');
  console.log('Example:');
  console.log('  npm run promote "Knot" "player2"');
  process.exit(1);
}

const [clanNameOrId, username] = args;
promoteMember(clanNameOrId, username);