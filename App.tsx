import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.card}>
        <Text style={styles.kicker}>Expo starter</Text>
        <Text style={styles.title}>Smagningsapp</Text>
        <Text style={styles.body}>
          A clean React Native template with Expo, ready for navigation,
          components, and API integration.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    backgroundColor: '#111827',
    padding: 24,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  kicker: {
    color: '#38bdf8',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontSize: 12,
    marginBottom: 8,
  },
  title: {
    color: '#f8fafc',
    fontSize: 34,
    fontWeight: '700',
    marginBottom: 12,
  },
  body: {
    color: '#cbd5e1',
    fontSize: 16,
    lineHeight: 24,
  },
});