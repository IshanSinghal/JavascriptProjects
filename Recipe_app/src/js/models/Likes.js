export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, publisher, img) {
        const like = {
            id,
            title,
            publisher,
            img
        };
        this.likes.push(like);
        
        //Perist data in localStorage
        this.peristData();

        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        //[2, 4, 8] splice(1, 1) --> returns 4, array becomes [2, 8]
        //[2, 4, 8] splice(1, 2) --> returns [4, 8], array becomes [2]
        
        this.likes.splice(index, 1);
        
        //Perist data in localStorage
        this.peristData();
        
    }

    isLike(id) {
        return (this.likes.findIndex(el => el.id === id) !== -1);
    }

    getNumLikes() {
        return this.likes.length;
    }

    peristData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        
        //Restore likes from localStorage
        if(storage) this.likes = storage;
    }
};

