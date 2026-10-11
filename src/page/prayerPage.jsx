// ini file prayerPage.jsx

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../components/header';
import Navbar from '../components/navbar';
import {api} from '../services/api';
import {getCurrentUser, setCurrentUser} from '../services/session';
import {formatLocation, LOCATIONS} from '../services/locations';
import {fallbackDashboard, formatCountdown, PRAYER_ICONS} from '../utils/prayer';

const PrayerPage = ({navigation}) => {
  const [prayerData, setPrayerData] = useState({
    ...fallbackDashboard.prayer,
    location: 'Jakarta, Indonesia',
    reminders: [],
  });
  const [secondsLeft, setSecondsLeft] = useState(
    fallbackDashboard.prayer.secondsToUpcoming,
  );
  const [locationModalVisible, setLocationModalVisible] = useState(false);

  const loadPrayers = async () => {
    const user = getCurrentUser();
    if (!user?.id) return;

    try {
      const data = await api.prayers(user.id);
      setPrayerData(data);
      setSecondsLeft(data.secondsToUpcoming);
    } catch (error) {
      Alert.alert('Jadwal Shalat', 'Gagal memuat jadwal dari backend.');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadPrayers);
    loadPrayers();
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isReminderEnabled = prayerName => {
    const reminder = prayerData.reminders?.find(
      item => item.prayerName === prayerName,
    );
    return reminder ? Boolean(reminder.enabled) : true;
  };

  const toggleReminder = async prayerName => {
    const user = getCurrentUser();
    if (!user?.id) {
      Alert.alert('Pengingat', 'Login dulu untuk menyimpan pengingat.');
      return;
    }

    const enabled = !isReminderEnabled(prayerName);
    await api.updateReminder(user.id, prayerName, {enabled, sound: 'Adhan'});
    await loadPrayers();
  };

  const handleQibla = () => {
    const user = getCurrentUser();
    if (!user?.latitude || !user?.longitude) {
      Alert.alert('Arah Kiblat', 'Pilih lokasi dulu untuk menghitung kiblat.');
      return;
    }

    const bearing = calculateQiblaBearing(user.latitude, user.longitude);
    Alert.alert(
      'Arah Kiblat',
      `Arah kiblat dari lokasimu sekitar ${bearing} derajat dari utara.`,
    );
  };

  const handleSelectLocation = async location => {
    const user = getCurrentUser();
    if (!user?.id) {
      setLocationModalVisible(false);
      return;
    }

    try {
      const data = await api.updateLocation(user.id, location);
      setCurrentUser(data.user);
      setLocationModalVisible(false);
      await loadPrayers();
    } catch (error) {
      Alert.alert('Lokasi', error.message);
    }
  };

  const schedule = prayerData.schedule || fallbackDashboard.prayer.schedule;
  const upcomingPrayer = schedule.find(item => item.name === prayerData.upcoming);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 110}}>
        <Header navigation={navigation} />

        <View style={styles.topRow}>
          <TouchableOpacity
            style={styles.locationPicker}
            onPress={() => setLocationModalVisible(true)}>
            <Icon name="location" size={18} color="#015958" />
            <Text style={styles.locationText}>{prayerData.location}</Text>
            <Icon name="chevron-down" size={16} color="#015958" />
          </TouchableOpacity>

          <View style={styles.dateBox}>
            <Text style={styles.todayLabel}>HARI INI</Text>
            <Text style={styles.dateText}>{new Date().toLocaleDateString('id-ID')}</Text>
          </View>
        </View>

        {upcomingPrayer && (
          <LinearGradient
            colors={['#1C8C70', '#86E4C3']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.prayerCard}>
            <View style={styles.row}>
              <View>
                <Text style={styles.smallTitle}>Sholat Mendatang</Text>
                <Text style={styles.prayerName}>{upcomingPrayer.name}</Text>
              </View>

              <TouchableOpacity
                style={styles.bellCircle}
                onPress={() => toggleReminder(upcomingPrayer.name)}>
                <Icon
                  name={
                    isReminderEnabled(upcomingPrayer.name)
                      ? 'notifications'
                      : 'notifications-outline'
                  }
                  size={26}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.bottomPrayer}>
              <View>
                <Text style={styles.time}>{upcomingPrayer.time}</Text>
                <Text style={styles.countdown}>
                  Selanjutnya di {formatCountdown(secondsLeft)}
                </Text>
              </View>

              <TouchableOpacity style={styles.viewButton} onPress={handleQibla}>
                <Text style={styles.viewText}>Lihat Qibla</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        )}

        <Text style={styles.sectionTitle}>Jadwal Hari Ini</Text>

        <View style={styles.scheduleList}>
          {schedule.map(item => {
            const current = item.name === prayerData.current;
            const passed = !item.isInfo && item.name !== prayerData.upcoming && !current;

            return item.isInfo ? (
              <View key={item.name} style={styles.infoRow}>
                <Icon name="sunny-outline" size={16} color="#B78500" />
                <Text style={styles.infoText}>{item.name}</Text>
                <Text style={styles.infoTime}>{item.time}</Text>
              </View>
            ) : (
              <View
                key={item.name}
                style={[styles.scheduleItem, current && styles.scheduleItemActive]}>
                <View style={styles.scheduleLeft}>
                  <View
                    style={[styles.iconCircle, current && styles.iconCircleActive]}>
                    <MaterialCommunityIcons
                      name={PRAYER_ICONS[item.name] || 'clock-outline'}
                      size={22}
                      color={current ? '#fff' : '#015958'}
                    />
                  </View>

                  <View>
                    <Text
                      style={[
                        styles.prayerItemName,
                        current && styles.prayerItemNameActive,
                      ]}>
                      {item.name}
                    </Text>

                    <Text
                      style={[
                        styles.statusText,
                        passed && styles.passedText,
                        current && styles.currentText,
                      ]}>
                      {current ? 'Sedang Berlangsung' : item.name === prayerData.upcoming ? 'Akan Datang' : 'Lewat'}
                    </Text>
                  </View>
                </View>

                <View style={styles.scheduleRight}>
                  <Text
                    style={[styles.scheduleTime, current && styles.scheduleTimeActive]}>
                    {item.time}
                  </Text>

                  <TouchableOpacity onPress={() => toggleReminder(item.name)}>
                    <Icon
                      name={
                        isReminderEnabled(item.name)
                          ? 'notifications'
                          : 'notifications-off-outline'
                      }
                      size={20}
                      color={
                        current
                          ? '#fff'
                          : isReminderEnabled(item.name)
                          ? '#0B7D5E'
                          : '#999'
                      }
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <Navbar activeScreen="Prayer" navigation={navigation} />

      <Modal
        visible={locationModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLocationModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setLocationModalVisible(false)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Pilih Lokasi</Text>

            {LOCATIONS.map(location => (
              <TouchableOpacity
                key={formatLocation(location)}
                style={styles.modalItem}
                onPress={() => handleSelectLocation(location)}>
                <Icon name="radio-button-off" size={18} color="#0B7D5E" />
                <Text style={styles.modalItemText}>{formatLocation(location)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const calculateQiblaBearing = (latitude, longitude) => {
  const kaabaLat = (21.4225 * Math.PI) / 180;
  const kaabaLng = (39.8262 * Math.PI) / 180;
  const userLat = (Number(latitude) * Math.PI) / 180;
  const userLng = (Number(longitude) * Math.PI) / 180;
  const deltaLng = kaabaLng - userLng;
  const y = Math.sin(deltaLng);
  const x =
    Math.cos(userLat) * Math.tan(kaabaLat) -
    Math.sin(userLat) * Math.cos(deltaLng);
  const bearing = (Math.atan2(y, x) * 180) / Math.PI;

  return Math.round((bearing + 360) % 360);
};

export default PrayerPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7F8',
  },

  topRow: {
    marginHorizontal: 20,
    marginTop: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },

  locationPicker: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 15,
    elevation: 2,
  },

  locationText: {
    flex: 1,
    fontWeight: '700',
    color: '#222',
    marginHorizontal: 8,
  },

  dateBox: {
    alignItems: 'flex-end',
  },

  todayLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '700',
  },

  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },

  prayerCard: {
    margin: 20,
    borderRadius: 25,
    padding: 22,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  smallTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,.85)',
    letterSpacing: 1,
  },

  prayerName: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },

  bellCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomPrayer: {
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  time: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },

  countdown: {
    color: 'rgba(255,255,255,.9)',
    marginTop: 4,
  },

  viewButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },

  viewText: {
    fontWeight: '700',
    color: '#015958',
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 12,
  },

  scheduleList: {
    marginHorizontal: 20,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3EBD8',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    marginBottom: 10,
  },

  infoText: {
    flex: 1,
    marginLeft: 8,
    fontWeight: '600',
    color: '#8A6A00',
  },

  infoTime: {
    fontWeight: '600',
    color: '#8A6A00',
  },

  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 18,
    marginBottom: 10,
    elevation: 2,
  },

  scheduleItemActive: {
    backgroundColor: '#0B7D5E',
  },

  scheduleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F3F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  iconCircleActive: {
    backgroundColor: 'rgba(255,255,255,.2)',
  },

  prayerItemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },

  prayerItemNameActive: {
    color: '#fff',
  },

  statusText: {
    marginTop: 2,
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
  },

  passedText: {
    color: '#B0B0B0',
  },

  currentText: {
    color: '#EFFFF6',
    letterSpacing: 0.5,
  },

  scheduleRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  scheduleTime: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginRight: 12,
  },

  scheduleTimeActive: {
    color: '#fff',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.4)',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 22,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 16,
  },

  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },

  modalItemText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#333',
  },
});
