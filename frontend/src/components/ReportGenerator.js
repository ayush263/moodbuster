import React, { useState } from 'react';
import { Download, Calendar, TrendingUp } from 'lucide-react';
import '../styles/ReportGenerator.css';

const ReportGenerator = ({ moodData, userName = 'User' }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDFReport = async () => {
    setIsGenerating(true);
    try {
      // Dynamic import for pdfkit (lightweight alternative)
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          period: selectedPeriod,
          moodData,
          userName
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mood-report-${selectedPeriod}-${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateCSVReport = () => {
    const csv = [
      ['Date', 'Mood Score', 'Note', 'Timestamp'],
      ...moodData.map(entry => [
        new Date(entry.timestamp).toLocaleDateString(),
        entry.moodScore,
        entry.note || '',
        entry.timestamp
      ])
    ];

    const csvContent = csv.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mood-data-${selectedPeriod}-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  };

  const calculateStats = () => {
    if (!moodData || moodData.length === 0) return null;
    
    const scores = moodData.map(m => m.moodScore);
    return {
      average: (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1),
      highest: Math.max(...scores),
      lowest: Math.min(...scores),
      entries: scores.length
    };
  };

  const stats = calculateStats();

  return (
    <div className="report-generator">
      <div className="report-header">
        <h3>📄 Generate Reports</h3>
        <p>Export your mood insights in PDF or CSV format</p>
      </div>

      <div className="report-content">
        <div className="period-selector">
          <label>Select Period:</label>
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            disabled={isGenerating}
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
            <option value="all">All Time</option>
          </select>
        </div>

        {stats && (
          <div className="report-preview">
            <div className="stat-item">
              <span className="stat-label">Average Mood</span>
              <span className="stat-value">{stats.average}/10</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Highest</span>
              <span className="stat-value">{stats.highest}/10</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Lowest</span>
              <span className="stat-value">{stats.lowest}/10</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Entries</span>
              <span className="stat-value">{stats.entries}</span>
            </div>
          </div>
        )}

        <div className="export-buttons">
          <button 
            className="export-btn pdf"
            onClick={generatePDFReport}
            disabled={isGenerating || !moodData || moodData.length === 0}
          >
            <Download size={20} />
            <span>{isGenerating ? 'Generating...' : 'Export as PDF'}</span>
          </button>
          <button 
            className="export-btn csv"
            onClick={generateCSVReport}
            disabled={!moodData || moodData.length === 0}
          >
            <Download size={20} />
            <span>Export as CSV</span>
          </button>
        </div>

        <div className="report-info">
          <p>💡 Your report includes:</p>
          <ul>
            <li>Daily mood trends and patterns</li>
            <li>Statistical analysis and insights</li>
            <li>Recommendations based on your data</li>
            <li>Peak mood times and mood distribution</li>
            <li>Professional formatting for sharing</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;
