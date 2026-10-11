// ini file settingsPage.jsx

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Navbar from '../components/navbar';
import Header from '../components/header';
import {api} from '../services/api';
import {getCurrentUser} from '../services/session';

const INITIAL_NOTIFICATIONS = [
  {id: '1', name: 'Fajr', time: '04:42 AM', sound: 'Adhan', icon: 'weather-sunset-up', enabled: true},
  {id: '2', name: 'Dhuhr', time: '12:15 PM', sound: 'Beep Only', icon: 'weather-sunny', enabled: true},
  {id: '3', name: 'Asr', time: '03:38 PM', sound: 'Silent', icon: 'weather-partly-cloudy', enabled: false},
  {id: '4', name: 'Maghrib', time: '06:15 PM', sound: 'Adhan', icon: 'weather-sunset', enabled: true},
  {id: '5', name: 'Isha', time: '07:35 PM', sound: 'Beep Only', icon: 'weather-night', enabled: true},
];

const SETTINGS_OPTIONS = [
  {
    id: 'help',
    title: 'Pusat Bantuan',
    subtitle: 'FAQ, kontak bantuan, dan panduan penggunaan.',
    icon: 'help-circle-outline',
  },
  {
    id: 'about',
    title: 'Tentang Aplikasi',
    subtitle: 'Informasi versi dan tujuan Muslim Daily.',
    icon: 'information-circle-outline',
  },
  {
    id: 'privacy',
    title: 'Kebijakan Privasi',
    subtitle: 'Cara aplikasi menjaga dan menggunakan data kamu.',
    icon: 'shield-checkmark-outline',
  },
  {
    id: 'terms',
    title: 'Syarat & Ketentuan',
    subtitle: 'Ketentuan penggunaan layanan Muslim Daily.',
    icon: 'document-text-outline',
  },
];

