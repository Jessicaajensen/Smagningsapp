import { ScrollView, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import { profileStyles as styles } from './profile.styles'
import { supabase } from '../../lib/supabase'
import { useEffect, useState } from 'react'
import { useAuthContext } from '../../hooks/use-auth-context'
import {
  ProfileAction,
  ProfileHero,
  ProfileInsightList,
  ProfileMetric,
  ProfileReview,
  ProfileTagGroup,
} from '../../components/profile-shell'

export default function ProfileScreen() {
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [tastingCount, setTastingCount] = useState(0)
  const [wineCount, setWineCount] = useState(0)
  const [beerCount, setBeerCount] = useState(0)
  const [latestTastingAt, setLatestTastingAt] = useState<string | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const router = useRouter()
  const { profile } = useAuthContext()

  useEffect(() => {
    async function loadProfileStats() {
      if (!profile?.id) {
        setTastingCount(0)
        setWineCount(0)
        setBeerCount(0)
        setLatestTastingAt(null)
        setIsLoadingStats(false)
        return
      }

      setIsLoadingStats(true)

      const { data, error } = await supabase
        .from('tastings')
        .select('beverage_type, created_at')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Failed to load profile stats:', error)
        setTastingCount(0)
        setWineCount(0)
        setBeerCount(0)
        setLatestTastingAt(null)
        setIsLoadingStats(false)
        return
      }

      const tastings = data ?? []
      const wineTastings = tastings.filter((tasting) => tasting.beverage_type === 'Wine').length
      const beerTastings = tastings.filter((tasting) => tasting.beverage_type === 'Beer').length

      setTastingCount(tastings.length)
      setWineCount(wineTastings)
      setBeerCount(beerTastings)
      setLatestTastingAt(tastings[0]?.created_at ?? null)
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

  const aromaTags = ['Roser', 'Tjære', 'Kirsebær', 'Lakrids', 'Kaffe', 'Tørret frugt']
  const tasteTags = ['Mørk frugt', 'Trøffel', 'Læder', 'Ristet malt', 'Chokolade', 'Vanilje']
  const favoriteReviews = [
    {
      title: 'Barolo Riserva 2013',
      subtitle: 'Rødvin - Piemonte',
      rating: '★★★★★',
      note: 'En af de bedste Baroloer jeg har smagt. Fantastisk struktur og dybde.',
    },
    {
      title: 'To Øl Black Ball Porter',
      subtitle: 'Baltic Porter',
      rating: '★★★★☆',
      note: 'Rigtig god dansk porter. Perfekt til koldt vejr.',
    },
    {
      title: 'Glenfiddich 18',
      subtitle: 'Single Malt - Speyside',
      rating: '★★★★☆',
      note: 'Flot balanceret whisky. God kompleksitet for prisen.',
    },
  ]

  const insights = [
    'Du foretrækker komplekse aromaer som roser og tjære',
    'Din gennemsnitlige rating er 4.3, og du er kritisk og selektiv',
    'Du har smagt flest vine (1 smagning)',
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
    <ScrollView style={styles.screenCenter} contentContainerStyle={styles.pageContent}>
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

      <ProfileTagGroup title="Din smagsprofil" tags={aromaTags} />
      <ProfileTagGroup title="Dine foretrukne smage" tags={tasteTags} />

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
  )
}