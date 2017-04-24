// collection defined both on client and server
Photos = new Mongo.Collection("photos");

if (Meteor.isClient) {
 
  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
  });

  Template.body.helpers({
    photos: function () {
      return Photos.find({}, {sort: {createdAt: -1}});
    }
  });

  Template.photoCard.events({
    "click .like": function (event) {
      event.preventDefault();

      Photos.update(this._id, {
        $addToSet: {
          likedBy: Meteor.userId()
        }
      });
    }
  });

  Template.postPhoto.helpers({
    unsubmittedPhoto: function () {
      return Session.get("unsubmittedPhoto");
    }
  });

  Template.postPhoto.events({
    // capture the event for submitting the photo
    "submit form": function (event) {
      var form = event.target;
      var caption = form.caption.value;

      Photos.insert({
        caption: caption,
        data: Session.get("unsubmittedPhoto"),
        createdAt: new Date(),
        username: Meteor.user().username,
        likedBy: [] 
      });

      Session.set("unsubmittedPhoto", null);
      form.caption.value = "";

      return false;
    },

    // capture the event for taking a photo to be submitted
    "click .take-photo": function () {
      MeteorCamera.getPicture({
        width: 400,
        height: 300,
        quality: 30
      }, function (error, data) {
        Session.set("unsubmittedPhoto", data);
      });

      return false;
    }
  });
}
