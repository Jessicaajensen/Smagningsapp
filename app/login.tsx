import { Link, Stack } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'

import { sharedStyles } from './(tabs)/shared.styles'

export default function LoginScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Login' }} />
      <View style={sharedStyles.screenCenter}>
        <View style={sharedStyles.mainCard}>
          <Text style={sharedStyles.pageKicker}>Account</Text>
          <Text style={sharedStyles.pageTitle}>Login</Text>
          <Text style={sharedStyles.pageBody}>Sign in to continue to Smagningsapp.</Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen</Text>
        </Link>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  link: {
    marginTop: 18,
    paddingVertical: 10,
  },
  linkText: {
    color: '#7a2f3d',
    fontSize: 16,
    fontWeight: '700',
  },
})