import { StyleSheet, Text } from 'react-native'
import { sharedStyles } from '../app/(tabs)/shared.styles'

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
      <Text style={sharedStyles.pageKicker}>{kicker}</Text>
      <Text style={sharedStyles.pageTitle}>{title}</Text>
      {description && <Text style={[sharedStyles.pageBody, styles.pageBodySpacing]}>{description}</Text>}
      {children}
    </>
  )
}

const styles = StyleSheet.create({
  pageBodySpacing: {
    marginBottom: 16,
  },
})
