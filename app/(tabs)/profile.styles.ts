import { StyleSheet } from 'react-native';

export const profileStyles = StyleSheet.create({
  screenCenter: {
    flex: 1,
    backgroundColor: '#f3ede3',
    justifyContent: 'center',
    padding: 24,
  },
  mainCard: {
    backgroundColor: '#fffdf9',
    borderRadius: 22,
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
  },
});