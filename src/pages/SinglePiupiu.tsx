import { useCallback, useRef, useState } from "react";
import { CompletePiupiu } from "../components/CompletePiupiu";
import { NavHeader } from "../components/NavHeader";
import { Piu } from "../types/Pius";
import NewPiupiu from "../components/NewPiupiu";
import { PiupiuList } from "../components/PiupiuList";
import { User } from "../types/Users";
import { getPiuReplies, getSinglePiu, postLikes, postPiuReply } from "../service";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

export const SinglePiupiu = () => {
  const [liked, setLiked] = useState(false);
  const [userReply, setuserReply] = useState("");
  const [replying, setReplying] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: post } = useQuery({
    queryKey: ["piu"],
    queryFn: async () => await getSinglePiu(id),
  });

  const { data: singlePiu, isLoading } = useQuery({
    queryKey: ["replies"],
    queryFn: async () => await getPiuReplies(id),
  });

  const getReplies = useCallback(async () => {}, []);

  const handleSubmit = async (e: React.FormEvent, replyText: string) => {
    console.log(e, replyText);
    await postPiuReply(replyText, id);
    // Precisa atualizar a pagina depois que posta
    navigate('home');
  };

  const handleLike = useCallback(async () => {
    postLikes(id);
  }, []);

  return (
    <>
      <NavHeader title="Post" />
      <CompletePiupiu
        author={post?.author}
        body={post?.mensagem || "--"}
        reactions={{
          reactions: {
            comment: {
              active: false,
              total: post?.replies?.total,
            },
            repiu: {
              active: false,
              total: 0,
            },
            like: {
              total: post?.likes?.total,
              active: liked,
              onClick: handleLike,
            },
          },
        }}
      />
      <NewPiupiu
        onChange={(e) => setuserReply(e.target.value)}
        onSubmit={handleSubmit}
        user={{} as User}
        variant="reply"
        value={userReply}
        loading={replying}
      />
      <PiupiuList
        piupius={singlePiu?.replies || []}
        onChange={getReplies}
        loading={isLoading}
      />
    </>
  );
};
