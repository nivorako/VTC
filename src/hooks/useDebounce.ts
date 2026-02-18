import { useState, useEffect } from "react";

/**
 * Hook qui renvoie une valeur "debounced".
 *
 * Utile pour éviter de déclencher des effets trop fréquents (ex: requêtes API)
 * lors de la saisie utilisateur.
 *
 * @template T Type de la valeur à "debouncer".
 * @param value Valeur courante.
 * @param delay Délai en millisecondes avant de publier la valeur.
 * @returns La dernière valeur après stabilisation pendant `delay` ms.
 */
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default useDebounce;
