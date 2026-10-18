const MOBILE_BREAKPOINT = 640;
const HISTORY_ROW_HEIGHT_PX = 44;
const HISTORY_PAGER_HEIGHT_PX = 52;
const MOBILE_REWARDS_RESERVE_PX = 136;
const DESKTOP_REWARDS_RESERVE_PX = 120;
const MOBILE_REWARDS_BOTTOM_GAP_PX = 20;
const DESKTOP_REWARDS_BOTTOM_GAP_PX = 24;
const VIEWPORT_OVERFLOW_TOLERANCE_PX = 6;
const DEFAULT_MOBILE_REWARDS_PAGE_SIZE = 6;
const DEFAULT_DESKTOP_REWARDS_PAGE_SIZE = 10;

export const WALLET_HISTORY_DAYS = 30;
export const REWARDS_HISTORY_DAYS = 7;
export const WALLET_HISTORY_PAGE_SIZE = 12;

export function getDefaultRewardsPageSize(viewportWidth = 1024) {
    return viewportWidth <= MOBILE_BREAKPOINT
        ? DEFAULT_MOBILE_REWARDS_PAGE_SIZE
        : DEFAULT_DESKTOP_REWARDS_PAGE_SIZE;
}

export function getResponsiveRewardsPageSize(historyTop = 0) {
    if (!process.env.BROWSER || typeof window === 'undefined') {
        return getDefaultRewardsPageSize();
    }

    const viewportWidth = window.innerWidth || 1024;
    const viewportHeight = window.innerHeight || 768;
    const reserve =
        viewportWidth <= MOBILE_BREAKPOINT
            ? MOBILE_REWARDS_RESERVE_PX
            : DESKTOP_REWARDS_RESERVE_PX;
    const availableHeight = Math.max(0, viewportHeight - historyTop - reserve);
    const fittedPageSize = Math.floor(availableHeight / HISTORY_ROW_HEIGHT_PX);

    return Math.max(
        1,
        fittedPageSize || getDefaultRewardsPageSize(viewportWidth)
    );
}

export function getRewardsBottomGapPx(viewportWidth = 1024) {
    return viewportWidth <= MOBILE_BREAKPOINT
        ? MOBILE_REWARDS_BOTTOM_GAP_PX
        : DESKTOP_REWARDS_BOTTOM_GAP_PX;
}

export function getRewardsRowHeightPx() {
    return HISTORY_ROW_HEIGHT_PX;
}

export function fitRewardsPageSizeToViewport(pageSize, pageBottom = 0) {
    if (!process.env.BROWSER || typeof window === 'undefined') {
        return pageSize;
    }

    const viewportWidth = window.innerWidth || 1024;
    const viewportHeight = window.innerHeight || 768;
    const bottomGap = getRewardsBottomGapPx(viewportWidth);

    if (!pageBottom) {
        return pageSize;
    }

    const overflow = pageBottom - (viewportHeight - bottomGap);

    if (overflow > VIEWPORT_OVERFLOW_TOLERANCE_PX) {
        return Math.max(
            1,
            pageSize - Math.ceil(overflow / HISTORY_ROW_HEIGHT_PX)
        );
    }

    const spareHeight = viewportHeight - bottomGap - pageBottom;

    if (spareHeight >= HISTORY_ROW_HEIGHT_PX) {
        return pageSize + Math.floor(spareHeight / HISTORY_ROW_HEIGHT_PX);
    }

    return pageSize;
}

export function getRewardsPageSizeFromTop(historyTop = 0) {
    if (!process.env.BROWSER || typeof window === 'undefined') {
        return getDefaultRewardsPageSize();
    }

    const viewportWidth = window.innerWidth || 1024;
    const viewportHeight = window.innerHeight || 768;
    const bottomGap = getRewardsBottomGapPx(viewportWidth);
    const availableHeight = Math.max(
        0,
        viewportHeight -
            historyTop -
            HISTORY_PAGER_HEIGHT_PX -
            bottomGap
    );

    return Math.max(
        1,
        Math.floor(availableHeight / HISTORY_ROW_HEIGHT_PX) ||
            getDefaultRewardsPageSize(viewportWidth)
    );
}
