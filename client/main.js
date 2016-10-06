import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import { Tracker } from 'meteor/tracker'
import { Mongo } from 'meteor/mongo';
import { Videos } from '../lib/videosCollection'
import { Comments } from '../lib/comments'

import './main.html';

import { Accounts } from 'meteor/accounts-base';
 
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});


Template.land.onCreated(function () {

  // 1. Initialization

  var instance = this;
    
  //Videos = new Mongo.Collection('videos');


  // 1. Autorun

  // will re-run when the "limit" reactive variables changes
  instance.autorun(function () {


    // subscribe to the posts publication
    var subscription = instance.subscribe('videos');
  });

  // 2. Cursor to videos instance from database
  instance.videos = function() { 
    return Videos.find({});
  }

});




Template.land.helpers({
    //videos: Tracker.autorun(function(){ return JSON.parse(Session.get("data")) }) ,
    videos: function () {
        //Meteor.subscribe('videos')
        return Template.instance().videos();
    }
})

Template.navbar.events({
    'click .btn-video'(event){
        event.stopPropagation();

        $('#modalvideo').modal('toggle');   
    }
})

Template.navbar.helpers({
    toggleModal(){
        $('#modalvideo').modal('toggle')
    }
})

Template.videothumb.helpers({
    
    //get thumb url from youtube
    getThumb(url) {
        var youtube_video_id = url.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/).pop();
        return youtube_video_id;
    },
    testUser : function(username){
              
        if(Meteor.user()){
            if(username == Meteor.user().username){
                return false;
            }
            return true;
        }
        return true
    }
})

Template.videoform.events({ 
    'submit #videoform'(event) {
    // Prevent default browser form submit
    event.preventDefault();
 
    
    //hide modal
    $('#modalvideo').modal('toggle');
    
    //get form values to links and others  
    var target = event.target;
    var url = target.url.value;
    var comment = target.comment.value;
    var title = target.title.value;
    var youtube_video_id = url.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/).pop();
    var rating = $('#rating').data('userrating');
    
    //clear form
        
    $(target.url).val("")
    $(target.comment).val("")
    $(target.title).val("")
    
    
    //new data object
    var obj = {url : url , youtube : youtube_video_id , title : title , comment : comment , username : Meteor.user().username , rating : rating}

    //insert in database
    Videos.insert(obj)
    
    
    //Session.set("data", JSON.stringify(videos))
    //console.log(Session.get("data"))
  }
})

Template.video.onCreated(function(){
    var data = this.data;
    
    var instance = this;
    
    console.log(this)
    
    //Session.set('videodata', data)
    
    if(data){
        instance.subscribe('comments',data.youtube);
    }
    
    // 2. Cursor to comments instance from database
    instance.comments = function(){
        return Comments.find({youtube: data.youtube})
    }
})




Template.video.helpers({
    comments: function () {
        //Meteor.subscribe('comments')
        return Template.instance().comments();
    }
})


/*Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});


Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});*/
