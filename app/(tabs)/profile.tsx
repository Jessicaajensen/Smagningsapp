import { Pressable, StyleSheet, Text, View } from 'react-native'
import { profileStyles as styles } from './profile.styles'
import { supabase } from '../../lib/supabase'
import { useState } from 'react'

export default function ProfileScreen() {
  const [isSigningOut, setIsSigningOut] = useState(false)

  async function handleSignOut() {
    setIsSigningOut(true)
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Error signing out:', error)
    }
    setIsSigningOut(false)
  }

  return (
    <View style={styles.screenCenter}>
      <View style={styles.mainCard}>
        <Text style={styles.pageKicker}>Account</Text>
        <Text style={styles.pageTitle}>Your profile</Text>
        <Text style={styles.pageBody}>Manage your account settings and preferences.</Text>

        <Pressable
          disabled={isSigningOut}
          onPress={handleSignOut}
          style={({ pressed }) => [
            buttonStyles.signOutButton,
            (pressed || isSigningOut) && buttonStyles.buttonDisabled,
          ]}
        >
          <Text style={buttonStyles.signOutButtonText}>
            {isSigningOut ? 'Signing out...' : 'Sign out'}
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

const buttonStyles = StyleSheet.create({
  signOutButton: {
    marginTop: 20,
    backgroundColor: '#c97676',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#fffdf9',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.65,
  },
})