// selecting root and rendering element

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);
root.render(<Test />);

function Test() {
  const [isActives, setIsActives] = React.useState({
    then: true,
    await: false,
  });

  const handleClick = (e) => {
    const id = e.target.id;

    if (id === "then") {
      if (isActives.then) return;
      return setIsActives({ then: true, await: false });
    }
    if (isActives.await) return;
    setIsActives({ then: false, await: true });
  };
  return (
    <>
      <section className="test">
        <h1>Test : </h1>
        <button
          style={{ display: !isActives.then ? "none" : "initial" }}
          onClick={handleClick}
          className={isActives.then ? "active" : ""}
          id="then"
        >
          using-Then
        </button>
        <button
          onClick={handleClick}
          className={isActives.await ? "active" : ""}
          id="await"
        >
          Async/Await
        </button>
      </section>
      <App {...{ isActives }} />
    </>
  );
}

//*************************************************** */

const url =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";

// app-start

function App({ isActives }) {
  console.log("app rerendered");
  const { data, isLoading, isError } = (
    isActives.then ? useFetchUsingThen : useFetchAsyncAwait
  )(url, isActives);
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
      <Message {...{ isLoading, isError }} />
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
    total_volume,
    price_change_percentage_24h: percentage,
    market_cap,
    id,
    image,
  } = ele;

  const totalVolume = getFormatedPrice(total_volume);
  const marketCap = getFormatedPrice(market_cap);

  return (
    <tr key={id}>
      <td>
        <img src={image} alt="coin-img" />
        <span>{name}</span>
      </td>
      <td>{symbol.toUpperCase()}</td>
      <td>${current_price}</td>
      <td>${totalVolume}</td>
      <td style={{ color: `${percentage > 0 ? "green" : "red"}` }}>
        {percentage.toFixed(2)}%
      </td>
      <td>Mkt Cap : ${marketCap}</td>
    </tr>
  );
};

const getFormatedPrice = (price) => {
  return new Intl.NumberFormat().format(price);
};

//Main-end
