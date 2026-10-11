import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const NAV_ITEMS = [
  {
    title: 'Beranda',
    route: 'Home',
    icon: 'home-outline',
    activeIcon: 'home',
  },
  {
    title: 'Sholat',
    route: 'Prayer',
    icon: 'time-outline',
    activeIcon: 'time',
  },
  {
    title: 'Doa',
    route: 'Duas',
    icon: 'book-outline',
    activeIcon: 'book',
  },
  {
    title: 'Dakwah',
    route: 'Dakwah',
    icon: 'megaphone-outline',
    activeIcon: 'megaphone',
  },
  {
    title: 'Pengaturan',
    route: 'Settings',
    icon: 'settings-outline',
    activeIcon: 'settings',
  },
];

const Navbar = ({activeScreen, navigation}) => {
  return (
    <View style={styles.bottomNav}>
      {NAV_ITEMS.map(item => {
        const active = item.route === activeScreen || item.title === activeScreen;
        const iconName = active ? item.activeIcon || item.icon : item.icon;

        return (
          <TouchableOpacity
            key={item.title}
            style={styles.navItem}
            onPress={() => {
              if (item.route && item.route !== activeScreen) {
                navigation?.navigate(item.route);
              }
            }}>
            <Icon
              name={iconName}
              size={22}
              color={active ? '#0B7D5E' : '#666'}
            />
            <Text style={[styles.navText, active && styles.navTextActive]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#eee',
  },

  navItem: {
    alignItems: 'center',
  },

  navText: {
    fontSize: 11,
    marginTop: 3,
    color: '#666',
  },

  navTextActive: {
    color: '#0B7D5E',
  },
});

export default Navbar;
