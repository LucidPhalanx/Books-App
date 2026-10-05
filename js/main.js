import { elements } from "./elements.js";
import { addBook, editBook, updateState} from "./books.js";
import { renderBooks, renderSelectedBooks, renderOverview } from "./rendering.js";
import { state, loadState } from "./state.js";

function initialize() {
    elements.bookView.value = "all";
    elements.bookSort.value = "none";
    elements.searchBooksInput.value = "";
    elements.searchAuthorsInput.value = "";
    elements.searchGenresInput.value = "";

    loadState();
    updateState();
    showSection(elements.overviewSection);
    renderBooks(state.books, elements.booksContainer, true);
    renderOverview();
}

function clearDialog() {
    elements.bookTitleInput.value = "";
    elements.bookAuthorInput.value = "";
    elements.bookGenreInput.value = "";
    elements.bookPagesInput.value = 0;
    elements.bookStatusInput.value = "want-to-read";
    elements.bookRatingInput.value = "";
    elements.bookDateStartedInput.value = "";
    elements.bookDateFinishedInput.value = "";
    elements.bookNotesInput.value = "";

    elements.addBookDialog.close();
}

function showSection(sectionToShow) {
    const sections = [
        elements.overviewSection,
        elements.booksSection,
        elements.readingSection,
        elements.wantToReadSection,
        elements.finishedSection,
        elements.favoriteSection
    ];

    sections.forEach(section => {
        section.style.display = section === sectionToShow ? "block" : "none";
    });
}

elements.favoriteViewButton.addEventListener("click", () => {
    showSection(elements.favoriteSection);
    renderBooks(state.books.filter(book => book.favorite), elements.favoriteContainer, false);
})

elements.overviewButton.addEventListener("click", () => {
    showSection(elements.overviewSection);
    renderOverview()
});

elements.booksButton.addEventListener("click", () => {
    showSection(elements.booksSection);
});

elements.readingButton.addEventListener("click", () => {
    showSection(elements.readingSection);
    renderBooks(state.books.filter(book => book.status === "reading"), elements.currentlyReadingContainer, false);
});

elements.wantToReadButton.addEventListener("click", () => {
    showSection(elements.wantToReadSection);
    renderBooks(state.books.filter(book => book.status === "want-to-read"), elements.wantToReadContainer, false);
});

elements.finishedButton.addEventListener("click", () => {
    showSection(elements.finishedSection);
    renderBooks(state.books.filter(book => book.status === "finished"), elements.finishedContainer, false);
});

elements.addBookButton.addEventListener("click", () => {
    elements.saveBookButton.textContent = "Add Book";
    clearDialog();
    elements.addBookDialog.showModal();
})

elements.cancelAddBookButton.addEventListener("click", () => {
    clearDialog();
})

elements.saveBookButton.addEventListener("click", () => {
    const title = elements.bookTitleInput.value.trim();
    const author = elements.bookAuthorInput.value.trim();
    const genre = elements.bookGenreInput.value.trim();
    const pages = elements.bookPagesInput.value === "" ? null : Number(elements.bookPagesInput.value);
    const status = elements.bookStatusInput.value;
    const rating = elements.bookRatingInput.value === "" ? null : Number(elements.bookRatingInput.value);
    const dateStarted = elements.bookDateStartedInput.value;
    const dateFinished = elements.bookDateFinishedInput.value;
    const notes = elements.bookNotesInput.value;

    if (!title || !author || !status) {
        alert("Fill out the form.");
        return;
    }

    if (elements.saveBookButton.textContent === "Add Book") {
        addBook(title, author, genre, pages, status, rating, dateStarted, dateFinished, notes);
        renderBooks(state.books, elements.booksContainer, true);
        clearDialog();
        renderOverview();
    } else if (elements.saveBookButton.textContent === "Edit") {
        const currentBook = state.books.find(book => book.id === state.currentBookId)
        const isFavorite = currentBook.favorite;
        editBook(state.currentBookId, title, author, genre, pages, status, rating, dateStarted, dateFinished, notes, isFavorite);
        renderBooks(state.books, elements.booksContainer, true);
        elements.saveBookButton.textContent = "Add Book";
        state.currentBookId = "";
        clearDialog();
        renderOverview();
    }
})

elements.bookView.addEventListener("change", renderSelectedBooks);
elements.bookSort.addEventListener("change", renderSelectedBooks);
elements.searchBooksInput.addEventListener("change", renderSelectedBooks);
elements.searchAuthorsInput.addEventListener("change", renderSelectedBooks);
elements.searchGenresInput.addEventListener("change", renderSelectedBooks);

initialize();