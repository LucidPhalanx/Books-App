export const state = {
    books: [],
    currentBookId: "",
    genresRead: [],
    authorsRead: []
}

export function saveState() {
    localStorage.setItem("state", JSON.stringify(state));
}

export function loadState() {
    const savedState = localStorage.getItem("state");

    if (savedState) {
        Object.assign(state, JSON.parse(savedState));
    }
}