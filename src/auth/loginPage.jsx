// ini file loginPage.jsx

import React, {useState} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


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


import Input from '../components/input';
import Button from '../components/button';
import {api} from '../services/api';

const LoginPage = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Data Belum Lengkap', 'Mohon isi email dan password.');
      return;
    }

    try {
      setLoading(true);
      await api.login(email, password);
      navigation.replace('Home');
    } catch (error) {
      Alert.alert('Login Gagal', error.message);
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

          <Text style={styles.title}>Selamat Datang</Text>

          <Text style={styles.subtitle}>
            Temukan ketenangan dalam ibadah harian Anda dengan companion spiritual modern kami.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Username Atau Email</Text>

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

          <TouchableOpacity style={styles.forgot}>
            <Text style={styles.forgotText}>Lupa Password?</Text>
          </TouchableOpacity>

          <Button title={loading ? 'Loading...' : 'Login'} onPress={handleLogin} />

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
          <Text>Belum punya akun? </Text>

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signup}>Buat akun</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginPage;

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
    fontSize: 36,
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

  forgot: {
    alignItems: 'flex-end',
    marginTop: 12,
  },

  forgotText: {
    color: '#0C6E52',
    fontWeight: '600',
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
