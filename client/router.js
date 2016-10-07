import { Videos } from '../lib/videosCollection'

Router.route('/', function () {
  this.render('splash-screen', {
    
  });
})
    
Router.route('/land', function () {
  this.render('land', {
    
  });
});

Router.route('about' , function(){
    this.render('about', {});
})


Router.route('/video/:_id', function(){
    
    Meteor.subscribe('videos');
    var video = Videos.findOne({youtube: this.params._id});

    if(video){
        this.render('video', {data:video})
    } else {
        //this.next();
        //var video = Videos.findOne({youtube: this.params._id});
        //this.render('video', {data:video})
        this.next();
    }
    
});