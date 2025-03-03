const User = require("./models/User");
const Class = require("./models/Class");
const db = require("./db");
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cors = require("cors");
const Announcement = require("./models/Announcement");

const Assignment = require("./models/Assignment");

const Message = require("./models/Message");

const Submissions = require("./models/Submissions");

const SupportRequest = require("./models/support_request");
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.json()); //req.body
app.use(bodyParser.urlencoded({ extended: true }));
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//for admin
const AdminRoutes = require("./routes/AdminRoutes");
app.use("/admin", AdminRoutes);

const userRoutes = require("./routes/userRoutes");

//for user
app.use("/user", userRoutes);
console.log("welcome to my app");

//for class
const classRoutes = require("./routes/classRoutes");
app.use("/class", classRoutes);
// for Announcement
const announcementRoutes = require("./routes/announcementRoutes");
app.use("/announcement", announcementRoutes);

//for Assignments
const assignmentRoutes = require("./routes/assignmentRoutes");
app.use("/assignment", assignmentRoutes);
//for submissions
const submissionRoutes = require("./routes/submissionsRoutes");
app.use("/submission", submissionRoutes);

//for Message
const messageRoutes = require("./routes/messageRoutes");
app.use("/message", messageRoutes);

//for supportRequest
const supportRequestRoutes = require("./routes/support_requestRoutes");
const Admin = require("./models/Admin");
app.use("/support_request", supportRequestRoutes);
app.listen(5000, () => {
  console.log("server is listing port no:5000");
});
