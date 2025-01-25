class Comment {
  constrcutor(obj) {
    obj && Object.assign(this, obj);
  }
}

module.exports = Comment;
