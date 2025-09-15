const express = require('express')
const app = express();
const cors = require('cors');
require('dotenv').config({path:'./config.env'})
const mongoose = require('mongoose');
const path = require('path');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// routes 
const UserRoutes = require('./routes/userRoutes');
const ProjectRoutes = require('./routes/projectRoutes');
const TaskRoutes = require('./routes/taskRoutes');
const CommentRoutes = require('./routes/commentRoutes');
const ReviewRoutes = require('./routes/reviewRoutes');

app.use('/users',UserRoutes);
app.use('/projects',ProjectRoutes);
app.use('/projects/:projectId/tasks',TaskRoutes);
app.use('/projects/:projectId/tasks/:taskId/comments',CommentRoutes);
app.use('/reviews',ReviewRoutes);


// Connect DB
mongoose.connect(process.env.ConnectionString,).
then(()=> console.log("Connected To DB")).
catch((Error)=>{console.log(Error)})

app.use((req, res, next) => {
  res.status(404).json({
    status: false,
    message: 'undefined endpoint',
    path: req.originalUrl
  });
});

app.listen(process.env.Port,()=>{
  console.log("Server Listen ");
})