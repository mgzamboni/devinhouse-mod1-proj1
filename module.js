/*
    Pega ItemList do localStorage
    Retorna um array contendo os elementos armazenados no localStorage
    Se não houver nenhum elemento armazenado, retorna um array vazio
*/
export function getLocalStorageArr(keyValue) {

    if(localStorage.getItem(keyValue) != null) {
        let localItems = JSON.parse(localStorage.getItem(keyValue));
        return localItems;
    }
    return [];
}

/*
    Adiciona o dado inputado ao array de dados armazenados no LocalStorage;
    Retorna o array que foi armazenado no localStorage
*/
function addInputItem() {

    let arrayItemList = getLocalStorageArr("itemsList");
    arrayItemList.push(document.querySelector("#itemInput").value);
    return arrayItemList;

}

/*
    Adiciona um elemento ao array armazenado no localStorage contendo os status das checkbox de cada item
    Todo status adicionado recebe o valor '0' por padrão;
    retorna o novo array armazenado no localStorage;
*/
function addItemStatus() {

    let arrayItemStatus = getLocalStorageArr("itemStatus");
    arrayItemStatus.push('0');
    return arrayItemStatus;
}

/*
    Converte um array para string e salva no localStorage com uma key fornecida (keyValue)
*/
function saveInLocalStorage(keyValue, arrayItemList) {

    localStorage.setItem(keyValue, JSON.stringify(arrayItemList));

}

/*
    Função que atualiza o id do node de acordo com seu indice no localStorage
*/
function updateItemNodeId() {

    for(let i = 0; i < document.getElementById("itemList").children.length; i++) {
        document.getElementById("itemList").children[i].id = `item${i}`;
    }

}

/*
    Função que retorna o indice do node filho "item" que está contido na lista de itens "itemList"
*/
function getItemNodeIndex(node) {

    for(let i = 0; i < node.parentNode.parentNode.children.length; i++) {
        if(node.parentNode.parentNode.children[i] == node.parentNode) {
            return i;
        }
    }
    return -1;

}

/*
    Função que cria um elemento para indicar que há lista não contém itens salvos;
*/
function createNoItem() {

    let item = document.createElement("p");
    item.setAttribute("class", "noItem");
    item.innerHTML = "A lista está vazia!";
    document.getElementById("itemList").appendChild(item);

}

/*
    Cria a div que ira comportar os elementos de um item
*/
function createDivElement(keyValue) {

    let item = document.createElement("div");
    item.setAttribute("id", keyValue);
    item.setAttribute("class", "itemDiv");
    document.getElementById("itemList").appendChild(item);

}

/*
    Cria o elemento checkbox
*/
function createCheckboxElement(keyValue) {

    let itemStatusList = getLocalStorageArr("itemStatus");
    let itemCheckbox = document.createElement("input");
    itemCheckbox.setAttribute("type", "checkbox");
    itemCheckbox.onclick = function() {
        let statusChange = getLocalStorageArr("itemStatus");
        if(itemCheckbox.checked == true) {
            statusChange[getItemNodeIndex(this)] = '1';
            saveInLocalStorage('itemStatus', statusChange);
            document.getElementById(keyValue).getElementsByClassName("itemText")[0].style.textDecoration = "line-through";
        } 
        else {
            statusChange[getItemNodeIndex(this)] = '0';
            saveInLocalStorage('itemStatus', statusChange);
            document.getElementById(keyValue).getElementsByClassName("itemText")[0].style.textDecoration = "none";
        }

    }
    if(itemStatusList[parseInt(keyValue.replace('item', ''))] == 0) {
        itemCheckbox.checked = false;
    } 
    else {
        itemCheckbox.checked = true;
    }
    document.getElementById(keyValue).appendChild(itemCheckbox);

}

/*
    Cria o elemento de texto do item
*/
function createTextElement(keyValue, keyItem) {

    let itemStatus = getLocalStorageArr("itemStatus");
    let itemText = document.createElement("p");
    itemText.setAttribute("class", "itemText");
    if(itemStatus[parseInt(keyValue.replace('item', ''))] == 0) {
        itemText.innerHTML = keyItem;
    } 
    else {
        itemText.innerHTML = keyItem.strike();
    }
    document.getElementById(keyValue).appendChild(itemText);

}

/*
    Cria o botão utilizado para excluir um item especifico da lista de itens
*/
    function createRemoveBtnElement(keyValue) {
    
    let itemRemove = document.createElement("button");
    itemRemove.setAttribute("class", "removeBttn");
    itemRemove.type = "button";
    //itemRemove.innerHTML = "x";
    itemRemove.innerHTML = "<img src='img/bin-icon.jpg' height='20px' width ='20px' alt='Remove'>";
    itemRemove.onclick = function() {
        let confirmRemove = confirm("ATENÇÃO! O item selecionado será excluído, deseja continuar?");
        if(confirmRemove) {
            let itemsList = getLocalStorageArr("itemsList");
            let itemStatus = getLocalStorageArr("itemStatus");
            itemsList.splice(getItemNodeIndex(this), 1);
            itemStatus.splice(getItemNodeIndex(this), 1);
            saveInLocalStorage('itemsList', itemsList);
            saveInLocalStorage('itemStatus', itemStatus);
            document.getElementById("itemList").removeChild(this.parentNode);
            updateItemNodeId();
            if(document.getElementById("itemList").children.length == 0) {
                createNoItem();
            }
        } else {
            alert("Ação cancelada!")
        }
    }
    document.getElementById(keyValue).appendChild(itemRemove) 
}

/*
    Função utilizada para criar a lista de itens a partir de um array passado como parâmetro. 
*/
export function createItemListHTML(arr) {

    if (arr.length == 0) {
        createNoItem();
    } 
    else {
        if(document.querySelector(".noItem") != null) {
            document.querySelector(".noItem").remove()
        }
        for(let i = 0; i < arr.length; i++) {
            if(document.getElementById(`item${i}`) == null) {
                //div
                createDivElement(`item${i}`);
                //checkbox
                createCheckboxElement(`item${i}`);
                //text
                createTextElement(`item${i}`, arr[i]);
                //remove button
                createRemoveBtnElement(`item${i}`);
            }
        }
    }

}

/*
    Função auxiliar utilizada para adicionar um novo item a lista de items com base no input do usuário.
    Utiliza a funcao saveInLocalStorage para adicionar o item inserido pelo usuário e seu status ao localStorage;
    Em seguida obtem o um array com base nos dados armazenados no localStorage e gera o HTML equivalente
*/
export function addItem() {

    if(document.querySelector("#itemInput").value != '') {
        saveInLocalStorage("itemsList", addInputItem());
        saveInLocalStorage("itemStatus", addItemStatus());
        createItemListHTML(getLocalStorageArr("itemsList"));
    } 
    else {
        alert("Adicione uma descrição a tarefa!");
    }
}

