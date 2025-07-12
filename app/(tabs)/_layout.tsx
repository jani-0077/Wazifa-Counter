import { Tabs } from 'expo-router';
import { Image } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#9ca3af',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../../assets/images/quran(1).png')}
              style={{
                width: size,
                height: size,
                tintColor: color,
                resizeMode: 'contain',
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="counter"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../../assets/images/bead.png')}
              style={{
                width: size,
                height: size,
                tintColor: color,
                resizeMode: 'contain',
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}