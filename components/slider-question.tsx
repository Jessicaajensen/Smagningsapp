import { View, Text, StyleSheet, Pressable } from 'react-native'

interface SliderQuestionProps {
  minLabel: string
  maxLabel: string
  value: number
  onValueChange: (value: number) => void
}

export function SliderQuestion({
  minLabel,
  maxLabel,
  value,
  onValueChange,
}: SliderQuestionProps) {
  function handleDecrement() {
    if (value > 0) {
      onValueChange(Math.max(0, value - 5))
    }
  }

  function handleIncrement() {
    if (value < 100) {
      onValueChange(Math.min(100, value + 5))
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sliderValue}>{value}</Text>
      <View style={styles.sliderLabels}>
        <Text style={styles.sliderLabel}>{minLabel}</Text>
        <Text style={styles.sliderLabel}>{maxLabel}</Text>
      </View>
      <View style={styles.sliderTrack}>
        <View
          style={[
            styles.sliderFill,
            {
              width: `${value}%`,
            },
          ]}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={handleDecrement}
          disabled={value === 0}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed, value === 0 && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>−</Text>
        </Pressable>
        <Pressable
          onPress={handleIncrement}
          disabled={value === 100}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed, value === 100 && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>+</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  sliderValue: {
    color: '#7a2f3d',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sliderLabel: {
    color: '#71675f',
    fontSize: 12,
    fontWeight: '500',
  },
  sliderTrack: {
    height: 8,
    backgroundColor: '#d9cab8',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 20,
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#7a2f3d',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#7a2f3d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: '#fffdf9',
    fontSize: 24,
    fontWeight: '700',
  },
})
