import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { NewPiupiu } from "../components/NewPiupiu";
import { Piu } from "../types/Pius";
import NavTitle from "../components/NavTitle";
import { PiupiuList } from "../components/PiupiuList";
import { usePagination } from "../hooks/useScroll";
import { piuComponentHeight } from "../consts";
import { User } from "../types/Users";
import { routes } from "../routes";
import { getPius, postPiu } from "../service";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Home = () => {
  const { user } = useAuth();
  const [textValue, setTextValue] = useState("");
  const [piupius, setPiupius] = useState<Piu[]>([]);
  const [newData, setNewData] = useState<Piu[] | undefined>();
  const [addingPiupiu, setAddingPiupiu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  const topRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const itemsPerPage = Math.ceil(window.screen.height / piuComponentHeight);

  const { scrollTop } = usePagination({
    onBottomEnter: () => {},
    onTopEnter: () => {},
    onTopLeave: () => {},
    bottomRef,
    topRef,
    refreshVariable: piupius,
  });

  const postNewPiu = async (e: React.FormEvent, formValue?: string) => {
    e.preventDefault();
    setAddingPiupiu(true);
    console.log('enviando', formValue)
   await postPiu(formValue as string)
  
      .then(() => {
        setTextValue("");
      })
      .finally(() => {
        setAddingPiupiu(false);
      });
  };

  const getPostsTimeline = async () => {
    const response = await getPius();
    console.log(response.data)
    setPiupius([...piupius, ...response.data])
    setIsLoading(false);
  }

  useEffect(() => {
    getPostsTimeline()
  }, []);


  return (
    <div ref={topRef} className="relative">
      <NavTitle
        position="sticky"
        navOptions={[
          { title: "Para você", path: routes.home },
          { title: "Perseguindo", path: routes.following },
        ]}
        refreshButton={{
          newPosts: newData,
          onClick: () => {
            scrollTop();
          },
        }}
      >
        <h2 className="text-xl font-bold px-4 py-3 ">Casa</h2>
      </NavTitle>
      <NewPiupiu
        loading={addingPiupiu}
        value={textValue}
        onChange={(e) => setTextValue(e.target.value)}
        onSubmit={postNewPiu}
        user={user as User}
      />
      <PiupiuList
        initialLoading={false}
        topRef={topRef}
        bottomRef={bottomRef}
        loading={isLoading}
        piupius={piupius}
        onChange={() => {}}
      />
    </div>
  );
};
