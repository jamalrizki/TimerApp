export const timerTemplates = [
  {
    id: 'quick5',
    name: '5 Minutes Quick Timer',
    description: 'A quick 5-minute timer for short tasks',
    intervals: [
      { duration: 300, label: 'Focus' }
    ]
  },
  {
    id: 'pomodoro',
    name: 'Pomodoro',
    description: '25 minutes focused work session',
    intervals: [
      { duration: 1500, label: 'Focus' },
      { duration: 300, label: 'Short Break' }
    ]
  },
  {
    id: 'break',
    name: 'Short Break',
    description: '5 minutes break between tasks',
    intervals: [
      { duration: 300, label: 'Break' }
    ]
  },
  {
    id: 'longBreak',
    name: 'Long Break',
    description: '15 minutes longer break',
    intervals: [
      { duration: 900, label: 'Long Break' }
    ]
  },
  {
    id: 'boxBreathing',
    name: 'Box Breathing',
    description: '4-4-4-4 breathing pattern',
    intervals: [
      { duration: 4, label: 'Inhale' },
      { duration: 4, label: 'Hold' },
      { duration: 4, label: 'Exhale' },
      { duration: 4, label: 'Hold' }
    ]
  },
  {
    id: '478Breathing',
    name: '4-7-8 Breathing',
    description: 'Relaxing breath pattern',
    intervals: [
      { duration: 4, label: 'Inhale' },
      { duration: 7, label: 'Hold' },
      { duration: 8, label: 'Exhale' }
    ]
  },
  {
    id: 'wimHof',
    name: 'Wim Hof Method',
    description: 'Basic Wim Hof breathing cycle',
    intervals: [
      { duration: 2, label: 'Deep Breath' },
      { duration: 2, label: 'Hold' },
      { duration: 2, label: 'Exhale' },
      { duration: 15, label: 'Hold Empty' }
    ]
  },
  {
    id: 'hiit',
    name: 'HIIT Workout',
    description: '30s work, 15s rest intervals',
    intervals: [
      { duration: 30, label: 'High Intensity' },
      { duration: 15, label: 'Rest' }
    ]
  }
]; 