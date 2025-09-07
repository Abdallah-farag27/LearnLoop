const Project = require("../model/project.model");

exports.getAllProjects = async (req, res) => {
  try {
    const adminId = req.query.adminId;
    if (!adminId) {
      return res.status(400).json({
        status: "fail",
        message: "There is no AdminID",
      });
    }
    const projects = await Project.find({admin:adminId}).populate("admin")
    res.status(200).json({
      status: "success",length: projects.length,data: {projects}});
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.createProject = async (req, res) => {
  
  if (!req.body) {
    return res.status(400).json({
      status: "fail",
      message: "There is no content",
    });
  }

  try {
    const newProject = {
      title: req.body.title,
      description: req.body.description,
      admin: req.body.admin,
      users: req.body.users,
      dueDate: req.body.dueDate
    };
    const project = await Project.create(newProject);
    res.status(201).json({status: "success",data: {project}});
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
exports.getProjectById = async (req, res) => {
    try {
    const id = req.params.projectId;
    if (!id) {
      return res.status(400).json({
        status: "fail",
        message: "Project id is required",
      });
    }
    const project = await Project.findById(id)
      .populate("admin", "username")
      .populate("users", "username");
    if (!project) {
      return res.status(404).json({
        status: "fail",
        message: "Project not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        project,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const id = req.params.projectId;
    if (!id) {
      return res.status(400).json({
        status: "fail",
        message: "Project ID is required",
      });
    }
    const updatedProject = await Project.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("admin", "username")
      .populate("users", "username");
    if (!updatedProject) {
      return res.status(404).json({
        status: "fail",
        message: "Project not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        project: updatedProject,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const id = req.params.projectId;
    if (!id) {
      return res.status(400).json({
        status: "fail",
        message: "Project ID is required",
      });
    }
    const deletedProject = await Project.findByIdAndDelete(id);
    if (!deletedProject) {
      return res.status(404).json({
        status: "fail",
        message: "Project not found",
      });
    }
    res.status(204).json({
      status: "success",
      message: "Project deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};


exports.addMember = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const userId = req.body.userId;

    if (!projectId || !userId) {
      return res.status(400).json({
        status: "fail",
        message: "Project ID and member ID are required",
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        status: "fail",
        message: "Project not found",
      });
    }

    // Prevent duplicate members
    // 409 conflict
    if (project.users.includes(userId)) {
      return res.status(409).json({
        status: "fail",
        message: "Member already exists in project",
      });
    }

    project.users.push(userId);
    await project.save();

    const updatedProject = await Project.findById(projectId)
      .populate("admin", "username")
      .populate("users", "username");

    res.status(200).json({
      status: "success",
      data: {
        project: updatedProject,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const userId = req.body.userId;

    if (!projectId || !userId) {
      return res.status(400).json({
        status: "fail",
        message: "Project ID and member ID are required",
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        status: "fail",
        message: "Project not found",
      });
    }

    const userIndex = project.users.indexOf(userId);
    if (userIndex === -1) {
      return res.status(404).json({
        status: "fail",
        message: "Member not found in project",
      });
    }

    project.users.splice(userIndex, 1);
    await project.save();

    const updatedProject = await Project.findById(projectId)
      .populate("admin", "username")
      .populate("users", "username");

    res.status(200).json({
      status: "success",
      message: "Member removed successfully",
      data: {
        project: updatedProject,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
