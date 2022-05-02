const express = require("express");
const app = express();
const PORT = 3001;

app.use(express.json());

// Placeholder data
let persons = [
    {
        id: 0,
        name: "Arto Hellas",
        number: "040-654321",
    },
    {
        id: 1,
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: 2,
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
    {
        id: 200,
        name: "My id is really high",
        number: "39-23-6423122",
    },
];

/** --------------- GET ---------------- */
// api/persons/:id return person info based on id.
// Returns 404 if person not found or id is not a number.
app.get("/api/persons/:id", (req, res) => {
    const id = Number.parseInt(req.params.id);

    if (isNaN(id) || persons.find((person) => person.id === id) === undefined) {
        res.sendStatus(404);
    } else {
        res.json(persons.find((person) => person.id === id));
    }
});

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

/** --------------- POST ---------------- */
app.post("/api/persons", (req, res) => {
    const newContact = req.body;
    newContact.id = Math.floor(Math.random() * 100000);
    persons = persons.concat(newContact);
    res.json(newContact);
});

/** --------------- DELETE ---------------- */
app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter((person) => person.id !== id);
    res.sendStatus(204);
});

//Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
