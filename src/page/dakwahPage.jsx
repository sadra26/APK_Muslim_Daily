// ini file dakwahPage.jsx

import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import YoutubePlayer from 'react-native-youtube-iframe';

import Navbar from '../components/navbar';
import Header from '../components/header';

// Daftar video dakwah (tambahkan video lain di sini)
const videoDakwahList = [
  {
    id: '1',
    videoId: 'rNEfq-AABK4',
    title: 'Cari Tahu Arah Hidupmu',
    author: 'Ust. Adi Hidayat',
  },
  
  {
    id: '2',
    videoId: 'R2vsmZ-ZXQ4',
    title: 'Mengenal Islam Lebih Dekat',
    author: 'Ust. Adi Hidayat',
  },

  {
    id: '3',
    videoId: 'J8SrWeyoZ1c',
    title: 'Bagaimana Mengendalikan Nafsu',
    author: 'Ust. Adi Hidayat',
  }

];

const DakwahPage = ({navigation}) => {
  const [quranSaved, setQuranSaved] = useState(false);
  const [hadithSaved, setHadithSaved] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [playing, setPlaying] = useState(true);

  const handlePlayVideo = video => {
    setSelectedVideo(video);
    setModalVisible(true);
    setPlaying(true);
  };

  const closeModal = () => {
    setPlaying(false);
    setModalVisible(false);
  };

  const handleShare = source => {
    Alert.alert('Bagikan', `Membagikan ${source}...`);
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
          <Text style={styles.title}>Dakwah Harian</Text>
          <Text style={styles.subtitle}>
            Inspirasi untuk perjalanan Ibadah Anda
          </Text>
        </View>

        {/* Quran Verse Card */}

        <LinearGradient
          colors={['#1C8C70', '#0B3D2E']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.quranCard}>
          <View style={styles.quranTopRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Ayat Qur'an</Text>
            </View>

            <Text style={styles.quoteMark}>”</Text>
          </View>

          <Text style={styles.quranQuote}>
            Maka sesungguhnya bersama kesulitan ada kemudahan. Sesungguhnya
            bersama kesulitan ada kemudahan.
          </Text>

          <View style={styles.quranBottomRow}>
            <Text style={styles.quranSource}>Surah Al-Insyirah 5-6</Text>

            <View style={styles.iconRow}>
              <TouchableOpacity
                style={styles.circleButton}
                onPress={() => setQuranSaved(!quranSaved)}>
                <Icon
                  name={quranSaved ? 'bookmark' : 'bookmark-outline'}
                  size={18}
                  color="#fff"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.circleButton}
                onPress={() => handleShare('Surah Al-Insyirah 5-6')}>
                <Icon name="share-social-outline" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Hadith Card */}

        <View style={styles.hadithCard}>
          <View style={styles.hadithTopRow}>
            <View style={styles.hadithBadge}>
              <Text style={styles.hadithBadgeText}>HADITH</Text>
            </View>

            <Text style={styles.quoteMarkDark}>”</Text>
          </View>

          <Text style={styles.hadithQuote}>
            Sebaik-baik kalian adalah yang paling baik akhlaknya.
          </Text>

          <View style={styles.divider} />

          <View style={styles.hadithBottomRow}>
            <Text style={styles.hadithSource}>Sahih Bukhari</Text>

            <View style={styles.hadithActions}>
              <TouchableOpacity
                style={styles.textAction}
                onPress={() => setHadithSaved(!hadithSaved)}>
                <Icon
                  name={hadithSaved ? 'bookmark' : 'bookmark-outline'}
                  size={16}
                  color="#0B7D5E"
                />
                <Text style={styles.textActionLabel}>
                  {hadithSaved ? 'SAVED' : 'SAVE'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.textAction}
                onPress={() => handleShare('hadith Sahih Bukhari')}>
                <Icon name="share-social-outline" size={16} color="#0B7D5E" />
                <Text style={styles.textActionLabel}>SHARE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Video Dakwah List */}

        <View style={{marginHorizontal: 20, marginTop: 20}}>
          <Text style={styles.sectionTitle}>Video Dakwah</Text>

          {videoDakwahList.map(video => (
            <TouchableOpacity
              key={video.id}
              style={styles.videoListCard}
              onPress={() => handlePlayVideo(video)}
              activeOpacity={0.85}>
              <View style={styles.thumbnailWrapper}>
                <Image
                  source={{
                    uri: `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`,
                  }}
                  style={styles.thumbnail}
                />
                <View style={styles.playOverlay}>
                  <Icon name="play" size={22} color="#fff" />
                </View>
              </View>

              <View style={styles.videoInfo}>
                <Text style={styles.videoListTitle} numberOfLines={2}>
                  {video.title}
                </Text>
                <Text style={styles.videoListAuthor}>{video.author}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}

      <Navbar activeScreen="Dakwah" navigation={navigation} />

      {/* Modal Video Player */}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} numberOfLines={1}>
                {selectedVideo?.title}
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <Icon name="close" size={26} color="#333" />
              </TouchableOpacity>
            </View>

            {selectedVideo && (
              <YoutubePlayer
                height={220}
                play={playing}
                videoId={selectedVideo.videoId}
                onChangeState={state => {
                  if (state === 'ended') setPlaying(false);
                }}
              />
            )}

            <Text style={styles.modalAuthor}>{selectedVideo?.author}</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default DakwahPage;

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
  },

  quranCard: {
    margin: 20,
    borderRadius: 25,
    padding: 22,
  },

  quranTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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

  quoteMark: {
    fontSize: 36,
    color: 'rgba(255,255,255,.5)',
    fontWeight: 'bold',
  },

  quranQuote: {
    fontSize: 19,
    fontWeight: '700',
    color: '#fff',
    marginTop: 14,
    lineHeight: 26,
  },

  quranBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 22,
  },

  quranSource: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255,255,255,.9)',
  },

  iconRow: {
    flexDirection: 'row',
    gap: 10,
  },

  circleButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  hadithCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 4,
    borderRadius: 25,
    padding: 22,
    elevation: 2,
  },

  hadithTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  hadithBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#DFF5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  hadithBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0B7D5E',
    letterSpacing: 0.5,
  },

  quoteMarkDark: {
    fontSize: 36,
    color: '#E8B84B',
    fontWeight: 'bold',
  },

  hadithQuote: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginTop: 14,
    lineHeight: 24,
  },

  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginTop: 18,
    marginBottom: 14,
  },

  hadithBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  hadithSource: {
    fontWeight: '700',
    color: '#0B7D5E',
  },

  hadithActions: {
    flexDirection: 'row',
    gap: 18,
  },

  textAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  textActionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0B7D5E',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B3D2E',
    marginBottom: 12,
  },

  videoListCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    marginBottom: 12,
    elevation: 2,
  },

  thumbnailWrapper: {
    width: 120,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },

  thumbnail: {
    width: '100%',
    height: '100%',
  },

  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  videoInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },

  videoListTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
  },

  videoListAuthor: {
    fontSize: 12,
    color: '#0B7D5E',
    marginTop: 4,
    fontWeight: '600',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  modalTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#0B3D2E',
    marginRight: 10,
  },

  modalAuthor: {
    marginTop: 10,
    fontSize: 13,
    color: '#0B7D5E',
    fontWeight: '600',
  },
});