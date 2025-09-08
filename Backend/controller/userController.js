const User = require("../model/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {promisify} = require('util');
const DeleteFile  = require("../utilis/DelPrevFile");

exports.uploadPersonalImg = async (req,res) =>{
    try {
    const userId = req.params.id;
    const imagePath = `/uploads/images/persons/${req.file.filename}`;

    let user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "user is not found",
      });
    }

    if (user.img)
      DeleteFile(user.img);

    user.img = imagePath;
    await user.save();
  
    res.status(200).json({
      message: "Image uploaded successfully",
      imagePath
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.signup = async (req, res) => {
  try {
    const newUser = req.body;
    const user = await User.create(newUser);
    res.status(201).json({
      status: "success",
      data: {
        user,
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
    if (!user ) {
      return res.status(401).json({
        status: "fail",
        message: "user is not found",
      });
    }

    let isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid Email or Password!' })
    }
    
    const accessToken = jwt.sign({ id: user._id, email: user.email, admin: user.admin },process.env.JWT_SECRET, { expiresIn: '4h' });
    const refreshToken = jwt.sign({ id: user._id, email: user.email, admin: user.admin},process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    
    user.refreshToken = refreshToken;
    await user.save();
    
    res.status(200).json({
      status: "success",
      message: "Login successful",
      accessToken,refreshToken
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.refreshToken = async (req,res) => {
  let {refreshtoken} = req.body;
    if (!refreshtoken){
      return res.status(403).json({message:'There is no refreshToken'});
    }
  try{
    
    let decoded = await promisify (jwt.verify) (refreshtoken,process.env.JWT_REFRESH_SECRET);
    let user = await User.findOne({_id:decoded.id}); 
    
    if (!user || user.refreshToken != refreshtoken)
    {
      return res.status(403).json({message:'There is no refreshToken'});
    }
    let accessToken = jwt.sign({ id: user._id, email: user.email, admin: user.admin },process.env.JWT_SECRET, { expiresIn: '4h' });
    return res.status(200).json({message:'success',accessToken});
  }
  catch (error){
    res.status(403).json({message:'fail'});
}};


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
        user,
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
    const {id} = req.params;
    console.log(id,req.body);
    const updates = req.body;
    if (!id || !updates) {
      return res.status(400).json({
        status: "fail",
        message: "user id or updates is required",
      });
    }
    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        user,
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
    const {id} = req.params;
    if (!id) {
      return res.status(400).json({
        status: "fail",
        message: "user id is required",
      });
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
