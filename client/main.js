import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import { Tracker } from 'meteor/tracker'
import { Mongo } from 'meteor/mongo';

import './main.html';

import { Accounts } from 'meteor/accounts-base';
 
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});

var videos = [{url:"https://www.youtube.com/embed/zgLRFwwbLi8"},
              {url:"https://www.youtube.com/embed/pUb63Dc7-Bw"},
             {url:"https://www.youtube.com/embed/QA_tK8wffwc"}]

Session.set("data", JSON.stringify(videos))


Template.land.onCreated(function () {

  // 1. Initialization

  var instance = this;
    
  Videos = new Mongo.Collection('videos');


  // 1. Autorun

  // will re-run when the "limit" reactive variables changes
  instance.autorun(function () {


    // subscribe to the posts publication
    var subscription = instance.subscribe('videos');

    // if subscription is ready, set limit to newLimit
    if (subscription.ready()) {
      console.log("> Received videos. \n\n")
      console.dir(subscription)
    } else {
      console.log("> Subscription is not ready yet. \n\n");
    }
  });

  // 2. Cursor

  instance.videos = function() { 
    return Videos.find({});
  }

});




Template.land.helpers({
    //videos: Tracker.autorun(function(){ return JSON.parse(Session.get("data")) }) ,
    videos: function () {
        //Meteor.subscribe('videos')
        return Template.instance().videos();
    },
    toggleModal(){
        $('#modalvideo').modal('toggle')
    }
})

Template.land.events({
    'click .btn-video'(event){
        event.stopPropagation();
        console.log("clicked")
        $('#modalvideo').modal('toggle');
        
        Meteor.call('custom.findVideo',function(err, res){
             //console.log("callback");
             //console.dir(res)
        })
        
        //var video =  Meteor.call('custom.findVideo');
        
    }
})

Template.video.helpers({
    getThumb(url) {
        var youtube_video_id = url.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/).pop();
        return youtube_video_id;
    }
})

Template.videoform.events({ 
    'submit #videoform'(event) {
    // Prevent default browser form submit
    event.preventDefault();
 
    console.log("submited ");
        
    $('#modalvideo').modal('toggle');
    
        
    console.dir(event);
        
    var target = event.target;
    var url = target.url.value;
    console.log("url: " + url);
        
    var obj = {url : url}
    videos.push(obj)
    //console.dir(videos)
    Videos.insert({url : url})
    
    //Session.set("data", JSON.stringify(videos))
    //console.log(Session.get("data"))
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
