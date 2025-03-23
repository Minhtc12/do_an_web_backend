const express = require("express");
// const contactsRouter = require("./app/routes/contact.route")
const bookRouter = require("./app/routes/book.route")
const borrowingRouter = require("./app/routes/borrowing.route")
const employeeRouter = require("./app/routes/employee.route")
const publisherRouter = require("./app/routes/publisher.route")
const readerRouter = require("./app/routes/reader.route")

const cors = require ("cors");
const ApiError = require("./app/api-error")

const app= express();
app.use(cors());
app.use(express.json());
// app.use("/api/contacts", contactsRouter);
app.use("/api/books",bookRouter );
app.use("/api/borrowings",borrowingRouter);
app.use("/api/employees",employeeRouter);
app.use("/api/publishers",publisherRouter);
app.use("/api/readers",readerRouter);

app.get("/",(req, res)=> {
   res.json({message: "welcome to contact book application."});
});
app.use((req, res, next) => {
    return next(new ApiError(404,"Resource not found"));
});
app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

// app.use("/api/contacts",contactsRouter);

module.exports = app;