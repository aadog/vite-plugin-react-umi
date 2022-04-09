// @ts-nocheck
// This file is generated by Umi automatically
// DO NOT CHANGE IT MANUALLY!
import { useState, useEffect, useCallback } from 'react';
import { AppData } from '../appData';

const initState = {
    initialState: undefined,
    loading: true,
    error: undefined,
};

export default () => {
    const [state, setState] = useState(initState);
    const refresh = useCallback(async () => {
        setState((s) => ({ ...s, loading: true, error: undefined }));
        try {
            const ret = await AppData.umiConfig.getInitialState();
            setState((s) => ({ ...s, initialState: ret, loading: false }));
        } catch (e) {
            setState((s) => ({ ...s, error: e, loading: false }));
        }
        // [?]
        // await sleep(10);
    }, []);

    const setInitialState = useCallback(async (initialState) => {
        setState((s) => {
            if (typeof initialState === 'function') {
                return { ...s, initialState: initialState(s.initialState), loading: false };
            }
            return { ...s, initialState, loading: false };
        });
        // [?]
        // await sleep(10)
    }, []);

    useEffect(() => {
        refresh();
    }, []);

    return {
        ...state,
        refresh,
        setInitialState,
    };
}