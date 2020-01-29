let mongoose = require('mongoose');
let uuid = require('uuid');

mongoose.Promise = global.Promise;

/* Tu código va aquí */
let bookmarkCollection = mongoose.Schema({
    id: {
        type: typeof uuid.v4()
    },
    titulo: {
        type: String
    },
    descripcion: {
        type: String
    },
    url: {
        type: String
    }
});

let Bookmark = mongoose.model('bookmark', bookmarkCollection);

let BookMarkToUpdate = {
    getAll: function () {
        return Bookmark.find()
            .then(bookmarks => {
                return bookmarks;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    updateBookmark: function (bookmarkupdate) {
        let test = bookmarkCollection.find(bookmarkupdate.id);
        test = {
            ...test,
            ...bookmarkupdate
        };
        return Bookmark.updateOne(test)
            .then(bookmark => {
                return bookmark;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    create: function (newBookmark) {
        return Bookmark.create(newBookmark)
            .then(bookmark => {
                return bookmark;
            })
            .catch(error => {
                throw Error(error);
            });
    },
}

module.exports = {
    BookMarkToUpdate
};