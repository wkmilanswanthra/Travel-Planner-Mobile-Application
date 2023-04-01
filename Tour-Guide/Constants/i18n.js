import {en, fr, es, de, ru, it} from "./Strings";
import * as Localization from 'expo-localization'
import {I18n} from 'i18n-js'
import React, {useState, useContext, useEffect, createContext} from 'react';

export const LocalizationContext = createContext();

export default function LocalizationProvider({children}){
    const [local, setLocal] = useState(Localization.locale);
    const i18n = new I18n({ en, fr, es, de, ru, it }, 'en');
    i18n.enableFallback = true;
    i18n.missingBehavior = 'guess';
    i18n.locale = local;

    useEffect(() => {
        setLocal(Localization.locale);
    }, [Localization.locale]);

    return (
        <LocalizationContext.Provider value={{ i18n, local, setLocal }}>
            {children}
        </LocalizationContext.Provider>
    );
}

