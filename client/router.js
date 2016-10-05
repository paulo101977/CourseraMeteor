import { Videos } from '../lib/videosCollection'

Router.route('/', function () {
  this.render('splash-screen', {
    
  });
})
    
Router.route('/land', function () {
  this.render('land', {
    
  });
});


Router.route('/video/:_id', function(){
    
    var video = Videos.findOne({youtube: this.params._id});

    if(video){
        this.render('video', {data:video})
    } else {
        //this.next();
    }
    
});