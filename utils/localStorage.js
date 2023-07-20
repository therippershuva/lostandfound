/**
 * save item to local storage
 * @param {String} itemName
 * @param {String} item
 * @returns {void}
 * */
export function saveToLocalStorage(itemName, item) {
    localStorage.setItem(itemName, item);
}
