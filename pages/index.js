import { useEffect, useState } from "react";

import styles from "../styles/Home.module.css";
import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { getSupabase } from "../utils/supabase";
import Link from "next/link";

const Index = withPageAuthRequired(({ user }) => {
  const [content, setContent] = useState("");
  const [todos, setTodos] = useState([]);

  const supabase = getSupabase(user.accessToken);

  useEffect(() => {
    const fetchTodos = async () => {
      const { data } = await supabase.from("todo").select("*");
      setTodos(data);
    };

    fetchTodos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resp = await supabase
      .from("todo")
      .insert({ content, user_id: user.sub });

    setTodos([...todos, resp.data[0]]);
    setContent("");
  };

  return (
    <div className={styles.container}>
      <p>
        Welcome {user.name}!{" "}
        <Link href="/api/auth/logout">
          <a>Logout</a>
        </Link>
      </p>
      <form onSubmit={handleSubmit}>
        <input onChange={(e) => setContent(e.target.value)} value={content} />
        <button>Add</button>
      </form>
      {todos?.length > 0 ? (
        todos.map((todo) => <p key={todo.id}>{todo.content}</p>)
      ) : (
        <p>You have completed all todos!</p>
      )}
    </div>
  );
});

// export const getServerSideProps = withPageAuthRequired({
//   async getServerSideProps({ req, res }) {
//     const {
//       user: { accessToken },
//     } = await getSession(req, res);

//     const supabase = getSupabase(accessToken);

//     const select = await supabase.from("todo").select("*");

//     console.log({ accessToken, select });

//     return {
//       props: { todos: select.data?.todos ?? [] },
//     };
//   },
// });

export default Index;
