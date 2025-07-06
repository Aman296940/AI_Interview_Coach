
export function calcFinalScore(sessions) {
  if (!sessions.length) return 0;
  const totalWeight = sessions.reduce((sum, s) => sum + (s.weight ?? 1), 0);
  const weighted = sessions.reduce(
    (sum, s) => sum + (s.score * (s.weight ?? 1)),
    0
  );
  return Math.round((weighted / totalWeight) * 10);
}
    