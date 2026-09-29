import { elements } from "./elements.js";
import { state } from "./state.js";
import { deleteBook } from "./books.js";

export function renderBooks(array = state.books, container, showActions = true) {
    container.innerHTML = "";

    for (const book of array) {
        const bookDiv = document.createElement("div");
        bookDiv.id = book.id
        bookDiv.classList.add("book");

        const bookTitleHeading = document.createElement("h3");
        bookTitleHeading.textContent = book.title;

        const bookAuthorPara = document.createElement("p");
        bookAuthorPara.textContent = `Author: ${book.author}`;

        const bookGenrePara = document.createElement("p");
        bookGenrePara.textContent = `Genre: ${book.genre}`;

        const bookPagesPara = document.createElement("p");
        bookPagesPara.textContent = book.pages !== null ? `Pages: ${book.pages}` : "";

        const bookStatusPara = document.createElement("p");
        if (book.status == "reading" ) {
            bookStatusPara.textContent = "Status: Reading";
        } else if (book.status == "finished") {
            bookStatusPara.textContent = "Status: Finished";
        } else if (book.status == "want-to-read") {
            bookStatusPara.textContent = "Status: Want to read";
        }

        const bookRatingPara = document.createElement("p");
        if (book.rating !== null) {
            const totalStars = 5;
            const filledStars = "★".repeat(book.rating);
            const emptyStars = "☆".repeat(totalStars - book.rating);
            
            bookRatingPara.textContent = `Rating: ${filledStars}${emptyStars}`;
        } else if (book.rating === null) {
            bookRatingPara.textContent = "No Rating given yet";
        }

        const bookNotesPara = document.createElement("p");
        bookNotesPara.textContent = book.notes !== "" ? `Notes: ${book.notes}` : "";

        bookDiv.appendChild(bookTitleHeading);
        bookDiv.appendChild(bookAuthorPara);
        bookDiv.appendChild(bookGenrePara);
        bookDiv.appendChild(bookPagesPara);
        bookDiv.appendChild(bookStatusPara);
        bookDiv.appendChild(bookRatingPara);
        bookDiv.appendChild(bookNotesPara);
        
        if (showActions == true) {
            const bookDeleteButton = document.createElement("button");
            bookDeleteButton.textContent = "Delete";
            bookDeleteButton.classList.add("deleteButton");

            const bookEditButton = document.createElement("button");
            bookEditButton.textContent = "Edit";
            bookEditButton.style.marginLeft = "5px";

            bookDeleteButton.addEventListener("click", () => {
                deleteBook(book.id);
                renderBooks(array, container, showActions);
                renderOverview();
            })

            bookEditButton.addEventListener("click", () => {
                state.currentBookId = book.id;
                renderEditDialog(book.id);
                renderOverview();
            })

            bookDiv.appendChild(bookDeleteButton);
            bookDiv.appendChild(bookEditButton);
        }

        container.appendChild(bookDiv);
    }

    renderOverview()
}

export function renderEditDialog(id) {
    const bookToEditIndex = state.books.findIndex(book => book.id === id);
    if (bookToEditIndex === -1) {
        return;
    }

    elements.saveBookButton.textContent = "Edit";
    elements.bookTitleInput.value = state.books[bookToEditIndex].title;
    elements.bookAuthorInput.value = state.books[bookToEditIndex].author;
    elements.bookGenreInput.value = state.books[bookToEditIndex].genre;
    elements.bookPagesInput.value = state.books[bookToEditIndex].pages;
    elements.bookStatusInput.value = state.books[bookToEditIndex].status;
    elements.bookRatingInput.value = state.books[bookToEditIndex].rating;
    elements.bookNotesInput.value = state.books[bookToEditIndex].notes;

    elements.addBookDialog.showModal();
    
}

export function renderSelectedBooks() {
    let displayedBooks = [...state.books];

    if (elements.bookView.value == "reading") {
        displayedBooks = displayedBooks.filter(book => book.status == "reading");
    } else if (elements.bookView.value == "want-to-read") {
        displayedBooks = displayedBooks.filter(book => book.status == "want-to-read");
    }  else if (elements.bookView.value == "finished") {
        displayedBooks = displayedBooks.filter(book => book.status == "finished");
    }

    if (elements.bookSort.value == "title-asc") {
        displayedBooks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (elements.bookSort.value == "title-desc") {
        displayedBooks.sort((a, b) => b.title.localeCompare(a.title));
    } else if (elements.bookSort.value == "rating-high") {
        displayedBooks.sort((a, b) => b.rating - a.rating);
    } else if (elements.bookSort.value == "rating-low") {
        displayedBooks.sort((a, b) => a.rating - b.rating);
    } else if (elements.bookSort.value == "pages-high") {
        displayedBooks.sort((a, b) => b.pages - a.pages);
    } else if (elements.bookSort.value == "pages-low") {
        displayedBooks.sort((a ,b) => a.pages - b.pages);
    }

    displayedBooks = displayedBooks.filter(book => book.title?.toLowerCase().includes(elements.searchBooksInput.value.toLowerCase()));
    displayedBooks = displayedBooks.filter(book => book.author?.toLowerCase().includes(elements.searchAuthorsInput.value.toLowerCase()));

    renderBooks(displayedBooks, elements.booksContainer, true);
}

export function renderOverview() {
    elements.totalBooksSpan.textContent = state.books.length;
    elements.readingSpan.textContent = state.books.filter(book => book.status === "reading").length;
    elements.finishedSpan.textContent = state.books.filter(book => book.status === "finished").length;
    elements.genreContainerUnorderedList.innerHTML = "";
    elements.authorContainerUnorderedList.innerHTML = "";

    for (const genre of state.genresRead) {
        const genreListItem = document.createElement("li");
        genreListItem.textContent = genre;

        elements.genreContainerUnorderedList.appendChild(genreListItem);
    }

    for (const author of state.authorsRead) {
        const authorListItem = document.createElement("li");
        authorListItem.textContent = author;

        elements.authorContainerUnorderedList.appendChild(authorListItem);
    }
}
