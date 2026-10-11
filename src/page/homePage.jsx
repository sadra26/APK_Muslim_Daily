// ini file homePage.jsx

import React, {useEffect, useMemo, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../components/header';
import Navbar from '../components/navbar';
import {api} from '../services/api';
import {getCurrentUser} from '../services/session';
import {fallbackDashboard, formatCountdown} from '../utils/prayer';



const HomePage = ({navigation}) => {
  const [dashboard, setDashboard] = useState(fallbackDashboard);
  const [secondsLeft, setSecondsLeft] = useState(
    fallbackDashboard.prayer.secondsToUpcoming,
  );


  const user = dashboard.user;
  const quranGoal = dashboard.quranGoal || fallbackDashboard.quranGoal;
  const progressPercent = Math.min(
    100,
    Math.round(((quranGoal.pagesRead || 0) / (quranGoal.targetPages || 604)) * 100),
  );

  const subtitle = useMemo(() => {
    const options = [
      'Semoga harimu penuh barakah dan ketenangan.',
      'Sedikit amal yang konsisten lebih kuat daripada semangat sesaat.',
      'Jaga niat, jaga waktu, dan lanjutkan langkah baik hari ini.',
    ];
    return options[new Date().getDate() % options.length];
  }, []);

  const loadDashboard = async () => {
    const activeUser = getCurrentUser();
    if (!activeUser?.id) {
      setDashboard(fallbackDashboard);
      return;
    }

    try {
      const data = await api.dashboard(activeUser.id);
      setDashboard(data);
      setSecondsLeft(data.prayer.secondsToUpcoming);
    } catch (error) {
      Alert.alert('Mode Offline', 'Dashboard memakai data cadangan sampai backend aktif.');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadDashboard);
    loadDashboard();
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleQuranProgress = async () => {
    const activeUser = getCurrentUser();
    const nextPagesRead = Math.min(
      quranGoal.targetPages || 604,
      (quranGoal.pagesRead || 0) + 1,
    );

    if (!activeUser?.id) {
      Alert.alert('Quran Goal', 'Login dulu untuk menyimpan progress bacaan.');
      return;
    }

    const data = await api.updateQuranProgress(activeUser.id, {
      ...quranGoal,
      pagesRead: nextPagesRead,
    });
    setDashboard(data);
    Alert.alert('Quran Goal', 'Progress bacaan bertambah 1 halaman.');
  };

  const handleSunnahCheckIn = async () => {
    const activeUser = getCurrentUser();
    if (!activeUser?.id) {
      Alert.alert('Sunnah Streak', 'Login dulu untuk menyimpan streak.');
      return;
    }

    const data = await api.sunnahCheckIn(activeUser.id);
    setDashboard(data);
    Alert.alert('Sunnah Streak', 'Check-in sunnah hari ini tersimpan.');
  };

  const handleCharity = async () => {
    const activeUser = getCurrentUser();
    if (!activeUser?.id) {
      Alert.alert('Charity', 'Login dulu untuk mencatat sedekah.');
      return;
    }

    await api.addCharity(activeUser.id, {
      amount: 10000,
      note: 'Catatan sedekah cepat dari Home',
    });
    Alert.alert('Charity', 'Sedekah personal Rp10.000 tercatat.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header navigation={navigation} />

        <View style={styles.greeting}>
          <Text style={styles.title}>
            {dashboard.greeting}, {user.fullName}
          </Text>

          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <LinearGradient
          colors={['#1C8C70', '#86E4C3']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.prayerCard}>
          <View style={styles.row}>
            <View>
              <Text style={styles.smallTitle}>Sholat Saat Ini</Text>

              <Text style={styles.prayerName}>{dashboard.prayer.current}</Text>

              <Text style={styles.timer}>
                Selanjutnya di {formatCountdown(secondsLeft)}
              </Text>
            </View>

            <View style={styles.location}>
              <Icon name="location" color="#fff" size={24} />

              <Text style={styles.locationText}>{user.city?.toUpperCase()}</Text>
            </View>
          </View>

          <View style={styles.bottomPrayer}>
            <View>
              <Text style={styles.smallTitle}>Sholat Mendatang</Text>

              <Text style={styles.upcoming}>
                {dashboard.prayer.upcoming} at {dashboard.prayer.upcomingTime}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => navigation.navigate('Prayer')}>
              <Text style={styles.viewText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.menuRow}>
          <MenuItem
            icon="compass-outline"
            text="QIBLA"
            onPress={() => navigation.navigate('Prayer')}
          />

          <MenuItem 
            icon="book-outline" 
            text="QURAN" 
            onPress={() => navigation.navigate('SurahList')} />

          <MenuItem icon="heart-outline" text="CHARITY" onPress={handleCharity} />

          <MenuItem
            icon="people-outline"
            text="UMMAH"
            onPress={() => navigation.navigate('Ummah')}
          />
        </View>

        <View style={styles.motivationCard}>
          <Image
            source={require('../../assets/motivation.jpg')}
            style={styles.motivationImage}
          />

          <View style={{flex: 1}}>
            <Text style={styles.motivationTitle}>DAILY MOTIVATION</Text>

            <Text style={styles.quote}>"{dashboard.motivation.quote}"</Text>

            <Text style={styles.source}>- {dashboard.motivation.source}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <TouchableOpacity style={styles.statCard} onPress={handleSunnahCheckIn}>
            <MaterialCommunityIcons
              name="star-circle-outline"
              size={28}
              color="#C58A00"
            />

            <Text style={styles.statTitle}>Sunnah Streak</Text>

            <Text style={styles.number}>{dashboard.sunnahStreak}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statCard} onPress={handleQuranProgress}>
            <MaterialCommunityIcons
              name="format-list-bulleted"
              size={28}
              color="#015958"
            />

            <Text style={styles.statTitle}>Quran Goal</Text>
            <Text style={styles.progressLabel}>{progressPercent}% selesai</Text>

            <View style={styles.progress}>
              <View style={[styles.progressFill, {width: `${progressPercent}%`}]} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Navbar activeScreen="Home" navigation={navigation} />
    </SafeAreaView>
  );
};




const MenuItem = ({icon, text, onPress}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Icon name={icon} size={24} color="#015958" />
    <Text style={styles.menuText}>{text}</Text>
  </TouchableOpacity>
);

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7F8',
  },

  greeting: {
    marginHorizontal: 20,
    marginTop: 25,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#222',
  },

  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },

  prayerCard: {
    margin: 20,
    borderRadius: 25,
    padding: 20,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  smallTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },

  prayerName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
  },

  timer: {
    color: '#fff',
    marginTop: 8,
  },

  location: {
    backgroundColor: 'rgba(255,255,255,.2)',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    maxWidth: 120,
  },

  locationText: {
    marginTop: 5,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },

  bottomPrayer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },

  upcoming: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },

  viewButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },

  viewText: {
    fontWeight: '700',
    color: '#015958',
  },

  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
  },

  menuItem: {
    alignItems: 'center',
    width: 70,
  },

  menuText: {
    marginTop: 10,
    fontWeight: '600',
    fontSize: 12,
  },

  motivationCard: {
    margin: 20,
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 20,
    flexDirection: 'row',
    elevation: 3,
  },

  motivationImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 15,
  },

  motivationTitle: {
    fontWeight: 'bold',
    color: '#015958',
  },

  quote: {
    fontSize: 18,
    fontStyle: 'italic',
    marginVertical: 5,
  },

  source: {
    color: '#666',
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 90,
  },

  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 20,
  },

  statTitle: {
    marginTop: 10,
    fontWeight: '600',
    fontSize: 18,
  },

  number: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#B78500',
  },

  progressLabel: {
    marginTop: 10,
    color: '#666',
    fontWeight: '600',
  },

  progress: {
    marginTop: 12,
    height: 8,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },

  progressFill: {
    height: 8,
    backgroundColor: '#0B7D5E',
    borderRadius: 5,
  },
});
