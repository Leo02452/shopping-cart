const fetchItem = async (id) => {
  const url = `https://api.mercadolibre.com/items/${id}`;
  const result = await fetch(url);
  const data = await result.json();

  return data;
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchItem,
  };
}
