import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { User } from "../../types/Users";
import { ProfilePic } from "../ProfilePic";
import { ReactionsBar, reactions } from "../ReactionsBar";
import { Username } from "../Username";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import NewPiupiu from "../NewPiupiu";
import { forwardRef } from "react";
import { checkForImageLinks } from "../../helpers";
import { backendRoutes, routes } from "../../routes";
import { useAuth } from "../../context/AuthContext";
import { deleteLikes, postLikes } from "../../service";
// import { postPiu, postPiuReply } from "../../service";

type PiupiuProps = {
  id: string;
  author: User;
  body: string;
  onChange?: () => void;
  reactions: Record<
    (typeof reactions)[number],
    { active?: boolean; total?: number }
  >;
  onClick?: () => void;
};
export const Piupiu = forwardRef(
  ({ id, author, body, reactions, onChange, onClick }: PiupiuProps, ref) => {
    const [liked, setLiked] = useState(reactions.like?.active);
    const [likesTotal, setLikesTotal] = useState(reactions.like?.total || 0);
    const [replying, setReplying] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [replies, setReplies] = useState(reactions.comment.total || 0);
    const navigate = useNavigate();
    const replyRef = useRef<HTMLDivElement | null>(null);
    const debounceTimer = useRef<number | undefined>();
    const [foundLinks, setFoundLinks] = useState("");

    const { handle } = useParams();

    const { token } = useAuth()
    // axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

    const handleLike = useCallback(async () => {
      setLiked(!liked);
      clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(async () => {
        if (liked !== reactions.like?.active) return;
        try {
          if (!liked) {
            // await axios.post(backendRoutes.singlePiupiu.like(id));
            await postLikes(id, handle as string);
          } else {
            // await axios.delete(backendRoutes.singlePiupiu.like(id));
            await deleteLikes(id);
          }
        } catch (err) {
          setLiked(!liked);
          console.log(err);
        } finally {
          onChange?.();
        }
      }, 250);
    }, [id, liked, onChange, reactions.like, debounceTimer.current]);

    const handleSubmit = async (e: React.FormEvent, submitingText?: string) => {
      e.preventDefault();
      setReplying(true);
      try {
        await axios.post(`/posts/${id}/reply`, {
          message: submitingText,
        });
        setReplies(replies + 1);
        setReplyText("");
      } catch (err) {
        console.log(err);
      }
      onChange?.();
      setReplying(false);
    };

    const handleClick = () => {
      onClick ? onClick() : navigate(routes.singlePiupiu(id));
    };
    
    const reactionProps = useMemo(() => {
      return {
        comment: {
          total: replies,
          active: replying,
          onClick: () => setReplying(!replying),
        },
        repiu: { ...reactions.repiu },
        like: {
          total: likesTotal,
          replies,
          active: liked,
          onClick: () => handleLike(),
        },
      };
    }, [reactions, liked, likesTotal, handleLike, replying]);

    useEffect(() => {
      setLiked(reactions?.like?.active);
      setLikesTotal(reactions?.like?.total || 0);
      setReplies(reactions?.comment.total || 0);
    }, [reactions]);

    useEffect(() => {
      const closeOnClickOut = (e: MouseEvent) => {
        if (
          replying &&
          replyRef.current &&
          !e.composedPath().includes(replyRef.current)
        ) {
          setReplying(false);
        }
      };

      const handleEscKey = (event: KeyboardEvent) => {
        if (event.key === "Escape" && replying) {
          setReplying(false);
        }
      };

      window.addEventListener("mousedown", closeOnClickOut);
      window.addEventListener("keydown", handleEscKey);

      return () => {
        window.removeEventListener("mousedown", closeOnClickOut);
        window.removeEventListener("keydown", handleEscKey);
      };
    }, [replying]);

    return (
      <div ref={replyRef}>
        <div className="flex flex-col w-full">
          <article
            ref={ref as any}
            onClick={handleClick}
            className="flex cursor-pointer hover:bg-[rgba(255,255,255,0.03)] select-none border-t-0 w-full px-4 py-2 border-[#2f3336] border-[1px] "
          >
            <ProfilePic image={author.image_url} userName={author.name} />
            <div className="px-2 w-full">
              <Username user={author} />
              <main className="mt-1 break-words pr-8 text-left mb-1">
                {checkForImageLinks(body, (link) => {
                  !foundLinks && setFoundLinks(link);
                })}
                <img className="w-full my-2" src={foundLinks} />
              </main>
              <ReactionsBar reactions={reactionProps} />
            </div>
          </article>
        </div>
        {replying && (
          <NewPiupiu
            value={replyText}
            onSubmit={handleSubmit}
            onChange={(e) => setReplyText(e.target.value)}
            variant="reply"
            user={{} as User}
          />
        )}
      </div>
    );
  }
);

export default Piupiu;
