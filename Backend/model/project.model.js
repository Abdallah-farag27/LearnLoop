const mongoose = require("mongoose");

const projectSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project must have title"],
    },
    description: {
      type: String,
      required: [true, "Project must have description"],
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Project must have Admin"],
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Project must have atleast one user"],
      },
    ],
    dueDate : {
      type:Date,
      required :[true,"Project must have DueDate"]
    }
  },
  { timestamps: true }
);

const Projects = mongoose.model("Projects",projectSchema);
module.exports = Projects;


