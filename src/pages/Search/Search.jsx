import styles from "./Search.module.css";

//hooks
import { useFetchDocuments } from "../../hooks/useFetchDocuments";
import { useQuery } from "../../hooks/useQuery";

import { Link } from "react-router-dom";

//Components
import PostDetail from "../../components/Post/PostDetail";

const Search = () => {
  const query = useQuery();

  //Pegando valor do search, o metodo get é do proprio URLSearchParams pegamos o atributo cadastrado, no caso o q
  const search = query.get("q");

  const { documents: posts } = useFetchDocuments("posts", search);
  console.log(posts);

  return (
    <div className={styles.search_container}>
      <h2>Search</h2>
      <div>
        {posts === null && (
          <div className={styles.no_posts}>
            <p>Não foram encontrados posts a partir da sua busca...</p>
            <Link to="/" className="btn btn-dark">
              Voltar
            </Link>
          </div>
        )}
        {posts && posts.map((post) => <PostDetail key={post.id} post={post} />)}
      </div>
    </div>
  );
};

export default Search;
