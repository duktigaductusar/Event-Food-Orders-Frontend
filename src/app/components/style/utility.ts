import { breakpoints } from "./breakpoints";

export function getBaseContainerStyle() {
    return { "max-width": `${breakpoints.lg}px`  };
}