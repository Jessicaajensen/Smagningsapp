import { Pressable, StyleSheet, Text, View } from 'react-native'

type ProfileMetricProps = {
  icon: string
  value: string
  label: string
}

type ProfileTagGroupProps = {
  title: string
  tags: string[]
}

type ProfileReviewProps = {
  title: string
  subtitle: string
  rating: string
  note: string
}

type ProfileInsightListProps = {
  title: string
  items: string[]
}

type ProfileActionProps = {
  label: string
  onPress?: () => void
  variant?: 'primary' | 'secondary'
}

export function ProfileHero({
  initials,
  title,
  subtitle,
}: {
  initials: string
  title: string
  subtitle: string
}) {
  return (
    <View style={styles.hero}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
      <Text style={styles.heroTitle}>{title}</Text>
      <Text style={styles.heroSubtitle}>{subtitle}</Text>
    </View>
  )
}

export function ProfileMetric({ icon, value, label }: ProfileMetricProps) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricIcon}>{icon}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  )
}

export function ProfileTagGroup({ title, tags }: ProfileTagGroupProps) {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.tagWrap}>
        {tags.map((tag) => (
          <View key={tag} style={styles.tagChip}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

export function ProfileReview({ title, subtitle, rating, note }: ProfileReviewProps) {
  return (
    <View style={styles.reviewCard}>
      <Text style={styles.reviewRating}>{rating}</Text>
      <Text style={styles.reviewTitle}>{title}</Text>
      <Text style={styles.reviewSubtitle}>{subtitle}</Text>
      <Text style={styles.reviewNote}>{note}</Text>
    </View>
  )
}

export function ProfileInsightList({ title, items }: ProfileInsightListProps) {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.insightList}>
        {items.map((item) => (
          <Text key={item} style={styles.insightItem}>
            • {item}
          </Text>
        ))}
      </View>
    </View>
  )
}

export function ProfileAction({ label, onPress, variant = 'secondary' }: ProfileActionProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        variant === 'primary' ? styles.primaryAction : styles.secondaryAction,
        pressed && styles.actionPressed,
      ]}
    >
      <Text style={[styles.actionText, variant === 'primary' ? styles.primaryActionText : styles.secondaryActionText]}>
        {label}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 20,
  },
  avatar: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: '#7a2f3d',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  avatarText: {
    color: '#fffdf9',
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: 1,
  },
  heroTitle: {
    color: '#2e251f',
    fontSize: 30,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    color: '#71675f',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  metricCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#fffdf9',
    borderRadius: 24,
    paddingVertical: 22,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#b8aa99',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  metricIcon: {
    color: '#7a2f3d',
    fontSize: 22,
    marginBottom: 8,
  },
  metricValue: {
    color: '#2e251f',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  metricLabel: {
    color: '#71675f',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: '#fffdf9',
    borderRadius: 24,
    padding: 22,
    shadowColor: '#b8aa99',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  sectionTitle: {
    color: '#2e251f',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tagChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d9cab8',
    backgroundColor: '#f8f2ea',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  tagText: {
    color: '#7a2f3d',
    fontSize: 14,
    fontWeight: '600',
  },
  reviewCard: {
    backgroundColor: '#fffdf9',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#b8aa99',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  reviewRating: {
    color: '#d6a66a',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
  },
  reviewTitle: {
    color: '#2e251f',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 6,
  },
  reviewSubtitle: {
    color: '#71675f',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  reviewNote: {
    color: '#71675f',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  insightList: {
    gap: 12,
  },
  insightItem: {
    color: '#2e251f',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  actionButton: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryAction: {
    backgroundColor: '#7a2f3d',
  },
  secondaryAction: {
    backgroundColor: '#fffaf3',
    borderWidth: 1,
    borderColor: '#d9cab8',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '700',
  },
  primaryActionText: {
    color: '#fffdf9',
  },
  secondaryActionText: {
    color: '#7a2f3d',
  },
  actionPressed: {
    opacity: 0.84,
  },
})