import express from 'express';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const clansFilePath = join(__dirname, '..', '..', 'public', 'data', 'clans.json');

router.get('/', (req, res) => {
  try {
    const clans = JSON.parse(readFileSync(clansFilePath, 'utf8'));
    res.json(clans);
  } catch (error) {
    console.error('Error reading clans:', error);
    res.status(500).json({ error: 'Error reading clans' });
  }
});

router.post('/', (req, res) => {
  try {
    const { name, tag, description, region, platform, color, owner } = req.body;

    if (!name || !tag || !description || !region || !platform || !owner) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    const clans = JSON.parse(readFileSync(clansFilePath, 'utf8'));

    const existingClan = clans.find(c => 
      c.name.toLowerCase() === name.toLowerCase() || 
      c.tag.toLowerCase() === tag.toLowerCase()
    );

    if (existingClan) {
      return res.status(400).json({ error: 'Clan name or tag already exists' });
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
      activity: []
    };

    clans.push(newClan);
    writeFileSync(clansFilePath, JSON.stringify(clans, null, 2), 'utf8');

    res.status(201).json(newClan);
  } catch (error) {
    console.error('Error creating clan:', error);
    res.status(500).json({ error: 'Error creating clan' });
  }
});

router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, tag, description, region, platform, color } = req.body;

    const clans = JSON.parse(readFileSync(clansFilePath, 'utf8'));
    const clanIndex = clans.findIndex(c => c.id === id);

    if (clanIndex === -1) {
      return res.status(404).json({ error: 'Clan not found' });
    }

    if (name) clans[clanIndex].name = name;
    if (tag) clans[clanIndex].tag = tag;
    if (description) clans[clanIndex].description = description;
    if (region) clans[clanIndex].region = region;
    if (platform) clans[clanIndex].platform = platform;
    if (color) clans[clanIndex].color = color;

    writeFileSync(clansFilePath, JSON.stringify(clans, null, 2), 'utf8');

    res.json(clans[clanIndex]);
  } catch (error) {
    console.error('Error updating clan:', error);
    res.status(500).json({ error: 'Error updating clan' });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const clans = JSON.parse(readFileSync(clansFilePath, 'utf8'));
    const clanIndex = clans.findIndex(c => c.id === id);

    if (clanIndex === -1) {
      return res.status(404).json({ error: 'Clan not found' });
    }

    clans.splice(clanIndex, 1);
    writeFileSync(clansFilePath, JSON.stringify(clans, null, 2), 'utf8');

    res.json({ message: 'Clan deleted successfully' });
  } catch (error) {
    console.error('Error deleting clan:', error);
    res.status(500).json({ error: 'Error deleting clan' });
  }
});

export default router;

