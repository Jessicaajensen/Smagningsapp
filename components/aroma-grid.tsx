import { View, Pressable, Text, StyleSheet } from 'react-native'

interface AromaGridProps {
  aromas: string[]
  selectedAromas: number[]
  onSelect: (index: number) => void
}

export function AromaGrid({ aromas, selectedAromas, onSelect }: AromaGridProps) {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {aromas.map((aroma, index) => (
          <Pressable
            key={`${aroma}-${index}`}
            onPress={() => onSelect(index)}
            style={({ pressed }) => [
              styles.aromaButton,
              selectedAromas.includes(index) && styles.aromaButtonSelected,
              pressed && styles.aromaButtonPressed,
            ]}
          >
            <Text
              style={[
                styles.aromaButtonText,
                selectedAromas.includes(index) && styles.aromaButtonTextSelected,
              ]}
            >
              {aroma}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  aromaButton: {
    backgroundColor: '#fffaf3',
    borderWidth: 2,
    borderColor: '#d9cab8',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  aromaButtonSelected: {
    backgroundColor: '#7a2f3d',
    borderColor: '#7a2f3d',
  },
  aromaButtonPressed: {
    opacity: 0.8,
  },
  aromaButtonText: {
    color: '#7a2f3d',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  aromaButtonTextSelected: {
    color: '#fffdf9',
  },
})
