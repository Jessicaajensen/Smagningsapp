import Ionicons from '@expo/vector-icons/Ionicons'
import { ScrollView, Text, View, StyleSheet, Pressable } from 'react-native'

const SUMMARY_CARDS = [
  { icon: 'wine-outline' as const, value: '1', label: 'Vin' },
  { icon: 'beer-outline' as const, value: '1', label: 'Øl' },
  { icon: 'water-outline' as const, value: '1', label: 'Whisky' },
  { icon: 'star-outline' as const, value: '4.3', label: 'Gns. rating' },
]

const FILTER_CHIPS = ['Alle', 'Vin', 'Øl', 'Whisky', 'Spiritus']

const COLLECTION_ITEMS = [
  {
    title: 'Barolo Riserva 2013',
    subtitle: 'Rødvin - Piemonte',
    rating: 5,
    tags: ['Roser', 'Tjære', 'Kirsebær', '+1'],
    note: 'En af de bedste Baroloer jeg har smagt. Fantastisk struktur og dybde.',
    date: '8. april 2026',
  },
  {
    title: 'To Øl Black Ball Porter',
    subtitle: 'Baltic Porter',
    rating: 4,
    tags: ['Kaffe', 'Tørret frugt', 'Lakridspulver'],
    note: 'Rigtig god dansk porter. Perfekt til koldt vejr.',
    date: '5. april 2026',
  },
  {
    title: 'Glenfiddich 18',
    subtitle: 'Single Malt - Speyside',
    rating: 4,
    tags: ['Æble', 'Egetræ', 'Honning'],
    note: 'Flot balanceret whisky. God kompleksitet for prisen.',
    date: '2. april 2026',
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={styles.starRow}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Ionicons
          key={index}
          name={index < rating ? 'star' : 'star-outline'}
          size={18}
          color={index < rating ? '#d8a86c' : '#d9cab8'}
        />
      ))}
    </View>
  )
}

export default function CollectionScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Dit bibliotek</Text>
        <Text style={styles.subtitle}>3 smagninger dokumenteret</Text>
      </View>

      <View style={styles.metricsGrid}>
        {SUMMARY_CARDS.map((card) => (
          <View key={card.label} style={styles.metricCard}>
            <View style={styles.metricIconWrap}>
              <Ionicons name={card.icon} size={26} color={card.label === 'Gns. rating' ? '#d8a86c' : '#7a2f3d'} />
            </View>
            <Text style={styles.metricValue}>{card.value}</Text>
            <Text style={styles.metricLabel}>{card.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.searchCard}>
        <Ionicons name="search" size={22} color="#8a847f" />
        <Text style={styles.searchPlaceholder}>Søg i dine smagninger...</Text>
      </View>

      <View style={styles.filterRow}>
        <View style={styles.filterIconWrap}>
          <Ionicons name="funnel-outline" size={22} color="#6f6a65" />
        </View>
        <View style={styles.chipRow}>
          {FILTER_CHIPS.map((chip, index) => (
            <Pressable
              key={chip}
              style={[styles.chip, index === 0 && styles.chipSelected]}
            >
              <Text style={[styles.chipText, index === 0 && styles.chipTextSelected]}>{chip}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.list}>
        {COLLECTION_ITEMS.map((item) => (
          <View key={item.title} style={styles.itemCard}>
            <View style={styles.itemTopRow}>
              <View style={styles.itemTitleGroup}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
              </View>
              <StarRating rating={item.rating} />
            </View>

            <View style={styles.tagRow}>
              {item.tags.map((tag) => (
                <View key={tag} style={styles.tagChip}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.itemNote}>{item.note}</Text>
            <Text style={styles.itemDate}>{item.date}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

