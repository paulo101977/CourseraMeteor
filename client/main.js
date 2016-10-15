import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import { Tracker } from 'meteor/tracker'
import { Mongo } from 'meteor/mongo';
import { Videos } from '../lib/videosCollection'
import { Comments } from '../lib/comments'

import './main.html';

import { Accounts } from 'meteor/accounts-base';

Session.set('sort' , 'date');
 
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});


//global helper
Template.registerHelper("getThumb", function (url) {
    var youtube_video_id = url.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/).pop();
    return youtube_video_id;
});


//Template Edit
Template.editpage.onCreated(function(){
    
    this.subscribe('videos');
    
    this.video = function(){
        return Videos.find({youtube : Router.current().params._id})
    }
    
})

Template.editpage.helpers({
    video : function() { 
        return Template.instance().video()
    }
})


//Template Land
Template.land.onCreated(function () {

  // 1. Initialization
  var instance = this;
    
  //Videos = new Mongo.Collection('videos');
    
 
 instance.subscribe('videos');


  // 1. Autorun


  // 2. Cursor to videos instance from database
  instance.videos = function(sort_order) { 
    return Videos.find({},{sort:sort_order});
  }
  
  // will re-run when the "limit" reactive variables changes
  instance.autorun(function () {
      /*var sort = Session.get('sort');
      
      var sort_order = {}
      
      sort_order[sort] = 1;

      instance.videos(sort_order)*/
  });

});


Template.land.helpers({
    //videos: Tracker.autorun(function(){ return JSON.parse(Session.get("data")) }) ,
    videos: function () {
       //Meteor.subscribe('videos')
       var sort = Session.get('sort');
      
       var sort_order = {}
      
       sort_order[sort] = 1;
        
       return Template.instance().videos(sort_order);
    }
})

//Template Caroussel
Template.caroussel.onCreated(function(){
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
    return Videos.find({} , {limit : 3 , skip : Math.floor(Math.random() * Videos.find({}).count()) }) ;
  }
})

Template.caroussel.helpers({
    videos : function(){
        return Template.instance().videos();
    },
    testIndex : function(index){
        return index == 0;
    },
    /*
    getThumb(url) {
        var youtube_video_id = url.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/).pop();
        return youtube_video_id;
    }*/
})

//Template Navbar
Template.navbar.helpers({
    toggleModal(){
        $('#modalvideo').modal('toggle')
    },
    toggleSort(){
         var name = Router.current().route.getName();
        
        //console.dir(name)
        if(name == 'land' || name == 'videos'){
            return true;
        }
        
        return false
    }
})


Template.navbar.events({
    'click .btn-menu'(event,instance){
        document.getElementById("mySidenav").style.width = "250px";
        document.getElementById("main").style.marginLeft = "250px";
        //document.body.style.backgroundColor = "rgba(0,0,0,0.7)";
    },
    'click .btn-video'(event){
        event.stopPropagation();

        $('#modalvideo').modal('toggle');   
    },
    'click .btn-sort'(event, instance){
        
    }
})

Template.navbar.rendered = function() {
    $(".btn-sort").popover({
        html: true, 
        animation: true,
        placement: 'bottom',
        content: function() {
            return $(".custompopover").html();
        }
    });
}


//Template Sidenav
Template.sidenav.events({
    'click .closebtn'(event,instance){
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";
        //document.body.style.backgroundColor = "white";
    }
})


