/**
 * Character sets for random string generation
 */
const CHAR_SETS = {
  ALPHA_LOWER: 'abcdefghijklmnopqrstuvwxyz',
  ALPHA_UPPER: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  NUMBERS: '0123456789',
  SPECIAL: '!@#$%^&*()_+-=[]{}|;:,.<>?'
} as const;

/**
 * Options for random string generation
 */
interface RandomStringOptions {
  /** Length of the generated string */
  length?: number;
  /** Include lowercase letters */
  includeLowercase?: boolean;
  /** Include uppercase letters */
  includeUppercase?: boolean;
  /** Include numbers */
  includeNumbers?: boolean;
  /** Include special characters */
  includeSpecial?: boolean;
  /** Custom character set to use (overrides other options) */
  customCharSet?: string;
}

/**
 * Generates a random string with the specified options
 * @param options Configuration options for string generation
 * @returns A random string
 */
export function generateRandomString(options: RandomStringOptions = {}): string {
  const {
    length = 10,
    includeLowercase = true,
    includeUppercase = true,
    includeNumbers = true,
    includeSpecial = false,
    customCharSet
  } = options;

  // Use custom character set if provided, otherwise build from options
  let chars = customCharSet;
  if (!chars) {
    chars = '';
    if (includeLowercase) chars += CHAR_SETS.ALPHA_LOWER;
    if (includeUppercase) chars += CHAR_SETS.ALPHA_UPPER;
    if (includeNumbers) chars += CHAR_SETS.NUMBERS;
    if (includeSpecial) chars += CHAR_SETS.SPECIAL;
  }

  if (!chars) {
    throw new Error('No character set specified for random string generation');
  }

  let result = '';
  const charsLength = chars.length;
  const randomValues = new Uint32Array(length);

  // Get cryptographically secure random values
  crypto.getRandomValues(randomValues);

  // Generate the random string
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % charsLength];
  }

  return result;
}

/**
 * Generates a simple random ID string
 * @param length Length of the ID (default: 8)
 * @returns A random ID string
 */
export function generateId(length = 8): string {
  return generateRandomString({
    length,
    includeLowercase: true,
    includeUppercase: false,
    includeNumbers: true,
    includeSpecial: false
  });
}

/**
 * Generates a random username
 * @returns A random username string
 */
export function generateName(): string {
  const adjectives = ['Happy', 'Lucky', 'Sunny', 'Clever', 'Swift', 'Bright', 'Kind', 'Wise'];
  const nouns = ['Panda', 'Tiger', 'Eagle', 'Dolphin', 'Fox', 'Wolf', 'Bear', 'Lion'];
  
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(Math.random() * 1000);
  
  return `${randomAdjective}${randomNoun}${randomNumber}`;
}

