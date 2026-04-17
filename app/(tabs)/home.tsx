import { Text, View } from 'react-native';
import { sharedStyles as styles } from './shared.styles';

export default function HomeScreen() {
  return (
    <View style={styles.screenCenter}>
      <View style={styles.mainCard}>
        <Text style={styles.pageKicker}>Home page</Text>
        <Text style={styles.pageTitle}>Velkommene til</Text>
        <Text style={styles.pageBody}>
          Home page
        </Text>
      </View>
    </View>
  );
}