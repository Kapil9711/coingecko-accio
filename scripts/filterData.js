const filterData = (data, sortInputs) => {
  const { searchInput, sortByMktCap, sortByPercentage } = sortInputs;

  let filteredData = data.filter((ele) => {
    if (ele.name.toLowerCase().includes(searchInput.toLowerCase())) return true;
    if (ele.symbol.toLowerCase().includes(searchInput.toLowerCase()))
      return true;
    return false;
  });

  if (sortByMktCap)
    filteredData.sort((a, b) => Number(a.market_cap) - Number(b.market_cap));
  if (sortByPercentage)
    filteredData.sort(
      (a, b) =>
        Number(a.price_change_percentage_24h) -
        Number(b.price_change_percentage_24h)
    );
  return filteredData;
};
