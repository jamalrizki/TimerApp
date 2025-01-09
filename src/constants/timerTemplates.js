export const timerTemplates = [
  {
    id: 'quick5',
    name: '5 Minutes Quick Timer',
    description: 'A quick 5-minute timer for short tasks',
    timers: [
      {
        id: 'quick5_1',
        name: '5min Focus',
        description: 'Quick Focus Session',
        duration: 300,
      }
    ]
  },
  {
    id: 'pomodoro',
    name: 'Pomodoro',
    description: '25 minutes focused work session',
    timers: [
      {
        id: 'pomodoro_1',
        name: 'Focus Session',
        description: 'Deep Work',
        duration: 1500,
      },
      {
        id: 'pomodoro_2',
        name: 'Short Break',
        description: 'Quick Refresh',
        duration: 300,
      }
    ]
  },
  {
    id: 'break',
    name: 'Short Break',
    description: '5 minutes break between tasks',
    timers: [
      {
        id: 'break_1',
        name: 'Break',
        description: 'Short Rest',
        duration: 300,
      }
    ]
  },
  {
    id: 'longBreak',
    name: 'Long Break',
    description: '15 minutes longer break',
    timers: [
      {
        id: 'longbreak_1',
        name: 'Long Break',
        description: 'Extended Rest',
        duration: 900,
      }
    ]
  },
  {
    id: 'boxBreathing',
    name: 'Box Breathing',
    description: '4-4-4-4 breathing pattern',
    timers: [
      {
        id: 'box_1',
        name: 'Inhale',
        description: 'Breathe In',
        duration: 4,
      },
      {
        id: 'box_2',
        name: 'Hold',
        description: 'Hold Breath',
        duration: 4,
      },
      {
        id: 'box_3',
        name: 'Exhale',
        description: 'Breathe Out',
        duration: 4,
      },
      {
        id: 'box_4',
        name: 'Hold Empty',
        description: 'Hold Empty',
        duration: 4,
      }
    ]
  },
  {
    id: '478Breathing',
    name: '4-7-8 Breathing',
    description: 'Relaxing breath pattern',
    timers: [
      {
        id: '478_1',
        name: 'Inhale',
        description: 'Breathe In',
        duration: 4,
      },
      {
        id: '478_2',
        name: 'Hold',
        description: 'Hold Breath',
        duration: 7,
      },
      {
        id: '478_3',
        name: 'Exhale',
        description: 'Long Exhale',
        duration: 8,
      }
    ]
  },
  {
    id: 'wimHof',
    name: 'Wim Hof Method',
    description: 'Basic Wim Hof breathing cycle',
    timers: [
      {
        id: 'wimhof_1',
        name: 'Deep Breath',
        description: 'Inhale Deeply',
        duration: 2,
      },
      {
        id: 'wimhof_2',
        name: 'Hold',
        description: 'Hold Breath',
        duration: 2,
      },
      {
        id: 'wimhof_3',
        name: 'Exhale',
        description: 'Release Breath',
        duration: 2,
      },
      {
        id: 'wimhof_4',
        name: 'Hold Empty',
        description: 'Retain Empty',
        duration: 15,
      }
    ]
  },
  {
    id: 'hiit',
    name: 'HIIT Workout',
    description: '30s work, 15s rest intervals',
    timers: [
      {
        id: 'hiit_1',
        name: 'Work',
        description: 'High Intensity',
        duration: 30,
      },
      {
        id: 'hiit_2',
        name: 'Rest',
        description: 'Recovery',
        duration: 15,
      }
    ]
  }
]; 