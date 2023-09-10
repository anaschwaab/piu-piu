import { useQuery } from "@tanstack/react-query";
import { PiupiuList } from "../components/PiupiuList";
import { getPosts } from "../service";
import { useParams } from "react-router-dom";

type ProfileProps = {
  postsRoute: "posts" | "likes";
};
export const Profile = ({ postsRoute }: ProfileProps) => {
  const { handle } = useParams();
  console.log(postsRoute);

  const { data: piupius, isLoading } = useQuery({ 
    queryKey: ['piupius', postsRoute],
    queryFn: async() => await getPosts({ handle, postsRoute })
  });

  return (
    <>
      <main>
        <PiupiuList initialLoading={isLoading} piupius={piupius || []} />
      </main>
    </>
  );
};
