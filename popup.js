document.addEventListener('DOMContentLoaded', () => {
    const listElement = document.getElementById('houseList');
    const clearButton = document.getElementById('clearButton');
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');
    const rentTab = document.getElementById('rentTab');
    const buyTab = document.getElementById('buyTab');
    const pageInfo = document.getElementById('pageInfo');
    const itemsPerPage = 20;
    let currentPage = 0;
    let currentTab = 'rent';

    const renderList = (houseList, page) => {
        listElement.innerHTML = '';
        const start = page * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedList = houseList.slice(start, end);

        paginatedList.forEach(house => {
            const li = document.createElement('li');
            li.innerHTML = `
                <img src="${house.image}" alt="${house.name}" class="house-image">
                <div class="house-info">
                    <p class="house-name">${house.name}</p>
                    <p class="house-price">${house.price} 万</p>
                    <button class="remove-button" data-code="${house.code}">移除</button>
                </div>
            `;
            listElement.appendChild(li);
        });

        prevPageButton.disabled = page === 0;
        nextPageButton.disabled = end >= houseList.length;

        const totalPages = Math.ceil(houseList.length / itemsPerPage);
        pageInfo.innerText = `第 ${page + 1} 页 / 共 ${totalPages} 页`;
    };

    const loadUninterestedHouses = () => {
        const storageKey = currentTab === 'rent' ? 'uninterestedHouses' : 'uninterestedSecondHandHouses';
        chrome.storage.local.get({ [storageKey]: [] }, (result) => {
            const houseList = result[storageKey];
            renderList(houseList, currentPage);
        });
    };

    listElement.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-button')) {
            const houseCode = event.target.getAttribute('data-code');
            const storageKey = currentTab === 'rent' ? 'uninterestedHouses' : 'uninterestedSecondHandHouses';
            chrome.storage.local.get({ [storageKey]: [] }, (result) => {
                const houseList = result[storageKey].filter(house => house.code !== houseCode);
                chrome.storage.local.set({ [storageKey]: houseList }, () => {
                    loadUninterestedHouses();
                });
            });
        }
    });

    clearButton.onclick = () => {
        const storageKey = currentTab === 'rent' ? 'uninterestedHouses' : 'uninterestedSecondHandHouses';
        chrome.storage.local.set({ [storageKey]: [] }, () => {
            listElement.innerHTML = '';
            pageInfo.innerText = `第 1 页 / 共 1 页`;
        });
    };

    prevPageButton.onclick = () => {
        if (currentPage > 0) {
            currentPage--;
            loadUninterestedHouses();
        }
    };

    nextPageButton.onclick = () => {
        const storageKey = currentTab === 'rent' ? 'uninterestedHouses' : 'uninterestedSecondHandHouses';
        chrome.storage.local.get({ [storageKey]: [] }, (result) => {
            const houseList = result[storageKey];
            if ((currentPage + 1) * itemsPerPage < houseList.length) {
                currentPage++;
                loadUninterestedHouses();
            }
        });
    };

    rentTab.onclick = () => {
        currentTab = 'rent';
        currentPage = 0;
        rentTab.classList.add('active');
        buyTab.classList.remove('active');
        loadUninterestedHouses();
    };

    buyTab.onclick = () => {
        currentTab = 'buy';
        currentPage = 0;
        buyTab.classList.add('active');
        rentTab.classList.remove('active');
        loadUninterestedHouses();
    };

    loadUninterestedHouses();
});
