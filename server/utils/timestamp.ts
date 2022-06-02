import dayjs from 'dayjs'

type TimeStampStyle = 'long' | 'medium' | 'short'

export function getUnix() {
    return dayjs().unix()
}

export function getISO8601() {
    return dayjs().toISOString()
}

export function getPrettyTimestamp(style: TimeStampStyle = 'medium') {
    if (style === 'long') return dayjs().format('LLLL')
    if (style === 'short') return dayjs().format('HH:mma')
    return dayjs().format('MM/DD HH:mma')
}
