import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, Text, View } from 'react-native'
import { profileStyles as styles } from './profile.styles'
import { useAuthContext } from '../../hooks/use-auth-context'
import {
  ProfileAction,
  ProfileHero,
  ProfileInsightList,
  ProfileMetric,
  ProfileReview,
  ProfileTagGroup,
} from '../../components/profile-shell'
import { MOCK_TASTINGS } from '../../lib/mock-tastings'
import { supabase } from '../../lib/supabase'
import { TASTE_LABELS, WINE_AROMAS } from '../../lib/tasting-constants'

type TastingRecord = {
  beverage_type: string
  created_at: string
  responses: Record<string, any>
}

function toStarRating(rating: number) {
  return `${'★'.repeat(rating)}${'☆'.repeat(Math.max(0, 5 - rating))}`
}

export default function ProfileScreen() {
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [tastingCount, setTastingCount] = useState(0)
  const [wineCount, setWineCount] = useState(0)
  const [beerCount, setBeerCount] = useState(0)
  const [latestTastingAt, setLatestTastingAt] = useState<string | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [topAromaTags, setTopAromaTags] = useState<string[]>([])
  const [topTasteTags, setTopTasteTags] = useState<string[]>([])
  const router = useRouter()
  const { profile } = useAuthContext()

  function resetStats() {
    setTastingCount(0)
    setWineCount(0)
    setBeerCount(0)
    setLatestTastingAt(null)
    setTopAromaTags([])
    setTopTasteTags([])
  }

  useEffect(() => {
    async function loadProfileStats() {
      if (!profile?.id) {
        resetStats()
        setIsLoadingStats(false)
        return
      }

      setIsLoadingStats(true)

      const { data, error } = await supabase
        .from('tastings')
        .select('beverage_type, created_at, responses')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Failed to load profile stats:', error)
        resetStats()
        setIsLoadingStats(false)
        return
      }

      const tastings = (data ?? []) as TastingRecord[]
      const wineTastings = tastings.filter((tasting) => tasting.beverage_type === 'Wine').length
      const beerTastings = tastings.filter((tasting) => tasting.beverage_type === 'Beer').length
      const aromaCounts = new Map<string, number>()
      const tasteCounts = new Map<string, number>()

      tastings.forEach((tasting) => {
        const aromaIndexes = tasting.responses?.step_3

        if (Array.isArray(aromaIndexes)) {
          aromaIndexes.forEach((aromaIndex: number) => {
            const aromaLabel = WINE_AROMAS[aromaIndex]

            if (!aromaLabel) {
              return
            }

            aromaCounts.set(aromaLabel, (aromaCounts.get(aromaLabel) ?? 0) + 1)
          })
        }

        if (tasting.responses?.step_6 !== undefined) {
          const bodyLabel = TASTE_LABELS.body[tasting.responses.step_6]
          if (bodyLabel) {
            tasteCounts.set(bodyLabel, (tasteCounts.get(bodyLabel) ?? 0) + 1)
          }
        }

        if (tasting.responses?.step_7 !== undefined) {
          const lengthLabel = TASTE_LABELS.length[tasting.responses.step_7]
          if (lengthLabel) {
            tasteCounts.set(lengthLabel, (tasteCounts.get(lengthLabel) ?? 0) + 1)
          }
        }

        if (tasting.responses?.step_8 !== undefined) {
          const occasionLabel = TASTE_LABELS.occasion[tasting.responses.step_8]
          if (occasionLabel) {
            tasteCounts.set(occasionLabel, (tasteCounts.get(occasionLabel) ?? 0) + 1)
          }
        }
      })

      const sortedAromas = [...aromaCounts.entries()].sort((first, second) => second[1] - first[1]).map(([label]) => label)
      const sortedTasteTags = [...tasteCounts.entries()].sort((first, second) => second[1] - first[1]).map(([label]) => label)

      setTastingCount(tastings.length)
      setWineCount(wineTastings)
      setBeerCount(beerTastings)
      setLatestTastingAt(tastings[0]?.created_at ?? null)
      setTopAromaTags(sortedAromas.slice(0, 6))
      setTopTasteTags(sortedTasteTags.slice(0, 6))
      setIsLoadingStats(false)
    }

    void loadProfileStats()
  }, [profile?.id])

  const latestTastingLabel = latestTastingAt
    ? new Date(latestTastingAt).toLocaleDateString('da-DK', {
        day: 'numeric',
        month: 'short',
      })
    : '—'

  const profileMetrics = [
    { icon: '↗', value: isLoadingStats ? '—' : String(tastingCount), label: 'Smagninger' },
    { icon: '🍷', value: isLoadingStats ? '—' : String(wineCount), label: 'Vine' },
    { icon: '🍺', value: isLoadingStats ? '—' : String(beerCount), label: 'Øl' },
    { icon: '⌁', value: isLoadingStats ? '—' : latestTastingLabel, label: 'Seneste' },
  ]

  const favoriteReviews = MOCK_TASTINGS.map((tasting) => ({
    title: tasting.title,
    subtitle: tasting.subtitle,
    rating: toStarRating(tasting.rating),
    note: tasting.note,
  }))

  const favoriteAroma = topAromaTags[0]
  const favoriteTaste = topTasteTags[0]
  const dominantBeverage = wineCount >= beerCount ? 'vin' : 'øl'

  const insights = [
    favoriteAroma
      ? `Din mest tilbagevendende aroma er ${favoriteAroma.toLowerCase()}`
      : 'Du har endnu ikke nok aroma-data til at vise et mønster',
    favoriteTaste
      ? `Et gennemgående smagsmønster er ${favoriteTaste.toLowerCase()}`
      : 'Dine smagsnoter bliver mere præcise, når du får flere smagninger',
    tastingCount > 0
      ? `Du har smagt flest ${dominantBeverage} (${Math.max(wineCount, beerCount)} af ${tastingCount} smagninger)`
      : 'Dine smagsindsigter vises, når du har gemt din første smagning',
  ]

  function handleSignOut() {
    setIsSigningOut(true)

    // Navigate immediately; do not block UX on logout network requests.
    router.replace('/login')

    void supabase.auth
      .signOut({ scope: 'local' })
      .then(({ error }) => {
        if (error) {
          console.error('Supabase local signOut error:', error)
        }
      })
      .catch((error) => {
        console.error('Unexpected sign out error:', error)
      })
      .finally(() => {
        setIsSigningOut(false)
      })
  }

  return (
    <SafeAreaView style={styles.screenCenter}>
      <ScrollView contentContainerStyle={styles.pageContent}>
      <ProfileHero
        initials="ME"
        title="Min smagsprofil"
        subtitle={isLoadingStats ? 'Henter smagninger...' : `Baseret på ${tastingCount} smagninger`}
      />

      <View style={styles.metricsGrid}>
        {profileMetrics.map((metric) => (
          <ProfileMetric key={metric.label} icon={metric.icon} value={metric.value} label={metric.label} />
        ))}
      </View>

      <ProfileTagGroup
        title="Din smagsprofil"
        tags={topAromaTags.length > 0 ? topAromaTags : ['Ingen aromaer endnu']}
      />
      <ProfileTagGroup
        title="Dine foretrukne smage"
        tags={topTasteTags.length > 0 ? topTasteTags : ['Ingen smagsdata endnu']}
      />

      <View style={styles.sectionSpacing}>
        <Text style={styles.sectionHeading}>Dine favoritter</Text>
        <View style={styles.reviewStack}>
          {favoriteReviews.map((review) => (
            <ProfileReview key={review.title} {...review} />
          ))}
        </View>
      </View>

      <ProfileInsightList title="Smagsindsigter" items={insights} />

      <View style={styles.actionsRow}>
        <ProfileAction label={isSigningOut ? 'Signing out...' : 'Sign out'} onPress={handleSignOut} variant="primary" />
      </View>
      </ScrollView>
    </SafeAreaView>
  )
}