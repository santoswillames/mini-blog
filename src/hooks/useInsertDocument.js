import { useState, useEffect, useReducer } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const initialState = {
  loading: null,
  error: null,
};

const insertReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null };
    case "INSERTED_DOC":
      return { loading: false, error: null };
    case "ERROR":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const useInsertDocument = (docCollection) => {
  const [response, dispatch] = useReducer(insertReducer, initialState);

  //deal with memory leak
  const [cancelled, setCancelled] = useState(false);

  const checkCancelBeforeDispatch = (action) => {
    if (!cancelled) {
      dispatch(action);
    }
  };

  // Função que inseri o Post
  const insertDocument = async (document) => {
    setCancelled(false);

    checkCancelBeforeDispatch({
      type: "LOADING",
    });

    try {
      //Pegando o documento que vai ser inserido, usando o spread operator
      const newDocument = { ...document, createdAt: Timestamp.now() };

      //Função com o resultado da inserção
      const insertedDocument = await addDoc(
        //Faz a procurada coleção no db e se retornar true faz a inserção
        collection(db, docCollection),
        newDocument
      );

      //Como temos uma ação no sistema acontecendo temos que dar o dispatch
      checkCancelBeforeDispatch({
        type: "INSERTED_DOC",
        payload: insertedDocument,
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
    insertDocument,
    response,
  };
};
