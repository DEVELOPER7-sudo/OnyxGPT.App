/**
 * Generate a random username for anonymous creators
 */
export function generateRandomUsername(): string {
  const adjectives = [
    'Swift', 'Bright', 'Keen', 'Clever', 'Smart',
    'Quick', 'Sharp', 'Bold', 'Wise', 'Noble',
    'Brave', 'Free', 'Wild', 'Silent', 'Golden',
    'Silver', 'Rapid', 'Mighty', 'Strong', 'Gentle',
    'Joyful', 'Happy', 'Calm', 'Cool', 'Epic',
    'Awesome', 'Super', 'Ultra', 'Mega', 'Prime'
  ];

  const nouns = [
    'Phoenix', 'Dragon', 'Tiger', 'Eagle', 'Wolf',
    'Lion', 'Panda', 'Owl', 'Raven', 'Falcon',
    'Hawk', 'Fox', 'Bear', 'Dolphin', 'Whale',
    'Shark', 'Penguin', 'Parrot', 'Butterfly', 'Bee',
    'Spider', 'Ant', 'Coder', 'Builder', 'Creator',
    'Artist', 'Writer', 'Thinker', 'Explorer', 'Seeker'
  ];

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 10000);

  return `${adjective}${noun}${number}`;
}
