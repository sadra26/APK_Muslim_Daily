import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { getSurahDetail } from '../services/quranApi';

const SurahDetailScreen = ({ route, navigation }) => {
  const { nomor, namaLatin } = route.params;
  const [surah, setSurah] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({ title: namaLatin });
    fetchDetail();
  }, []);

  const fetchDetail = async () => {
    try {
      const data = await getSurahDetail(nomor);
      setSurah(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderAyat = ({ item }) => (
    <View style={styles.ayatCard}>
      <Text style={styles.ayatNumber}>Ayat {item.nomorAyat}</Text>
      <Text style={styles.teksArab}>{item.teksArab}</Text>
      <Text style={styles.teksLatin}>{item.teksLatin}</Text>
      <Text style={styles.teksTerjemahan}>{item.teksIndonesia}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <FlatList
      data={surah?.ayat || []}
      keyExtractor={(item) => item.nomorAyat.toString()}
      renderItem={renderAyat}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.headerNamaArab}>{surah?.nama}</Text>
          <Text style={styles.headerArti}>{surah?.arti}</Text>
          <Text style={styles.headerDetail}>
            {surah?.tempatTurun} • {surah?.jumlahAyat} Ayat
          </Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    marginBottom: 8,
  },
  headerNamaArab: { fontSize: 28, marginBottom: 4 },
  headerArti: { fontSize: 14, color: '#555' },
  headerDetail: { fontSize: 12, color: '#777', marginTop: 4 },
  ayatCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  ayatNumber: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  teksArab: {
    fontSize: 24,
    textAlign: 'right',
    lineHeight: 42,
    marginBottom: 8,
  },
  teksLatin: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#555',
    marginBottom: 6,
  },
  teksTerjemahan: { fontSize: 14, color: '#333' },
});

export default SurahDetailScreen;