const User = require("../model/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const { promisify } = require('util');
// const { DeleteFile, path, Defimgpath } = require("../utilis/DelPrevFile");
const { promisify } = require('util');
const { DeleteFile, Defimgpath } = require("../utilis/DelPrevFile");

exports.signup = async (req, res) => {
  try {
    const newUser = req.body;
    newUser.admin = newUser.role === "admin"
    const user = await User.create(newUser);

    user.img = Defimgpath;
    if (req.file) {
      user.img = path.join("Uploads", "images", "persons", req.file.filename);
    }

    await user.save();

    res.status(201).json({
      status: "success",
      data: {
        user
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "user is not found",
      });
    }

    let isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid Email or Password!' })
    }

    const accessToken = jwt.sign({ id: user._id, admin: user.admin }, process.env.JWT_SECRET, { expiresIn: '4h' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Login successful",
      accessToken, refreshToken
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.refreshToken = async (req, res) => {
  let { refreshtoken } = req.body;
  if (!refreshtoken) {
    return res.status(403).json({ message: 'There is no refreshToken' });
  }
  try {

    let decoded = await promisify(jwt.verify)(refreshtoken, process.env.JWT_REFRESH_SECRET);
    let user = await User.findOne({ _id: decoded.id });

    if (!user || user.refreshToken != refreshtoken) {
      return res.status(403).json({ message: 'There is no refreshToken' });
    }
    let accessToken = jwt.sign({ id: user._id, username: user.username, admin: user.admin }, process.env.JWT_SECRET, { expiresIn: '4h' });
    return res.status(200).json({ message: 'success', accessToken });
  }
  catch (error) {
    res.status(403).json({ message: 'fail' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.getUserByID = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        status: "fail",
        message: "User id is required",
      });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        user
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    Object.assign(user, req.body);

    if (req.file) {
      if (user.img)
        DeleteFile(user.img);
      user.img = path.join("Uploads", "images", "persons", req.file.filename);
    }
    else if (req.body.user_img) {
      if (user.img)
        DeleteFile(user.img);
      user.img = Defimgpath;
    }

    await user.save();

    res.status(200).json({
      status: "success",
      data: {
        user
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (!req.user.admin) {
      console.log(req.user);
      return res.status(400).json({
        status: "fail",
        message: "only Admins Can Delete Users",
      });
    }
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        status: "fail",
        message: "userId is required",
      });
    }
    const user = await User.findById(id);
    if (!user || user.admin) {
      return res.status(404).json({
        status: "fail",
        message: `User with username : ${user.username} is not found or he is Admin`,
      });
    }

    await user.deleteOne();

    res.status(204).json({
      status: "success",
      data: `user with ${id} Deleted Successfuly`,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.getUserByToken = async (req, res, next) => {
  try {
    const id = req.user.id;
    if (!id) {
      return res.status(400).json({
        status: "fail",
        message: "User id is required",
      });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        user
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
}

