export function buildRecommendation(food, alternatives = []) {
  const reasons = [];

  if (food.calories > 700) reasons.push('High calorie intake warning');
  if (food.fats > 20) reasons.push('Lower fat alternative available');
  if (food.protein > 25) reasons.push('High protein meal for fitness');
  if (food.sugar > 8) reasons.push('High sugar content');
  if (food.fiber < 4) reasons.push('Low fiber content');

  const healthier = alternatives.find((item) => item.food_id !== food.food_id);

  if (!reasons.length) {
    return {
      level: 'Balanced',
      message: 'This item has a balanced nutrition profile for an occasional meal.',
      alternative: healthier || null
    };
  }

  const healthIssues = reasons.filter((reason) => !reason.toLowerCase().includes('fitness') && !reason.toLowerCase().includes('good'));
  if (!healthIssues.length) {
    return {
      level: 'Protein Rich',
      message: 'High protein meal for fitness. Pair it with fiber-rich vegetables for a more complete meal.',
      alternative: healthier || null
    };
  }

  const alternativeText = healthier ? ` Consider ${healthier.food_name} as a healthier alternative.` : '';
  return {
    level: healthIssues.length > 1 ? 'Needs Attention' : 'Moderate',
    message: `${capitalize(healthIssues.join(' and '))} detected.${alternativeText}`,
    alternative: healthier || null
  };
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
