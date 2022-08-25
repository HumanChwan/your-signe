{
    const shopSection = document.querySelector('.shop');
    const cartToggleButton: HTMLButtonElement | null =
        document.querySelector('.cart-toggle');
    const cartDiv: HTMLElement | null = document.querySelector('.cart');

    type TShopObject = {
        id: number;
        image: string;
        name: string;
        desc: string;
    };

    type TShopList = {
        list: TShopObject[];
    };
    const confetti = (button: HTMLButtonElement) => {
        const random = (max: number) => {
            return Math.floor(Math.random() * max);
        };

        const frag = document.createDocumentFragment();
        const className = `confetti-${random(300)}`;

        for (let i = 0; i < 100; i++) {
            const styles = `transform: translate3d(${random(500) - 250}px, ${
                random(200) - 150
            }px, 0) rotate(${random(360)}deg); 
            background: hsla(${random(360)}, 100%, 50%, 1);
            animation: bang 700ms ease-out forwards;
            opacity: 0`;

            var e = document.createElement('i');
            e.classList.add(className);
            e.style.cssText = styles.toString();
            frag.appendChild(e);
        }
        button.append(frag);

        setTimeout(() => {
            document.querySelectorAll(`.${className}`).forEach((conf) => {
                conf.remove();
            });
        }, 1000);
    };

    class Cart {
        domElement: HTMLElement;
        listContainerElement: HTMLDivElement;
        openState: boolean;
        domButtonElement: HTMLButtonElement;
        cartContents: Array<TShopObject & { quantity: number }>;

        constructor(cartDiv: HTMLElement, cartButton: HTMLButtonElement) {
            this.domElement = cartDiv;
            this.openState = false;
            this.domButtonElement = cartButton;
            this.listContainerElement = document.querySelector(
                '.cart-object-container'
            )!;
            this.cartContents = [];

            this.createToggleFunctionality();
        }

        createToggleFunctionality = () => {
            this.domButtonElement.addEventListener('click', () => {
                this.openState = !this.openState;
                if (this.openState) {
                    this.domElement.classList.remove('cart-close');
                    this.domElement.classList.add('cart-open');

                    this.domButtonElement.textContent = '>>';
                } else {
                    this.domElement.classList.remove('cart-open');
                    this.domElement.classList.add('cart-close');

                    this.domButtonElement.textContent = '<<';
                }
            });
        };

        createCartElement = (shopObject: TShopObject): HTMLDivElement => {
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
            spanQuantityElement.innerText = 'Qty: x1';

            const incQtyButton = document.createElement('button');
            incQtyButton.textContent = '+';
            incQtyButton.onclick = () => {
                console.log('click');
                this.checkAndChangeQuantity(shopObject, 1);
            };
            const descQtyButton = document.createElement('button');
            descQtyButton.textContent = '-';
            descQtyButton.onclick = () => {
                this.checkAndChangeQuantity(shopObject, -1);
            };
            qtyDivElement.appendChild(incQtyButton);
            qtyDivElement.appendChild(spanQuantityElement);
            qtyDivElement.appendChild(descQtyButton);

            divDescElement.appendChild(spanElement);
            divDescElement.appendChild(paragraphElement);
            divDescElement.appendChild(qtyDivElement);

            divElement.appendChild(divImgElement);
            divElement.appendChild(divDescElement);

            return divElement;
        };

        modifyCartContent = (
            foundCartObject: TShopObject & { quantity: number }
        ) => {
            if (foundCartObject.quantity === 0) {
                const element = document.querySelector(
                    `#cart-object-${foundCartObject.id}`
                ) as HTMLDivElement;
                this.listContainerElement.removeChild(element);
                this.cartContents = this.cartContents.filter(
                    (cartObject) => cartObject.id !== foundCartObject.id
                );
                return;
            }
            const contentElement = document.querySelector(
                `#cart-object-${foundCartObject.id} > .cart-object-desc .quantity`
            ) as HTMLDivElement;
            contentElement.innerText = `Qty: x${foundCartObject.quantity}`;
        };

        checkAndChangeQuantity = (
            shopObject: TShopObject,
            delta: 1 | -1
        ): boolean => {
            const foundCartObject = this.cartContents.find(
                (cartObject) => cartObject.id === shopObject.id
            );
            if (foundCartObject !== undefined) {
                foundCartObject.quantity += delta;
                this.modifyCartContent(foundCartObject);
                return true;
            }
            return false;
        };

        addToCart = (shopObject: TShopObject) => {
            if (!this.openState) this.domButtonElement.click();
            if (this.checkAndChangeQuantity(shopObject, 1)) return;

            this.cartContents.push({ ...shopObject, quantity: 1 });
            this.listContainerElement.appendChild(
                this.createCartElement(shopObject)
            );
        };
    }

    const getData = async (): Promise<TShopList> => {
        const response = await fetch('./data.json', {
            method: 'GET',
        });
        return await response.json();
    };

    const appendData = (shopList: Array<TShopObject>, cart: Cart) => {
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
                confetti(buttonElement);
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
        const cart = new Cart(cartDiv!, cartToggleButton!);
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
