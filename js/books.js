import { state, saveState } from "./state.js";

export function addBook(title, author, genre, pages, status, rating, notes) {
    const id = crypto.randomUUID();

    state.books.push({
        id: id,
        title: title,
        author: author,
        genre: genre,
        pages: pages === null ? null : Number(pages),
        status: status,
        rating: rating === null ? null : Number(rating),
        notes: notes
    });

    saveState();
}

export function deleteBook(id) {
    const bookToDeleteIndex = state.books.findIndex(book => book.id === id);
    if (bookToDeleteIndex === -1) {
        return;
    }

    state.books.splice(bookToDeleteIndex, 1);
    saveState();
}

export function editBook(id, title, author, genre, pages, status, rating, notes) {
    const bookToEditIndex = state.books.findIndex(book => book.id === id);
    if (bookToEditIndex === -1) {
        return;
    }

    state.books[bookToEditIndex] = {
        id: id,
        title: title,
        author: author,
        genre: genre,
        pages: pages === null ? null : Number(pages),
        status: status,
        rating: rating === null ? null : Number(rating),
        notes: notes
    };

    saveState();
}