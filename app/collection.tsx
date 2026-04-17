import { Link } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

const navItems = [
  { href: '/home', label: 'Home' },
  { href: '/profile', label: 'Profile' },
  { href: '/collection', label: 'Collection' },
  { href: '/feed', label: 'Feed' },
];

export default function CollectionScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.kicker}>Collection page</Text>
        <Text style={styles.title}>Saved items</Text>
        <Text style={styles.body}>
          Use this page for saved products, recipes, or favorites.
        </Text>
      </View>

      <View style={styles.navRow}>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} style={styles.navLink}>
            {item.label}
          </Link>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 24,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#111827',
    borderColor: '#1f2937',
    borderWidth: 1,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
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
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
  },
  body: {
    color: '#cbd5e1',
    fontSize: 16,
    lineHeight: 24,
  },
  navRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  navLink: {
    backgroundColor: '#1d4ed8',
    color: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
    fontWeight: '700',
  },
});