import { useLocation } from "react-router-dom";
import { useMemo } from "react";

export function useQuery() {
  const { search } = useLocation();

  //Só será excutada quando o search for alterado
  return useMemo(() => new URLSearchParams(search), [search]);
}
