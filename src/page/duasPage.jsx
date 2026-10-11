// ini file duasPage.jsx

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Navbar from '../components/navbar';
import Header from '../components/header';
import { getDoaList } from '../services/doaApi';

const TABS = ['Semua Doa', 'Rumah', 'Sakit', 'Perjalanan', 'Makan'];

const TAB_ICONS = {
  'Semua Doa': [],
  Rumah: ['rumah'],
  Sakit: ['sakit'],
  Perjalanan: ['perjalanan'],
  Makan: ['makan'],
};

const DuasPage = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('Semua Doa');
  const [duaList, setDuaList] = useState([]);
  const [duaOfTheDay, setDuaOfTheDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDuas();
  }, []);

  const fetchDuas = async () => {
    try {
      setLoading(true);
      const data = await getDoaList();
      setDuaList(data);

      if (data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        setDuaOfTheDay(data[randomIndex]);
      }

      setError(null);
    } catch (err) {
      setError('Gagal memuat daftar doa. Cek koneksi internet.');
    } finally {
      setLoading(false);
    }
  };

  const getNama = item => item?.nama || item?.judul || 'Tanpa Judul';
  const getGrupTag = item => {
    const grup = item?.grup || '';
    const tags = Array.isArray(item?.tag) ? item.tag : [];
    return [grup, ...tags].join(' ').toLowerCase();
  };

  const filteredDuas = duaList.filter(item => {
    const nama = getNama(item).toLowerCase();
    const matchesSearch = nama.includes(searchText.toLowerCase());

    const matchesTab =
      activeTab === 'Semua Doa' ||
      getGrupTag(item).includes(activeTab.toLowerCase());

    return matchesSearch && matchesTab;
  });

  const handleReadFull = () => {
    if (!duaOfTheDay) return;
    navigation.navigate('DoaDetail', {
      id: duaOfTheDay.id,
      nama: getNama(duaOfTheDay),
    });
  };

  const handleOpenDua = item => {
    navigation.navigate('DoaDetail', {
      id: item.id,
      nama: getNama(item),
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        <Header navigation={navigation} />

        <View style={styles.searchBar}>
          <Icon name="search-outline" size={20} color="#999" />
          <TextInput
            placeholder="Cari Doa..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchInput}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsRow}
        >
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#0B7D5E" />
          </View>
        ) : error ? (
          <View style={styles.loadingBox}>
            <Text style={styles.emptyText}>{error}</Text>
            <TouchableOpacity onPress={fetchDuas} style={styles.retryBtn}>
              <Text style={styles.retryText}>Coba Lagi</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {duaOfTheDay && (
              <LinearGradient
                colors={['#1C8C70', '#0B7D5E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.dailyCard}
              >
                <Text style={styles.dailyLabel}>Doa Harian</Text>

                <Text style={styles.dailyTitle}>{getNama(duaOfTheDay)}</Text>

                {duaOfTheDay.grup && (
                  <Text style={styles.dailyQuote}>{duaOfTheDay.grup}</Text>
                )}

                <TouchableOpacity
                  style={styles.readButton}
                  onPress={handleReadFull}
                >
                  <Text style={styles.readButtonText}>Baca Lengkap</Text>
                  <Icon name="arrow-forward" size={16} color="#015958" />
                </TouchableOpacity>
              </LinearGradient>
            )}

            <View style={styles.list}>
              {filteredDuas.length === 0 ? (
                <Text style={styles.emptyText}>
                  Tidak ada doa yang ditemukan.
                </Text>
              ) : (
                filteredDuas.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.duaCard}
                    onPress={() => handleOpenDua(item)}
                  >
                    <View style={styles.duaLeft}>
                      <View style={styles.iconCircle}>
                        <Icon
                          name={TAB_ICONS[activeTab] || 'hand-left'}
                          size={22}
                          color="#0B7D5E"
                        />
                      </View>

                      <View style={styles.duaTextContainer}>
                        <Text style={styles.duaTitle} numberOfLines={2}>
                          {getNama(item)}
                        </Text>
                        {item.grup && (
                          <Text style={styles.duaSubtitle} numberOfLines={1}>
                            {item.grup}
                          </Text>
                        )}
                      </View>
                    </View>

                    <Icon name="chevron-forward" size={18} color="#999" />
                  </TouchableOpacity>
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>

      <Navbar activeScreen="Duas" navigation={navigation} />
    </SafeAreaView>
  );
};

export default DuasPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7F8',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 15,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#000',
  },
  tabsRow: {
    paddingHorizontal: 20,
    marginTop: 18,
    gap: 10,
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#DFF5E9',
    marginRight: 10,
  },
  tabActive: {
    backgroundColor: '#0B3D2E',
  },
  tabText: {
    fontWeight: '600',
    color: '#0B7D5E',
  },
  tabTextActive: {
    color: '#fff',
  },
  dailyCard: {
    margin: 20,
    borderRadius: 25,
    padding: 22,
  },
  dailyLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,.85)',
    letterSpacing: 1,
  },
  dailyTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  dailyQuote: {
    color: 'rgba(255,255,255,.9)',
    fontStyle: 'italic',
    marginTop: 12,
    lineHeight: 20,
  },
  readButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 20,
    gap: 8,
  },
  readButtonText: {
    fontWeight: '700',
    color: '#015958',
  },
  list: {
    marginHorizontal: 20,
  },
  duaCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    elevation: 2,
  },
  duaLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  duaTextContainer: {
    flex: 1,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#DFF5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  duaTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  duaSubtitle: {
    marginTop: 3,
    fontSize: 13,
    color: '#B78500',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
  loadingBox: {
    alignItems: 'center',
    marginTop: 40,
  },
  retryBtn: {
    marginTop: 10,
    padding: 10,
  },
  retryText: {
    color: '#0B7D5E',
    fontWeight: 'bold',
  },
});