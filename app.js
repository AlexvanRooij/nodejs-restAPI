const express = require('express');
const app = express();
const mongoose = require('mongoose');
const http = require('http');
const log = require('pretty-log');

const User = require('./models/User');
const db = require('./database/keys').mongoURI;

mongoose
  .connect(
    db
  )
  .then(() => log.success("MongoDB connected"))
  .catch(err => console.log(err));

app.use(express.json());

app.get('/users', async (req, res, next) => {
    try {
        const allUsers = await User.find({});
        res.json(allUsers);
    } catch(error) {
        next(error);
    }
});

app.get('/users/:id', async (req, res, next) => {
  const id = req.params.id;
  try {
      const user = await User.findById(id);
      res.json(user);
  } catch(error) {
      next(error);
  }
});

app.delete('/users/delete/:id', async (req, res, next) => {
  const id = req.params.id;
  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
  res.json({ message: 'User deleted successfully', deletedUser }); 
  } catch(error) {
      next(error);
  }
});

app.post('/users/create', async (req, res, next) => {
  const { email, name, password} = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }
  try {
      const newUser = await User.create({email, name, password});

      res.status(201).json({ message: 'User created successfully', newUser });
  } catch (error) {
      next(error);
  }
});

app.put('/users/update/:id', async (req, res, next) => {
  const { email, name, password } = req.body;
  const id = req.params.id;

  try {
      const updatedUser = await User.findByIdAndUpdate(id, { email, name, password }, { new: true });

      if (!updatedUser) {
          return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: 'User updated successfully', updatedUser });
  } catch (error) {
      next(error);
  }
});

http.createServer(app).listen(3000, function () {
    log.success('Server has started!');
});
