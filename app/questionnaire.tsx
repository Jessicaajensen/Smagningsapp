import * as ImagePicker from 'expo-image-picker'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import { AromaGrid } from '../components/aroma-grid'
import { QuestionnaireQuestion } from '../components/questionnaire-question'
import { SliderQuestion } from '../components/slider-question'
import { useAuthContext } from '../hooks/use-auth-context'
import { supabase } from '../lib/supabase'
import { WINE_AROMAS } from '../lib/tasting-constants'
import { questionnaireStyles } from './(tabs)/questionnaire.styles'

const BEVERAGE_TYPES = ['Wine', 'Beer', 'Whisky', 'Gin']
const TOTAL_STEPS = 9 // Step 0 = drikkevare valg step 1-8 er spørgsmål

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

type SliderScaleQuestion = {
  step: number
  kicker: string
  title: string
  description: string
  type: 'slider'
  minLabel: string
  maxLabel: string
}

type WineQuestion = MultipleChoiceQuestion | MultiSelectQuestion | SliderScaleQuestion

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
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function setStepResponse(step: number, value: unknown) {
    setResponses((previous) => ({ ...previous, [`step_${step}`]: value }))
  }

  function handleSelectBeverage(type: string) {
    setBeverageType(type)
    setStepResponse(0, type)
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
    setStepResponse(currentStep, optionIndex)
  }

  function handleToggleAroma(aromaIndex: number) {
    setResponses((previous) => {
      const key = `step_${currentStep}`
      const currentAromas = Array.isArray(previous[key]) ? previous[key] : []
      const updatedAromas = currentAromas.includes(aromaIndex)
        ? currentAromas.filter((idx: number) => idx !== aromaIndex)
        : [...currentAromas, aromaIndex]

      return { ...previous, [key]: updatedAromas }
    })
  }

  function handleSliderChange(value: number) {
    setStepResponse(currentStep, Math.round(value))
  }

  async function handlePickImage() {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'We need access to your photos to upload an image.')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    })

    if (result.canceled || !result.assets.length) {
      return
    }

    setSelectedImage(result.assets[0])
  }

  function clearSelectedImage() {
    setSelectedImage(null)
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

  async function uploadSelectedImage() {
    if (!selectedImage) {
      return null
    }

    const imageResponse = await fetch(selectedImage.uri)
    const imageBlob = await imageResponse.blob()
    const fileExtension = selectedImage.fileName?.split('.').pop() ?? 'jpg'
    const filePath = `${profile?.id}/${Date.now()}.${fileExtension}`

    const { error } = await supabase.storage.from('tasting-images').upload(filePath, imageBlob, {
      contentType: selectedImage.mimeType ?? 'image/jpeg',
      upsert: false,
    })

    if (error) {
      throw error
    }

    const { data } = supabase.storage.from('tasting-images').getPublicUrl(filePath)
    return data.publicUrl
  }

  async function submitTastingToSupabase() {
    try {
      const imageUrl = await uploadSelectedImage()

      const { error } = await supabase.from('tastings').insert({
        user_id: profile?.id,
        beverage_type: beverageType,
        responses: responses,
        image_url: imageUrl,
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

        <View style={questionnaireStyles.imagePickerCard}>
          <View style={questionnaireStyles.imagePickerHeader}>
            <Text style={questionnaireStyles.imagePickerTitle}>Billede</Text>
            <Text style={questionnaireStyles.imagePickerText}>Valgfrit foto til denne smagning</Text>
          </View>

          {selectedImage ? (
            <View style={questionnaireStyles.imagePreviewBlock}>
              <Image source={{ uri: selectedImage.uri }} style={questionnaireStyles.imagePreview} />
              <Text style={questionnaireStyles.imagePreviewLabel} numberOfLines={1}>
                {selectedImage.fileName ?? 'Valgt billede'}
              </Text>
            </View>
          ) : (
            <Text style={questionnaireStyles.imagePickerText}>
              Tilføj et billede fra din kamerarulle, hvis du vil gemme et visuelt minde sammen med vurderingen.
            </Text>
          )}

          <View style={questionnaireStyles.imagePickerActions}>
            <Pressable
              onPress={handlePickImage}
              disabled={isSubmitting}
              style={({ pressed }) => [
                styles.button,
                questionnaireStyles.ghostButton,
                pressed && !isSubmitting && styles.buttonPressed,
                isSubmitting && styles.buttonDisabled,
              ]}
            >
              <Text style={questionnaireStyles.ghostButtonText}>
                {selectedImage ? 'Skift billede' : 'Vælg billede'}
              </Text>
            </Pressable>

            {selectedImage ? (
              <Pressable
                onPress={clearSelectedImage}
                disabled={isSubmitting}
                style={({ pressed }) => [
                  styles.button,
                  questionnaireStyles.ghostButton,
                  pressed && !isSubmitting && styles.buttonPressed,
                  isSubmitting && styles.buttonDisabled,
                ]}
              >
                <Text style={questionnaireStyles.ghostButtonText}>Fjern</Text>
              </Pressable>
            ) : null}
          </View>
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
    paddingBottom: 20,
  },
  mainCard: {
    backgroundColor: '#fffdf9',
    borderRadius: 24,
    padding: 24,
    paddingBottom: 40,
    marginBottom: 20,
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
    textAlign: 'center',
  },
  beverageButtonTextSelected: {
    color: '#fffdf9',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 8,
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
    textAlign: 'center',
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
    textAlign: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
})
