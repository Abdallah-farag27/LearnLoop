const Review = require("../model/Reviews.model");

exports.createReview = async (req, res) => {
  
  if (!req.body){
    return res.status(400).json({
      status: "fail",
      message: "Data are required"});
    }
  try {
    const reviewerId = req.user.id;
    const {rating,text,task,user}= req.body;   
    const review = {
      rating,
      text,
      task,
      reviewerId,
      user,
    };
    const newReview = await Review.create(review);
    if (newReview){
      res.status(201).json({
        message: "Review created successfully",
        data: { Review: newReview },
      });
    }    
  } catch (err) {
    res.status(500).json({status: "fail",err});
  }
};

exports.getReviewbyId = async (req,res) => {
  try{
  if (!req.params) {
    return res.status(400).json({
      status: "fail",
      message: "reviewId is required"
    });
  }
    const reviewId = req.params.reviewId; 
    const review = await Review.findById(reviewId);

    if (!review){
      return res.status(400).json({status: "fail", message: "Review not found",});
    }
    return res.status(200).json({review});
  }
  catch(err)
  {
    res.status(500).json({status: "fail",err});
  }
}

exports.getAllReviews = async (req, res) => {  
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({
        status: "fail",
        message: "userId is required"
      });
    }

    const reviews = await Review.find({ user: userId })
      .populate("user", "username")
      .populate("reviewer", "username");

      res.status(200).json({status: "success",length: reviews.length,data: reviews}); 
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};

exports.updateReview = async (req,res) => {
  try {
  if (!req.params || !req.body) {
    return res.status(400).json({
      status: "fail",
      message: "reviewId is required or no Data"
    });
  }
  const reviewId = req.params.reviewId;   

  const UpdateReview = await Review.findByIdAndUpdate(reviewId, req.body, {
    new: true,
    runValidators: true,
  })

  if (UpdateReview){
    res.status(200).json({
      message: "Review Updated successfully",
      data: { UpdateReview},
    });
  }    
} catch (err) {
  res.status(500).json({status: "fail",err});
}  
}

exports.deleteReview = async (req, res) => {
  
  try {
  const reviewId = req.params.reviewId;
  
  if (!reviewId) {
    return res.status(400).json({
      status: "fail",
      message: "userId is required"
    });
  }

  const review = await Review.findByIdAndDelete(reviewId);

  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }
  return res.status(204).json({message:"Review Deleted Successfully"});
} catch (err) {
  res.status(500).json({status: "fail",err});
}  
};
