import Transaction from '../models/Transaction.js';

export const summary = async (req, res) => {
  const { start, end } = req.query;
  const match = { user: req.user.id };
  if (start || end) {
    match.date = {};
    if (start) match.date.$gte = new Date(start);
    if (end) match.date.$lte = new Date(end);
  }
  const agg = await Transaction.aggregate([
    { $match: match },
    { $group: { _id: '$type', total: { $sum: '$amount' } } },
  ]);
  const totals = { income: 0, expense: 0 };
  for (const r of agg) totals[r._id] = r.total;
  const balance = totals.income - totals.expense;
  res.json({ incomeTotal: totals.income, expenseTotal: totals.expense, balance });
};

export const byCategory = async (req, res) => {
  const { start, end, type } = req.query;
  const match = { user: req.user.id };
  if (type) match.type = type;
  if (start || end) {
    match.date = {};
    if (start) match.date.$gte = new Date(start);
    if (end) match.date.$lte = new Date(end);
  }
  const agg = await Transaction.aggregate([
    { $match: match },
    { $group: { _id: '$category', total: { $sum: '$amount' } } },
    { $project: { _id: 0, category: '$_id', total: 1 } },
    { $sort: { total: -1 } },
  ]);
  res.json({ results: agg });
};

export const byMonth = async (req, res) => {
  let { year } = req.query;
  year = Number(year) || new Date().getFullYear();
  const start = new Date(`${year}-01-01T00:00:00.000Z`);
  const end = new Date(`${year + 1}-01-01T00:00:00.000Z`);
  const match = { user: req.user.id, date: { $gte: start, $lt: end } };
  const agg = await Transaction.aggregate([
    { $match: match },
    { $group: { _id: { m: { $month: '$date' }, t: '$type' }, total: { $sum: '$amount' } } },
  ]);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const data = months.map((m) => ({ month: m, income: 0, expense: 0, net: 0 }));
  for (const r of agg) {
    const idx = r._id.m - 1;
    data[idx][r._id.t] = r.total;
  }
  for (const row of data) row.net = row.income - row.expense;
  res.json({ year, months: data });
};
