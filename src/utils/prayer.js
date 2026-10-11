export const PRAYER_ICONS = {
  Fajr: 'weather-sunset-up',
  Dhuhr: 'weather-sunny',
  Dhuhur: 'weather-sunny',
  Asr: 'weather-partly-cloudy',
  Maghrib: 'weather-sunset',
  Isha: 'weather-night',
};

export const formatCountdown = totalSeconds => {
  const safeSeconds = Math.max(0, Number(totalSeconds) || 0);
  const h = Math.floor(safeSeconds / 3600);
  const m = Math.floor((safeSeconds % 3600) / 60);
  const s = safeSeconds % 60;
  const pad = n => String(n).padStart(2, '0');

  return `${pad(h)}:${pad(m)}:${pad(s)}`;
};

export const fallbackDashboard = {
  user: {
    id: 1,
    fullName: 'Ahmad',
    email: 'ahmad@mail.com',
    city: 'Jakarta',
    country: 'Indonesia',
    latitude: -6.2,
    longitude: 106.816666,
    calculationMethod: 20,
  },
  greeting: 'Assalamu alaikum',
  motivation: {
    quote: 'Verily, with hardship comes ease.',
    source: 'Surah Ash-Sharh 94:5',
  },
  prayer: {
    current: 'Dhuhr',
    upcoming: 'Asr',
    upcomingTime: '15:19',
    secondsToUpcoming: 2 * 60 * 60,
    schedule: [
      {name: 'Subuh', time: '04:35'},
      {name: 'Sunrise', time: '05:55', isInfo: true},
      {name: 'Dhuhur', time: '11:58'},
      {name: 'Asar', time: '15:19'},
      {name: 'Maghrib', time: '17:51'},
      {name: 'Isya', time: '19:04'},
    ],
  },
  quranGoal: {
    targetPages: 604,
    pagesRead: 0,
    lastSurah: 'Al-Fatihah',
    lastAyah: 1,
  },
  sunnahStreak: 0,
};
