const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: [
    {
      ingredient: {
        type: String,
        required: true,
      },
      quantity: { type: Number, required: true },
      unitType: { type: String, enum: ["g", "ml", "units"], required: true },
    },
  ],
  cookTimeInSeconds: {type: Number, required: true, min: 1},
  averageRating: {type: Number, default: 0, min: 0, max: 5},
  createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, default: null},
  isDemo: {type: Boolean, default: true},
  isDeleted: {type: Boolean, default: false},
  deletedAt: {type: Date, default: null},
}, {timestamps: true});

RecipeSchema.index({createdAt: -1})
RecipeSchema.index({createdBy: 1})
RecipeSchema.index({isDeleted: 1})

RecipeSchema.pre(/^find/, function(next){
  if(!this.getOptions().withDeleted){
    this.where({isDeleted: false})
  }
  next()
})

RecipeSchema.pre("countDocuments", function(next){
  if(!this.getOptions().withDeleted){
    this.where({isDeleted: false})
  }

  next()
})

RecipeSchema.statics.findWithDeleted = function(filter = {}){
  return this.find(filter).setOptions({withDeleted: true})
}

RecipeSchema.statics.findOneWithDeleted = function(filter = {}){
  return this.findOne(filter).setOptions({withDeleted: true})
}

RecipeSchema.statics.countDocumentsWithDeleted = function(filter = {}){
  return this.countDocuments(filter).setOptions({withDeleted: true})
}

module.exports = mongoose.model("Recipe", RecipeSchema)