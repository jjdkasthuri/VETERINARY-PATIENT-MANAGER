import { deleteDates, editDates } from "../functions.js"
import { dateBox } from "../selectors.js"
import { Db } from "../functions.js"

export default class UI {

    showAlert(message, type) {
        if(type === "error") {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: message,
                showConfirmButton: false,
                timer: 2000,
            })
        } else {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: message,
                showConfirmButton: false,
                timer: 2000,
            })
        }
    }

    printDates() {
        
        this.cleanHTML();

        //Read db files
        const objectStore = Db.transaction("dates").objectStore("dates");

        objectStore.openCursor().onsuccess = function(e) {

            const cursor = e.target.result;

            if(cursor) {
                const { petName, owner, cellphone, day, hour, symptoms, id } = cursor.value;
                const divDate = document.createElement("div");
                divDate.classList.add("date", "p-3");
                divDate.dataset.id = id;

                const petParagraph = document.createElement("h2");
                petParagraph.classList.add("card-title", "font-weight-bolder");
                petParagraph.textContent = petName;

                const ownerParagraph = document.createElement("p");
                ownerParagraph.innerHTML = `
                    <span class="font-weight-bolder">Owner: </span> ${owner}
                `

                const cellphoneParagraph = document.createElement("p");
                cellphoneParagraph.innerHTML = `
                    <span class="font-weight-bolder">Cellphone: </span> ${cellphone}
                `

                const dayParagraph = document.createElement("p");
                dayParagraph.innerHTML = `
                    <span class="font-weight-bolder">Date: </span> ${day}
                `
                const hourParagraph = document.createElement("p");
                hourParagraph.innerHTML = `
                    <span class="font-weight-bolder">Hour: </span> ${hour}
                `

                const symptomsParagraph = document.createElement("p");
                symptomsParagraph.innerHTML = `
                    <span class="font-weight-bolder">Symptoms: </span> ${symptoms}
                `

                const btnDelete = document.createElement("buttom");
                btnDelete.classList.add("btn", "btn-danger", "mt-2", "mr-2");
                btnDelete.innerHTML = 'Delete <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';

                btnDelete.onclick = () => deleteDates(id);

                const btnEdit = document.createElement("buttom");
                btnEdit.classList.add("btn", "btn-info", "mt-2");
                btnEdit.innerHTML = 'Edit <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>'

                const date = cursor.value;
                btnEdit.onclick = () => editDates(date);

                divDate.appendChild(petParagraph);
                divDate.appendChild(ownerParagraph);
                divDate.appendChild(cellphoneParagraph);
                divDate.appendChild(dayParagraph);
                divDate.appendChild(hourParagraph);
                divDate.appendChild(symptomsParagraph);
                divDate.appendChild(btnDelete);
                divDate.appendChild(btnEdit);


                dateBox.appendChild(divDate);

                //Next elemente
                cursor.continue();
            }
        }

    }

    cleanHTML(){
        while(dateBox.firstChild){
            dateBox.removeChild(dateBox.firstChild);
        }
    }

}