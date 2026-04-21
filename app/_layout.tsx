import { Stack, usePathname, useRouter } from 'expo-router'
import { useEffect } from 'react'

import { SplashScreenController } from '../components/splash-screen-controller'
import { useAuthContext } from '../hooks/use-auth-context'
import AuthProvider from '../providers/auth-provider'

function AuthRedirects() {
  const { isLoading, isLoggedIn } = useAuthContext()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    if (!isLoggedIn && pathname !== '/login') {
      router.replace('/login')
      return
    }

    if (isLoggedIn && (pathname === '/login' || pathname === '/')) {
      router.replace('/(tabs)/home')
    }
  }, [isLoading, isLoggedIn, pathname, router])

  return null
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <SplashScreenController />
      <AuthRedirects />

      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#0f172a' },
          headerTintColor: '#f8fafc',
          contentStyle: { backgroundColor: '#0f172a' },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="questionnaire" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
      </Stack>
    </AuthProvider>
  )
}