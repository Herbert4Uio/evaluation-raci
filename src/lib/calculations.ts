import { Activity } from './types';

export const calculateCompliance = (
  scores: Record<string, number | 'NA'>,
  activities: Activity[]
) => {
  let obtainedScore = 0;
  let maxPossibleScore = 0;

  activities.forEach((activity) => {
    const score = scores[activity.id];
    if (score !== undefined && score !== 'NA') {
      obtainedScore += score * activity.weight;
      maxPossibleScore += 5 * activity.weight;
    }
  });

  const percentage = maxPossibleScore > 0 ? obtainedScore / maxPossibleScore : 0;
  return {
    obtainedScore,
    maxPossibleScore,
    percentage
  };
};
