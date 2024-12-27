const postEvents = require("../subscribers/post");
const { post } = require("../subscribers/events");

const handleAPIErrors = (err, postID) => {
    console.log(err);
    if (!err.response) {
      // 'You are offline. Please reconnect to the internet'))
      throw err;
    } else if (err.response.status === 401) {
      console.log(`401 ${err.response.status}`);
      if(postID) {
        postEvents.dispatch(post.failedPost, { post_id: postID, status: "failed" });
      }
      let error = new Error(err.response.message);
      //error.statusCode = 401;
      throw error;
    }else if (err.response.status === 403) {
      console.log(`403 ${err.response.status}`);
      if(postID) {
        postEvents.dispatch(post.failedPost, { post_id: postID, status: "failed" });
      }
      let error = new Error(err.response.message);
      error.statusCode = 403;
      throw error;
    }else if (err.response.status === 404) {
      console.log(`404 ${err.response.status}`);
      if(postID) {
        postEvents.dispatch(post.failedPost, { post_id: postID, status: "failed" });
      }
      let error = new Error(err.response.message);
      error.statusCode = 404;
      throw error;
    }else if (err.response.status === 422) {
      console.log(`422 ${err.response.status}`);
      console.log("Duplicate post");
      if(postID) {
        postEvents.dispatch(post.failedPost, { post_id: postID, status: "failed" });
      }
      let error = new Error(err.response.message);
      error.statusCode = 422;
      throw error;
    }else if (err.response.status === 429) {
      console.log(`429 ${err.response.status}`);
      if(postID) {
        postEvents.dispatch(post.failedPost, { post_id: postID, status: "failed" });
      }
      // check for linkedin account not connected error
      let error = new Error(err.response.message);
      error.statusCode = 429;
      throw error;
    }
    else {
      throw err.err.response.status;
    }

    //If you come across this am testing Linkedin API. Drop a like.
};

module.exports = handleAPIErrors;