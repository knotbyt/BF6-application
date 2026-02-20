import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const clansFilePath = join(__dirname, '..', '..', 'public', 'data', 'clans.json');

const VALID_REGIONS = ['NA East', 'NA West', 'EU West', 'EU Central', 'Asia Pacific'];
const VALID_PLATFORMS = ['PC', 'Xbox', 'PlayStation', 'Cross-play'];

function addClan(name, tag, owner, description, region, platform, color) {
  try {
    const clansData = JSON.parse(readFileSync(clansFilePath, 'utf8'));

    const existingClan = clansData.find(c =>
      c.name.toLowerCase() === name.toLowerCase() ||
      c.tag.toLowerCase() === tag.toLowerCase()
    );

    if (existingClan) {
      console.error(`Error: A clan with that name or tag already exists ("${existingClan.name}" [${existingClan.tag}])`);
      process.exit(1);
    }

    if (!VALID_REGIONS.includes(region)) {
      console.error(`Error: Invalid region "${region}"`);
      console.log('Valid regions:', VALID_REGIONS.join(', '));
      process.exit(1);
    }

    if (!VALID_PLATFORMS.includes(platform)) {
      console.error(`Error: Invalid platform "${platform}"`);
      console.log('Valid platforms:', VALID_PLATFORMS.join(', '));
      process.exit(1);
    }

    const newClan = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      tag,
      owner,
      description,
      members: 1,
      region,
      platform,
      founded: new Date().getFullYear().toString(),
      image: null,
      color: color || '#4A9EFF',
      memberList: [
        {
          username: owner,
          role: 'Leader'
        }
      ],
      activity: [
        {
          type: 'other',
          message: 'Clan was created',
          timestamp: new Date().toISOString(),
          timeAgo: 'just now'
        }
      ]
    };

    clansData.push(newClan);
    writeFileSync(clansFilePath, JSON.stringify(clansData, null, 2), 'utf8');

    console.log(`✓ Successfully created clan "${name}" [${tag}]`);
    console.log(`  Owner: ${owner}`);
    console.log(`  Region: ${region}`);
    console.log(`  Platform: ${platform}`);
    console.log(`  ID: ${newClan.id}`);

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

if (args.length < 6) {
  console.log('Usage: npm run add-clan <name> <tag> <owner> <description> <region> <platform> [color]');
  console.log('');
  console.log('Example:');
  console.log('  npm run add-clan "Shadow Squad" "[SHDW]" "DarkKnight" "Stealth ops clan" "EU West" "PC"');
  console.log('  npm run add-clan "Shadow Squad" "[SHDW]" "DarkKnight" "Stealth ops clan" "EU West" "PC" "#FF5733"');
  console.log('');
  console.log('Valid regions:', VALID_REGIONS.join(', '));
  console.log('Valid platforms:', VALID_PLATFORMS.join(', '));
  process.exit(1);
}

const [name, tag, owner, description, region, platform, color] = args;
addClan(name, tag, owner, description, region, platform, color);