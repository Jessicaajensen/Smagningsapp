import { Text, View } from 'react-native';
import { sharedStyles as styles } from './shared.styles';

export default function FeedScreen() {
  return (
    <View style={styles.screenCenter}>
      <View style={styles.mainCard}>
        <Text style={styles.pageKicker}>Feed page</Text>
        <Text style={styles.pageTitle}>Recent updates</Text>
        <Text style={styles.pageBody}>
          Feed page
        </Text>
      </View>
    </View>
  );
}