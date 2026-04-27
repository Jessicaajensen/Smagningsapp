import Ionicons from '@expo/vector-icons/Ionicons'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { COLLECTION_FILTER_CHIPS, COLLECTION_SUMMARY_CARDS } from '../../lib/collection-constants'
import { MOCK_TASTINGS } from '../../lib/mock-tastings'

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
        {COLLECTION_SUMMARY_CARDS.map((card) => (
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
          {COLLECTION_FILTER_CHIPS.map((chip, index) => (
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
        {MOCK_TASTINGS.map((item) => (
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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f3ede3',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 20,
  },
  header: {
    gap: 10,
  },
  title: {
    color: '#2e251f',
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '500',
    letterSpacing: -0.4,
  },
  subtitle: {
    color: '#6f6a65',
    fontSize: 18,
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#fffdf9',
    borderRadius: 24,
    paddingVertical: 22,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    minHeight: 142,
    shadowColor: '#b8aa99',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  metricIconWrap: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricValue: {
    color: '#2e251f',
    fontSize: 30,
    fontWeight: '700',
  },
  metricLabel: {
    color: '#6f6a65',
    fontSize: 16,
    fontWeight: '600',
  },
  searchCard: {
    minHeight: 56,
    borderRadius: 18,
    backgroundColor: '#fffdf9',
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchPlaceholder: {
    color: '#9b968f',
    fontSize: 18,
    fontWeight: '500',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  filterIconWrap: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    flex: 1,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#e9dfd0',
  },
  chipSelected: {
    backgroundColor: '#7a2f3d',
    shadowColor: '#7a2f3d',
    shadowOpacity: 0.16,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  chipText: {
    color: '#6f6a65',
    fontSize: 16,
    fontWeight: '700',
  },
  chipTextSelected: {
    color: '#fffdf9',
  },
  list: {
    gap: 18,
    paddingBottom: 8,
  },
  itemCard: {
    backgroundColor: '#fffdf9',
    borderRadius: 24,
    padding: 22,
    shadowColor: '#b8aa99',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
    gap: 14,
  },
  itemTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
  },
  itemTitleGroup: {
    flex: 1,
    gap: 6,
  },
  itemTitle: {
    color: '#2e251f',
    fontSize: 24,
    fontWeight: '500',
  },
  itemSubtitle: {
    color: '#6f6a65',
    fontSize: 18,
    fontWeight: '600',
  },
  starRow: {
    flexDirection: 'row',
    gap: 2,
    paddingTop: 2,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    backgroundColor: '#e9dfd0',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  tagText: {
    color: '#6f6a65',
    fontSize: 15,
    fontWeight: '600',
  },
  itemNote: {
    color: '#5d5854',
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  itemDate: {
    color: '#6f6a65',
    fontSize: 15,
    fontWeight: '600',
  },
})
