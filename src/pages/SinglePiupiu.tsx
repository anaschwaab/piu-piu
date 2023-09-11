import { useCallback, useEffect, useState } from "react";
import { CompletePiupiu } from "../components/CompletePiupiu";
import { NavHeader } from "../components/NavHeader";
import { Piu } from "../types/Pius";
import NewPiupiu from "../components/NewPiupiu";
import { PiupiuList } from "../components/PiupiuList";
import { User } from "../types/Users";
import { getPiuReplies, getSinglePiu, postPiuReply } from "../service";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "../service/queryClient";

export const SinglePiupiu = () => {
  const [liked, setLiked] = useState(false);
  const [userReply, setuserReply] = useState("");
  const [replying, setReplying] = useState(false);
  const { id } = useParams();
  const [post, setPost] = useState<Piu>();

  const { data } = useQuery({
    queryKey: ["piu"],
    queryFn: async () => await getSinglePiu(id),
  });

  const { data: replies, isLoading } = useQuery({
    queryKey: ["replies"],
    queryFn: async () => await getPiuReplies(id),
  });

  const getReplies = useCallback(async () => {}, []);

  const { mutate } = useMutation({
    mutationFn: async(replyText: string) => await postPiuReply(replyText, id),
    onSuccess: () => queryClient.invalidateQueries(['replies'])
  })

  const handleSubmit = async (e: React.FormEvent, replyText: string) => {
    console.log(e, replyText);
    mutate(replyText);
    setuserReply("");
    setReplying(false);
  };

  const handleLike = useCallback(async () => {
    setLiked(true);
  }, []);

  useEffect(() => {
    data && setPost(data)
    console.log(data);
  }, [data])

  return (
    <>
      <NavHeader title="Post" />
      <CompletePiupiu
        author={post?.author}
        body={post?.message || ""}
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
        piupius={replies?.replies || []}
        onChange={getReplies}
        loading={isLoading}
      />
    </>
  );
};
