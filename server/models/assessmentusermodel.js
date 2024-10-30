const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const assessmentUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["admin", "manager", "user"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

assessmentUserSchema.pre("save", async function (next) {
  const hashPassword = async (user) => {
    if (!user.isModified("password")) {
      return next();
    }
    user.password = await bcrypt.hash(user.password, 8);
    next();
  };

  await hashPassword(this); 
});

assessmentUserSchema.methods.comparePassword = function (user, password) {
    return bcrypt.compareSync(password, user.password);
  };

module.exports = mongoose.model("assessmentUserSchema", assessmentUserSchema);
