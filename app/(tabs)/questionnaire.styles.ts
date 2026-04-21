import { StyleSheet } from 'react-native'

export const questionnaireStyles = StyleSheet.create({
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  optionButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fffaf3',
    borderWidth: 2,
    borderColor: '#d9cab8',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButtonSelected: {
    backgroundColor: '#7a2f3d',
    borderColor: '#7a2f3d',
  },
  optionButtonPressed: {
    opacity: 0.8,
  },
  optionButtonText: {
    color: '#7a2f3d',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  optionButtonTextSelected: {
    color: '#fffdf9',
  },
  sliderContainer: {
    marginTop: 24,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sliderLabel: {
    color: '#71675f',
    fontSize: 12,
    fontWeight: '500',
  },
  sliderValue: {
    color: '#7a2f3d',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
})
