const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const usersFilePath = path.join(__dirname, 'users.json');

const readUsersFromFile = () => {
  const data = fs.readFileSync(usersFilePath);
  return JSON.parse(data);
};

const writeUsersToFile = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

app.get('/api/users', (req, res) => {
  const users = readUsersFromFile();
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const users = readUsersFromFile();
  const newUser = { id: Date.now(), ...req.body };
  users.push(newUser);
  writeUsersToFile(users);
  res.json(newUser);
});

app.put('/api/users/:id', (req, res) => {
  const users = readUsersFromFile();
  const userIndex = users.findIndex((user) => user.id === parseInt(req.params.id));
  if (userIndex !== -1) {
    users[userIndex] = { id: parseInt(req.params.id), ...req.body };
    writeUsersToFile(users);
    res.json(users[userIndex]);
  } else {
    res.status(404).send('Usuário não encontrado');
  }
});

app.delete('/api/users/:id', (req, res) => {
  let users = readUsersFromFile();
  users = users.filter((user) => user.id !== parseInt(req.params.id));
  writeUsersToFile(users);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
