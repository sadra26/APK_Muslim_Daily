import {getCurrentUser, setCurrentUser} from './session';

const API_BASE_URL = 'http://10.0.2.2:3000';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const rawText = await response.text();
  let data = {};

  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch (error) {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message || rawText || 'Server tidak merespons dengan benar.',
    );
  }

  return data;
}

export const api = {
  baseUrl: API_BASE_URL,

  async login(email, password) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({email, password}),
    });
    setCurrentUser(data.user);
    return data.user;
  },

  async register(fullName, email, password) {
    const data = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({fullName, email, password}),
    });
    setCurrentUser(data.user);
    return data.user;
  },

  dashboard(userId = getCurrentUser()?.id) {
    return request(`/dashboard/${userId}`);
  },

  prayers(userId = getCurrentUser()?.id) {
    return request(`/prayers/${userId}`);
  },

  updateLocation(userId, location) {
    return request(`/users/${userId}/location`, {
      method: 'PUT',
      body: JSON.stringify(location),
    });
  },

  updateReminder(userId, prayerName, payload) {
    return request(`/reminders/${userId}/${prayerName}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  sunnahCheckIn(userId, activity = 'daily_sunnah') {
    return request(`/sunnah/${userId}/check-in`, {
      method: 'POST',
      body: JSON.stringify({activity}),
    });
  },

  updateQuranProgress(userId, payload) {
    return request(`/quran/${userId}/progress`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  addCharity(userId, payload) {
    return request(`/charity/${userId}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  ummahPosts() {
    return request('/ummah');
  },

  createUmmahPost(userId, content) {
    return request(`/ummah/${userId}`, {
      method: 'POST',
      body: JSON.stringify({content}),
    });
  },

  getDailyMotivation() {
    return request('/motivation/daily');
  }
};
