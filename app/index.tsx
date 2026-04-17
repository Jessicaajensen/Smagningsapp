import { StyleSheet, Text, View } from 'react-native'

import { sharedStyles } from './(tabs)/shared.styles'
import SignOutButton from '../components/social-auth-buttons/sign-out-button'
import { useAuthContext } from '../hooks/use-auth-context'

export default function HomeScreen() {
  const { profile } = useAuthContext()

  return (
    <View style={sharedStyles.screenCenter}>
      <View style={sharedStyles.mainCard}>
        <Text style={sharedStyles.pageKicker}>Account</Text>
        <Text style={sharedStyles.pageTitle}>Welcome!</Text>

        <Text style={styles.label}>Username</Text>
        <Text style={sharedStyles.pageBody}>{profile?.username ?? '-'}</Text>

        <Text style={styles.label}>Full name</Text>
        <Text style={sharedStyles.pageBody}>{profile?.full_name ?? '-'}</Text>

        <View style={styles.signOutRow}>
          <SignOutButton />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7a2f3d',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 8,
    marginBottom: 4,
  },
  signOutRow: {
    marginTop: 20,
  },
})