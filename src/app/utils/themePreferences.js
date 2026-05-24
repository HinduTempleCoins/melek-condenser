export const NIGHTMODE_STORAGE_KEY = 'blurt-nightmode';

export const getNightmodeFromSearch = (search = '') => {
    try {
        const params = new URLSearchParams(search);
        const theme = params.get('theme');
        if (theme === 'dark') return true;
        if (theme === 'light') return false;
    } catch (error) {}

    return undefined;
};

export const getStoredNightmode = () => {
    if (!process.env.BROWSER || typeof window === 'undefined') {
        return undefined;
    }

    try {
        const storedNightmode = window.localStorage.getItem(
            NIGHTMODE_STORAGE_KEY
        );
        if (storedNightmode === 'true') return true;
        if (storedNightmode === 'false') return false;
    } catch (error) {}

    return undefined;
};

export const getAppliedNightmode = () => {
    if (!process.env.BROWSER || typeof document === 'undefined') {
        return undefined;
    }

    const body = document.body;
    const html = document.documentElement;

    if (
        (body && body.classList.contains('theme-dark')) ||
        (html && html.classList.contains('theme-dark'))
    ) {
        return true;
    }

    if (
        (body && body.classList.contains('theme-light')) ||
        (html && html.classList.contains('theme-light'))
    ) {
        return false;
    }

    return undefined;
};

export const getSystemNightmode = () => {
    if (
        !process.env.BROWSER ||
        typeof window === 'undefined' ||
        !window.matchMedia
    ) {
        return undefined;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const appendThemeToUrl = (url, nightmodeEnabled) => {
    if (!url) return url;

    const explicitNightmode =
        typeof nightmodeEnabled === 'boolean'
            ? nightmodeEnabled
            : getNightmodeFromSearch(
                  process.env.BROWSER && typeof window !== 'undefined'
                      ? window.location.search
                      : ''
              );
    const appliedNightmode = getAppliedNightmode();
    const systemNightmode = getSystemNightmode();
    const effectiveNightmode =
        typeof explicitNightmode === 'boolean'
            ? explicitNightmode
            : typeof appliedNightmode === 'boolean'
                ? appliedNightmode
                : systemNightmode;

    if (typeof effectiveNightmode !== 'boolean') return url;

    const theme = effectiveNightmode ? 'dark' : 'light';
    const base =
        process.env.BROWSER && typeof window !== 'undefined'
            ? window.location.origin
            : 'http://localhost';

    try {
        const resolvedUrl = new URL(url, base);
        resolvedUrl.searchParams.set('theme', theme);

        if (/^https?:\/\//.test(url)) {
            return resolvedUrl.toString();
        }

        return `${resolvedUrl.pathname}${resolvedUrl.search}${resolvedUrl.hash}`;
    } catch (error) {
        const separator = url.indexOf('?') === -1 ? '?' : '&';
        return `${url}${separator}theme=${theme}`;
    }
};
