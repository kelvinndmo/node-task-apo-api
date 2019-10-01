const express = require('express');
const router = new express.Router();

const Task = require('../models/task');
const auth = require('../midlewares/auth');

router.post('/tasks', auth, async (req, res) => {
  // const task = new Task(req.body);
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });
  console.log(task);

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(status).send(error);
  }
});

router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  try {
    // const task = await Task.findById(req.params.id);
    const task = await Task.findOne({ _id, owner: req.user._id });
    updates.forEach(update => req.body[update]);
    await task.save();

    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true
    // });
    if (!task) {
      res.status(404).send();
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/tasks/:id', auth, (req, res) => {
  const _id = req.params.id;

  try {
    const task = Task.findOneAndDelete({ _id, owner: req.user.owner });
    if (!task) {
      res.status(404).send({ error: 'Task was not found' });
    }
    res.status(200).send({ message: 'Task deleted succesffully' });
  } catch (error) {
    res.status(400).send({ error });
  }
});

router.get('/tasks', auth, async (req, res) => {
  console.log(req.query);
  try {
    await req.user
      .populate({
        path: 'tasks',
        match
      })
      .exactPopulate();
  } catch (error) {
    res.status(500).send(error);
  }
  // Task.find({})
  //   .then(data => {
  //     res.status(200).send(data);
  //   })
  //   .catch(error => {
  //     res.status(400).send(error);
  //   });
});

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      res.status(404).send({ error: 'task not found' });
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(400).send(error);
  }

  // Task.findById(_id)
  //   .then(task => {
  //     if (!task) {
  //       res.status(404).send();
  //     }
  //     res.status(200).send(task);
  //   })
  //   .catch(error => {
  //     res.send(400).send(error);
  //   });
});

module.exports = router;
