import { Text, View, FlatList } from 'react-native';
import { sharedStyles as styles } from './shared.styles';
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

type Wine = {
  id: number
  name: string
}


export default function CollectionScreen() {
   const [wine, setWine] = useState<Wine[]>([])
  
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
        <Text style={styles.pageKicker}>Collection page</Text>
        <Text style={styles.pageTitle}>Saved items</Text>
        <Text style={styles.pageBody}>
          Collections/bibliotek
        </Text>
        <FlatList
                data={wine}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <Text style={styles.item}>{item.name}</Text>
                )}
              />
      </View>
    </View>
  );
}