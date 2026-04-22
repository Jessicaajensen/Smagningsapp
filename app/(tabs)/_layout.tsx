import Ionicons from '@expo/vector-icons/Ionicons'
import { Tabs, usePathname, useRouter } from 'expo-router'
import { Pressable, Text, View, StyleSheet } from 'react-native'

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

function StartTastingButton() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/questionnaire', params: { returnTo: pathname } })}
      style={({ pressed }) => [styles.startButton, pressed && styles.startButtonPressed]}
      accessibilityRole="button"
      accessibilityLabel="Start smagning"
    >
      <Ionicons name="add" size={26} color="#fffdf9" />
    </Pressable>
  )
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#fffdf9',
        },
        headerShadowVisible: false,
        headerTitleAlign: 'left',
        headerTitle: () => (
          <View style={styles.titleRow}>
            <View style={styles.logoMark}>
              <Ionicons name="wine-outline" size={18} color="#fffdf9" />
            </View>
            <Text style={styles.titleText}>Palate</Text>
          </View>
        ),
        headerRight: () => <StartTastingButton />,
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

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoMark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#7a2f3d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    color: '#2e251f',
    fontSize: 24,
    fontWeight: '600',
  },
  startButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#7a2f3d',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  startButtonPressed: {
    opacity: 0.84,
  },
})