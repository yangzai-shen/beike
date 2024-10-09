// popup.js

document.addEventListener('DOMContentLoaded', () => {
    const listElement = document.getElementById('houseList');
    const clearButton = document.getElementById('clearButton');
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');
    const itemsPerPage = 20;
    let currentPage = 0;

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
          <p class="house-price">${house.price}</p>
          <button class="remove-button" data-code="${house.code}">移除</button>
        </div>
      `;
            listElement.appendChild(li);
        });

        prevPageButton.disabled = page === 0;
        nextPageButton.disabled = end >= houseList.length;
    };

    const loadUninterestedHouses = () => {
        chrome.storage.local.get({ uninterestedHouses: [] }, (result) => {
            const houseList = result.uninterestedHouses;
            renderList(houseList, currentPage);
        });
    };

    listElement.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-button')) {
            const houseCode = event.target.getAttribute('data-code');
            chrome.storage.local.get({ uninterestedHouses: [] }, (result) => {
                const houseList = result.uninterestedHouses.filter(house => house.code !== houseCode);
                chrome.storage.local.set({ uninterestedHouses: houseList }, () => {
                    loadUninterestedHouses();
                });
            });
        }
    });

    clearButton.onclick = () => {
        chrome.storage.local.set({ uninterestedHouses: [] }, () => {
            listElement.innerHTML = '';
        });
    };

    prevPageButton.onclick = () => {
        if (currentPage > 0) {
            currentPage--;
            loadUninterestedHouses();
        }
    };

    nextPageButton.onclick = () => {
        currentPage++;
        loadUninterestedHouses();
    };

    loadUninterestedHouses();
});
