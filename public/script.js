"use strict";
const shopSection = document.querySelector('.shop');
const getData = async () => {
    const response = await fetch('./data.json', {
        method: 'GET',
    });
    console.log(response);
    return await response.json();
};
const appendData = (shopList) => {
    shopList.forEach((shopObject) => {
        const objectElement = document.createElement('div');
        objectElement.classList.add('card');
        objectElement.id = `card-id-${shopObject.id}`;
        const divImageElement = document.createElement('div');
        divImageElement.classList.add('card-img');
        const imageElement = document.createElement('img');
        imageElement.src = shopObject.image;
        const divDescElement = document.createElement('div');
        divDescElement.classList.add('card-desc');
        const paragraphElement = document.createElement('p');
        paragraphElement.innerText = shopObject.desc;
        divDescElement.appendChild(paragraphElement);
        divImageElement.appendChild(imageElement);
        objectElement.appendChild(divImageElement);
        objectElement.appendChild(divDescElement);
        shopSection?.appendChild(objectElement);
    });
};
const main = async () => {
    const data = await getData();
    appendData(data.list);
};
main();
