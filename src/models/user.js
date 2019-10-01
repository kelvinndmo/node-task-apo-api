const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Task = require('../models/task');

mongoose.connect('mongodb://127.0.01:27018/task-manager-api', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const userSchema = new mongoose.Schema(
  {
    name: String,
    password: {
      required: true,
      type: String,
      trim: true,
      minlength: 6,
      validate(value) {
        if (value.toLowerCase().includes('password')) {
          throw new Error('cannot include the word password');
        }
      }
    },
    age: Number,
    email: {
      unique: true,
      type: String,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid');
        }
      }
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    console.log('wrong');

    throw new Error('Wrong password or email');
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    console.log('wrong');
    throw new Error('wrong user or password');
  }
  return user;
};

userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, 'thiisnovak');
  user.tokens = user.tokens.concat({ token: token });
  await user.save();
  return token;
};

userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  console.log('heeelllo');

  delete userObject.password;
  delete userObject.tokens;
  console.log(userObject);

  return userObject;
};

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
});

//hash plain password, statics methods are available on the model
//and methods mehtohds
// are available on the instances.
userSchema.pre('remove', async function(next) {
  const user = this;

  await Task.deleteMany({ owner: user._id });

  next();
});
userSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});
const User = mongoose.model('User', userSchema);

module.exports = User;
