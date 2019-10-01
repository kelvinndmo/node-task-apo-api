const express = require('express');
require('./db/mongoose');

const User = require('./models/user');
const Task = require('./models/task');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/tasks');

const ObjectID = require('mongodb').ObjectID;

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log('Sever is running');
});

// const jwt = require('jsonwebtoken');

// const myFunction = async () => {
//   const token = jwt.sign({ _id: '1234567' }, 'novak254', {
//     expiresIn: '1 days'
//   });
//   const token2 = jwt.verify(token, 'novak254');
//   console.log(token2);
// };

// myFunction();

///Users/novak/mongodb/bin/mongod --dbpath=/Users/novak/mongodb-data

// const main = async () => {
//   // const task = await Task.findById('5d923211a81e3312daa8ca96');
//   // await task.populate('owner').execPopulate();
//   // console.log(task.owner);

//   const user = await User.findById('5d9230c3eef493126a2ade2b');
//   //virtual property  which is a relationship between two entities
//   await user.populate('tasks').execPopulate();
//   console.log(user.tasks);
// };

// main();
