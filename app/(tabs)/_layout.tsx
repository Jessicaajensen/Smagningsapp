import Ionicons from '@expo/vector-icons/Ionicons'
import { Tabs } from 'expo-router'

const iconColor = '#7a6c66'

function TabIcon({
  name,
  color,
  size,
}: {
  name: keyof typeof Ionicons.glyphMap
  color: string
  size: number
}) {
  return <Ionicons name={name} size={size} color={color} />
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginBottom: 2,
        },
        tabBarStyle: {
          backgroundColor: '#fffdf9',
          borderTopColor: '#eee4d8',
          borderTopWidth: 1,
          height: 90,
          paddingTop: 10,
          paddingBottom: 14,
          paddingHorizontal: 12,
        },
        tabBarActiveTintColor: '#7a2f3d',
        tabBarInactiveTintColor: iconColor,
        tabBarItemStyle: {
          paddingVertical: 6,
        },
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Feed',
          tabBarLabel: 'Feed',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="wine-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: 'Bibliotek',
          tabBarLabel: 'Bibliotek',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="book-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  )
}