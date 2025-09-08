const Task = require("../model/task.model");
const DeleteFile = require("../utilis/DelPrevFile");


exports.uploadtaskfile = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const fpath = `/uploads/files/${req.file.filename}`;

    let task = await Task.findById(taskId);
    
    if (!task) {
      return res.status(401).json({
        status: "fail",
        message: "task is not found",
      });
    }

    if (task.img) DeleteFile(task.img);

    task.img = imagePath;
    await task.save();

    res.status(200).json({
      message: "file uploaded successfully",
      fpath,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProjectTasks = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    if (!projectId) {
      return res.status(400).json({
        status: "fail",
        message: "Project ID is required",
      });
    }
    const tasks = await Task.find({ projectId })
      .populate("users", "username")
      .populate("projectId", "title");
    res.status(200).json({
      status: "success",
      length: tasks.length,
      data: {
        tasks,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.createTask = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    if (!projectId) {
      return res.status(400).json({
        status: "fail",
        message: "Project ID is required",
      });
    }

    const { title, descritpion,users, dueDate ,createdby} = req.body;

    const newTask = await Task.create({title,descritpion,users,projectId,dueDate,createdby});

    const task = await Task.findById(newTask._id)
      .populate("users", "username")
      .populate("projectId", "title");

    res.status(201).json({
      status: "success",
      data: {
        task,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    if (!taskId) {
      return res.status(400).json({
        status: "fail",
        message: "Task ID is required",
      });
    }

    const task = await Task.findById(taskId)
      .populate("users", "username")
      .populate("projectId", "title");

    if (!task) {
      return res.status(404).json({
        status: "fail",
        message: "Task not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        task,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    if (!taskId) {
      return res.status(400).json({
        status: "fail",
        message: "Task ID is required",
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("users", "username")
      .populate("projectId", "title");

    if (!updatedTask) {
      return res.status(404).json({
        status: "fail",
        message: "Task not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        task: updatedTask,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const id = req.params.taskId;

    if (!id) {
      return res.status(400).json({
        status: "fail",
        message: "Task ID is required",
      });
    }

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({
        status: "fail",
        message: "Task not found",
      });
    }

    res.status(204).json({
      status: "success",
      message: "Task deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
