const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    isDemo: { type: Boolean, default: false },
    refreshTokens: [{
      token: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    }],
    role: {
      type: String,
      enum: ["user", "admin"],
      required: true,
      default: "user",
    },
    lastLogin: { type: Date },
    isDeleted: {type: Boolean, default: false},
    deletedAt: {type: Date, default: null},
  },
  { timestamps: true }
);

UserSchema.index({isDeleted: 1})

UserSchema.pre(/^find/, function(next){
  if(!this.getOptions().withDeleted){
    this.where({isDeleted: false})
  }
  next()
})

UserSchema.pre("countDocuments", function(next){
  if(!this.getOptions().withDeleted){
    this.where({isDeleted: false})
  }
  next()
})

UserSchema.statics.findOneWithDeleted = function(filter = {}){
  return this.findOne(filter).setOptions({withDeleted: true})
}

UserSchema.statics.findWithDeleted = function(filter = {}){
  return this.find(filter).setOptions({withDeleted: true})
}

UserSchema.statics.countDocumentsWithDeleted = function(filter = {}){
  return this.countDocuments(filter).setOptions({withDeleted: true})
}

module.exports = mongoose.model("User", UserSchema);
