/** Clamp a value to 1-99 range */
function clamp(value: number): number {
  return Math.min(99, Math.max(1, Math.round(value)));
}

/**
 * STR — derived from lean body mass in kg.
 * Lean mass = weight * (1 - bodyFat/100)
 * Scaled: 30kg lean -> 1, 80kg lean -> 99
 */
export function calculateSTR(weightKg: number | undefined, bodyFatPct: number | undefined): number | null {
  if (weightKg == null || bodyFatPct == null) return null;
  const leanMass = weightKg * (1 - bodyFatPct / 100);
  // Linear scale: 30-80 kg lean mass -> 1-99
  return clamp(((leanMass - 30) / 50) * 98 + 1);
}

/**
 * END — derived from daily steps + active minutes.
 * Steps: 0-15000 mapped to 0-70
 * Active minutes: 0-120 mapped to 0-29
 */
export function calculateEND(steps: number | undefined, activeMinutes: number | undefined): number | null {
  if (steps == null) return null;
  const stepsComponent = Math.min(70, (steps / 15000) * 70);
  const minutesComponent = activeMinutes != null ? Math.min(29, (activeMinutes / 120) * 29) : 0;
  return clamp(stepsComponent + minutesComponent);
}

/**
 * VIT — derived from resting heart rate + sleep efficiency.
 * Lower resting HR is better: 80bpm -> low, 40bpm -> high
 * Higher sleep efficiency is better: 0% -> low, 100% -> high
 * Each contributes roughly half.
 */
export function calculateVIT(restingHr: number | undefined, sleepEfficiency: number | undefined): number | null {
  if (restingHr == null && sleepEfficiency == null) return null;

  let score = 0;
  let components = 0;

  if (restingHr != null) {
    // 40-80 bpm range, lower is better -> inverted scale
    const hrScore = ((80 - Math.min(80, Math.max(40, restingHr))) / 40) * 99;
    score += hrScore;
    components++;
  }

  if (sleepEfficiency != null) {
    // 0-100% efficiency, higher is better
    const sleepScore = (sleepEfficiency / 100) * 99;
    score += sleepScore;
    components++;
  }

  return clamp(score / components);
}

/**
 * Player level derived from total enemies defeated.
 * Level = floor(sqrt(totalDefeated * 2)) + 1
 */
export function calculateLevel(totalDefeated: number): number {
  return Math.floor(Math.sqrt(totalDefeated * 2)) + 1;
}

const TITLES = ['Novice', 'Apprentice', 'Warrior', 'Veteran', 'Champion', 'Hero', 'Legend'] as const;

/** Player title based on level */
export function getTitle(level: number): string {
  const index = Math.min(level - 1, TITLES.length - 1);
  return TITLES[index];
}
