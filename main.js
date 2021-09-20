//Main

import {getLocalStorageArr} from './module.js';
import {createItemListHTML} from './module.js';
import {addItem} from './module.js';

form.addEventListener("submit", function(event) {
    event.preventDefault();
    addItem();
    document.getElementById("itemInput").value = null;
})

window.onload = function() {
    createItemListHTML(getLocalStorageArr("itemsList"));
};