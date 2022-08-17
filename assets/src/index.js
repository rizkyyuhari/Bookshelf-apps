const STORAGE_KEY = "STORAGE_KEY";
const formInput = document.getElementById("adding-form");
const incompleteBookshelfList = document.getElementById(
  "incompleteBookshelfList"
);
const completeBookShelflist = document.getElementById("completeBookshelfList");

const updateJumlahBuku = () => {
  document.querySelector(".jumlah-buku").innerText = getData().length;
};
window.onload = () => {
  if (localStorage.getItem(STORAGE_KEY) === null) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }

  updateJumlahBuku();

  renderBookItem();
};

formInput.addEventListener("submit", (e) => {
  e.preventDefault();

  if (localStorage.getItem(STORAGE_KEY) === null) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }

  const newArray = JSON.stringify([...getData(), getFormValue()]);
  localStorage.setItem(STORAGE_KEY, [newArray]);

  updateJumlahBuku();
  renderBookItem();

  e.target.reset();
});

function getFormValue() {
  const id = +new Date();
  const title = document.getElementById("book-title").value;
  const author = document.getElementById("book-author").value;
  const year = new Date(
    document.getElementById("book-year").value
  ).getFullYear();
  const isComplete = document.getElementById("book-status").checked;
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function createNewElement(formValue, greenBtnText) {
  const { id, title, author, year, isComplete } = formValue;
  const bookItem = document.createElement("div");
  bookItem.className = "book_item padding";
  const bookItemContent = `
    <h3>${title}</h3>
    <p>Penulis: ${author}</p>
    <p>Tahun: ${year}</p>

    <div class="action">
      <button class="green" onclick="swapBook('${id}')">${greenBtnText}</button>
      <button class="red" onclick="deleteBook('${id}')">Hapus buku</button>
    </div>`;
  bookItem.innerHTML = bookItemContent;
  return bookItem;
}

function renderBookItem() {
  incompleteBookshelfList.innerHTML = "";
  completeBookShelflist.innerHTML = "";
  const lstorage = JSON.parse(localStorage.getItem(STORAGE_KEY));
  for (const iterator of lstorage) {
    if (iterator.isComplete === false) {
      incompleteBookshelfList.append(
        createNewElement(iterator, "Selesai di Baca")
      );
    } else {
      completeBookShelflist.append(
        createNewElement(iterator, "Belum Selesai di Baca")
      );
    }
  }
}

function getData() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY));
}

function deleteBook(id) {
  const confirm = window.confirm("Yakin Ingin Menghapus data buku");

  if (confirm) {
    const bookData = getData().filter((a) => a.id != id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookData));
    document.querySelector(".jumlah-buku").innerText = getData().length;
    renderBookItem();
  }
}

function swapBook(id) {
  const bookData = getData().filter((a) => a.id == id);

  if (bookData[0].isComplete == false) {
    bookData[0].isComplete = true;
  } else {
    bookData[0].isComplete = false;
  }
  const books = getData().filter((a) => a.id != id);

  const newArray = JSON.stringify([...books, ...bookData]);

  localStorage.setItem(STORAGE_KEY, newArray);
  renderBookItem();
}

document.getElementById("searchBook").addEventListener("input", (e) => {
  const booksItem = document.querySelectorAll(".book_item");

  for (const book of booksItem) {
    if (
      !book.firstElementChild.textContent
        .toLowerCase()
        .includes(e.target.value.toLowerCase())
    ) {
      book.setAttribute("hidden", "");
    } else {
      book.removeAttribute("hidden");
    }
  }
});
