const bookList = [];
const RENDER_BOOK = "render-book";
const SAVED_BOOK = "saved-book";
document.addEventListener("DOMContentLoaded", () => {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addBook();
  });
  if (isStorageExist()) {
    loadBooksData();
  }
});

const addBook = () => {
  const title = document.getElementById("title").value;
  bookList.push({ id: generateId(), title, isCompleted: false });
  document.getElementById("title").value = "";
  document.dispatchEvent(new Event(RENDER_BOOK));
  saveBooksData();
  showToast("success", "Berhasil Menambahkan Buku");
};
const generateId = () => {
  return Math.floor(Math.random() * 1000000);
};

const generateBook = (id, title, isCompleted) => {
  return {
    id,
    title,
    isCompleted,
  };
};
const displayBook = (bookObject) => {
  const titleContainer = document.createElement("div");
  titleContainer.classList.add("item-title");

  const bookTitle = document.createElement("p");
  bookTitle.textContent = bookObject.title;
  titleContainer.append(bookTitle);

  const container = document.createElement("li");
  container.classList.add("item");
  container.setAttribute("id", `book-${bookObject.id}`);

  if (bookObject.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");
    undoButton.addEventListener("click", () => {
      isNotCompletedReading(bookObject.id);
      showToast("undo", "Berhasil Mengembalikan Buku");
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");
    trashButton.addEventListener("click", () => {
      removeBook(bookObject.id);
      showToast("delete", "Berhasil Menghapus Buku");
    });

    titleContainer.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");
    checkButton.addEventListener("click", () =>
     { bookIsCompletedReading(bookObject.id);
        showToast("default", "Berhasil Menyelesaikan Buku");
    }
    );
    titleContainer.append(checkButton);
  }

  container.append(titleContainer);
  return container;
};

document.addEventListener(RENDER_BOOK, () => {
  const currentlyReading = document.getElementById("currently-reading");
  currentlyReading.innerHTML = "";
  const finishedReading = document.getElementById("finished-reading");
  finishedReading.innerHTML = "";
    
  for (const item of bookList) {
    const bookElement = displayBook(item);
    if (!item.isCompleted) {
      currentlyReading.append(bookElement);
    } else {
      finishedReading.append(bookElement);
    }
  }
});


const bookIsCompletedReading = (id) => {
  const bookTarget = findBook(id);
  if (bookTarget == null) return;
  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_BOOK));
  saveBooksData();
};

const findBook = (bookId) =>
  bookList.find((book) => book.id === bookId) || null;

const isNotCompletedReading = (id) => {
  const bookTarget = findBook(id);
  if (bookTarget == null) return;
  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_BOOK));
  saveBooksData();
};

const removeBook = (id) => {
  const bookTarget = findBookIndex(id);
  if (bookTarget === -1) return;
  bookList.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_BOOK));
  saveBooksData();
};

const findBookIndex = (bookId) =>
  bookList.findIndex((book) => book.id === bookId);
const saveBooksData = () => {
  if (isStorageExist()) {
    localStorage.books = JSON.stringify(bookList);
    document.dispatchEvent(new Event(SAVED_BOOK));
  }
};

const isStorageExist = () => {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
};

const loadBooksData = () => {
  const savedBooksData = localStorage.getItem("books");
  if (savedBooksData === null) return;

  bookList.push(...JSON.parse(savedBooksData));
  document.dispatchEvent(new Event(RENDER_BOOK));
};
const showToast = (type, message) => {
  const toast = document.createElement("div");
  toast.classList.add("toast", "show", type);
  toast.style.backgroundColor = {
    success: "#4CCD99",
    delete: "#FA7070",
    undo: "#FFC700",
    default: "#67C6E3",
  }[type];

  const toastMessage = document.createElement("p");
  toastMessage.classList.add("toast-message");
  toastMessage.textContent = message;

  toast.appendChild(toastMessage);
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2000);
};

