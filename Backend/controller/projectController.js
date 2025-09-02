const Project = require("../model/project.model");
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("owner", "username")
      .populate("members", "username");
    res.status(200).json({
      status: "success",
      length: projects.length,
      data: {
        projects,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.createProject = async (req, res) => {
  try {
    const newProject = {
      name: req.body.name,
      description: req.body.description,
      owner: req.body.owner,
      members: req.body.members,
    };
    const project = await Project.create(newProject);
    res.status(201).json({
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
exports.getProjectById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        status: "fail",
        message: "Project id is required",
      });
    }
    const project = await Project.findById(id)
      .populate("owner", "username")
      .populate("members", "username");
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
    const id = req.params.id;
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
      .populate("owner", "username")
      .populate("members", "username");
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
    const id = req.params.id;
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
    const projectId = req.params.id;
    const memberId = req.body.memberId;

    if (!projectId || !memberId) {
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
    if (project.members.includes(memberId)) {
      return res.status(409).json({
        status: "fail",
        message: "Member already exists in project",
      });
    }

    project.members.push(memberId);
    await project.save();

    const updatedProject = await Project.findById(projectId)
      .populate("owner", "username")
      .populate("members", "username");

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
    const projectId = req.params.id;
    const memberId = req.params.memberId;

    if (!projectId || !memberId) {
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

    const memberIndex = project.members.indexOf(memberId);
    if (memberIndex === -1) {
      return res.status(404).json({
        status: "fail",
        message: "Member not found in project",
      });
    }

    project.members.splice(memberIndex, 1);
    await project.save();

    const updatedProject = await Project.findById(projectId)
      .populate("owner", "username")
      .populate("members", "username");

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
