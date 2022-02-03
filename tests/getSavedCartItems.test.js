const localStorageSimulator = require('../mocks/localStorageSimulator');
const getSavedCartItems = require('../helpers/getSavedCartItems');

localStorageSimulator('getItem');

describe('4 - Teste a função getSavedCartItems', () => {
  it ('Teste se, ao executar getSavedCartItems, o método localStorage.getItem é chamado.', async () => {
    await getSavedCartItems();
    expect(localStorage.getItem).toHaveBeenCalled();
 });
  it (`Teste se, ao executar getSavedCartItems, o método localStorage.getItem é chamado com o 'cartItems' como parâmetro.`, async () => {
    await getSavedCartItems();
    expect(localStorage.getItem).toBeCalledWith('cartItems');
 });
});
