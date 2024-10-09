document.querySelectorAll('.sellListContent li.clear').forEach(item => {
    const houseCode = item.querySelector('.title a').href;
    const houseName = item.querySelector('.title a').textContent.trim();
    const housePrice = item.querySelector('.totalPrice span').textContent.trim() + ' 万';
    const houseImageElement = item.querySelector('img.lj-lazy');

    const houseImage = houseImageElement ? houseImageElement.src : '';

    if (!item.querySelector('.uninterested-button')) {
        const button = document.createElement('button');
        button.innerText = '不感兴趣';
        button.classList.add('uninterested-button');
        button.style.position = 'absolute';
        button.style.right = '10px';
        button.style.bottom = '10px';
        button.style.padding = '8px 12px';
        button.style.backgroundColor = '#f44336';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
        button.style.cursor = 'pointer';
        button.style.zIndex = '1000';

        button.onclick = () => {
            chrome.storage.local.get({ uninterestedSecondHandHouses: [] }, (result) => {
                let uninterestedList = result.uninterestedSecondHandHouses;
                if (!uninterestedList.some(house => house.code === houseCode)) {
                    uninterestedList.push({
                        code: houseCode,
                        name: houseName,
                        price: housePrice,
                        image: houseImage
                    });
                    chrome.storage.local.set({ uninterestedSecondHandHouses: uninterestedList });
                }
            });

            item.style.display = 'none';
        };

        item.style.position = 'relative';
        item.appendChild(button);
    }
});

document.querySelectorAll('.content__list--item').forEach(item => {
    const houseCode = item.getAttribute('data-house_code');
    const houseName = item.querySelector('.content__list--item--title a').textContent.trim();
    const housePrice = item.querySelector('.content__list--item-price em').textContent.trim() + ' 元/月';
    const houseImageElement = item.querySelector('.content__list--item--aside img.lazyloaded');

    const houseImage = houseImageElement ? houseImageElement.src : '';

    if (!item.querySelector('.uninterested-button')) {
        const button = document.createElement('button');
        button.innerText = '不感兴趣';
        button.classList.add('uninterested-button');
        button.style.position = 'absolute';
        button.style.right = '10px';
        button.style.bottom = '10px';
        button.style.padding = '8px 12px';
        button.style.backgroundColor = '#f44336';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
        button.style.cursor = 'pointer';
        button.style.zIndex = '1000';

        button.onclick = () => {
            chrome.storage.local.get({ uninterestedHouses: [] }, (result) => {
                let uninterestedList = result.uninterestedHouses;
                if (!uninterestedList.some(house => house.code === houseCode)) {
                    uninterestedList.push({
                        code: houseCode,
                        name: houseName,
                        price: housePrice,
                        image: houseImage
                    });
                    chrome.storage.local.set({ uninterestedHouses: uninterestedList });
                }
            });

            item.style.display = 'none';
        };

        item.style.position = 'relative';
        item.appendChild(button);
    }
});

window.onload = () => {
    chrome.storage.local.get({ uninterestedHouses: [] }, (result) => {
        const uninterestedList = result.uninterestedHouses;
        document.querySelectorAll('.content__list--item').forEach(item => {
            const houseCode = item.getAttribute('data-house_code');
            if (uninterestedList.some(house => house.code === houseCode)) {
                item.style.display = 'none';
            }
        });
    });

    chrome.storage.local.get({ uninterestedSecondHandHouses: [] }, (result) => {
        const uninterestedList = result.uninterestedSecondHandHouses;
        document.querySelectorAll('.sellListContent li.clear').forEach(item => {
            const houseCode = item.querySelector('.title a').href;
            if (uninterestedList.some(house => house.code === houseCode)) {
                item.style.display = 'none';
            }
        });
    });
};
