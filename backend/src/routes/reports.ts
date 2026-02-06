import { Router, Response } from 'express';
import { query } from '../db/database';
import { AuthRequest, authenticateToken } from '../middleware/auth';
import jsPDF from 'jspdf';
import * as path from 'path';
import * as fs from 'fs';

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

// PDF Generation Helper Functions
function generatePDFReport(
  title: string,
  dateRange: string,
  totalCredits: number,
  totalDebits: number,
  balance: number,
  transactions: any[]
): Buffer {
  const doc = new jsPDF();

  // Add logo (assuming logo is in the public directory)
  try {
    const logoPath = path.join(__dirname, '../../public/YTBSavings.png');
    if (fs.existsSync(logoPath)) {
      // Note: In a real implementation, you'd need to handle image loading properly
      // For now, we'll just add text
    }
  } catch (error) {
    console.log('Logo not found, skipping logo');
  }

  // Title
  doc.setFontSize(20);
  doc.text('YTB Savings', 20, 30);
  doc.setFontSize(16);
  doc.text(title, 20, 45);
  doc.setFontSize(12);
  doc.text(`Date Range: ${dateRange}`, 20, 55);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 65);

  // Summary
  doc.setFontSize(14);
  doc.text('Summary', 20, 85);
  doc.setFontSize(12);
  doc.text(`Total Income: ₹${totalCredits.toFixed(2)}`, 20, 95);
  doc.text(`Total Expenses: ₹${totalDebits.toFixed(2)}`, 20, 105);
  doc.text(`Balance: ₹${balance.toFixed(2)}`, 20, 115);

  // Transactions table
  if (transactions.length > 0) {
    doc.setFontSize(14);
    doc.text('Transactions', 20, 135);

    // Table headers
    doc.setFontSize(10);
    let yPosition = 145;
    doc.text('Date', 20, yPosition);
    doc.text('Type', 60, yPosition);
    doc.text('Amount', 100, yPosition);
    doc.text('Description', 140, yPosition);

    // Table rows
    yPosition += 10;
    transactions.forEach((txn) => {
      if (yPosition > 270) { // New page if needed
        doc.addPage();
        yPosition = 30;
      }

      doc.text(txn.date, 20, yPosition);
      doc.text(txn.type === 'credit' ? 'Income' : 'Expense', 60, yPosition);
      doc.text(`₹${txn.amount.toFixed(2)}`, 100, yPosition);
      doc.text(txn.description.substring(0, 30), 140, yPosition);
      yPosition += 8;
    });
  }

  return Buffer.from(doc.output('arraybuffer'));
}

// PDF Export Routes
router.get('/daily/pdf', authenticateToken, async (req: AuthRequest, res: Response) => {
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

    const pdfBuffer = generatePDFReport(
      'Daily Report',
      reportDate,
      totalCredits,
      totalDebits,
      totalCredits - totalDebits,
      transactions
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=daily_report_${reportDate}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate PDF report' });
  }
});

router.get('/monthly/pdf', authenticateToken, async (req: AuthRequest, res: Response) => {
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

    const pdfBuffer = generatePDFReport(
      'Monthly Report',
      reportMonth,
      totalCredits,
      totalDebits,
      totalCredits - totalDebits,
      transactions
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=monthly_report_${reportMonth}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate PDF report' });
  }
});

router.get('/weekly/pdf', authenticateToken, async (req: AuthRequest, res: Response) => {
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

    const pdfBuffer = generatePDFReport(
      'Weekly Report',
      `${startDateStr} to ${endDateStr}`,
      totalCredits,
      totalDebits,
      totalCredits - totalDebits,
      transactions
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=weekly_report_${startDateStr}_to_${endDateStr}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate PDF report' });
  }
});

router.get('/annual/pdf', authenticateToken, async (req: AuthRequest, res: Response) => {
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

    const pdfBuffer = generatePDFReport(
      'Annual Report',
      reportYear.toString(),
      totalCredits,
      totalDebits,
      totalCredits - totalDebits,
      transactions
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=annual_report_${reportYear}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate PDF report' });
  }
});

