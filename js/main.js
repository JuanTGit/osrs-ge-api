console.log('Welcome to the general store!')


// Grab Item ID from Item name input
const geItemAPI = async function(itemName){
    let information = await fetch('https://oldschool.runescape.wiki/?title=Module:GEIDs/data.json&action=raw&ctype=application%2Fjson')
    let infoData = await information.json()
    return await infoData[itemName]
}
console.log(geItemAPI('Acorn'))


// Get Item Prices
const gePriceAPI = async function(itemId){
    let prices = await fetch(`https://prices.runescape.wiki/api/v1/osrs/latest?id=${itemId}`)
    let priceData = await prices.json()
    return await priceData
}

const searchItem = document.getElementById('geForm')

searchItem.addEventListener('submit', async (event) => {
    event.preventDefault();
    let item = event.target.itemInput.value.charAt(0).toUpperCase() + event.target.itemInput.value.slice(1).toLowerCase();
    let itemId = await geItemAPI(item)
    let gePriceItem = await gePriceAPI(itemId)
    updateCard(itemId, gePriceItem, item)
})

const updateCard = function(item, gePrice, itemN){
    let {itemImg, itemName, itemDescription, price, priceHigh, priceLow} = {
        itemImg: document.getElementById('itemImg'),
        itemName: document.getElementById('itemName'),
        itemDescription: document.getElementById('itemDescription'),
        price: document.getElementById('price'),
        priceHigh: document.getElementById('priceHigh'),
        priceLow: document.getElementById('priceLow')
    }

    itemImg.src = `https://oldschool.runescape.wiki/images/${itemN.replace(/\s+/g, '_')}_detail.png`
    itemName.innerHTML = `${itemN}`
    // itemDescription.innerHTML = `${item.examine}`
    priceHigh.innerHTML = `Average High: ${gePrice.data[item].high.toLocaleString()} gp`
    priceLow.innerHTML = `Average Low: ${gePrice.data[item].low.toLocaleString()} gp`


}


document.addEventListener('DOMContentLoaded', function () {
    const itemInput = document.getElementById('itemInput');
    const suggestionsList = document.getElementById('suggestions');

    // Asynchronous function to load JSON data
    async function loadItems() {
        try {
            const response = await fetch('https://oldschool.runescape.wiki/?title=Module:GEIDs/data.json&action=raw&ctype=application%2Fjson');
            const itemsObject = await response.json();

            itemInput.addEventListener('input', function () {
                const userInput = itemInput.value.toLowerCase().trim();
                const itemsArray = Object.entries(itemsObject);
                const filteredItems = itemsArray.slice(2).filter(([key, value]) =>
                    key.toString().toLowerCase().includes(userInput)
                );
                displaySuggestions(filteredItems.slice(0,10));
            });
        } catch (error) {
            console.error('Error loading JSON:', error);
        }
    }

    loadItems();

    function displaySuggestions(suggestedItems) {
        suggestionsList.innerHTML = '';

        suggestedItems.forEach(([key, value]) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${key}`;
            listItem.classList.add('list-group-item')
            
            // Add click event listener to fill in the input on click
            listItem.addEventListener('click', function () {
                itemInput.value = key;
                suggestionsList.innerHTML = ''; // Clear suggestions after selecting one
            });

            suggestionsList.appendChild(listItem);
        });
    }
});
