import { useEffect } from "react";
import { useRouter } from "next/router";

const withAuth = (WrappedComponent: any) => {
  return (props: any) => {
    const router = useRouter();

    useEffect(() => {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      if (!isLoggedIn || isLoggedIn !== "true") {
        router.replace("/login");
      }
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
