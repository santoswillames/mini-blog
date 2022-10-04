import { useState, useEffect, useReducer } from "react";
import { db } from "../firebase/config";
import { collection, doc, updateDoc } from "firebase/firestore";

const initialState = {
  loading: null,
  error: null,
};

const updateReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null };
    case "UPDATED_DOC":
      return { loading: false, error: null };
    case "ERROR":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const useUpdateDocument = (docCollection) => {
  const [response, dispatch] = useReducer(updateReducer, initialState);

  //deal with memory leak
  const [cancelled, setCancelled] = useState(false);

  const checkCancelBeforeDispatch = (action) => {
    if (!cancelled) {
      dispatch(action);
    }
  };

  // Função que inseri o Post
  const updateDocument = async (id, data) => {
    checkCancelBeforeDispatch({
      type: "LOADING",
    });

    try {
      const docRef = await doc(db, docCollection, id);

      const updatedDocument = await updateDoc(docRef, data);

      //Como temos uma ação no sistema acontecendo temos que dar o dispatch
      checkCancelBeforeDispatch({
        type: "UPDATED_DOC",
        payload: updatedDocument,
      });
    } catch (error) {
      checkCancelBeforeDispatch({
        type: "ERROR",
        payload: error.message,
      });
    }
  };

  useEffect(() => {
    //Encerrando o componente
    return () => setCancelled(true);
  }, []);

  return {
    updateDocument,
    response,
  };
};
