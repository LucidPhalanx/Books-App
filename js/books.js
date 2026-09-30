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
        notes: notes,
        favorite: false
    });
    
    updateState();
    saveState();
}

export function deleteBook(id) {
    const bookToDeleteIndex = state.books.findIndex(book => book.id === id);
    if (bookToDeleteIndex === -1) {
        return;
    }

    state.books.splice(bookToDeleteIndex, 1);
    updateState();
    saveState();
}

export function editBook(id, title, author, genre, pages, status, rating, notes, isFavorite) {
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
        notes: notes,
        favorite: isFavorite
    };
    
    updateState();
    saveState();
}

export function updateState() {
    const finishedBooks = state.books.filter(book => book.status === "finished");
    state.authorsRead = [];
    state.genresRead = [];
    state.booksByAuthors = [];

    for (const book of finishedBooks) {
        if (!state.authorsRead.includes(book.author)) {
            state.authorsRead.push(book.author);
        };

        if (!state.genresRead.includes(book.genre)) {
            state.genresRead.push(book.genre);
        };
    }

    for (const author of state.authorsRead) {
        const booksByAuthor = finishedBooks.filter(book => book.author === author);

        state.booksByAuthors.push({
            author: author,
            books: booksByAuthor
        })
    }

    state.booksByAuthors.sort((a, b) => b.books.length - a.books.length);
}