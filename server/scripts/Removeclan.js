import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const clansFilePath = join(__dirname, '..', '..', 'public', 'data', 'clans.json');

function removeClan(clanNameOrId) {
  try {
    const clansData = JSON.parse(readFileSync(clansFilePath, 'utf8'));

    const clanIndex = clansData.findIndex(c =>
      c.name.toLowerCase() === clanNameOrId.toLowerCase() ||
      c.id.toLowerCase() === clanNameOrId.toLowerCase() ||
      c.tag.toLowerCase() === clanNameOrId.toLowerCase()
    );

    if (clanIndex === -1) {
      console.error(`Error: Clan "${clanNameOrId}" not found`);
      console.log('Available clans:');
      clansData.forEach(c => console.log(`  - ${c.name} (${c.tag}) [id: ${c.id}]`));
      process.exit(1);
    }

    const clan = clansData[clanIndex];
    clansData.splice(clanIndex, 1);
    writeFileSync(clansFilePath, JSON.stringify(clansData, null, 2), 'utf8');

    console.log(`✓ Successfully removed clan "${clan.name}" [${clan.tag}]`);
    console.log(`  Had ${clan.members} member(s)`);
    console.log(`  Remaining clans: ${clansData.length}`);

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

if (args.length < 1) {
  console.log('Usage: npm run remove-clan <clan-name-or-id-or-tag>');
  console.log('');
  console.log('Example:');
  console.log('  npm run remove-clan "Knot"');
  console.log('  npm run remove-clan "[KNOT]"');
  console.log('  npm run remove-clan "knot"');
  process.exit(1);
}

const [clanNameOrId] = args;
removeClan(clanNameOrId);