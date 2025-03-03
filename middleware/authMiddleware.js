

const verifyTeacher = (req, res, next) => {
  if (req.userData.userId.role !== "teacher") {
    return res
      .status(403)
      .json({ message: "Access denied, only teachers can create classes" });
  }
  next();
};

module.exports = { verifyTeacher };
