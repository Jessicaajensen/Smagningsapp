import { Text, View } from 'react-native';
import { sharedStyles as styles } from './shared.styles';

export default function CollectionScreen() {
  return (
    <View style={styles.screenCenter}>
      <View style={styles.mainCard}>
        <Text style={styles.pageKicker}>Collection page</Text>
        <Text style={styles.pageTitle}>Saved items</Text>
        <Text style={styles.pageBody}>
          Collections/bibliotek
        </Text>
      </View>
    </View>
  );
}