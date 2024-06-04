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

function useFetch(url) {
  const [fetchState, dispatch] = React.useReducer(fetchReducer, {
    data: [],
    isLoading: true,
    isError: false,
  });

  React.useEffect(() => {
    dispatch({ type: "Loading" });
    const controller = new AbortController();
    const res = fetch(url, { signal: controller.signal });
    res
      .then((res) => {
        if (res.status === 200) return res.json();
        else return Promise.reject(res);
      })
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
