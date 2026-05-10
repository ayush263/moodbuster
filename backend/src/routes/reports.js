const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

/**
 * Generate PDF Report
 * @route POST /api/reports/generate
 */
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const { period, moodData, userName } = req.body;

    // Simple text-based report generation
    // In production, use a library like pdfkit
    const reportContent = generateReportContent(period, moodData, userName);
    
    // Convert to PDF (using a simple approach)
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="mood-report-${period}.pdf"`);
    
    // For now, return as text that can be converted to PDF on frontend
    const pdfBuffer = Buffer.from(reportContent);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate report', message: error.message });
  }
});

/**
 * Generate CSV Report
 * @route POST /api/reports/csv
 */
router.post('/csv', authMiddleware, async (req, res) => {
  try {
    const { moodData } = req.body;
    
    const csv = 'Date,Mood Score,Note\n' + 
      moodData.map(entry => 
        `"${new Date(entry.timestamp).toLocaleDateString()}",${entry.moodScore},"${(entry.note || '').replace(/"/g, '""')}"`
      ).join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="mood-data.csv"');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate CSV', message: error.message });
  }
});

/**
 * Get Mood Statistics
 * @route GET /api/reports/stats
 */
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user;
    const { period = '30days' } = req.query;

    // Calculate period in days
    const daysMap = {
      '7days': 7,
      '30days': 30,
      '90days': 90,
      '6months': 180,
      '1year': 365
    };
    
    const days = daysMap[period] || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch mood data (implement based on your DB)
    // const moods = await Mood.find({ userId, timestamp: { $gte: startDate } });
    
    // Calculate statistics
    const stats = {
      totalEntries: 0, // moods.length,
      averageMood: 0,
      highestMood: 0,
      lowestMood: 0,
      trend: 'neutral',
      volatility: 0,
      peakHour: 0,
      moodDistribution: {}
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics', message: error.message });
  }
});

function generateReportContent(period, moodData, userName) {
  const date = new Date().toLocaleDateString();
  let content = `MOOD TRACKING REPORT\n`;
  content += `Generated: ${date}\n`;
  content += `User: ${userName}\n`;
  content += `Period: ${period}\n\n`;
  
  if (moodData && moodData.length > 0) {
    const scores = moodData.map(m => m.moodScore);
    const avg = (scores.reduce((a, b) => a + b) / scores.length).toFixed(1);
    
    content += `Summary:\n`;
    content += `- Total Entries: ${moodData.length}\n`;
    content += `- Average Mood: ${avg}/10\n`;
    content += `- Highest: ${Math.max(...scores)}/10\n`;
    content += `- Lowest: ${Math.min(...scores)}/10\n\n`;
  }
  
  return content;
}

module.exports = router;
