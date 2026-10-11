// ini file registerPage.jsx

import React, {useState} from 'react';

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Input from '../components/input';
import Button from '../components/button';
import {api} from '../services/api';

const RegisterPage = ({navigation}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Data Belum Lengkap', 'Mohon isi semua kolom terlebih dahulu.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Tidak Cocok', 'Password dan konfirmasi password harus sama.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Password Terlalu Pendek', 'Password minimal 6 karakter.');
      return;
    }

    try {
      setLoading(true);
      await api.register(fullName, email, password);
      Alert.alert('Akun Berhasil Dibuat', 'Kamu akan masuk ke halaman utama.', [
        {text: 'OK', onPress: () => navigation.replace('Home')},
      ]);
    } catch (error) {
      Alert.alert('Registrasi Gagal', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo_mosque.png')}
            style={styles.logo}
          />

          <Text style={styles.title}>Buat Akun</Text>

          <Text style={styles.subtitle}>
            Gabungkan diri dengan komunitas kami dan nikmati pengalaman ibadah yang lebih baik.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Nama Lengkap</Text>

          <Input
            placeholder="Nama lengkap Anda"
            value={fullName}
            onChangeText={setFullName}
          />

          <Text style={[styles.label, {marginTop: 20}]}>Username Atau Email</Text>

          <Input
            placeholder="nama@email.com"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={[styles.label, {marginTop: 20}]}>Password</Text>

          <Input
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Text style={[styles.label, {marginTop: 20}]}>Konfirmasi Password</Text>

          <Input
            placeholder="••••••••"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <Button title={loading ? 'Loading...' : 'Daftar Akun'} onPress={handleSignUp} />

          <Text style={styles.or}>Atau</Text>

          <View style={styles.social}>
            <TouchableOpacity style={styles.circle}>
              <FontAwesome name="facebook" size={24} color="#3b5998" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.circle}>
              <FontAwesome name="twitter" size={24} color="#1DA1F2" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.circle}>
              <FontAwesome name="google" size={24} color="#db4a39" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottom}>
          <Text> Sudah punya akun? </Text>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signup}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },

  logoContainer: {
    alignItems: 'center',
    marginTop: 35,
    paddingHorizontal: 30,
  },

  logo: {
    width: 90,
    height: 90,
    marginBottom: 25,
    resizeMode: 'contain',
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111',
  },

  subtitle: {
    marginTop: 10,
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    lineHeight: 22,
  },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 25,
    marginTop: 35,
    borderRadius: 25,
    padding: 25,
    elevation: 4,
  },

  label: {
    fontWeight: '600',
    color: '#333',
  },

  or: {
    textAlign: 'center',
    marginVertical: 25,
    color: '#777',
    fontWeight: 'bold',
  },

  social: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },

  circle: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: '#F3F3F3',
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 30,
  },

  signup: {
    color: '#0C6E52',
    fontWeight: 'bold',
  },
});
