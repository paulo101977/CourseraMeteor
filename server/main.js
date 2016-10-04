import { Meteor } from 'meteor/meteor';

import { Mongo } from 'meteor/mongo';

import { Videos } from './videosCollection'
 

Meteor.startup(() => {
  // code to run on server at startup

    Videos.remove({}); //delete all

    Videos.insert({url:"https://www.youtube.com/embed/zgLRFwwbLi8"});
    Videos.insert({url:"https://www.youtube.com/embed/pUb63Dc7-Bw"});
    Videos.insert({url:"https://www.youtube.com/embed/QA_tK8wffwc"});
    
});



Meteor.publish('videos', function() {
  return Videos.find({});
});




