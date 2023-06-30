export const sameDay = (date, other) => {
  return (
    date.getFullYear() == other.getFullYear() &&
    date.getMonth() == other.getMonth() &&
    date.getDate() == other.getDate()
  )
}