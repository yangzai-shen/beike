// content.js

document.querySelectorAll('.content__list--item').forEach(item => {
    const houseCode = item.getAttribute('data-house_code');
    const houseName = item.querySelector('.content__list--item--title a').textContent.trim();
    const housePrice = item.querySelector('.content__list--item-price em').textContent.trim() + ' 元/月';
    // 获取包含图片的元素
    const houseImageElement = item.querySelector('.content__list--item--aside img.lazyloaded');

    const houseImage = houseImageElement ? houseImageElement.src : '';
    console.log(houseImage);

    const button = document.createElement('button');
    button.innerText = '不感兴趣';
    button.style.marginLeft = '10px';
    button.style.padding = '5px';
    button.style.backgroundColor = '#f44336';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.cursor = 'pointer';

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

    item.querySelector('.content__list--item--main .content__list--item--title').appendChild(button);
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
};
