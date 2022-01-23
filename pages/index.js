import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
// import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import Link from "next/link";

import styles from "../styles/Home.module.css";
import { getSupabase } from "../utils/supabase";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <button onClick={() => loginWithRedirect()}>Log In</button>;
};

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button onClick={() => logout({ returnTo: window.location.origin })}>
      Log Out
    </button>
  );
};

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    )
  );
};

const Index = () => {
  const { user } = useAuth0();

  const [content, setContent] = useState("");
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const { data } = await getSupabase(user?.sub).from("todo").select("*");
      setTodos(data);
    };

    fetchTodos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resp = await getSupabase(user?.sub)
      .from("todo")
      .insert({ content, user_id: user.sub });

    setTodos([...todos, resp.data[0]]);
    setContent("");
  };

  return (
    <div className={styles.container}>
      <Profile />
      <LoginButton />
      <LogoutButton />
      {/* <Link href="/api/auth/logout">
          <a>Logout</a>
        </Link> */}
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
};

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
