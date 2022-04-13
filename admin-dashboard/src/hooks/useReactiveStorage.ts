import { useState, useMemo, useCallback } from 'react'
import { useLocalStorage, useEvent } from 'react-use'

// @NOTE: create conditions where you can pass in arrays or objects and the hook serializes and deserializes
function useReactiveStorage(key: string, value: string) {
    const [storageValue, setStorageValue, removeStorageValue] = useLocalStorage<
        string | undefined
    >(key)
    const [stateValue, setStateValue] = useState(storageValue || value)

    const set = useCallback((newValue: string) => {
        setStorageValue(newValue)
        setStateValue(newValue)
    }, [setStateValue, setStorageValue])

    const remove = useCallback(() => {
        removeStorageValue()
        setStateValue('')
    }, [removeStorageValue, setStateValue])

    const storageValueChanged = useCallback(() => {
        const newStorageValue = window.localStorage.getItem(key)

        if (newStorageValue !== stateValue) {
            setStateValue(newStorageValue || '')
        }
    }, [stateValue, key])

    useEvent('storage', storageValueChanged)

    return useMemo(() => [
        stateValue,
        set as any,
        remove as any,
    ], [stateValue, set, remove])
}

export default useReactiveStorage