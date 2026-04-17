import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto'

declare const process: {
  env: {
    EXPO_PUBLIC_SUPABASE_URL?: string
    EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string
    EXPO_PUBLIC_SUPABASE_ANON_KEY?: string
  }
}

const isSSR = typeof window === 'undefined'
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabasePublishableKey =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error('Missing Supabase environment variables for web.')
}

if (!/^https?:\/\//.test(supabaseUrl)) {
  throw new Error('EXPO_PUBLIC_SUPABASE_URL must start with http:// or https://')
}

const ExpoWebSecureStoreAdapter = {
  getItem: (key: string) => {
    if (isSSR) return null
    return AsyncStorage.getItem(key)
  },
  setItem: (key: string, value: string) => {
    if (isSSR) return
    return AsyncStorage.setItem(key, value)
  },
  removeItem: (key: string) => {
    if (isSSR) return
    return AsyncStorage.removeItem(key)
  },
}

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey,
  {
    auth: {
      storage: ExpoWebSecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
)