//Template Videothumb
Template.videothumb.helpers({
    
    //get thumb url from youtube
    /*getThumb(url) {
        var youtube_video_id = url.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/).pop();
        return youtube_video_id;
    },*/
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

Template.videothumb.events({
    'click .btn-delete'(event , instance){
        event.stopPropagation();

        $('#modaldelete').modal('toggle'); 
        
        //console.dir(instance)
        
        Session.set('todelete', instance.data.youtube);
    }
})

//Template modaldelete
Template.modaldelete.onCreated(function(){
    this.subscribe('videos');
})

Template.modaldelete.events({
    'click .btn-yes'(event , instance){
        event.stopPropagation();

        //console.dir(instance) 
        
        var todelete = Session.get('todelete')
        
        $('#modaldelete').modal('toggle'); 
        
        if(todelete){
            var video = Videos.find({youtube:todelete}).fetch();

            for(var i = 0 ; i < video.length ; i++){
                var id = video[i]._id
                Videos.remove({"_id" : id} , function(error , count){
                    if(error) console.dir(error)
                })
            }
            
        }
    }
})


//template videoform


Template.videoform.events({ 
    'submit #videoform'(event) {
    // Prevent default browser form submit
    event.preventDefault();
        
    var routeName = Router.current().route.getName();
        
    console.log(routeName)
 
    //Router.g
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
    var obj = {url : url , youtube : youtube_video_id , title : title , comment : comment , username : user , rating : rating , date : new Date()}

    //insert in database
    Videos.insert(obj)
    
    
    //Session.set("data", JSON.stringify(videos))
    //console.log(Session.get("data"))
  }
})

//Template video
Template.video.onCreated(function(){
    var data = this.data;
    
    var instance = this;
    
    
    //Session.set('videodata', data)
    
    if(data){
        instance.subscribe('comments',Router.current().params._id);
    }
    
    instance.autorun(function(){
        instance.subscribe('comments',Router.current().params._id);
    })
    
    // 2. Cursor to comments instance from database
    instance.comments = function(){
        return Comments.find({youtube: Router.current().params._id})
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

//template videos
Template.videos.onCreated(function(){
    var instance = this;
    
    instance.subscribe('videos');
    
    instance.autorun(function(){
        instance.subscribe('videos');
    })
    
    instance.videos = function(sort_order){
        return Videos.find({} , {sort : sort_order})
    }
})

Template.videos.helpers({
    videos : function(){
        var sort = Session.get('sort');
      
       var sort_order = {}
      
       sort_order[sort] = 1;
        
       return Template.instance().videos(sort_order);
    },
    /*getThumb(url) {
        var youtube_video_id = url.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/).pop();
        return youtube_video_id;
    },*/
})

//template comment form
Template.commentform.onCreated(function () {

  // 1. Initialization

  var instance = this;
    


  // 1. Autorun
  // will re-run when the "limit" reactive variables changes
  instance.autorun(function () {
    // subscribe to the posts publication
    var subscription = instance.subscribe('comments',Router.current().params._id);
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

Template.comment_template.events({
    'click .btn-edit'(event,instance){
        
        //console.dir(instance)
        
        //data about this comment
        
        $('.editcommentmodal').modal('toggle');
        var data = instance.data;
        $('.commentarea').val(data.comment);
        var rating = data.rating;
        Session.set('rating',rating);
        Session.set('commentId', instance.data._id)
    },
    'click .btn-delete'(event,instance){
        
        Session.set('idComment', instance.data._id)
        
        $('.deletecomment').modal('toggle')
    }
})

Template.editcommentmodal.helpers({
    rating: function(){
        return Session.get('rating');
    }
})

Template.editcommentmodal.events({
    'click .btn-cancel'(event,instance){
        event.preventDefault();
        
        $('.editcommentmodal').modal('toggle');
    },
    'submit .editcommentmodal'(event,instance){
        event.preventDefault();
        
        var id = Session.get('commentId')
        
        //Videos.update({_id : video._id},{$set:{title: title, comment : comment, rating : rating, date: new Date()}}
        Comments.update({_id : id } , {$set:{comment : $('.commentarea').val(),rating:$('#ratingcommentform').data('userrating')}})
        
        $('.editcommentmodal').modal('toggle')
    }
})

Template.deletecomment.events({
    'click .btn-yes'(event,instance){
        event.preventDefault();
        
        var id = Session.get('idComment');
        
        Comments.remove({_id : id})
        
        $('.deletecomment').modal('toggle')
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
        var youtube = Router.current().params._id;
        var user = Meteor.user().username;
        
        $(target.commentarea).val("");
        $('#ratingcomment').trigger('reset')
        
        //var rating = "3";
        
        if(!rating) rating = 0;

        
        var obj = {comment : comment , youtube : youtube , username : user , rating : rating , date : new Date()}
        
        Comments.insert(obj);
    },
    'click .btn-cancel'(events,instance){
        
        event.preventDefault();
        
        var target = event.target;
        $(target.commentarea).val("");
        $('#ratingcomment').trigger('reset')
        
        $("#commentcontainer").stop().animate({
            height : 0,
            'border-width' : 0
        },200)
    }
})

//youtube, title , comment , username, rating ,date 

//http://stackoverflow.com/questions/21657960/bootstrap-3-meteor-event-on-radio-buttons
Template.custompopover.onCreated(function(){
    
    $(document.body).on('change.tplcustompopover', '#dateradio', function(e){
        // handler
        Session.set('sort' , 'date');
    });
    
    $(document.body).on('change.tplcustompopover', '#titleradio', function(e){
        // handler
        Session.set('sort' , 'title');
    });
    
    $(document.body).on('change.tplcustompopover', '#ratingradio', function(e){
        // handler
        Session.set('sort' , 'rating');
    });
    
    $(document.body).on('change.tplcustompopover', '#userradio', function(e){
        // handler
        Session.set('sort' , 'username');
    });
    
    //commentradio
    $(document.body).on('change.tplcustompopover', '#commentradio', function(e){
        // handler
        Session.set('sort' , 'comment');
    });
})

Template.editform.onCreated(function(){
    this.subscribe('videos')         
})

//tempalte editform
Template.editform.events({
    'submit #editform'(event,instance){
        event.preventDefault();
         
        
        var target = event.target;
        var title = target.title.value;
        var comment = target.comment.value;
        var rating = $('#rating').data('userrating');
        var youtube = Router.current().params._id;
        //var user = Meteor.user().username; //not needed
        
        var video = Videos.find({youtube : youtube}).fetch()[0];
        
        
        if(video){
           Videos.update({_id : video._id},{$set:{title: title, comment : comment, rating : rating, date: new Date()}},
             function(err,sucess){
                if(err){

                    $('.alert-warning').removeClass('hide');
                    $('.alert-warning').animate({
                        opacity: 1
                    }, {duration:1500,
                       complete: function(){
                          Router.go('land') 
                       }})  
                }
                if(sucess){
                    $('.alert-success').removeClass('hide');
                    $('.alert-success').animate({
                        opacity: 1
                    }, {duration:1500,
                       complete: function(){
                          Router.go('land') 
                       }})
                }
             }); 
        }
        
        //Router.go('land')
        //Videos.update({_id : "Jack"},{$set:{age : 13, username : "Jack"}});
    },
    'click .btn-cancel'(event,instance){
        Router.go('land');
    }
})

Template.about.onCreated(function(){
    GoogleMaps.load();
    
    GoogleMaps.ready('map', function(map) {
        // Add a marker to the map once it's ready
        var marker = new google.maps.Marker({
            position: map.options.center,
            map: map.instance,
            title: 'I am here!'
        });
      });
    
})

Template.about.helpers({
  mapOptions: function() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
        
        //var myLatLng = {lat: -22.8790217, lng: -43.5257598};

      // Map initialization options
      return {
        scrollwheel: false,
        center: new google.maps.LatLng(-22.8790217,-43.5257598),
        zoom: 15
      };
    }
  }
});
