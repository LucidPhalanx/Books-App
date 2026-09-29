import { elements } from "./elements.js";
import { addBook, editBook } from "./books.js";
import { renderBooks, renderSelectedBooks } from "./rendering.js";
import { state, loadState } from "./state.js";

function initialize() {
    loadState();
    showSection(elements.overviewSection);
    renderBooks(state.books, elements.booksContainer, true);

    elements.bookView.value = "all";
    elements.bookSort.value = "none";
}

function clearDialog() {
    elements.bookTitleInput.value = "";
    elements.bookAuthorInput.value = "";
    elements.bookGenreInput.value = "";
    elements.bookPagesInput.value = 0;
    elements.bookStatusInput.value = "want-to-read";
    elements.bookRatingInput.value = "";
    elements.bookNotesInput.value = "";

    elements.addBookDialog.close();
}

function showSection(sectionToShow) {
    const sections = [
        elements.overviewSection,
        elements.booksSection,
        elements.readingSection,
        elements.wantToReadSection,
        elements.finishedSection
    ];

    sections.forEach(section => {
        section.style.display = section === sectionToShow ? "block" : "none";
    });
}

elements.overviewButton.addEventListener("click", () => {
    showSection(elements.overviewSection);
});

elements.booksButton.addEventListener("click", () => {
    showSection(elements.booksSection);
});

elements.readingButton.addEventListener("click", () => {
    showSection(elements.readingSection);
});

elements.wantToReadButton.addEventListener("click", () => {
    showSection(elements.wantToReadSection);
});

elements.finishedButton.addEventListener("click", () => {
    showSection(elements.finishedSection);
});

elements.addBookButton.addEventListener("click", () => {
    elements.addBookDialog.showModal();
})

elements.cancelAddBookButton.addEventListener("click", () => {
    clearDialog();
})

elements.saveBookButton.addEventListener("click", () => {
    const title = elements.bookTitleInput.value.trim();
    const author = elements.bookAuthorInput.value.trim();
    const genre = elements.bookGenreInput.value.trim();
    const pages = elements.bookPagesInput.value === "" ? null :  Number(elements.bookPagesInput.value);
    const status = elements.bookStatusInput.value;
    const rating = elements.bookRatingInput.value === "" ? null : Number(elements.bookRatingInput.value);
    const notes = elements.bookNotesInput.value;

    if (elements.saveBookButton.textContent === "Add Book") {
        addBook(title, author, genre, pages, status, rating, notes);
        renderBooks(state.books, elements.booksContainer, true);
        clearDialog();
    } else if (elements.saveBookButton.textContent === "Edit") {
        editBook(state.currentBookId, title, author, genre, pages, status, rating, notes);
        renderBooks(state.books, elements.booksContainer, true);
        elements.saveBookButton.textContent = "Add Book";
    }
})

elements.bookView.addEventListener("change", renderSelectedBooks);
elements.bookSort.addEventListener("change", renderSelectedBooks);

initialize();