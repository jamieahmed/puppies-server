import { Puppy } from "../models/puppy.js"
import { v2 as cloudinary } from 'cloudinary'

function create(req, res) {
  // add the profile ObjectID of the user to body of request
  req.body.owner = req.user.profile
  // create a puppy
  Puppy.create(req.body)
  .then(puppy => {
    // populate the 'owner' of puppy
    Puppy.findById(puppy._id)
    .populate('owner')
    .then(populatedPuppy => {
      // respond with JSON (puppy)
      res.json(populatedPuppy)
    })
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({err: err.errmsg})
  })
}

function index(req, res) {
  Puppy.find({})
  .populate('owner')
  .then(puppies => {
    res.json(puppies)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({err: err.errmsg})
  })
}

function deleteOne(req, res) {
  // Check to make sure the puppy's owner is the logged in user
  Puppy.findById(req.params.id)
  .then(puppy => {
    if (puppy.owner._id.equals(req.user.profile)) {
      // if yes, allow a delete
      Puppy.findByIdAndDelete(puppy._id)
      .then(deletedPuppy => {
        // return the deleted puppy to verify a completed deletion
        res.json(deletedPuppy)
      })
    } else {
      // if no, tell them they're not authorized
      res.status(401).json({err: "Not authorized!"})
    }
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({err: err.errmsg})
  })
}

function update(req, res) {
  Puppy.findById(req.params.id)
  .then(puppy => {
    if (puppy.owner._id.equals(req.user.profile)) {
      Puppy.findByIdAndUpdate(req.params.id, req.body, {new: true})
      .populate('owner')
      .then(updatedPuppy => {
        res.json(updatedPuppy)
      })
    } else {
      res.status(401).json({err: "Not authorized!"})
    }
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({err: err.errmsg})
  })
}

function addPhoto(req, res) {
  console.log(req.files)
  const imageFile = req.files.photo.path
  Puppy.findById(req.params.id)
  .then(puppy => {
    cloudinary.uploader.upload(imageFile, {tags: `${puppy.name}`})
    .then(image => {
      console.log(image)
      puppy.photo = image.url
      puppy.save()
      .then(puppy => {
        res.status(201).json(puppy.photo)
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
  })
}

export {
  create,
  index,
  deleteOne as delete,
  update,
  addPhoto
}