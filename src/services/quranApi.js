const BASE_URL = 'https://equran.id/api/v2';

export const getSurahList = async () => {
  const response = await fetch(`${BASE_URL}/surat`);
  const json = await response.json();
  return json.data; // array of surah
};

export const getSurahDetail = async (nomor) => {
  const response = await fetch(`${BASE_URL}/surat/${nomor}`);
  const json = await response.json();
  return json.data; // detail surah + array ayat
};