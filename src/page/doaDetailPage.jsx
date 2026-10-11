import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { getDoaDetail } from '../services/doaApi';

const DoaDetailPage = ({ route, navigation }) => {
  const { id, nama } = route.params;
  const [doa, setDoa] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({ title: nama || 'Detail Doa' });
    fetchDetail();
  }, []);

  const fetchDetail = async () => {
    try {
      const data = await getDoaDetail(id);
      setDoa(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  if (!doa) {
    return (
      <View style={styles.center}>
        <Text>Doa tidak ditemukan.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.judul}>{doa.nama || doa.judul}</Text>

        {doa.grup && <Text style={styles.grup}>{doa.grup}</Text>}

        <View style={styles.card}>
          <Text style={styles.teksArab}>
            {doa.ar || doa.teksArab || doa.arab}
          </Text>
        </View>

        {(doa.tr || doa.latin || doa.teksLatin) && (
          <View style={styles.section}>
            <Text style={styles.label}>Latin</Text>
            <Text style={styles.teksLatin}>
              {doa.tr || doa.latin || doa.teksLatin}
            </Text>
          </View>
        )}

        {(doa.idn || doa.terjemahan || doa.teksIndonesia) && (
          <View style={styles.section}>
            <Text style={styles.label}>Terjemahan</Text>
            <Text style={styles.teksTerjemahan}>
              {doa.idn || doa.terjemahan || doa.teksIndonesia}
            </Text>
          </View>
        )}

        {(doa.tentang || doa.sumber || doa.referensi) && (
          <View style={styles.section}>
            <Text style={styles.label}>Sumber / Referensi</Text>
            <Text style={styles.sumber}>
              {doa.tentang || doa.sumber || doa.referensi}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7F8' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20 },
  judul: { fontSize: 20, fontWeight: '700', color: '#222', marginBottom: 4 },
  grup: { fontSize: 13, color: '#888', marginBottom: 16 },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    marginBottom: 16,
  },
  teksArab: { fontSize: 26, textAlign: 'right', lineHeight: 46 },
  section: { marginBottom: 16 },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  teksLatin: { fontSize: 14, fontStyle: 'italic', color: '#555', lineHeight: 22 },
  teksTerjemahan: { fontSize: 15, color: '#333', lineHeight: 22 },
  sumber: { fontSize: 13, color: '#777', lineHeight: 20 },
});

export default DoaDetailPage;