const Project = require("../model/project.model");
const User = require("../model/user.model")
const {DeleteFile,Defimgpath} = require("../utilis/DelPrevFile");

exports.getAllProjects = async (req, res) => {
  try {
    console.log(req.user);
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({
        status: "fail",
        message: "There is no Projects yet",
      });
    }

    let projects = [];    
    // this user is admin
    if (req.user.admin)
    projects = await Project.find({ admin: userId });
    else 
    projects = await Project.find({users:userId}).populate("admin","username").populate("users","username");

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
    let imagePath = Defimgpath;
    if (req.file) {
      imagePath = `uploads/images/projects/${req.file.filename}`;
    }
    const userNames = req.body.usernames;

    const users = await User.find({ username: { $in: userNames } , admin : false });

    if (users.length !== userNames.length) {
      const foundUsernames = users.map(u => u.username);
      const notFound = userNames.filter(u => !foundUsernames.includes(u));
      return res.status(404).json({
        message: `These users were not found: ${notFound.join(", ")}`,
      });
    }

    // Extract their IDs
    const userIds = users.map(u => u._id);

    const newProject = {
      title: req.body.title,
      description: req.body.description,
      admin: req.user.id,
      users: userIds,
      dueDate: req.body.dueDate,
      img: imagePath,
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

    const updatedProject = await Project.findById(id);
    Object.assign(updatedProject, req.body);
      
    if (req.file) {
      if (updatedProject.img) {
        DeleteFile(updatedProject.img);
      }
      updatedProject.img = `Uploads/images/projects/${req.file.filename}`;
    } else if (req.body.pro_img) {
      if (updatedProject.img) {
        DeleteFile(updatedProject.img);
      }
      updatedProject.img = Defimgpath;
    }

    await updatedProject.save();
    await updatedProject.populate("users", "username");
    await updatedProject.populate("admin", "username");

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
    const userName = req.body.username;

    if (!projectId || !userName) {
      return res.status(400).json({
        status: "fail",
        message: "Project ID and member ID are required",
      });
    }
    const userAdded = await User.findOne({ username: userName , admin : false});
    if (!userAdded) {
      return res.status(400).json({
        status: "fail",
        message: `this User ${userName} is Admin or Does not Exist
        Add Another One`,
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
    if (project.users.find(u => u.equals(userAdded._id))) {
      return res.status(409).json({
        status: "fail",
        message: "Member already exists in project",
      });
    }

    project.users.push(userAdded._id);
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

    const project = await Project.findByIdAndUpdate(projectId,
      {$pull : {users: userId}},
      {new : true}
    );

    if (!project) {
      return res.status(404).json({
        status: "fail",
        message: "Project not found",
      });
    }
    await project.populate("admin", "username");
    await project.populate("users", "username");

    res.status(200).json({
      status: "success",
      message: "Member removed successfully",
      data: {
        project
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
