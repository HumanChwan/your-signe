"use strict";
var cart;
const shopSection = document.querySelector('.shop');
const cartToggleButton = document.querySelector('.cart-toggle');
const cartDiv = document.querySelector('.cart');
class Cart {
    constructor(cartDiv, cartButton) {
        this.createToggleFunctionality = () => {
            this.domButtonElement.addEventListener('click', () => {
                this.openState = !this.openState;
                if (this.openState) {
                    this.domElement.classList.remove('cart-close');
                    this.domElement.classList.add('cart-open');
                    this.domButtonElement.textContent = '>>';
                }
                else {
                    this.domElement.classList.remove('cart-open');
                    this.domElement.classList.add('cart-close');
                    this.domButtonElement.textContent = '<<';
                }
            });
        };
        this.initializeDragDropFunctionality = (shopList) => {
            this.domElement.addEventListener('dragover', (e) => {
                e.preventDefault();
            });
            this.domElement.addEventListener('drop', (e) => {
                e.preventDefault();
                try {
                    const id = parseInt(e.dataTransfer.getData('id'));
                    const item = shopList.find(i => i.id === id)
                    this.addToCart(item);
                }
                catch (err) {
                    console.error(err);
                }
            });

            shopSection?.addEventListener('dragover', (e) => {
                e.preventDefault();
            });
            shopSection?.addEventListener('drop', (e) => {
                e.preventDefault();
                try {
                    const id = parseInt(e.dataTransfer.getData('id'));
                    const item = shopList.find(i => i.id === id)
                    this.checkAndChangeQuantity(item, -1);
                }
                catch (err) {
                    console.error(err);
                }
            });
        };
        this.createCartElement = (shopObject) => {
            const divElement = document.createElement('div');
            divElement.draggable = true;
            divElement.classList.add('cart-object');
            divElement.id = `cart-object-${shopObject.id}`;
            const divImgElement = document.createElement('div');
            divImgElement.classList.add('cart-object-img');
            const imgElement = document.createElement('img');
            imgElement.src = shopObject.image;
            imgElement.draggable = false;
            divImgElement.appendChild(imgElement);
            const divDescElement = document.createElement('div');
            divDescElement.classList.add('cart-object-desc');
            const spanElement = document.createElement('span');
            spanElement.innerText = shopObject.name;
            const paragraphElement = document.createElement('p');
            paragraphElement.innerText = shopObject.desc;
            const qtyDivElement = document.createElement('div');
            qtyDivElement.classList.add('cart-object-qty');
            const spanQuantityElement = document.createElement('span');
            spanQuantityElement.classList.add('quantity');
            spanQuantityElement.innerText = 'Quantity: 1';

            divElement.addEventListener('dragstart', (e) => {
                e.dataTransfer?.setData('id', `${shopObject.id}`);
            });

            qtyDivElement.appendChild(spanQuantityElement);
            // qtyDivElement.appendChild(descQtyButton);
            divDescElement.appendChild(spanElement);
            divDescElement.appendChild(paragraphElement);
            divDescElement.appendChild(qtyDivElement);
            divElement.appendChild(divImgElement);
            divElement.appendChild(divDescElement);
            return divElement;
        };
        this.modifyCartContent = (foundCartObject) => {
            if (foundCartObject.quantity === 0) {
                const element = document.querySelector(`#cart-object-${foundCartObject.id}`);
                this.listContainerElement.removeChild(element);
                this.cartContents = this.cartContents.filter((cartObject) => cartObject.id !== foundCartObject.id);
                return;
            }
            const contentElement = document.querySelector(`#cart-object-${foundCartObject.id} > .cart-object-desc .quantity`);
            contentElement.innerText = `Quantity: ${foundCartObject.quantity}`;
        };
        this.checkAndChangeQuantity = (shopObject, delta) => {
            const foundCartObject = this.cartContents.find((cartObject) => cartObject.id === shopObject.id);
            if (foundCartObject !== undefined) {
                foundCartObject.quantity += delta;
                this.modifyCartContent(foundCartObject);
                if (this.cartContents.length === 0) {
                    document
                        .querySelector('.dashed-placeholder')
                        ?.classList.remove('hide');
                    this.listContainerElement.classList.add('center-me-nya');
                }
                return true;
            }
            return false;
        };
        this.addToCart = (shopObject) => {
            if (this.checkAndChangeQuantity(shopObject, 1))
                return;
            if (this.cartContents.length === 0) {
                document
                    .querySelector('.dashed-placeholder')
                    ?.classList.add('hide');
                this.listContainerElement.classList.remove('center-me-nya');
            }
            this.cartContents.push({ ...shopObject, quantity: 1 });
            this.listContainerElement.appendChild(this.createCartElement(shopObject));
            if (!this.openState)
                this.domButtonElement.click();
        };
        this.domElement = cartDiv;
        this.openState = false;
        this.domButtonElement = cartButton;
        this.listContainerElement = document.querySelector('.cart-object-container');
        this.cartContents = [];
        this.createToggleFunctionality();
    }
}
const getData = async () => {
    const response = await fetch('./data.json', {
        method: 'GET',
    });
    console.log(response);
    return await response.json();
};
const appendData = (shopList) => {
    const shopChildren = shopList.map((shopObject) => {
        const objectElement = document.createElement('div');
        objectElement.classList.add('card');
        objectElement.id = `card-id-${shopObject.id}`;
        objectElement.draggable = true;
        const divImageElement = document.createElement('div');
        divImageElement.classList.add('card-img');
        const imageElement = document.createElement('img');
        imageElement.src = shopObject.image;
        imageElement.draggable = false;
        const divDescElement = document.createElement('div');
        divDescElement.classList.add('card-desc');
        const spanElement = document.createElement('span');
        spanElement.innerText = shopObject.name;
        const paragraphElement = document.createElement('p');
        paragraphElement.innerText = shopObject.desc;
        divDescElement.appendChild(spanElement);
        divDescElement.appendChild(paragraphElement);
        divImageElement.appendChild(imageElement);
        objectElement.appendChild(divImageElement);
        objectElement.appendChild(divDescElement);
        return objectElement;
    });
    shopChildren.forEach((shopElement) => {
        shopSection?.appendChild(shopElement);
    });
    return shopChildren;
};
const main = async () => {
    const data = await getData();
    // .sort((a, b) => Math.random() > 0.5 ? 1 : -1)
    const shopChildren = appendData(data.list);
    cart = new Cart(cartDiv, cartToggleButton);
    shopChildren.forEach((shopElement, idx) => {
        shopElement.addEventListener('dragstart', (e) => {
            // e.preventDefault();
            e.dataTransfer?.setData('id', `${data.list[idx].id}`);
        });
    });
    cart.initializeDragDropFunctionality(data.list);
};
main();
