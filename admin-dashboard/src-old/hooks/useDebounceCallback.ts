import { debounce } from 'lodash-es'
import createCancelableHook from './createCancelableHook'

interface DebounceSettings {
    /**
     * Specify invoking on the leading edge of the timeout.
     */
    leading?: boolean

    /**
     * The maximum time func is allowed to be delayed before it’s invoked.
     */
    maxWait?: number

    /**
     * Specify invoking on the trailing edge of the timeout.
     */
    trailing?: boolean
}

const useDebounce: any = createCancelableHook(
    (...params) => debounce(...params),
    (wait?: number, options?: any) => {
        const compareParams: any[] = [wait]
        if (options) {
            compareParams.push(options.leading)
            compareParams.push(options.maxWait)
            compareParams.push(options.trailing)
            compareParams.push(options.setCancel)
        }
        return compareParams
    },
)

export default useDebounce
