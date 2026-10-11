const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const pool = require('./db');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json());

const PRAYER_NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const FALLBACK_TIMINGS = {
  Fajr: '04:35',
  Sunrise: '05:55',
  Dhuhr: '11:58',
  Asr: '15:19',
  Maghrib: '17:51',
  Isha: '19:04',
};

const userFields =
  'id, full_name AS fullName, email, avatar_url AS avatarUrl, city, country, latitude, longitude, calculation_method AS calculationMethod';

function publicUser(user) {
  return {
    ...user,
    latitude: Number(user.latitude),
    longitude: Number(user.longitude),
  };
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 11) return 'Selamat pagi';
  if (hour < 15) return 'Selamat siang';
  if (hour < 18) return 'Selamat sore';
  return 'Selamat malam';
}

function timeToDate(time) {
  const [hour, minute] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date;
}

function buildPrayerState(timings) {
  const items = [
    { name: 'Fajr', time: timings.Fajr },
    { name: 'Sunrise', time: timings.Sunrise, isInfo: true },
    { name: 'Dhuhr', time: timings.Dhuhr },
    { name: 'Asr', time: timings.Asr },
    { name: 'Maghrib', time: timings.Maghrib },
    { name: 'Isha', time: timings.Isha },
  ];
  const now = new Date();
  const next = items.find(item => !item.isInfo && timeToDate(item.time) > now) || items[0];
  const currentIndex = items.findIndex(item => item.name === next.name) - 1;
  const current = [...items].slice(0, currentIndex + 1).reverse().find(item => !item.isInfo) || items[items.length - 1];
  const countdownTarget = timeToDate(next.time);
  if (countdownTarget < now) countdownTarget.setDate(countdownTarget.getDate() + 1);

  return {
    current: current.name,
    upcoming: next.name,
    upcomingTime: next.time,
    secondsToUpcoming: Math.max(0, Math.floor((countdownTarget - now) / 1000)),
    schedule: items,
  };
}

async function fetchPrayerTimes(user) {
  try {
    const response = await axios.get('https://api.aladhan.com/v1/timings', {
      params: {
        latitude: user.latitude,
        longitude: user.longitude,
        method: user.calculationMethod || process.env.ALADHAN_METHOD || 20,
      },
      timeout: 7000,
    });

    const timings = response.data?.data?.timings || FALLBACK_TIMINGS;
    return buildPrayerState({
      Fajr: timings.Fajr?.slice(0, 5),
      Sunrise: timings.Sunrise?.slice(0, 5),
      Dhuhr: timings.Dhuhr?.slice(0, 5),
      Asr: timings.Asr?.slice(0, 5),
      Maghrib: timings.Maghrib?.slice(0, 5),
      Isha: timings.Isha?.slice(0, 5),
    });
  } catch (error) {
    return buildPrayerState(FALLBACK_TIMINGS);
  }
}

async function getUserById(id) {
  const [rows] = await pool.query(`SELECT ${userFields} FROM users WHERE id = ?`, [id]);
  return rows[0] ? publicUser(rows[0]) : null;
}

async function ensureDefaults(userId) {
  await pool.query(
    'INSERT IGNORE INTO quran_progress (user_id, target_pages, pages_read) VALUES (?, 604, 0)',
    [userId],
  );

  for (const name of PRAYER_NAMES) {
    await pool.query(
      'INSERT IGNORE INTO prayer_reminders (user_id, prayer_name, enabled, sound) VALUES (?, ?, TRUE, ?)',
      [userId, name, name === 'Dhuhr' || name === 'Isha' ? 'Beep Only' : 'Adhan'],
    );
  }
}

