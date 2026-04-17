import { Text, View } from 'react-native';
import { profileStyles as styles } from './profile.styles';

export default function ProfileScreen() {
  return (
    <View style={styles.screenCenter}>
      <View style={styles.mainCard}>
        <Text style={styles.pageKicker}>Profile page</Text>
        <Text style={styles.pageTitle}>Your profile</Text>
        <Text style={styles.pageBody}>
          Profile page
        </Text>
      </View>
    </View>
  );
}