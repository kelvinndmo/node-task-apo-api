const express = require('express');
const router = new express.Router();

const User = require('../models/user');
const auth = require('../midlewares/auth');

router.get('/test', (req, res) => {
  res.send('thestin the applications');
});

router.post('/users', async (req, resp) => {
  const user = new User(req.body);
  try {
    const token = await user.generateAuthToken();
    await user.save();
    resp.status(201).send({ user });
  } catch (error) {
    console.log(error);
    resp.status(400).send(error);
  }

  // user
  //   .save()
  //   .then(data => {
  //     resp.send(data);
  //   })
  //   .catch(error => {
  //     resp.status(400).send(error);
  //   });
});

//fetching
router.get('/users', auth, (req, res) => {
  User.find({})
    .then(data => {
      res.status(200).send(data);
    })
    .catch(error => {
      res.status(400).send(error);
    });
});

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send({ message: 'logged out men' });
  } catch (error) {
    res.status(500).send();
  }
});

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.get('/users/me', auth, (req, res) => {
  res.send(req.user);
});

router.get('/users/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
  // User.findById(_id)
  //   .then(data => {
  //     if (!data) {
  //       return res.status(404).send();
  //     }
  //     res.send(data);
  //   })
  //   .catch(error => {
  //     res.status(400).send(error);
  //   });
});
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: 'Wrong password or email' });
  }
});

router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (error) {}
});

router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every(update => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: 'invalid item is being pushed' });
  }

  try {
    updates.forEach(update => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    console.log(error);

    res.status(400).send(error);
  }
});

module.exports = router;
