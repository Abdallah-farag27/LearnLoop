const Task = require("../model/task.model");
const User = require("../model/user.model")
const {DeleteFile} = require("../utilis/DelPrevFile");


exports.gettaskfile = async (req,res) =>{
  try{
    const taskId = req.params.taskId;
    if (!taskId){
      return res.status(400).json({
        status: "fail",
        message: "Task ID is required",
      });
    }
    let task = await Task.findById(taskId,"filepath");

    if (!task || !task.filepath) {
      return res.status(404).json({
        status: "fail",
        message: "File not found",
      });
    }
    console.log(task.filepath);
    if (req.query.download){
      return res.status(200).download(`uploads/files/${task.filepath}`);
    }
    else 
      return res.status(200).sendFile(`uploads/files/${task.filepath}`);

  }catch(err)
  {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}

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

    let filePath = ""; 
    if (req.file) 
      filePath = `uploads/files/${req.file.filename}`;

    const user = await User.findOne({username:req.body.username,admin:false});
    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: `User ${req.body.username} does not exist or is an Admin`,
      });
    }
    const newTask = {
      title: req.body.title,
      description: req.body.description ? req.body.description : "",
      user: user._id,
      projectId: projectId,
      dueDate: req.body.dueDate,
      createdby: req.user.id,
      filepath: filePath,
    };

    const task = await Task.create(newTask);

    await task.populate("user","username");
    await task.populate("projectId","title");


    res.status(201).json({
      status: "success",
      data: {
        task
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

    const updatedTask = await Task.findById(taskId);
    if (!updatedTask) {
      return res.status(404).json({
        status: "fail",
        message: "Task not found",
      });
    }

    Object.assign(updatedTask, req.body);

    if (req.file) {
      DeleteFile(updatedTask.filepath);
      updatedTask.filepath =`uploads/files/${req.file.filename}`;
    }
    else if (req.body.file) {
      DeleteFile(updatedTask.filepath);
      updatedTask.filepath = ""
    }

    await updatedTask.save();


    await updatedTask.populate("user", "username")
    await updatedTask.populate("projectId", "title");

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
