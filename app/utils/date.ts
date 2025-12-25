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

// Convert date range string to startDate and endDate
export const getDateRange = (range: string): { startDate?: string; endDate?: string } => {
  const now = new Date()
  const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
  
  let startDate: Date

  switch (range) {
    case '1D':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0, 0)
      break
    case '7D':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7, 0, 0, 0, 0)
      break
    case '1M':
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate(), 0, 0, 0, 0)
      break
    case '3M':
      startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate(), 0, 0, 0, 0)
      break
    case 'Custom':
      // For custom, return empty to show all events
      // You can implement custom date picker later
      return {}
    default:
      // Default to 7 days
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7, 0, 0, 0, 0)
  }

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  }
}
