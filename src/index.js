const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [
  {
    id: "4ebbac39-d6cd-4ae8-acef-5e00f944b589",
    name: "Paulo",
    userName: "Bes",
    todos: [
      {
        id: "c4393414-7b3f-44d3-a4a3-5ced2b1ed055",
        title: "teste",
        done: false,
        deadline: "2022-05-18T00:00:00.000Z",
        created_at: "2022-05-14T02:07:02.509Z"
      },
      {
        id: "206aa992-239f-4fb0-93e6-e7b8b3af31d8",
        title: "teste",
        done: false,
        deadline: "2022-05-18T00:00:00.000Z",
        created_at: "2022-05-14T02:07:04.772Z"
      },
      {
        id: "306ed45a-5ac9-49a4-9b81-488e129c2f6e",
        title: "teste",
        done: false,
        deadline: "2022-05-18T00:00:00.000Z",
        created_at: "2022-05-14T02:07:08.618Z"
      }
    ]
  }
];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find((user) => user.userName === username);

  if (!username) {
    return response.status(400).json({ error: "Not found User name" })
  }
  if (!user) {
    return response.status(400).json({ error: "Not found users" })
  }

  request.user = user;

  return next();
}

function checksExistsUserId(request, response, next) {
  const { user } = request;
  const { id } = request.params;

  const todoAlreadyExists = user.todos.find((todoAlreadyExists) => todoAlreadyExists.id === id);

  if (!todoAlreadyExists) {
    return response.json({ error: "id not exist" });
  }
  
  request.todoAlreadyExists = todoAlreadyExists;

  return next()
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, userName } = request.body;

  users.push({
    id: uuidv4(),
    name,
    userName,
    todos: []
  });

  return response.status(201).json({ users });
});

app.get('/all', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  const todosAll = user.todos;

  return response.status(200).json({ todosAll });
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;

  console.log()

  const todos = user.todos.push({
    id: uuidv4(), // precisa ser um uuid
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  });

  return response.status(201).send();
});

app.put('/todos/:id',checksExistsUserAccount, checksExistsUserId, (request, response) => {
  // Complete aqui
  const { todoAlreadyExists } = request;
  const { title, deadline } = request.body;
  // const { id } = request.params;

  // const todoAlreadyExists = user.todos.find((todoAlreadyExists) => todoAlreadyExists.id === id);

  // if (!todoAlreadyExists) {
  //   return response.json({ error: "id not exist" });
  // }

  todoAlreadyExists.title = title;
  todoAlreadyExists.deadline = deadline;

  return response.status(201).send();
});

app.patch('/todos/:id/done', checksExistsUserAccount, checksExistsUserId, (request, response) => {
  // Complete aqui
  const { todoAlreadyExists } = request;
  const { done } = request.body;
  // const { id } = request.params;

  // const idExists = user.todos.find((idExists) => idExists.id === id);

  // if (!idExists) {
  //   return response.status(400).json({ error: "Id not found" });
  // }

  todoAlreadyExists.done = done;

  return response.status(201).send()
});

app.delete('/todos/:id', checksExistsUserAccount, checksExistsUserId,  (request, response) => {
  // Complete aqui
  const { todoAlreadyExists, user } = request;
  const { id } = request.params;
  const arr = user.todos

  const index = arr.findIndex(object => {
    return object.id === id;
  })

  arr.splice(index)

  return response.status(200).send()

});

module.exports = app;