const express = require('express');
const router = express.Router();

let moods = [];
let moodId = 1;

router.get('/', (req, res) => {
  try {
    res.json(moods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req, res) => {
  try {
    const { moodScore, context } = req.body;

    if (!moodScore || moodScore < 1 || moodScore > 10) {
      return res.status(400).json({ error: 'Invalid mood score. Must be between 1 and 10.' });
    }

    const newMood = {
      id: moodId++,
      moodScore: parseInt(moodScore),
      context: context || {},
      timestamp: new Date().toISOString(),
      created_at: new Date()
    };

    moods.push(newMood);

    res.status(201).json({
      success: true,
      message: 'Mood logged successfully',
      mood: newMood
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stats', (req, res) => {
  try {
    if (moods.length === 0) {
      return res.json({
        totalEntries: 0,
        averageMood: 0,
        highestMood: 0,
        lowestMood: 0,
        trend: 'No data'
      });
    }

    const scores = moods.map(m => m.moodScore);
    const average = scores.reduce((a, b) => a + b) / scores.length;
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);

    const recentMoods = moods.slice(-7);
    const recentAverage = recentMoods.reduce((a, b) => a + b.moodScore, 0) / recentMoods.length;
    const overallAverage = average;
    const trend = recentAverage > overallAverage ? 'improving' : recentAverage < overallAverage ? 'declining' : 'stable';

    res.json({
      totalEntries: moods.length,
      averageMood: parseFloat(average.toFixed(2)),
      highestMood: highest,
      lowestMood: lowest,
      trend,
      recentMoods: recentMoods.reverse()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const mood = moods.find(m => m.id === parseInt(req.params.id));
    if (!mood) {
      return res.status(404).json({ error: 'Mood entry not found' });
    }
    res.json(mood);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const { moodScore, context } = req.body;
    const mood = moods.find(m => m.id === parseInt(req.params.id));

    if (!mood) {
      return res.status(404).json({ error: 'Mood entry not found' });
    }

    if (moodScore) mood.moodScore = parseInt(moodScore);
    if (context) mood.context = { ...mood.context, ...context };

    res.json({
      success: true,
      message: 'Mood updated successfully',
      mood
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const index = moods.findIndex(m => m.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ error: 'Mood entry not found' });
    }

    const deletedMood = moods.splice(index, 1);
    res.json({
      success: true,
      message: 'Mood deleted successfully',
      mood: deletedMood[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
