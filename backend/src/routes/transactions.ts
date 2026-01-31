import { Router, Response } from 'express';
import { query } from '../db/database';
import { AuthRequest, authenticateToken } from '../middleware/auth';
import { randomUUID } from 'crypto';

const router = Router();

// Get all transactions for user
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.userId;

  try {
    const result = await query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC',
      [userId]
    );
    res.json(result.rows);
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

  const id = randomUUID();

  try {
    await query(
      'INSERT INTO transactions (id, user_id, type, amount, description, category, date, payment_method) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [id, userId, type, amount, description, category || null, date, payment_method || 'cash']
    );

    res.json({ id, type, amount, description, category, date, payment_method: payment_method || 'cash' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add transaction' });
  }
});

// Delete transaction
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const transaction = await query(
      'SELECT * FROM transactions WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (transaction.rows.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await query('DELETE FROM transactions WHERE id = $1', [id]);
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete transaction' });
  }
});

export default router;

