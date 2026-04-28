import { useAuthContext } from '../hooks/use-auth-context'
import { useEffect } from 'react'
import * as SplashScreen from 'expo-splash-screen'

void SplashScreen.preventAutoHideAsync().catch(() => {
  // preventAutoHideAsync can reject if called after splash is already hidden.
})

export function SplashScreenController() {
  const { isLoading } = useAuthContext()

  useEffect(() => {
    if (isLoading) return

    void SplashScreen.hideAsync().catch(() => {
      // hideAsync can reject if splash is not currently shown.
    })
  }, [isLoading])

  return null
}