import express from 'express';
import Clan from '../models/Clan.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all clans
router.get('/', async (req, res) => {
  try {
    const clans = await Clan.find()
      .populate('owner', 'username')
      .populate('memberList', 'username')
      .sort({ createdAt: -1 });
    
    // Transform to match frontend format
    const formattedClans = clans.map(clan => ({
      id: clan._id.toString(),
      name: clan.name,
      tag: clan.tag,
      owner: clan.ownerUsername,
      description: clan.description,
      members: clan.members,
      region: clan.region,
      platform: clan.platform,
      founded: clan.founded,
      image: clan.image,
      color: clan.color,
      ownerId: clan.owner._id.toString()
    }));

    res.json(formattedClans);
  } catch (error) {
    console.error('Error fetching clans:', error);
    res.status(500).json({ error: 'Error fetching clans' });
  }
});

// Get single clan
router.get('/:id', async (req, res) => {
  try {
    const clan = await Clan.findById(req.params.id)
      .populate('owner', 'username')
      .populate('memberList', 'username');

    if (!clan) {
      return res.status(404).json({ error: 'Clan not found' });
    }

    // Format members list
    const members = clan.memberList.map(member => ({
      id: member._id.toString(),
      username: member.username,
      role: member._id.toString() === clan.owner._id.toString() ? 'Leader' : 'Member'
    }));

    // Format activity (sort by most recent first, limit to 20)
    const activity = (clan.activity || [])
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 20)
      .map(act => ({
        type: act.type,
        message: act.message,
        timestamp: act.timestamp,
        timeAgo: getTimeAgo(act.timestamp)
      }));

    const formattedClan = {
      id: clan._id.toString(),
      name: clan.name,
      tag: clan.tag,
      owner: clan.ownerUsername,
      description: clan.description,
      members: clan.members,
      memberList: members,
      region: clan.region,
      platform: clan.platform,
      founded: clan.founded,
      image: clan.image,
      color: clan.color,
      ownerId: clan.owner._id.toString(),
      activity: activity
    };

    res.json(formattedClan);
  } catch (error) {
    console.error('Error fetching clan:', error);
    res.status(500).json({ error: 'Error fetching clan' });
  }
});

// Helper function to calculate time ago
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

// Create clan (protected)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, tag, description, region, platform, color } = req.body;

    if (!name || !tag || !description || !region || !platform) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Check if clan name or tag already exists
    const existingClan = await Clan.findOne({
      $or: [{ name }, { tag }]
    });

    if (existingClan) {
      return res.status(400).json({ error: 'Clan name or tag already exists' });
    }

    const clan = new Clan({
      name,
      tag,
      owner: req.user.userId,
      ownerUsername: req.user.username,
      description,
      region,
      platform,
      color: color || '#4A9EFF',
      memberList: [req.user.userId]
    });

    await clan.save();
    await clan.populate('owner', 'username');

    const formattedClan = {
      id: clan._id.toString(),
      name: clan.name,
      tag: clan.tag,
      owner: clan.ownerUsername,
      description: clan.description,
      members: clan.members,
      region: clan.region,
      platform: clan.platform,
      founded: clan.founded,
      image: clan.image,
      color: clan.color,
      ownerId: clan.owner._id.toString()
    };

    res.status(201).json(formattedClan);
  } catch (error) {
    console.error('Error creating clan:', error);
    res.status(500).json({ error: 'Error creating clan' });
  }
});

// Update clan (protected - owner only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const clan = await Clan.findById(req.params.id);

    if (!clan) {
      return res.status(404).json({ error: 'Clan not found' });
    }

    // Check if user is the owner
    if (clan.owner.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Only the clan owner can update the clan' });
    }

    const { name, tag, description, region, platform, color } = req.body;

    if (name) clan.name = name;
    if (tag) clan.tag = tag;
    if (description) clan.description = description;
    if (region) clan.region = region;
    if (platform) clan.platform = platform;
    if (color) clan.color = color;

    await clan.save();
    await clan.populate('owner', 'username');

    const formattedClan = {
      id: clan._id.toString(),
      name: clan.name,
      tag: clan.tag,
      owner: clan.ownerUsername,
      description: clan.description,
      members: clan.members,
      region: clan.region,
      platform: clan.platform,
      founded: clan.founded,
      image: clan.image,
      color: clan.color,
      ownerId: clan.owner._id.toString()
    };

    res.json(formattedClan);
  } catch (error) {
    console.error('Error updating clan:', error);
    res.status(500).json({ error: 'Error updating clan' });
  }
});

// Delete clan (protected - owner only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const clan = await Clan.findById(req.params.id);

    if (!clan) {
      return res.status(404).json({ error: 'Clan not found' });
    }

    // Check if user is the owner
    if (clan.owner.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Only the clan owner can delete the clan' });
    }

    await Clan.findByIdAndDelete(req.params.id);
    res.json({ message: 'Clan deleted successfully' });
  } catch (error) {
    console.error('Error deleting clan:', error);
    res.status(500).json({ error: 'Error deleting clan' });
  }
});

// Join clan (protected)
router.post('/:id/join', authenticateToken, async (req, res) => {
  try {
    const clan = await Clan.findById(req.params.id);

    if (!clan) {
      return res.status(404).json({ error: 'Clan not found' });
    }

    // Check if user is already a member
    if (clan.memberList.includes(req.user.userId)) {
      return res.status(400).json({ error: 'You are already a member of this clan' });
    }

    clan.memberList.push(req.user.userId);
    clan.members = clan.memberList.length;

    // Add activity entry
    const user = await User.findById(req.user.userId);
    if (user) {
      clan.activity.push({
        type: 'member_joined',
        message: `${user.username} joined the clan`,
        timestamp: new Date()
      });
    }

    await clan.save();

    res.json({ message: 'Successfully joined clan', members: clan.members });
  } catch (error) {
    console.error('Error joining clan:', error);
    res.status(500).json({ error: 'Error joining clan' });
  }
});

// Leave clan (protected)
router.post('/:id/leave', authenticateToken, async (req, res) => {
  try {
    const clan = await Clan.findById(req.params.id);

    if (!clan) {
      return res.status(404).json({ error: 'Clan not found' });
    }

    // Owner cannot leave their own clan
    if (clan.owner.toString() === req.user.userId) {
      return res.status(400).json({ error: 'Clan owner cannot leave the clan' });
    }

    clan.memberList = clan.memberList.filter(
      memberId => memberId.toString() !== req.user.userId
    );
    clan.members = clan.memberList.length;
    await clan.save();

    res.json({ message: 'Successfully left clan', members: clan.members });
  } catch (error) {
    console.error('Error leaving clan:', error);
    res.status(500).json({ error: 'Error leaving clan' });
  }
});

export default router;

