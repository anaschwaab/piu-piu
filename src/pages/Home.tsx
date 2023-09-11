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
import { useAuth } from "../context/AuthContext";
import { useMutation, useInfiniteQuery } from "@tanstack/react-query";
import queryClient from "../service/queryClient";

export const Home = () => {
  const { user } = useAuth();
  const [textValue, setTextValue] = useState("");
  const [piupius, setPiupius] = useState<Piu[]>([]);
  const [newData, setNewData] = useState<Piu[] | undefined>();
  const [addingPiupiu, setAddingPiupiu] = useState(false);

  const topRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const itemsPerPage = Math.ceil(window.screen.height / piuComponentHeight);

  const { scrollTop } = usePagination({
    onBottomEnter: () => {hasNextPage && fetchNextPage()},
    onTopEnter: () => {setNewData([])},
    onTopLeave: () => {},
    bottomRef,
    topRef,
    refreshVariable: piupius,
  });

  const {
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery(
    ["piu"],
    (params) => {
      return getPius({
        page: params.pageParam ? params.pageParam : 1,
        perPage: itemsPerPage,
    });
    
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.currentPage < allPages[0].totalPages) {
          return lastPage.currentPage + 1;
        }
        return undefined;
      },
      onSuccess: (response) => setPiupius(response?.pages.flatMap(page => page.data)),
      refetchInterval: 20000,
      structuralSharing(oldData, newData) {
        console.log(oldData, newData)
        if (oldData?.pages) {
          if (oldData?.pages[0] !== newData.pages[0]) {
            const difference = newData.pages[0].totalPius - oldData?.pages[0].totalPius;
            
            setNewData(newData.pages[0].data.slice(0, difference));
          }
        }
        return newData;
      },
    }
  );


  const { mutate } = useMutation({
    mutationFn: async(replyText: string) => await postPiu(replyText),
    onSuccess: () => queryClient.invalidateQueries(["piu"]) 
  })

  const postNewPiu = async (e: React.FormEvent, formValue: string) => {
    e.preventDefault();
    setAddingPiupiu(true);
    mutate(formValue);
    setTextValue("");
    setAddingPiupiu(false);
  };

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
        // key={}
        loading={addingPiupiu}
        value={textValue}
        onChange={(e) => setTextValue(e.target.value)}
        onSubmit={postNewPiu}
        user={user as User}
      />
      <PiupiuList
        initialLoading={isLoading}
        topRef={topRef}
        bottomRef={bottomRef}
        loading={true}
        piupius={piupius}
        onChange={() => {}}
      />
    </div>
  );
};
