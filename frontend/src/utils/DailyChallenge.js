/**
 * Selects a consistent problem for the day based on the current date seed.
 */
export const getDailyChallenge = (problems) => {
  if (!problems || problems.length === 0) return null;

  // Generate a seed based on YYYY-MM-DD
  const today = new Date().toISOString().slice(0, 10);
  
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = (hash << 5) - hash + today.charCodeAt(i);
    hash |= 0; 
  }

  const index = Math.abs(hash) % problems.length;
  return problems[index];
};