// selecting root and rendering element

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);

const url =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";

// app-start

function App() {
  const { data, isLoading, isError } = useFetch(url);
  const [sortInputs, setSortInputs] = React.useState({
    searchInput: "",
    sortByMktCap: false,
    sortByPercentage: false,
  });
  const filteredData = filterData(data, sortInputs);
  return (
    <>
      <Header {...{ sortInputs, setSortInputs }} />
      <Main {...{ filteredData, isLoading, isError }} />
    </>
  );
}

// app-end

//*************************************************************** */

// header-start

function Header(props) {
  const { sortInputs, setSortInputs } = props;
  const { searchInput, sortByMktCap, sortByPercentage } = sortInputs;

  return (
    <header>
      <input
        id="searchInput"
        value={searchInput}
        onChange={(e) => handleInput(e.target.id, e.target.value, props)}
        type="text"
        placeholder="Search By Name or Symbol"
      />
      <button
        className={sortByMktCap ? "active" : ""}
        id="sortByMktCap"
        onClick={(e) => handleInput(e.target.id, !sortByMktCap, props)}
      >
        Sort By Mkt Cap
      </button>
      <button
        className={sortByPercentage ? "active" : ""}
        id="sortByPercentage"
        onClick={(e) => handleInput(e.target.id, !sortByPercentage, props)}
      >
        Sort by percentage
      </button>
    </header>
  );
}

const handleInput = (id, value, { setSortInputs }) => {
  if (id === "searchInput") setSortInputs((prev) => ({ ...prev, [id]: value }));
  if (id === "sortByMktCap")
    setSortInputs((prev) => ({
      ...prev,
      [id]: value,
      sortByPercentage: false,
    }));
  if (id === "sortByPercentage")
    setSortInputs((prev) => ({ ...prev, [id]: value, sortByMktCap: false }));
};

// header-end

//***************************************************************** */

//Main-start

function Main(props) {
  const { filteredData, isLoading, isError } = props;

  return (
    <main>
      <Message {...{ isError, isLoading }} />
      <table>
        <tbody>
          {filteredData.map((ele) => (
            <TableData key={ele.id} {...{ ele }} />
          ))}
        </tbody>
      </table>
    </main>
  );
}

const Message = ({ isLoading, isError }) => {
  if (isLoading) {
    return (
      <div className="msg">
        <h1>Loading...</h1>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="msg">
        <h1>Error in fetching data...</h1>
      </div>
    );
  }
  return null;
};

const TableData = ({ ele }) => {
  const {
    name,
    symbol,
    current_price,
    fully_diluted_valuation,
    price_change_percentage_24h: percentage,
    market_cap,
    id,
    image,
  } = ele;

  const valuation = getFormatedPrice(fully_diluted_valuation);
  const marketCap = getFormatedPrice(market_cap);

  return (
    <tr key={id}>
      <td style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <img
          style={{ height: "30px", width: "30px" }}
          src={image}
          alt="coin-img"
        />
        <span>{name}</span>
      </td>
      <td>{symbol.toUpperCase()}</td>
      <td>${current_price}</td>
      <td>${valuation}</td>
      <td style={{ color: `${percentage > 0 ? "green" : "red"}` }}>
        {percentage.toFixed(2)}%
      </td>
      <td>Mkt Cap: ${marketCap}</td>
    </tr>
  );
};

const getFormatedPrice = (price) => {
  return new Intl.NumberFormat().format(price);
};

//Main-end
