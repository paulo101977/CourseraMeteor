import { Videos } from '../lib/videosCollection'

Router.onBeforeAction('loading');

Router.route('/', function () {
  this.render('splash-screen', {
    
  });
})
    
Router.route('/land', {
  name : 'land',
     template : 'land',
     path : '/land',
     layoutTemplate: 'land'
});

Router.route('about' ,{ 
     name : 'about',
     template : 'about',
     path : '/about',
     layoutTemplate: 'about'
})

Router.route('/videos', {
     template : 'videos',
     path : '/videos',
     layoutTemplate: 'videos'
});

Router.route('/edit/:_id',{
    template : 'editpage',
    path : '/edit/:_id',
    layoutTemplate : 'editpage',
    subscriptions: function() {
        this.subscribe('videos');
    },
    data: function () {
        return Videos.findOne({youtube: this.params._id});
    },
    waitOn: function () {
        return this.subscribe('videos');
    }
})


Router.route('/video/:_id', {
     template : 'video',
     path : '/video/:_id',
     layoutTemplate: 'video',
     onRun: function () {
        this.subscribe('videos');
        $(document).ready(function(){
            document.body.style.backgroundColor = "white";
        })
     },
     waitOn: function () {
        return Meteor.subscribe('videos');
    },
     onRerun: function () {
        this.subscribe('videos');
        $(document).ready(function(){
            document.body.style.backgroundColor = "white";
        })
     },
     subscriptions: function() {
        this.subscribe('videos');
        /*var video = Videos.findOne({youtube: this.params._id});

        if(video){
            this.render('video', {data:video})
        } else {
            //this.next();
            //var video = Videos.findOne({youtube: this.params._id});
            //this.render('video', {data:video})
            this.next();
        }*/
    },
    data: function () {
        return Videos.findOne({youtube: this.params._id});
    },
    
    
});