async function getDashboard(userId) {
  const user = await getUserById(userId);
  if (!user) return null;

  await ensureDefaults(userId);
  const prayer = await fetchPrayerTimes(user);
  const [motivationRows] = await pool.query(
    'SELECT quote, source FROM daily_motivations ORDER BY MOD(id + DAYOFYEAR(CURDATE()), 31) LIMIT 1',
  );
  const [quranRows] = await pool.query('SELECT target_pages AS targetPages, pages_read AS pagesRead, last_surah AS lastSurah, last_ayah AS lastAyah FROM quran_progress WHERE user_id = ?', [userId]);
  const [streakRows] = await pool.query(
    `SELECT COUNT(*) AS streak FROM sunnah_logs
     WHERE user_id = ? AND activity = 'daily_sunnah'
     AND log_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`,
    [userId],
  );

  return {
    user,
    greeting: getGreeting(),
    motivation: motivationRows[0],
    prayer,
    quranGoal: quranRows[0],
    sunnahStreak: streakRows[0]?.streak || 0,
  };
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/auth/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Nama, email, dan password wajib diisi.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)',
      [fullName, email.toLowerCase(), passwordHash],
    );
    await ensureDefaults(result.insertId);
    const user = await getUserById(result.insertId);
    res.status(201).json({ user });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email sudah terdaftar.' });
    }
    res.status(500).json({ message: 'Gagal membuat akun.' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query(`SELECT id, password_hash FROM users WHERE email = ?`, [String(email || '').toLowerCase()]);
    const account = rows[0];
    if (!account || !(await bcrypt.compare(password || '', account.password_hash))) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }
    await ensureDefaults(account.id);
    const user = await getUserById(account.id);
    res.json({ user });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({
      message:
        'Backend gagal login. Pastikan MySQL XAMPP aktif dan backend/schema.sql sudah di-import.',
    });
  }
});

app.get('/dashboard/:userId', async (req, res) => {
  const dashboard = await getDashboard(req.params.userId);
  if (!dashboard) return res.status(404).json({ message: 'User tidak ditemukan.' });
  res.json(dashboard);
});

app.get('/prayers/:userId', async (req, res) => {
  const user = await getUserById(req.params.userId);
  if (!user) return res.status(404).json({ message: 'User tidak ditemukan.' });
  const prayer = await fetchPrayerTimes(user);
  const [reminders] = await pool.query(
    'SELECT prayer_name AS prayerName, enabled, sound FROM prayer_reminders WHERE user_id = ?',
    [user.id],
  );
  res.json({ ...prayer, location: `${user.city}, ${user.country}`, reminders });
});

app.put('/users/:userId/location', async (req, res) => {
  const { city, country, latitude, longitude, calculationMethod } = req.body;
  await pool.query(
    'UPDATE users SET city = ?, country = ?, latitude = ?, longitude = ?, calculation_method = ? WHERE id = ?',
    [city, country, latitude, longitude, calculationMethod || 20, req.params.userId],
  );
  res.json({ user: await getUserById(req.params.userId) });
});

app.put('/reminders/:userId/:prayerName', async (req, res) => {
  const { enabled, sound } = req.body;
  await pool.query(
    `INSERT INTO prayer_reminders (user_id, prayer_name, enabled, sound)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE enabled = VALUES(enabled), sound = VALUES(sound)`,
    [req.params.userId, req.params.prayerName, Boolean(enabled), sound || 'Adhan'],
  );
  res.json({ ok: true });
});

app.post('/sunnah/:userId/check-in', async (req, res) => {
  const activity = req.body.activity || 'daily_sunnah';
  await pool.query(
    'INSERT IGNORE INTO sunnah_logs (user_id, activity, log_date) VALUES (?, ?, CURDATE())',
    [req.params.userId, activity],
  );
  res.json(await getDashboard(req.params.userId));
});

app.put('/quran/:userId/progress', async (req, res) => {
  const { pagesRead, targetPages, lastSurah, lastAyah } = req.body;
  await pool.query(
    `INSERT INTO quran_progress (user_id, pages_read, target_pages, last_surah, last_ayah)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE pages_read = VALUES(pages_read), target_pages = VALUES(target_pages),
       last_surah = VALUES(last_surah), last_ayah = VALUES(last_ayah)`,
    [req.params.userId, pagesRead || 0, targetPages || 604, lastSurah || 'Al-Fatihah', lastAyah || 1],
  );
  res.json(await getDashboard(req.params.userId));
});

app.post('/charity/:userId', async (req, res) => {
  const { amount, note } = req.body;
  await pool.query(
    'INSERT INTO charity_logs (user_id, amount, note, log_date) VALUES (?, ?, ?, CURDATE())',
    [req.params.userId, amount || 0, note || null],
  );
  res.json({ ok: true });
});

app.get('/ummah', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT p.id, p.content, p.created_at AS createdAt, u.full_name AS author
     FROM ummah_posts p JOIN users u ON u.id = p.user_id
     ORDER BY p.created_at DESC LIMIT 50`,
  );
  res.json(rows);
});

app.post('/ummah/:userId', async (req, res) => {
  await pool.query('INSERT INTO ummah_posts (user_id, content) VALUES (?, ?)', [
    req.params.userId,
    req.body.content,
  ]);
  res.json({ ok: true });
});


app.listen(port, () => {
  console.log(`Muslim Daily backend running on http://localhost:${port}`);
});
