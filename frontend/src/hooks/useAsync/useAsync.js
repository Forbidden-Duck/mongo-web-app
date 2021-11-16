import { useCallback, useEffect, useState } from "react";

/**
 *
 * @param {function} callbackFn
 * @param {Array} deps
 * @returns { { loading: boolean, error: Error, value: any } }
 */
export default function useAsync(callbackFn, deps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [value, setValue] = useState();

    const callbackFnMemoised = useCallback(() => {
        setLoading(true);
        setError(undefined);
        setValue(undefined);
        callbackFn()
            .then(setValue)
            .catch(setError)
            .finally(() => setLoading(false));
    }, deps);

    useEffect(() => {
        callbackFnMemoised();
    }, [callbackFnMemoised]);

    return { loading, error, value };
}
