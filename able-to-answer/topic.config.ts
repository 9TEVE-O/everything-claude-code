export interface TopicConfig {
  id: string
  name: string
  description: string
  searchQueries: string[]
  knownChannels: string[]
  categoryRules: Record<string, string[]>
  durationCategories: {
    quickHit: number
    deepDive: number
  }
}

export const ABLETON_CONFIG: TopicConfig = {
  id: 'ableton',
  name: 'Able-to-Answer',
  description: 'Every Ableton Live tutorial, interview, and session on YouTube — auto-categorized.',
  searchQueries: [
    'Ableton Live tutorial',
    'Ableton tips tricks',
    'Ableton mixing tutorial',
    'Ableton mastering tutorial',
    'Ableton Wavetable tutorial',
    'Ableton Operator synthesizer',
    'Ableton Max for Live tutorial',
    'Ableton live performance set',
    'Ableton sampling techniques',
    'Ableton beginner guide',
    'Ableton advanced techniques',
    'producer interview Ableton',
    'music production Ableton workflow',
    'Ableton workflow tips',
    'Ableton plugins tutorial',
    'Ableton arrangement tips',
    'Ableton drum rack tutorial',
    'Ableton automation tips',
    'Ableton MIDI tutorial',
    'Ableton Push tutorial',
    'Ableton mixing session',
    'Ableton sound design',
    'Ableton creative techniques',
    'how I make music Ableton',
    'Ableton Live 12 tutorial',
  ],
  knownChannels: [
    'UCXom-HriOvPMjdpHKSzBkXw', // Ableton official
    'UCIcCXe3iWo6lB3-DzNfNwqQ', // Point Blank Music School
    'UCpDJl2EmP7Oh90Vyl9VTa2g', // Produce Like A Pro
    'UCMN75R7jIJWLKdOyUuWU3ZA', // In The Mix
    'UCGxaKQ9jJRBwGYL8yKkFqbQ', // Sadowick Production
  ],
  categoryRules: {
    'tips-tricks': ['tips', 'tricks', 'hack', 'shortcut', 'workflow', 'secret', 'faster', 'productivity', 'hidden', 'quick tip'],
    'mixing-mastering': ['mixing', 'mastering', 'mix', 'master', 'eq', 'equalizer', 'compression', 'compressor', 'limiter', 'loudness', 'levels', 'gain staging', 'sidechain', 'reverb', 'delay'],
    'plugins-instruments': ['plugin', 'vst', 'au', 'wavetable', 'operator', 'analog', 'collision', 'tension', 'max for live', 'synth', 'synthesizer', 'drum rack', 'sampler', 'simpler', 'instrument rack', 'effect rack'],
    'interviews': ['interview', 'behind the scenes', 'how i make', 'my process', 'artist story', 'producer talk', 'making of', 'studio tour', 'day in the life'],
    'beginner': ['beginner', 'getting started', 'basics', 'intro to', 'fundamentals', 'first steps', 'learn ableton', 'how to use', 'start here', 'for beginners', 'introduction'],
    'advanced': ['advanced', 'deep dive', 'professional', 'complex', 'expert', 'pro tips', 'next level', 'in depth', 'masterclass'],
    'live-performance': ['live performance', 'live set', 'performing live', 'concert', 'gig', 'dj set', 'ableton push live', 'playing live', 'live show'],
    'sampling': ['sampling', 'sample', 'chop', 'loop', 'arrangement', 'clip launch', 'flip a sample', 'chopping samples', 'drum loop'],
  },
  durationCategories: {
    quickHit: 300,
    deepDive: 1800,
  },
}

// To create a hub for a different topic, copy this config and swap it in:
// export const FL_STUDIO_CONFIG: TopicConfig = { id: 'fl-studio', name: 'FL Answer', ... }

export const ACTIVE_TOPIC = ABLETON_CONFIG
