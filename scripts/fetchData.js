const fetchReducer = (state, { type, payload }) => {
  switch (type) {
    case "Success":
      return { data: [...payload], isLoading: false, isError: false };
    case "Error":
      return { data: [], isLoading: false, isError: true };
    case "Loading":
      return { data: [], isLoading: true, isError: false };
    default:
      return;
  }
};

function useFetchAsync_Then(url) {
  const [fetchState, dispatch] = React.useReducer(fetchReducer, {
    data: [],
    isLoading: true,
    isError: false,
  });

  React.useEffect(() => {
    dispatch({ type: "Loading" });
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const res = await fetch(url, {
          signal: controller.signal,
        });
        if (res.status === 200) return res.json();
        else return Promise.reject("err");
      } catch (err) {
        return Promise.reject(err);
      }
    };

    fetchData()
      .then((successData) => {
        dispatch({ type: "Success", payload: successData });
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        dispatch({ type: "Error" });
      });

    return () => controller.abort();
  }, [url]);

  return fetchState;
}
