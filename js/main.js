// console.log('Welcome to the general store!')

const geAPI = async function(){
    let response = await fetch('https://prices.runescape.wiki/api/v1/osrs/mapping')
    let data = await response.json()
    console.log(data[1].icon)
}