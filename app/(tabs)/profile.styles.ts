import { StyleSheet } from 'react-native';

export const profileStyles = StyleSheet.create({
  screenCenter: {
    flex: 1,
    backgroundColor: '#f3ede3',
  },
  pageContent: {
    padding: 24,
    paddingTop: 56,
    paddingBottom: 120,
    gap: 20,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 10,
  },
  sectionSpacing: {
    gap: 16,
  },
  sectionHeading: {
    color: '#2e251f',
    fontSize: 24,
    fontWeight: '600',
    marginTop: 8,
  },
  reviewStack: {
    gap: 14,
  },
  actionsRow: {
    paddingTop: 4,
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