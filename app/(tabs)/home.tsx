import { Text, View } from 'react-native';
import { sharedStyles as styles } from './shared.styles';

export default function HomeScreen() {
  return (
    <View style={styles.screenCenter}>
      <View style={styles.mainCard}>
        <Text style={styles.pageKicker}>Home page</Text>
        <Text style={styles.pageTitle}>Welcome to Smagningsapp</Text>
        <Text style={styles.pageBody}>
          This starter uses Expo Router tabs, and now all pages share the same
          visual style.
        </Text>
      </View>
    </View>
  );
}