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
    },
    toggleSort(){
         var name = Router.current().route.getName();
        
        //console.dir(name)
        if(name == 'land'){
            return true;
        }
        
        return false
    }
})


Template.navbar.events({
    'click .btn-sort'(event,instance){
        document.getElementById("mySidenav").style.width = "250px";
        document.getElementById("main").style.marginLeft = "250px";
        document.body.style.backgroundColor = "rgba(0,0,0,0.7)";
    }
})

Template.navbar.rendered = function() {
    /*$(".btn-sort").popover({
        html: true,
        title: 'Sort',
        animation: true,
        placement: 'bottom',
        content: function() {
            return $(".customaffix").html();
        }
    });*/
}

Template.sidenav.events({
    'click .closebtn'(event,instance){
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";
        document.body.style.backgroundColor = "white";
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
    $('#rating').trigger('reset');
    
    var user = Meteor.user().username
    
    
    //new data object
    var obj = {url : url , youtube : youtube_video_id , title : title , comment : comment , username : user , rating : rating}

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
    
    Session.set('clicked', false);
})




Template.video.helpers({
    comments: function () {
        //Meteor.subscribe('comments')
        return Template.instance().comments();
    }
})

Template.video.events({
    'click .btn-comment'(event , instance){
        var clicked = Session.get('clicked');
        
        if(!clicked){
            $("#commentcontainer").stop().animate({
                height : 300,
                'border-width' : 2
            },200)
        } else {
            $("#commentcontainer").stop().animate({
                height : 0,
                'border-width' : 0
            },200)
        }
        
        Session.set('clicked', !clicked);
    }
})

Template.commentform.onCreated(function () {

  // 1. Initialization

  var instance = this;
    


  // 1. Autorun

  // will re-run when the "limit" reactive variables changes
  instance.autorun(function () {
    // subscribe to the posts publication
    var subscription = instance.subscribe('comments',instance.data.youtube);
  });



});

Template.comment_template.helpers({
    getUser : function(username){
              
        if(Meteor.user()){
            if(username == Meteor.user().username){
                return false;
            }
            return true;
        }
        return true
    }
})

Template.commentform.events({
    'submit #comments'(event,instance){
        
        event.preventDefault();
        event.stopPropagation();
        
        var clicked = Session.get('clicked');
        Session.set('clicked', !clicked);
        
        $("#commentcontainer").stop().animate({
            height : 0,
            'border-width' : 0
        },200)
       
        
        var target = event.target;
        var comment = target.commentarea.value;
        var rating = $('#ratingcomment').data('userrating');
        var youtube = instance.data.youtube;
        var user = Meteor.user().username;
        
        $(target.commentarea).val("");
        $('#ratingcomment').trigger('reset')
        
        //var rating = "3";
        
        if(!rating) rating = 0;

        
        var obj = {comment : comment , youtube : youtube , username : user , rating : rating}
        
        Comments.insert(obj);
    }
})

