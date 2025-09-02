const Task = require("../model/task.model");

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
      .populate("assignee", "username")
      .populate("projectId", "name");
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

    const { title, status, assignee, dueDate } = req.body;

    const newTask = await Task.create({
      title,
      status,
      assignee,
      projectId,
      dueDate,
    });

    const task = await Task.findById(newTask._id)
      .populate("assignee", "username")
      .populate("projectId", "name");

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
    const taskId = req.params.id;
    if (!taskId) {
      return res.status(400).json({
        status: "fail",
        message: "Task ID is required",
      });
    }

    const task = await Task.findById(taskId)
      .populate("assignee", "username")
      .populate("projectId", "name");

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
    const taskId = req.params.id;
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
      .populate("assignee", "username")
      .populate("projectId", "name");

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
    const id = req.params.id;

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
