import React, {useState} from 'react';
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {clearCurrentUser, getCurrentUser} from '../services/session';


const Header = ({navigation}) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const user = getCurrentUser() || {
    fullName: 'Guest',
    email: 'Belum login',
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
  };

  const handleMenuPress = title => {
    closeSidebar();
    Alert.alert(title, `Membuka halaman ${title}.`);
  };

  const handleLogout = () => {
    closeSidebar();
    Alert.alert('Keluar', 'Apakah kamu yakin ingin keluar?', [
      {text: 'Batal', style: 'cancel'},
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: () => {
          clearCurrentUser();
          navigation?.navigate('Login');
        },
      },
    ]);
  };

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.logoText}>Muslim Daily</Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setSidebarVisible(true)}>
          <Image
            source={require('../../assets/profile.jpg')}
            style={styles.profile}
          />
        </TouchableOpacity>
      </View>

      <Modal
        visible={sidebarVisible}
        transparent
        animationType="fade"
        onRequestClose={closeSidebar}>
        <View style={styles.modalRoot}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.backdrop}
            onPress={closeSidebar}
          />

          <View style={styles.sidebar}>
            <View style={styles.sidebarHeader}>
              <Text style={styles.sidebarTitle}>Profile / Akun</Text>

              <TouchableOpacity
                onPress={closeSidebar}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.profileBlock}>
              <Image
                source={require('../../assets/profile.jpg')}
                style={styles.sidebarProfile}
              />

              <View style={styles.profileTextBlock}>
                <Text style={styles.userName}>{user.fullName}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </View>
            </View>

          

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Icon name="log-out-outline" size={20} color="#B3261E" />
              <Text style={styles.logoutText}>Keluar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 20,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logoText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#003E40',
  },

  profile: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },

  modalRoot: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,.35)',
  },

  sidebar: {
    width: '78%',
    maxWidth: 340,
    height: '100%',
    backgroundColor: '#F4F7F8',
    paddingTop: 28,
    paddingHorizontal: 20,
    elevation: 12,
  },

  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sidebarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0B3D2E',
  },

  profileBlock: {
    marginTop: 24,
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },

  sidebarProfile: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },

  profileTextBlock: {
    flex: 1,
    marginLeft: 14,
  },

  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },

  userEmail: {
    marginTop: 3,
    fontSize: 13,
    color: '#777',
  },

  menuList: {
    marginTop: 22,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    elevation: 1,
  },

  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#DFF5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  menuText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },

  logoutButton: {
    marginTop: 'auto',
    marginBottom: 28,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCEEEE',
    padding: 15,
    borderRadius: 16,
  },

  logoutText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '700',
    color: '#B3261E',
  },
});

export default Header;
