import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();

// GET /api/users/:id - Get user profile
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const prisma = (req as any).prisma;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        _count: {
          select: { memories: true }
        }
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// POST /api/users - Create or update user from OAuth
router.post('/', async (req, res) => {
  try {
    const { email, name, githubId } = req.body;
    const prisma = (req as any).prisma;

    if (!email) {
      return res.status(400).json({ error: 'email is required' });
    }

    // Try to find existing user by email
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // Update existing user
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name,
          ...(githubId && { githubId }),
        },
      });
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email,
          name,
          ...(githubId && { githubId }),
        },
      });
    }

    res.status(201).json({ user });
  } catch (error) {
    console.error('Error creating/updating user:', error);
    res.status(500).json({ error: 'Failed to create/update user' });
  }
});

export default router;