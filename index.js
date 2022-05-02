const express = require("express");
const app = express();
const PORT = 3001;

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-654321",
    },
    {
        id: 2,
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: 3,
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
];

// api/persons route
app.get("/api/persons", (req, res) => {
    res.json(persons);
});

// Not supported routes catch
app.get("*", (req, res) => {
    console.log("Unknown path");
    res.sendStatus(404);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
