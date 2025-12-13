/**
 * Spaced Repetition System (SRS) utilities using the SM-2 algorithm
 * Based on SuperMemo 2 algorithm by Piotr Wozniak
 */

export interface SRSResult {
  easeFactor: number;
  interval: number;
  repetition: number;
  nextReviewDate: Date;
}

type UserGrade = "easy" | "good" | "hard" | "again";

/**
 * Maps user-friendly grade to SM-2 quality value (0-5)
 * @param grade - User grade: "again", "hard", "good", or "easy"
 * @returns Quality value for SM-2 algorithm
 */
function gradeToQuality(grade: UserGrade): number {
  const gradeMap: Record<UserGrade, number> = {
    again: 0, // Complete fail
    hard: 2, // Incorrect response, correct on second attempt
    good: 3, // Correct response with effort
    easy: 5, // Perfect response
  };
  return gradeMap[grade];
}

/**
 * Calculate next review schedule using SM-2 algorithm
 * @param currentEaseFactor - Current ease factor (default: 2.5)
 * @param currentInterval - Current interval in days (default: 0)
 * @param currentRepetition - Current repetition count (default: 0)
 * @param userGrade - User's performance grade
 * @returns New SRS parameters and next review date
 */
export function calculateNextReview(
  currentEaseFactor: number,
  currentInterval: number,
  currentRepetition: number,
  userGrade: UserGrade,
): SRSResult {
  const quality = gradeToQuality(userGrade);

  let easeFactor = currentEaseFactor;
  let interval = currentInterval;
  let repetition = currentRepetition;

  // Update ease factor based on quality
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)),
  );

  // If quality < 3, reset learning
  if (quality < 3) {
    repetition = 0;
    interval = 1; // Review again tomorrow
  } else {
    repetition += 1;

    // Calculate new interval based on repetition count
    if (repetition === 1) {
      interval = 1; // First successful review: 1 day
    } else if (repetition === 2) {
      interval = 6; // Second successful review: 6 days
    } else {
      // Subsequent reviews: multiply previous interval by ease factor
      interval = Math.round(interval * easeFactor);
    }
  }

  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  return {
    easeFactor,
    interval,
    repetition,
    nextReviewDate,
  };
}
