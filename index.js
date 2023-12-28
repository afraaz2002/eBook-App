import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import 'dotenv/config';
import pg from "pg";

const port = 3000;
const app = express();

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "books",
    password: "Affu2002$",
    port: 5432
});

db.connect();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const getBookDetails = (items) => {
    let books = [];

    items.forEach((book) => {
        let bookDetails = {
            id: book.id,
            title: book.volumeInfo.title,
            amount: book.saleInfo.retailPrice.amount && book.saleInfo.retailPrice.amount,
            buyLink: book.saleInfo.buyLink,
            imageLink: book.volumeInfo.imageLinks.thumbnail
        }
        books.push(bookDetails);
    })
    return books;
}

const getBooksById = async (books) => {

    try {
        let getBooks = [];
        let count = 0;

        while (count < books.length) {
            const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${books[count].book_id}?key=${process.env.API_KEY}`);

            const result = await response.data;
            getBooks.push(result);
            count++;
        }
        const recommendBooks = getBookDetails(getBooks);
        return recommendBooks;
    }
    catch (err) {
        console.log(err);
    }
}

const getBooksByType = async (bookType) => {
    try {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${bookType}&filter=paid-ebooks&maxResults=6&langRestrict=en&orderBy=relevance&key=${process.env.API_KEY}`);
        const result = await response.data.items;
        const books = getBookDetails(result);

        return books;
    } catch (err) {
        console.log("errow while fetching data " + err);
    }
}

const getFreeBooks = async () => {
    let books = [];
    const randomNum = Math.floor(Math.random() * 240);

    try {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=subject:fiction&filter=free-ebooks&startIndex=${randomNum}&maxResults=9&langRestrict=en&orderBy=relevance&key=${process.env.API_KEY}`);
        const result = await response.data.items;

        result.forEach((book) => {
            let bookDetails = {
                id: book.id,
                title: book.volumeInfo.title,
                buyLink: book.saleInfo.buyLink,
                imageLink: book.volumeInfo.imageLinks.thumbnail
            }
            books.push(bookDetails);
        })
        // console.log(books)
        return books;

    } catch (err) {
        console.log("errow while fetching data " + err);
    }
}

const getBooks = async () => {
    const randomNum = Math.floor(Math.random() * 18);
    try {
        const response1 = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=inauthor: 
        Arundhati Roy&filter=paid-ebooks&startIndex=${randomNum}&maxResults=8&langRestrict=en&key=${process.env.API_KEY}`);

        const result = await response1.data.items;
        const books = getBookDetails(result);

        return books;
    } catch (err) {
        console.log("error while fetching " + err);
    }
}

app.get("/", async (req, res) => {
    const books = await getBooks();
    const booksByType = await getBooksByType("subject:fiction");
    const freeBook = await getFreeBooks();

    // console.log(booksByType);
    res.render("index.ejs", {
        customBooks: books,
        collectionBooks: booksByType,
        freeBooks: freeBook,
        active: "fiction"
    });
});

app.post("/", async (req, res) => {
    const type = req.body.type;
    const books = await getBooks();
    const freeBook = await getFreeBooks();
    const booksByType = await getBooksByType("subject:" + type);

    res.render("index.ejs", {
        customBooks: books,
        collectionBooks: booksByType,
        freeBooks: freeBook,
        active: type
    });
})

app.post("/search", async (req, res) => {
    const bookName = req.body.search;
    // console.log(bookName);
    const books = await getBooks();
    if (bookName != "") {
        const booksByType = await getBooksByType("intitle:" + bookName);
        res.render("index.ejs", {
            customBooks: books,
            collectionBooks: booksByType,
            type: bookName
        });
    }
})

app.get("/bookmark", async (req, res) => {
    const getBookmarkBooks = await db.query("SELECT * FROM ebooks");
    const books = [];

    try {
        getBookmarkBooks.rows.forEach((book) => {
            books.push(book);
        })
        const bookmarkBooks = await getBooksById(books);
        console.log(bookmarkBooks);
        res.render("bookmark.ejs",{
            collectionBooks: bookmarkBooks,
        });
        console.log(books);

    } catch (err) {
        console.log("error while fetching " + err);
    }

})

app.post("/bookmark", async (req, res) => {
    const bookId = req.body.eBook;
    try {
        await db.query(`INSERT INTO ebooks(book_id) VALUES('${bookId}')`)
        res.status(204).send();
    } catch (err) {
        console.log(err.message) 
    }
    // console.log(bookId);

})

app.listen(port, () => {
    console.log("Server listening on port " + port);
})
// CREATE TABLE ebooks(
//     id SERIAL PRIMARY KEY NOT NULL,
//         book_id VARCHAR(25) NOT NULL UNIQUE
//     )