const SettingsPage = ({navigation}) => {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const allEnabled = notifications.every(item => item.enabled);

  const loadReminders = async () => {
    const user = getCurrentUser();
    if (!user?.id) return;

    try {
      const data = await api.prayers(user.id);
      const nextNotifications = INITIAL_NOTIFICATIONS.map(item => {
        const reminder = data.reminders.find(
          row => row.prayerName === item.name || row.prayerName === 'Dhuhr' && item.name === 'Dhuhr',
        );

        const prayerTime = data.schedule.find(
          row => row.name === item.name || row.name === 'Dhuhr' && item.name === 'Dhuhr',
        )?.time;

        return {
          ...item,
          time: prayerTime || item.time,
          enabled: reminder ? Boolean(reminder.enabled) : item.enabled,
          sound: reminder?.sound || item.sound,
        };
      });
      setNotifications(nextNotifications);
    } catch (error) {
      Alert.alert('Settings', 'Gagal memuat reminder dari backend.');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadReminders);
    loadReminders();
    return unsubscribe;
  }, [navigation]);

  const toggleOne = async id => {
    const user = getCurrentUser();
    const selected = notifications.find(item => item.id === id);
    if (!user?.id || !selected) return;

    const enabled = !selected.enabled;
    setNotifications(prev =>
      prev.map(item => (item.id === id ? {...item, enabled} : item)),
    );
    await api.updateReminder(user.id, selected.name, {
      enabled,
      sound: selected.sound,
    });
  };

  const toggleAll = async () => {
    const user = getCurrentUser();
    if (!user?.id) return;

    const enabled = !allEnabled;
    setNotifications(prev => prev.map(item => ({...item, enabled})));
    await Promise.all(
      notifications.map(item =>
        api.updateReminder(user.id, item.name, {
          enabled,
          sound: item.sound,
        }),
      ),
    );
  };

  const handleSetFridayReminder = () => {
    Alert.alert('Reminder Set', 'Kamu akan diingatkan membaca Surah Al-Kahf setiap Jumat.');
  };

  const handleOpenSetting = item => {
    Alert.alert(item.title, item.subtitle);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 110}}>
        {/* Header */}

        <Header navigation={navigation} />

        {/* Title */}

        <View style={styles.titleBlock}>
          <Text style={styles.title}>Pengingat</Text>
          <Text style={styles.subtitle}>
            Sesuaikan notifikasi ibadah harian Anda.
          </Text>
        </View>

        {/* Section Header */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Notifikasi Sholat</Text>

          <TouchableOpacity onPress={toggleAll}>
            <Text
              style={[
                styles.allEnabledText,
                !allEnabled && styles.allEnabledTextOff,
              ]}>
              {allEnabled ? 'SEMUA DIAKTIFKAN' : 'AKTIFKAN SEMUA'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Notification List */}

        <View style={styles.list}>
          {notifications.map(item => (
            <View key={item.id} style={styles.notifCard}>
              <View style={styles.notifLeft}>
                <View
                  style={[
                    styles.iconCircle,
                    item.enabled && styles.iconCircleActive,
                  ]}>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={22}
                    color={item.enabled ? '#fff' : '#0B7D5E'}
                  />
                </View>

                <View>
                  <Text style={styles.notifName}>{item.name}</Text>
                  <Text style={styles.notifDetail}>
                    {item.time} • {item.sound}
                  </Text>
                </View>
              </View>

              <Switch
                value={item.enabled}
                onValueChange={() => toggleOne(item.id)}
                trackColor={{false: '#ddd', true: '#0B7D5E'}}
                thumbColor="#fff"
              />
            </View>
          ))}
        </View>

        {/* Friday Special */}

        <LinearGradient
          colors={['#1C8C70', '#0B3D2E']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.fridayCard}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Jum'at Berkah</Text>
          </View>

          <Text style={styles.fridayTitle}>Surah Al-Kahf</Text>

          <Text style={styles.fridayQuote}>
            Bacalah Surah Al-Kahf pada hari Jumat untuk mendapatkan cahaya dan perlindungan dari fitnah Dajjal.
          </Text>

          <TouchableOpacity
            style={styles.setReminderButton}
            onPress={handleSetFridayReminder}>
            <Text style={styles.setReminderText}>Atur Pengingat</Text>
            <Icon name="notifications" size={16} color="#015958" />
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.generalSection}>
          <Text style={styles.sectionTitle}>Pengaturan Umum</Text>

          {SETTINGS_OPTIONS.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.settingCard}
              onPress={() => handleOpenSetting(item)}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Icon name={item.icon} size={22} color="#0B7D5E" />
                </View>

                <View style={styles.settingTextBlock}>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                  <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                </View>
              </View>

              <Icon name="chevron-forward" size={18} color="#B0B0B0" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}

      <Navbar activeScreen="Settings" navigation={navigation} />
    </SafeAreaView>
  );
};

export default SettingsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7F8',
  },

  header: {
    marginTop: 20,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoText: {
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 8,
    color: '#003E40',
  },

  profile: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },

  titleBlock: {
    marginHorizontal: 20,
    marginTop: 22,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#0B3D2E',
  },

  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: '#666',
    lineHeight: 20,
  },

  sectionHeader: {
    marginHorizontal: 20,
    marginTop: 28,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },

  allEnabledText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0B7D5E',
    letterSpacing: 0.5,
  },

  allEnabledTextOff: {
    color: '#999',
  },

  list: {
    marginHorizontal: 20,
  },

  notifCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 18,
    marginBottom: 12,
    elevation: 2,
  },

  notifLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DFF5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  iconCircleActive: {
    backgroundColor: '#0B7D5E',
  },

  notifName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },

  notifDetail: {
    marginTop: 2,
    fontSize: 13,
    color: '#888',
  },

  fridayCard: {
    margin: 20,
    borderRadius: 25,
    padding: 22,
  },

  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },

  fridayTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
  },

  fridayQuote: {
    color: 'rgba(255,255,255,.9)',
    marginTop: 10,
    lineHeight: 20,
  },

  setReminderButton: {
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

  setReminderText: {
    fontWeight: '700',
    color: '#015958',
  },

  generalSection: {
    marginHorizontal: 20,
    marginBottom: 10,
  },

  settingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 18,
    marginTop: 12,
    elevation: 2,
  },

  settingLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DFF5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  settingTextBlock: {
    flex: 1,
  },

  settingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
  },

  settingSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: '#888',
    lineHeight: 17,
  },
});
