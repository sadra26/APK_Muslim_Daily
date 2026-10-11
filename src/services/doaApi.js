const BASE_URL = 'https://equran.id/api';

export const getDoaList = async (grup = null, tag = null) => {
  let url = `${BASE_URL}/doa`;
  const params = new URLSearchParams();
  if (grup) params.append('grup', grup);
  if (tag) params.append('tag', tag);
  if (params.toString()) url += `?${params.toString()}`;

  const response = await fetch(url);
  const json = await response.json();

  // Debug sekali saat development, hapus/comment setelah field dikonfirmasi
  if (__DEV__) console.log('Contoh response doa:', JSON.stringify(json).slice(0, 500));

  return json.data || json; // fallback jika API tidak bungkus dalam "data"
};

export const getDoaDetail = async (id) => {
  const response = await fetch(`${BASE_URL}/doa/${id}`);
  const json = await response.json();
  return json.data || json;
};