import { View, Text, Pressable, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { QuestionnaireQuestion } from '../components/questionnaire-question'
import { AromaGrid } from '../components/aroma-grid'
import { SliderQuestion } from '../components/slider-question'
import { questionnaireStyles } from './(tabs)/questionnaire.styles'
import { supabase } from '../lib/supabase'
import { useAuthContext } from '../hooks/use-auth-context'

const OptionStyles = questionnaireStyles

const BEVERAGE_TYPES = ['Wine', 'Beer', 'Whisky', 'Gin']
const TOTAL_STEPS = 9 // Step 0 = drikkevare valg step 1-8 er spørgsmål

const WINE_AROMAS = [
  'Jordbær',
  'Kirsebær',
  'Hindbær',
  'Solbær',
  'Brombær',
  'Blomme',
  'Vanilje',
  'Kaffe',
  'Chokolade',
  'Peber',
  'Læder',
  'Våd skovbund',
  'Blyantstift',
  'Tobak',
]

type MultipleChoiceQuestion = {
  step: number
  kicker: string
  title: string
  description: string
  type: 'multipleChoice'
  options: string[]
}

type MultiSelectQuestion = {
  step: number
  kicker: string
  title: string
  description: string
  type: 'multiSelect'
  options: string[]
}

type SliderQuestion = {
  step: number
  kicker: string
  title: string
  description: string
  type: 'slider'
  minLabel: string
  maxLabel: string
}

type WineQuestion = MultipleChoiceQuestion | MultiSelectQuestion | SliderQuestion

const WINE_QUESTIONS: WineQuestion[] = [
  {
    step: 1,
    kicker: 'Det Visuelle (Øjet)',
    title: 'Farven',
    description: 'Hold glasset på skrå. gerne over et hvidt underlag Hvilken farve minder vinen mest om?',
    type: 'multipleChoice',
    options: ['Lilla/Violet', 'Rubindrød', 'Granatrød', 'Tebrun'],
  },
  {
    step: 2,
    kicker: 'Det Visuelle',
    title: 'Gennemsigtighed',
    description: 'Kan du se din finger gennem vinen?',
    type: 'multipleChoice',
    options: ['Som saft, gennemsigtig', 'Som mørkt øl, moderat', 'Som blæk, uigennemsigtig'],
  },
  {
    step: 3,
    kicker: 'Duften - Næsen)',
    title: 'Aromaer',
    description: 'Hvad rammer din næse? Vælg så mange du genkender.',
    type: 'multiSelect',
    options: WINE_AROMAS,
  },
  {
    step: 4,
    kicker: 'Smagen & Struktur',
    title: 'Syre',
    description: 'Hvor meget løber dit vand i munden?',
    type: 'slider',
    minLabel: 'Lav syre, flad',
    maxLabel: 'Høj syre, frisk/sprød',
  },
  {
    step: 5,
    kicker: 'Smag & Struktur',
    title: 'Tannin',
    description: 'Føles dine gummer tørre eller ru?',
    type: 'slider',
    minLabel: 'Silkeblød',
    maxLabel: 'Udtørrende',
  },
  {
    step: 6,
    kicker: 'Smag & Struktur',
    title: 'Krop',
    description: 'Hvor meget fylder vinen i munden?',
    type: 'multipleChoice',
    options: ['Som skummetmælk/let', 'Som sødmælk/medium', 'Som fløde/kraftig'],
  },
  {
    step: 7,
    kicker: 'Eftersmag & Konklusion',
    title: 'Længden',
    description: 'Hvor længe bliver smagen hængende, efter du har sunket?',
    type: 'multipleChoice',
    options: ['Væk med det samme', 'Et par sekunder', 'Den bliver hængende længe'],
  },
  {
    step: 8,
    kicker: 'Eftersmag & Konklusion',
    title: 'Anledningen/Viben',
    description: 'Hvornår ville du drikke den her igen?',
    type: 'multipleChoice',
    options: ['Til en god bøf', 'Hygge i sofaen', 'Fest med vennerne', 'Give den som gave til svigerfar'],
  },
]

export default function QuestionnaireScreen() {
  const router = useRouter()
  const { returnTo } = useLocalSearchParams<{ returnTo?: string | string[] }>()
  const returnToPath = Array.isArray(returnTo) ? returnTo[0] : returnTo
  const { profile } = useAuthContext()
  const [currentStep, setCurrentStep] = useState(0)
  const [beverageType, setBeverageType] = useState<string | null>(null)
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleSelectBeverage(type: string) {
    setBeverageType(type)
    setResponses({ ...responses, step_0: type })
    // gå til næste step
    setCurrentStep(1)
  }

  function handleExit() {
    if (returnToPath) {
      router.replace(returnToPath)
      return
    }

    router.back()
  }

  function handleSelectOption(optionIndex: number) {
    setResponses({ ...responses, [`step_${currentStep}`]: optionIndex })
  }

  function handleToggleAroma(aromaIndex: number) {
    const currentAromas = responses[`step_${currentStep}`] || []
    let updatedAromas
    if (currentAromas.includes(aromaIndex)) {
      updatedAromas = currentAromas.filter((idx: number) => idx !== aromaIndex)
    } else {
      updatedAromas = [...currentAromas, aromaIndex]
    }
    setResponses({ ...responses, [`step_${currentStep}`]: updatedAromas })
  }

  function handleSliderChange(value: number) {
    setResponses({ ...responses, [`step_${currentStep}`]: Math.round(value) })
  }

  function handlePrevious() {
    if (currentStep === 1) {
      setCurrentStep(0)
      setBeverageType(null)
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  function handleNext() {
    const isCurrentStepAnswered = responses[`step_${currentStep}`] !== undefined && responses[`step_${currentStep}`] !== null

    if (!isCurrentStepAnswered) {
      return
    }

    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  function handleSubmit() {
    setIsSubmitting(true)
    // Validation alle spørgsmål skal besvares
    const allAnswered = Object.keys(responses).length === TOTAL_STEPS
    if (!allAnswered) {
      setIsSubmitting(false)
      Alert.alert('Error', 'Besvar venligst alle spørgsmål inden du afslutter smagningen.')
      return
    }

    if (!profile?.id) {
      setIsSubmitting(false)
      Alert.alert('Error', 'User not authenticated.')
      return
    }

   
    submitTastingToSupabase()
  }

  async function submitTastingToSupabase() {
    try {
      const { error } = await supabase.from('tastings').insert({
        user_id: profile?.id,
        beverage_type: beverageType,
        responses: responses,
        created_at: new Date().toISOString(),
      })

      if (error) {
        Alert.alert('Error', `Failed to save tasting: ${error.message}`)
        setIsSubmitting(false)
        return
      }

      setIsSubmitting(false)

      if (returnToPath) {
        router.replace(returnToPath)
        return
      }

      router.back()
    } catch (err) {
      Alert.alert('Error', `An unexpected error occurred: ${err}`)
      setIsSubmitting(false)
    }
  }

  function getCurrentQuestion() {
    if (beverageType === 'Wine') {
      return WINE_QUESTIONS.find((q) => q.step === currentStep)
    }
    // tilføj øl, whisky og gin spørgsmål senere
    return null
  }

  const currentQuestion = getCurrentQuestion()
  const isCurrentAnswered =
    currentQuestion &&
    (currentQuestion.type === 'multiSelect'
      ? responses[`step_${currentStep}`]?.length > 0
      : responses[`step_${currentStep}`] !== undefined && responses[`step_${currentStep}`] !== null)
  const isLastStep = currentStep === TOTAL_STEPS - 1
  const isFirstStep = currentStep === 0

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleExit} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </Pressable>
        <Text style={styles.stepIndicator}>
          Step {currentStep + 1}/{TOTAL_STEPS}
        </Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.mainCard}>
          {currentStep === 0 ? (
            <>
              <Text style={styles.pageKicker}>Første trin</Text>
              <Text style={styles.pageTitle}>Hvad smager du på?</Text>
              <Text style={styles.pageBody}>
                Vælg den type drikkevare, du gerne vil vurdere
              </Text>
              <View style={questionnaireStyles.optionGrid}>
                {BEVERAGE_TYPES.map((type) => (
                  <Pressable
                    key={type}
                    onPress={() => handleSelectBeverage(type)}
                    style={({ pressed }) => [
                      questionnaireStyles.optionButton,
                      beverageType === type && questionnaireStyles.optionButtonSelected,
                      pressed && questionnaireStyles.optionButtonPressed,
                    ]}
                  >
                    <Text
                      style={[
                        questionnaireStyles.optionButtonText,
                        beverageType === type && questionnaireStyles.optionButtonTextSelected,
                      ]}
                    >
                      {type}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </>
          ) : currentQuestion ? (
            <>
              <QuestionnaireQuestion
                kicker={currentQuestion.kicker}
                title={currentQuestion.title}
                description={currentQuestion.description}
              >
                {currentQuestion.type === 'multipleChoice' && (
                  <View style={questionnaireStyles.optionGrid}>
                    {currentQuestion.options.map((option, index) => (
                      <Pressable
                        key={option}
                        onPress={() => handleSelectOption(index)}
                        style={({ pressed }) => [
                          questionnaireStyles.optionButton,
                          responses[`step_${currentStep}`] === index &&
                            questionnaireStyles.optionButtonSelected,
                          pressed && questionnaireStyles.optionButtonPressed,
                        ]}
                      >
                        <Text
                          style={[
                            questionnaireStyles.optionButtonText,
                            responses[`step_${currentStep}`] === index &&
                              questionnaireStyles.optionButtonTextSelected,
                          ]}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
                {currentQuestion.type === 'multiSelect' && (
                  <AromaGrid
                    aromas={currentQuestion.options}
                    selectedAromas={responses[`step_${currentStep}`] || []}
                    onSelect={handleToggleAroma}
                  />
                )}
                {currentQuestion.type === 'slider' && (
                  <SliderQuestion
                    title={currentQuestion.title}
                    minLabel={currentQuestion.minLabel}
                    maxLabel={currentQuestion.maxLabel}
                    value={responses[`step_${currentStep}`] || 50}
                    onValueChange={handleSliderChange}
                  />
                )}
              </QuestionnaireQuestion>
            </>
          ) : (
            <>
              <Text style={styles.pageKicker}>Spørgsmål {currentStep}</Text>
              <Text style={styles.pageTitle}>Spørgsmål {currentStep}</Text>
              <Text style={styles.pageBody}>
                Placeholder - spørgsmål kommer her
              </Text>
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={currentStep === 0 ? handleExit : handlePrevious}
          style={({ pressed }) => [
            styles.button,
            styles.secondaryButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.secondaryButtonText}>
            {isFirstStep ? 'Exit' : 'Back'}
          </Text>
        </Pressable>

        {currentStep === 0 ? null : (
          <Pressable
            onPress={isLastStep ? handleSubmit : handleNext}
            disabled={!isCurrentAnswered || isSubmitting}
            style={({ pressed }) => [
              styles.button,
              styles.primaryButton,
              (!isCurrentAnswered || isSubmitting) && styles.buttonDisabled,
              pressed && !(!isCurrentAnswered || isSubmitting) && styles.buttonPressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>
              {isSubmitting ? 'Submitting...' : isLastStep ? 'Submit' : 'Next'}
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3ede3',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fffdf9',
    borderBottomWidth: 1,
    borderBottomColor: '#eee4d8',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#7a2f3d',
    fontWeight: '700',
  },
  stepIndicator: {
    fontSize: 14,
    fontWeight: '600',
    color: '#71675f',
  },
  spacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  mainCard: {
    backgroundColor: '#fffdf9',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#b8aa99',
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
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
    marginBottom: 24,
  },
  beverageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  beverageButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fffaf3',
    borderWidth: 2,
    borderColor: '#d9cab8',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  beverageButtonSelected: {
    backgroundColor: '#7a2f3d',
    borderColor: '#7a2f3d',
  },
  beverageButtonPressed: {
    opacity: 0.8,
  },
  beverageButtonText: {
    color: '#7a2f3d',
    fontSize: 16,
    fontWeight: '700',
  },
  beverageButtonTextSelected: {
    color: '#fffdf9',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#fffdf9',
    borderTopWidth: 1,
    borderTopColor: '#eee4d8',
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#7a2f3d',
  },
  primaryButtonText: {
    color: '#fffdf9',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#d9cab8',
    backgroundColor: '#fffaf3',
  },
  secondaryButtonText: {
    color: '#7a2f3d',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
})
