import { useEffect } from "react";
import { useRouter } from "next/router";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect ke halaman login
    router.push("/login");
  }, [router]);

  return null; // Halaman ini tidak menampilkan apapun
};

export default Home;
