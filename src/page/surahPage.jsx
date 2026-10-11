import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { getSurahList } from '../services/quranApi';

const SurahListScreen = ({ navigation }) => {
  const [surahList, setSurahList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSurahList();
  }, []);

  const fetchSurahList = async () => {
    try {
      setLoading(true);
      const data = await getSurahList();
      setSurahList(data);
      setError(null);
    } catch (err) {
      setError('Gagal memuat daftar surat. Cek koneksi internet.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        navigation.navigate('SurahDetail', {
          nomor: item.nomor,
          namaLatin: item.namaLatin,
        })
      }
    >
      <View style={styles.numberCircle}>
        <Text style={styles.numberText}>{item.nomor}</Text>
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.namaLatin}>{item.namaLatin}</Text>
        <Text style={styles.detail}>
          {item.tempatTurun} • {item.jumlahAyat} Ayat • {item.arti}
        </Text>
      </View>
      <Text style={styles.namaArab}>{item.nama}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
        <TouchableOpacity onPress={fetchSurahList} style={styles.retryBtn}>
          <Text style={styles.retryText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={surahList}
      keyExtractor={(item) => item.nomor.toString()}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  numberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numberText: { color: '#2E7D32', fontWeight: 'bold' },
  itemInfo: { flex: 1 },
  namaLatin: { fontSize: 16, fontWeight: '600' },
  detail: { fontSize: 12, color: '#777', marginTop: 2 },
  namaArab: { fontSize: 18, marginLeft: 8 },
  retryBtn: { marginTop: 10, padding: 10 },
  retryText: { color: '#2E7D32', fontWeight: 'bold' },
});

export default SurahListScreen;