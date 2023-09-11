import { useState } from "react";
import { NavHeader } from "../components/NavHeader";
import NavTitle from "../components/NavTitle";
import ProfilePic from "../components/ProfilePic";
import { Username } from "../components/Username";
import { User } from "../types/Users";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { BsFillPencilFill } from "react-icons/bs";
import { ProfileEditForm } from "../components/ProfileEditForm";
import { Dialog } from "../components/Dialog";
import { routes } from "../routes";
import { getUser, updateUser } from "../service";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";

export const ProfileLayout = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { handle } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDialogClick = () => {
    setDialogOpen(!dialogOpen);
  };

  const handleSubmit = async (userData: Partial<User>) => {
    try {
      await updateUser(handle, userData);
    } catch (error) {
      console.log(error);
      navigate("/home");
    }
  };


  const { data } = useQuery({
    queryKey: ["user", handle],
    queryFn: async () => await getUser(handle),
  });

  return (
    <>
      <NavHeader
        title={data?.user.name || ""}
        subtitle={`${data?.posts || 0} piadas`}
      />
      <NavTitle
        position="relative"
        navOptions={[
          { title: "Perfil", path: routes.profile(data?.user.handle) },
          { title: "Curtidas", path: routes.userLikes(data?.user.handle) },
        ]}
      >
        <section className="h-48 w-full bg-zinc-700" />
        <section className="relative mb-2 select-none px-3 w-full">
          <div className="min-h-[5rem] flex justify-end w-full">
            <div className="absolute -top-16 left-4 ">
              <ProfilePic
                border
                variant="reallyBig"
                userName={data?.user.name || ""}
                image={data?.user.image_url}
              />
            </div>

            {user?.handle === handle && (
              <div
                onClick={handleDialogClick}
                className="absolute cursor-pointer rounded-full bg-zinc-950 hover:bg-zinc-900 p-6 right-4 top-4"
              >
                <BsFillPencilFill />
              </div>
            )}

          </div>
          <div>
            <Username size="xl" variant="column" user={data?.user} />
            <p className="text-white mt-3 text-sm">{data?.user.description}</p>
          </div>
        </section>
      </NavTitle>
      <Outlet />
      {user?.handle === handle && (
        <Dialog
          onClose={() => {
            setDialogOpen(false);
          }}
          open={dialogOpen}
        >
          {data?.user && (
            <ProfileEditForm
              onSubmit={(data) => handleSubmit(data)}
              user={data?.user}
            />
          )}
        </Dialog>
      )}
    </>
  );
};
