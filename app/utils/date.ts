// Format date to "MMM DD, HH:MM AM/PM" format
export const formatEventDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date

  // Validate the date
  if (isNaN(d.getTime())) {
    return 'Invalid Date'
  }

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  // Use UTC methods to ensure consistent formatting regardless of server/client timezone
  const month = months[d.getUTCMonth()]
  const day = d.getUTCDate()
  let hours = d.getUTCHours()
  const minutes = d.getUTCMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'

  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  const minutesStr = minutes < 10 ? `0${minutes}` : minutes

  return `${month} ${day}, ${hours}:${minutesStr} ${ampm}`
}
