import { Router, Response } from 'express';
import { getDatabase } from '../db/database';
import { AuthRequest, authenticateToken } from '../middleware/auth';
import { randomUUID } from 'crypto';

const router = Router();

// Get all transactions for user
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  const db = getDatabase();
  const userId = req.userId;

  try {
    const transactions = db
      .prepare('SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC')
      .all(userId);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

// Add transaction
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { type, amount, description, category, date, payment_method } = req.body;
  const userId = req.userId;

  if (!type || !amount || !description || !date) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const db = getDatabase();
  const id = randomUUID();

  try {
    db.prepare(
      'INSERT INTO transactions (id, user_id, type, amount, description, category, date, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(id, userId, type, amount, description, category || null, date, payment_method || 'cash');

    res.json({ id, type, amount, description, category, date, payment_method: payment_method || 'cash' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add transaction' });
  }
});

// Delete transaction
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;
  const db = getDatabase();

  try {
    const transaction = db.prepare('SELECT * FROM transactions WHERE id = ? AND user_id = ?').get(id, userId);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    db.prepare('DELETE FROM transactions WHERE id = ?').run(id);
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete transaction' });
  }
});

export default router;
