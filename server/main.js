import { Meteor } from 'meteor/meteor';

import { Mongo } from 'meteor/mongo';

import { Videos } from '../lib/videosCollection'


import { Comments } from '../lib/comments'
 

Meteor.startup(() => {
  // code to run on server at startup

    Videos.remove({}); //delete all

    Videos.insert({youtube: "zgLRFwwbLi8" , title : "Title One" , comment : "Comment One",url:"https://www.youtube.com/embed/zgLRFwwbLi8" , username:"paulo101977" , rating : "5",date : new Date()});
    Videos.insert({youtube: "pUb63Dc7-Bw" , title : "Title Two" , comment : "Comment two",url:"https://www.youtube.com/embed/pUb63Dc7-Bw" , username:"paulo101977" , rating : "3",date : new Date()});
    Videos.insert({youtube: "QA_tK8wffwc" , title : "Title Three" , comment : "Comment Three",url:"https://www.youtube.com/embed/QA_tK8wffwc" , username:"paulo101977" , rating : "4",date : new Date()});
    Videos.insert({youtube: "1skSrlw4JRU" , title : "Title Four" , comment : "Comment Four",url:"https://www.youtube.com/watch?v=1skSrlw4JRU" , username:"paulo" , rating : "1",date : new Date()});
    Videos.insert({youtube: "8JjVPiDLdH4" , title : "Title Five" , comment : "Comment Five",url:"https://www.youtube.com/watch?v=8JjVPiDLdH4" , username:"paulo" , rating : "5",date : new Date()});
    Videos.insert({youtube: "YjQVCX1bww0" , title : "Title Six" , comment : "Comment Six",url:"https://www.youtube.com/watch?v=YjQVCX1bww0" , username:"paulo101977" , rating : "2",date : new Date()});
    
    
    Comments.remove({});
    
    Comments.insert({youtube: "zgLRFwwbLi8" , comment : "Comment One" , username:"paulo101977",rating: 3,date : new Date()})
    Comments.insert({youtube: "zgLRFwwbLi8" , comment : "Comment Two" , username:"paulo101977",rating:4,date : new Date()})
    
});



Meteor.publish('videos', function() {
  return Videos.find({});
});

Meteor.publish('comments',function(youtube){
   return Comments.find({youtube : youtube})         
});

Videos.allow({
    'insert': function (userId,doc) {
      /* user and doc checks ,
      return true to allow insert */
      return true; 
    },
    remove: function (userId, docs){
        return true;
    }
});

Comments.allow({
    'insert': function (userId,doc) {
      /* user and doc checks ,
      return true to allow insert */
      return true; 
    },
    remove: function (userId, docs){
        return true;
    }
});




