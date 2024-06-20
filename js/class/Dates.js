export default class Dates {
    
    constructor() {
        this.dates = [];
    }

    addDate(date) { 
        this.dates = [...this.dates, date];
    }

    deleteDate(id){
        this.dates = this.dates.filter( date => date.id !== id )
    }

    editDate(dateEdited) {
        this.dates = this.dates.map( date => date.id === dateEdited.id ? dateEdited : date )
    }

}
