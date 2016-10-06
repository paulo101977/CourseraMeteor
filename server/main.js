import { Meteor } from 'meteor/meteor';

import { Mongo } from 'meteor/mongo';

import { Videos } from '../lib/videosCollection'


import { Comments } from '../lib/comments'
 

Meteor.startup(() => {
  // code to run on server at startup

    Videos.remove({}); //delete all

    Videos.insert({youtube: "zgLRFwwbLi8" , title : "Title One" , comment : "Comment One",url:"https://www.youtube.com/embed/zgLRFwwbLi8" , username:"paulo101977" , rating : "5"});
    Videos.insert({youtube: "pUb63Dc7-Bw" , title : "Title Two" , comment : "Comment two",url:"https://www.youtube.com/embed/pUb63Dc7-Bw" , username:"paulo101977" , rating : "3"});
    Videos.insert({youtube: "QA_tK8wffwc" , title : "Title Three" , comment : "Comment Three",url:"https://www.youtube.com/embed/QA_tK8wffwc" , username:"paulo101977" , rating : "4"});
    
    Comments.remove({});
    
    Comments.insert({youtube: "zgLRFwwbLi8" , comment : "Comment One" , username:"paulo101977",rating: 3})
    Comments.insert({youtube: "zgLRFwwbLi8" , comment : "Comment Two" , username:"paulo101977",rating:4})
    
});



Meteor.publish('videos', function() {
  return Videos.find({});
});

Meteor.publish('comments',function(youtube){
   return Comments.find({youtube : youtube})         
});




