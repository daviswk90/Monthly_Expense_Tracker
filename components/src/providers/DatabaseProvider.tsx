import React from "react";
import { initDatabase } from "../lib/db/sqlite";
import * as Categories from "../lib/data/categories";
import * as Transactions from "../lib/data/transactions";

type API = {
  categories: typeof Categories;
  transactions: typeof Transactions;
};

export const DatabaseContext = React.createContext<{
  ready: boolean;
  api: API;
} | null>(null);

export default function DatabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      await initDatabase();
      if (alive) setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const api: API = React.useMemo(
    () => ({
      categories: Categories,
      transactions: Transactions,
    }),
    []
  );

  return (
    <DatabaseContext.Provider value={{ ready, api }}>
      {children}
    </DatabaseContext.Provider>
  );
}
