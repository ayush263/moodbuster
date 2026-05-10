const express = require('express');
const router = express.Router();

const recommendationsDb = [
  {
    id: 1,
    title: 'Meditation Session',
    description: 'Guided 10-minute meditation to calm your mind and reduce stress.',
    duration: '10 mins',
    category: 'mindfulness',
    icon: '🧘'
  },
  {
    id: 2,
    title: 'Morning Jog',
    description: 'A refreshing outdoor run to boost your mood and energy levels.',
    duration: '30 mins',
    category: 'exercise',
    icon: '🏃'
  },
  {
    id: 3,
    title: 'Breathing Exercise',
    description: '4-7-8 breathing technique to reduce anxiety and improve focus.',
    duration: '5 mins',
    category: 'wellness',
    icon: '💨'
  },
  {
    id: 4,
    title: 'Journaling',
    description: 'Reflect on your thoughts and feelings through expressive writing.',
    duration: '15 mins',
    category: 'reflection',
    icon: '✍️'
  },
  {
    id: 5,
    title: 'Social Time',
    description: 'Connect with friends or family for meaningful conversation.',
    duration: '60 mins',
    category: 'social',
    icon: '👥'
  },
  {
    id: 6,
    title: 'Creative Activity',
    description: 'Engage in art, music, or crafts to express yourself.',
    duration: '30 mins',
    category: 'creativity',
    icon: '🎨'
  }
];

let feedback = [];

router.get('/', (req, res) => {
  try {
    const recommendations = recommendationsDb.map(rec => ({
      ...rec,
      score: Math.floor(Math.random() * 40) + 60
    }));

    res.json(recommendations.sort((a, b) => b.score - a.score));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/feedback', (req, res) => {
  try {
    const { recommendationId, helpful } = req.body;

    if (!recommendationId || typeof helpful !== 'boolean') {
      return res.status(400).json({ error: 'Invalid feedback data' });
    }

    const feedbackEntry = {
      id: feedback.length + 1,
      recommendationId,
      helpful,
      timestamp: new Date().toISOString()
    };

    feedback.push(feedbackEntry);

    res.status(201).json({
      success: true,
      message: 'Feedback recorded successfully',
      feedback: feedbackEntry
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const rec = recommendationsDb.find(r => r.id === parseInt(req.params.id));
    if (!rec) {
      return res.status(404).json({ error: 'Recommendation not found' });
    }
    res.json(rec);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
