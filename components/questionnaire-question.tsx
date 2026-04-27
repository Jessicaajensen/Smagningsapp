import { Text } from 'react-native'

interface QuestionnaireQuestionProps {
  kicker: string
  title: string
  description?: string
  children: React.ReactNode
}

export function QuestionnaireQuestion({
  kicker,
  title,
  description,
  children,
}: QuestionnaireQuestionProps) {
  return (
    <>
      <Text style={styles.pageKicker}>{kicker}</Text>
      <Text style={styles.pageTitle}>{title}</Text>
      {description && <Text style={styles.pageBody}>{description}</Text>}
      {children}
    </>
  )
}

import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  pageKicker: {
    color: '#7a2f3d',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '700',
  },
  pageTitle: {
    color: '#2e251f',
    fontSize: 34,
    fontWeight: '600',
    marginBottom: 12,
  },
  pageBody: {
    color: '#71675f',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    marginBottom: 16,
  },
})
