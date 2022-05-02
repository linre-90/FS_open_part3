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

// /info route. Displays info about saved contacts.
app.get("/info", (req, res) => {
    const content = `
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>`;

    const HTML = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Puhelinluettelo API</title>
      </head>
      <body>
        ${content}
      </body>
    </html>
    `;
    res.send(HTML);
});

// Not supported routes catch
app.get("*", (req, res) => {
    console.log("Unknown path");
    res.sendStatus(404);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
