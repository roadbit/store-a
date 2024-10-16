const Visit = require('../models/visit');

exports.recordVisit = async (req, res) => {
  try {
    const visit = new Visit();
    await visit.save();
    res.status(201).json({ message: 'Visit recorded successfully' });
  } catch (error) {
    console.error('Error recording visit:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getVisitsForLast24Hours = async (req, res) => {
  try {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    console.log('Fetching visits from', twentyFourHoursAgo, 'to', now);

    const visits = await Visit.find({
      timestamp: { $gte: twentyFourHoursAgo, $lte: now }
    }).exec();

    console.log('Visits found:', visits);

    const hours = Array.from({ length: 24 }, (_, i) => {
      const startOfHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), i, 0, 0);
      const endOfHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), i, 59, 59);

      const count = visits.filter(visit => visit.timestamp >= startOfHour && visit.timestamp <= endOfHour).length;
      return {
        hour: `${i < 10 ? '0' : ''}${i}:00`,
        count
      };
    });

    res.json(hours);
  } catch (err) {
    console.error('Error fetching visits:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};