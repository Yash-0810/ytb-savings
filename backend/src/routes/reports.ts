import { Router, Response } from 'express';
import { query } from '../db/database';
import { AuthRequest, authenticateToken } from '../middleware/auth';

const router = Router();

// Daily Report
router.get('/daily', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { date } = req.query;
  const userId = req.userId;

  const reportDate = (date as string) || new Date().toISOString().split('T')[0];

  try {
    const result = await query(
      'SELECT * FROM transactions WHERE user_id = $1 AND date = $2 ORDER BY created_at DESC',
      [userId, reportDate]
    );
    const transactions = result.rows;

    const totalDebits = transactions
      .filter((t: any) => t.type === 'debit')
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    const totalCredits = transactions
      .filter((t: any) => t.type === 'credit')
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    res.json({
      date: reportDate,
      totalDebits,
      totalCredits,
      balance: totalCredits - totalDebits,
      transactions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch daily report' });
  }
});

// Monthly Report
router.get('/monthly', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { month } = req.query;
  const userId = req.userId;

  const reportMonth = (month as string) || new Date().toISOString().slice(0, 7);

  try {
    const result = await query(
      'SELECT * FROM transactions WHERE user_id = $1 AND date LIKE $2 ORDER BY date DESC',
      [userId, `${reportMonth}%`]
    );
    const transactions = result.rows;

    const totalDebits = transactions
      .filter((t: any) => t.type === 'debit')
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    const totalCredits = transactions
      .filter((t: any) => t.type === 'credit')
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    res.json({
      month: reportMonth,
      totalDebits,
      totalCredits,
      balance: totalCredits - totalDebits,
      transactions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch monthly report' });
  }
});

// Annual Report
router.get('/annual', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { year } = req.query;
  const userId = req.userId;

  const reportYear = parseInt(year as string) || new Date().getFullYear();

  try {
    const result = await query(
      'SELECT * FROM transactions WHERE user_id = $1 AND date LIKE $2 ORDER BY date DESC',
      [userId, `${reportYear}%`]
    );
    const transactions = result.rows;

    const totalDebits = transactions
      .filter((t: any) => t.type === 'debit')
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    const totalCredits = transactions
      .filter((t: any) => t.type === 'credit')
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    // Monthly breakdown
    const monthlyMap: { [key: string]: any[] } = {};
    (transactions as any[]).forEach((t) => {
      const monthKey = t.date.slice(0, 7);
      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = [];
      }
      monthlyMap[monthKey].push(t);
    });

    const monthlyData = Object.entries(monthlyMap).map(([month, monthTransactions]) => {
      const monthDebits = monthTransactions
        .filter((t: any) => t.type === 'debit')
        .reduce((sum: number, t: any) => sum + t.amount, 0);
      const monthCredits = monthTransactions
        .filter((t: any) => t.type === 'credit')
        .reduce((sum: number, t: any) => sum + t.amount, 0);

      return {
        month,
        totalDebits: monthDebits,
        totalCredits: monthCredits,
        balance: monthCredits - monthDebits,
        transactions: monthTransactions,
      };
    });

    res.json({
      year: reportYear,
      totalDebits,
      totalCredits,
      balance: totalCredits - totalDebits,
      monthlyData,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch annual report' });
  }
});

// Weekly Report
router.get('/weekly', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { date } = req.query;
  const userId = req.userId;

  const selectedDate = new Date((date as string) || new Date());
  const dayOfWeek = selectedDate.getDay();
  const diff = selectedDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const startDate = new Date(selectedDate.setDate(diff));
  const startDateStr = startDate.toISOString().split('T')[0];
  const endDateStr = new Date(new Date(startDate).setDate(startDate.getDate() + 6))
    .toISOString()
    .split('T')[0];

  try {
    const result = await query(
      'SELECT * FROM transactions WHERE user_id = $1 AND date >= $2 AND date <= $3 ORDER BY date DESC',
      [userId, startDateStr, endDateStr]
    );
    const transactions = result.rows;

    const totalDebits = transactions
      .filter((t: any) => t.type === 'debit')
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    const totalCredits = transactions
      .filter((t: any) => t.type === 'credit')
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    res.json({
      week: `${startDateStr} to ${endDateStr}`,
      totalDebits,
      totalCredits,
      balance: totalCredits - totalDebits,
      transactions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch weekly report' });
  }
});

export default router;

