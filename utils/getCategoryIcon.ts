export function getCategoryIcon(category: string): string {
  switch (category) {
    case "weight_training":
      return "🏋️‍♂️";
    case "cardio":
      return "🔥";
    case "calisthenics":
      return "🤸‍♂️";
    default:
      return "💪";
  }
}
