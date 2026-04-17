import { Stack } from 'expo-router'
import { useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'

import { sharedStyles } from './(tabs)/shared.styles'
import { supabase } from '../lib/supabase'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSignIn() {
    setErrorMessage(null)
    setIsSubmitting(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (error) {
      setErrorMessage(formatAuthError(error.message))
    }

    setIsSubmitting(false)
  }

  async function handleSignUp() {
    setErrorMessage(null)
    setIsSubmitting(true)

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    })

    if (error) {
      setErrorMessage(formatAuthError(error.message))
    } else {
      setErrorMessage('Account created. Check your email to confirm if required.')
    }

    setIsSubmitting(false)
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Login' }} />
      <View style={sharedStyles.screenCenter}>
        <View style={sharedStyles.mainCard}>
          <Text style={sharedStyles.pageKicker}>Account</Text>
          <Text style={sharedStyles.pageTitle}>Login</Text>
          <Text style={sharedStyles.pageBody}>Sign in to continue to Smagningsapp.</Text>

          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#9b8f85"
            style={styles.input}
            value={email}
          />

          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setPassword}
            placeholder="Your password"
            placeholderTextColor="#9b8f85"
            secureTextEntry
            style={styles.input}
            value={password}
          />

          {errorMessage ? <Text style={styles.message}>{errorMessage}</Text> : null}

          <View style={styles.actionsRow}>
            <Pressable
              disabled={isSubmitting || !email.trim() || !password}
              onPress={handleSignIn}
              style={({ pressed }) => [
                styles.primaryButton,
                (pressed || isSubmitting || !email.trim() || !password) && styles.buttonDisabled,
              ]}
            >
              <Text style={styles.primaryButtonText}>{isSubmitting ? 'Working...' : 'Sign in'}</Text>
            </Pressable>

            <Pressable
              disabled={isSubmitting || !email.trim() || !password}
              onPress={handleSignUp}
              style={({ pressed }) => [
                styles.secondaryButton,
                (pressed || isSubmitting || !email.trim() || !password) && styles.buttonDisabled,
              ]}
            >
              <Text style={styles.secondaryButtonText}>Create account</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </>
  )
}

function formatAuthError(message: string) {
  if (message.toLowerCase().includes('email not confirmed')) {
    return 'Your email still needs confirmation in Supabase. Confirm it in the dashboard or disable email confirmation for development.'
  }

  if (message.toLowerCase().includes('invalid login credentials')) {
    return 'Wrong email or password. Double-check the test account values.'
  }

  return message
}

const styles = StyleSheet.create({
  inputLabel: {
    marginTop: 14,
    marginBottom: 6,
    color: '#7a2f3d',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e8ddd1',
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#2e251f',
    fontSize: 16,
    fontWeight: '500',
  },
  message: {
    marginTop: 10,
    color: '#7a2f3d',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  actionsRow: {
    marginTop: 18,
    gap: 10,
  },
  primaryButton: {
    backgroundColor: '#7a2f3d',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fffdf9',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#d9cab8',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    backgroundColor: '#fffaf3',
  },
  secondaryButtonText: {
    color: '#7a2f3d',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.65,
  },
})