"use strict";
var cart;
{
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
            this.createCartElement = (shopObject) => {
                const divElement = document.createElement('div');
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
                // const incQtyButton = document.createElement('button');
                // incQtyButton.textContent = '+';
                // incQtyButton.onclick = () => {
                //     console.log('click');
                //     this.checkAndChangeQuantity(shopObject, 1);
                // };
                const descQtyButton = document.createElement('button');
                descQtyButton.textContent = '-';
                descQtyButton.onclick = () => {
                    this.checkAndChangeQuantity(shopObject, -1);
                };
                // qtyDivElement.appendChild(incQtyButton);
                qtyDivElement.appendChild(spanQuantityElement);
                qtyDivElement.appendChild(descQtyButton);
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
                    return true;
                }
                return false;
            };
            this.addToCart = (shopObject) => {
                if (!this.openState)
                    this.domButtonElement.click();
                if (this.checkAndChangeQuantity(shopObject, 1))
                    return;
                this.cartContents.push({ ...shopObject, quantity: 1 });
                this.listContainerElement.appendChild(this.createCartElement(shopObject));
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
    const appendData = (shopList, cart) => {
        const shopChildren = shopList.map((shopObject) => {
            const objectElement = document.createElement('div');
            objectElement.classList.add('card');
            objectElement.id = `card-id-${shopObject.id}`;
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
            const divButtonElement = document.createElement('div');
            divButtonElement.classList.add('card-button');
            const buttonElement = document.createElement('button');
            buttonElement.onclick = () => {
                cart.addToCart(shopObject);
            };
            buttonElement.textContent = 'Add To Cart';
            divButtonElement.appendChild(buttonElement);
            divDescElement.appendChild(spanElement);
            divDescElement.appendChild(paragraphElement);
            divImageElement.appendChild(imageElement);
            objectElement.appendChild(divImageElement);
            objectElement.appendChild(divDescElement);
            objectElement.appendChild(divButtonElement);
            return objectElement;
        });
        shopChildren.forEach((shopElement) => {
            shopSection?.appendChild(shopElement);
        });
        return shopChildren;
    };
    const main = async () => {
        const data = await getData();
        cart = new Cart(cartDiv, cartToggleButton);
        // .sort((a, b) => Math.random() > 0.5 ? 1 : -1)
        const shopChildren = appendData(data.list, cart);
        shopChildren.forEach((shopElement, idx) => {
            shopElement.addEventListener('dragstart', (e) => {
                // e.preventDefault();
                e.dataTransfer?.setData('id', `${data.list[idx].id}`);
            });
        });
    };
    main();
}
