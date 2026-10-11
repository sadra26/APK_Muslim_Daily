// ini file App.jsx

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PrayerPage from './src/page/prayerPage';
import RegisterPage from './src/auth/registerPage';
import LoginPage from './src/auth/loginPage';
import HomePage from './src/page/homePage';
import DuasPage from './src/page/duasPage';
import DakwahPage from './src/page/dakwahPage';
import SettingsPage from './src/page/settingsPage';
import SurahListScreen from './src/page/surahPage';
import SurahDetailScreen from './src/page/surahDetailPage';
import UmmahScreen from './src/page/ummahPage';
import DoaDetailPage from './src/page/doaDetailPage';



const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginPage} />

        <Stack.Screen name="Home" component={HomePage} />

        <Stack.Screen name="Register" component={RegisterPage} />

        <Stack.Screen name="Prayer" component={PrayerPage} />

        <Stack.Screen name="Duas" component={DuasPage} />

        <Stack.Screen name="Dakwah" component={DakwahPage} />

        <Stack.Screen name="Settings" component={SettingsPage} />

        <Stack.Screen name="SurahList" component={SurahListScreen} />

        <Stack.Screen name="SurahDetail" component={SurahDetailScreen} />

        <Stack.Screen name="Ummah" component={UmmahScreen} />

        <Stack.Screen name="DoaDetail" component={DoaDetailPage} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
