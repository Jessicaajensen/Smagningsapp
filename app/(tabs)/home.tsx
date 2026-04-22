import { Text, View, FlatList, Pressable, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { sharedStyles as styles } from './shared.styles';
import { supabase } from '../../lib/supabase'

type Wine = {
  id: number
  name: string
}

export default function HomeScreen() {
  const [wine, setWine] = useState<Wine[]>([])
  const router = useRouter()

  useEffect(() => {
    getWine()
  }, [])

  async function getWine() {
    const { data } = await supabase.from('wine').select()
    setWine((data ?? []) as Wine[])
  }
  return (
    <View style={styles.screenCenter}>
      <View style={styles.mainCard}>
        <Text style={styles.pageKicker}>Home page</Text>
        <Text style={styles.pageTitle}>Velkommen til</Text>
        <Text style={styles.pageBody}>
          Home page
        </Text>
        <FlatList
        data={wine}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.item}>{item.name}</Text>
        )}
      />
        <Pressable
          onPress={() => router.push('/questionnaire')}
          style={({ pressed }) => [
            buttonStyles.tastingButton,
            pressed && buttonStyles.buttonPressed,
          ]}
        >
          <Text style={buttonStyles.tastingButtonText}>Start smagning</Text>
        </Pressable>
      </View>
    </View>
  );
}

const buttonStyles = StyleSheet.create({
  tastingButton: {
    marginTop: 20,
    backgroundColor: '#7a2f3d',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  tastingButtonText: {
    color: '#fffdf9',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.8,
  },
})



