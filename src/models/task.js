const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect('mongodb://127.0.01:27018/task-manager-api', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const TaskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

TaskSchema.pre('save', async function(next) {
  const task = this;
  console.log('this is a task');
  next();
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;
