import { elements } from "./elements.js";
import { state, saveState } from "./state.js";
import { deleteBook } from "./books.js";

export function renderBooks(array = state.books, container, showActions = true) {
    container.innerHTML = "";

    for (const book of array) {
        const bookDiv = document.createElement("div");
        bookDiv.id = book.id
        bookDiv.classList.add("book");
        bookDiv.style.borderColor = book.favorite === true ? "yellow" : "white";

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

        const bookDateStartedPara = document.createElement("p");
        bookDateStartedPara.textContent = book.dateStarted ? `Date Started: ${book.dateStarted}` : "";
        if (book.status === "want-to-read") {
            bookDateStartedPara.textContent = "";
        }

        const bookDateFinishedPara = document.createElement("p");
        if (book.status === "reading") {
            bookDateFinishedPara.textContent = "Book is not finished yet.";
        } else if (book.status === "want-to-read") {
            bookDateFinishedPara.textContent = "";
        } else if (book.status === "finished") {
            bookDateFinishedPara.textContent = book.dateFinished ? `Date Finished: ${book.dateFinished}` : "";
        }

        const bookNotesPara = document.createElement("p");
        bookNotesPara.textContent = book.notes !== "" ? `Notes: ${book.notes}` : "";

        bookDiv.appendChild(bookTitleHeading);
        bookDiv.appendChild(bookAuthorPara);
        bookDiv.appendChild(bookGenrePara);
        bookDiv.appendChild(bookPagesPara);
        bookDiv.appendChild(bookStatusPara);
        bookDiv.appendChild(bookRatingPara);
        bookDiv.appendChild(bookDateStartedPara);
        bookDiv.appendChild(bookDateFinishedPara);
        bookDiv.appendChild(bookNotesPara);
        
        if (showActions == true) {
            const bookDeleteButton = document.createElement("button");
            bookDeleteButton.textContent = "Delete";
            bookDeleteButton.classList.add("deleteButton");

            const bookEditButton = document.createElement("button");
            bookEditButton.textContent = "Edit";
            bookEditButton.style.marginLeft = "5px";

            const bookFavoriteButton = document.createElement("button");
            bookFavoriteButton.classList.add("book-favorite-button");
            bookFavoriteButton.style.backgroundColor = "#0A0A2E";
            bookFavoriteButton.style.color = "yellow";
            bookFavoriteButton.textContent = book.favorite ? "★" : "☆";

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

            bookFavoriteButton.addEventListener("click", () => {
                if (book.favorite) {
                    book.favorite = false;
                    bookDiv.style.borderColor = "white";
                    bookFavoriteButton.textContent = "☆";
                } else {
                    book.favorite = true;
                    bookDiv.style.borderColor = "yellow";
                    bookFavoriteButton.textContent = "★";
                }
                saveState();
            })

            bookDiv.appendChild(bookDeleteButton);
            bookDiv.appendChild(bookEditButton);
            bookDiv.appendChild(bookFavoriteButton);
        }

        container.appendChild(bookDiv);
    }
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
    elements.bookDateStartedInput.value = state.books[bookToEditIndex].dateStarted;
    elements.bookDateFinishedInput.value = state.books[bookToEditIndex].dateFinished;
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
        displayedBooks = displayedBooks.filter((book) => book.rating);
        displayedBooks.sort((a, b) => b.rating - a.rating);
    } else if (elements.bookSort.value == "rating-low") {
        displayedBooks = displayedBooks.filter((book) => book.rating);
        displayedBooks.sort((a, b) => a.rating - b.rating);
    } else if (elements.bookSort.value == "pages-high") {
        displayedBooks = displayedBooks.filter((book) => book.pages);
        displayedBooks.sort((a, b) => b.pages - a.pages);
    } else if (elements.bookSort.value == "pages-low") {
        displayedBooks = displayedBooks.filter((book) => book.pages);
        displayedBooks.sort((a ,b) => a.pages - b.pages);
    } else if (elements.bookSort.value == "date-started-early-to-late") {
        displayedBooks = displayedBooks.filter(book => book.status !== "want-to-read");
        displayedBooks = displayedBooks.filter(book => book.dateStarted);
        displayedBooks.sort((a, b) => new Date(a.dateStarted) - new Date(b.dateStarted));
    } else if (elements.bookSort.value == "date-started-late-to-early") {
        displayedBooks = displayedBooks.filter(book => book.status !== "want-to-read");
        displayedBooks = displayedBooks.filter(book => book.dateStarted);
        displayedBooks.sort((a, b) => new Date(b.dateStarted) - new Date(a.dateStarted));
    } else if (elements.bookSort.value == "date-finished-early-to-late") {
        displayedBooks = displayedBooks.filter(book => book.status == "finished");
        displayedBooks = displayedBooks.filter(book => book.dateFinished);
        displayedBooks.sort((a, b) => new Date(a.dateFinished) - new Date(b.dateFinished));
    } else if (elements.bookSort.value == "date-finished-late-to-early") {
        displayedBooks = displayedBooks.filter(book => book.status == "finished");
        displayedBooks = displayedBooks.filter(book => book.dateFinished);
        displayedBooks.sort((a, b) => new Date(b.dateFinished) - new Date(a.dateFinished));
    }

    displayedBooks = displayedBooks.filter(book => book.title?.toLowerCase().includes(elements.searchBooksInput.value.toLowerCase()));
    displayedBooks = displayedBooks.filter(book => book.author?.toLowerCase().includes(elements.searchAuthorsInput.value.toLowerCase()));
    displayedBooks = displayedBooks.filter(book => book.genre?.toLowerCase().includes(elements.searchGenresInput.value.toLowerCase()));

    renderBooks(displayedBooks, elements.booksContainer, true);
}

export function renderOverview() {
    elements.totalBooksSpan.textContent = state.books.length;
    elements.readingSpan.textContent = state.books.filter(book => book.status === "reading").length;
    elements.finishedSpan.textContent = state.books.filter(book => book.status === "finished").length;
    elements.genreContainerUnorderedList.innerHTML = "";
    elements.authorContainerUnorderedList.innerHTML = "";
    elements.booksByAuthorsContainer.innerHTML = "";
    elements.mostReadAuthorsOrderedList.innerHTML = "";

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

    for (const authorInfo of state.booksByAuthors) {
        const booksByAuthorDiv = document.createElement("div");
        const authorNameHeading = document.createElement("h3");
        authorNameHeading.textContent = authorInfo.author + ":";
        const booksByAuthorUnorderedList = document.createElement("ul");

        booksByAuthorDiv.appendChild(authorNameHeading);
        booksByAuthorDiv.appendChild(booksByAuthorUnorderedList);

        for (const book of authorInfo.books) {
            const bookNameListItem = document.createElement("li");
            bookNameListItem.textContent = book.title;
            booksByAuthorUnorderedList.appendChild(bookNameListItem);
        }
        
        elements.booksByAuthorsContainer.appendChild(booksByAuthorDiv);
    }

    for (const authorInfo of state.booksByAuthors) {
        if (authorInfo.books.length < 2) {
            continue;
        }
        const mostReadAuthorListItem = document.createElement("li");
        mostReadAuthorListItem.textContent = authorInfo.author.concat(`, ${authorInfo.books.length} Books`);
        elements.mostReadAuthorsOrderedList.appendChild(mostReadAuthorListItem);
    }
}
