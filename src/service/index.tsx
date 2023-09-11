import { backendRoutes } from "../routes";
import { Api } from "./api";
import { LoginProps, User } from "../types/Users";
import { RegisterProps } from "../types/Users";
import { Piu } from "../types/Pius";

interface PostsLikes {
  handle: string | undefined;
  postsRoute: string;
}

export async function Login({ handle, password }: LoginProps) {
  try {
    const response = await Api.post(backendRoutes.login, {
      handle,
      password,
    });
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function Register({ name, handle, password }: RegisterProps) {
  try {
    const response = await Api.post(backendRoutes.signup, {
      name,
      handle,
      password,
    });
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getUser(handle: string | undefined) {
  const tokenUser = localStorage.getItem("token");
  try {
    const response = await Api.get(`users/${handle}`, {
      headers: { Authorization: `Bearer ${tokenUser}` },
    });
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error);
  }
}

interface Params {
    page: number,
    perPage: number
}

export async function getPius({page = 1, perPage}: Params) {
  const tokenUser = localStorage.getItem("token");
  try {
    const response = await Api.get(backendRoutes.pius, {
      params: { page, perPage },
      headers: { Authorization: `Bearer ${tokenUser}` },
    });
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getSinglePiu(id: string | undefined) {
  const tokenUser = localStorage.getItem("token");
  try {
    const response = await Api.get<Piu>(backendRoutes.singlePiupiu.post(id), {
      headers: { Authorization: `Bearer ${tokenUser}` },
    });
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getPiuReplies(id: string | undefined) {
  const tokenUser = localStorage.getItem("token");
  try {
    const response = await Api.get(backendRoutes.singlePiupiu.replies(id), {
      headers: { Authorization: `Bearer ${tokenUser}` },
    });
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getPosts({ handle, postsRoute }: PostsLikes) {
  const tokenUser = localStorage.getItem("token");
  try {
    const response = await Api.get(
      postsRoute === "posts"
        ? `users/${handle}/posts`
        : `users/${handle}/likes`,
      {
        headers: { Authorization: `Bearer ${tokenUser}` },
      }
    );
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getLatestUsers() {
  const tokenUser = localStorage.getItem("token");
  try {
    const response = await Api.get(`users/latest`, {
      headers: { Authorization: `Bearer ${tokenUser}` },
    });
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function postLikes(postId: string | undefined) {
  const tokenUser = localStorage.getItem("token");

  try {
    const response = await Api.post(backendRoutes.singlePiupiu.like(postId), {
      headers: { Authorization: `Bearer ${tokenUser}` },
    });
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteLikes(postId: string | undefined) {
  const tokenUser = localStorage.getItem("token");

  try {
    const response = await Api.delete(backendRoutes.singlePiupiu.like(postId), {
      headers: { Authorization: `Bearer ${tokenUser}` },
    });
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function postPiuReply(message: string, id: string | undefined) {
  const tokenUser = localStorage.getItem("token");

  try {
    const response = await Api.post(
      backendRoutes.singlePiupiu.reply(id),
      { message },
      {
        headers: { Authorization: `Bearer ${tokenUser}` },
      }
    );
    const { data } = response;
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function postPiu(mensagem: string | undefined) {
  const tokenUser = localStorage.getItem("token");

  try {
    await Api.post(
      backendRoutes.posts,
      { message: mensagem },
      {
        headers: { Authorization: `Bearer ${tokenUser}` },
      }
    );
  } catch (error) {
    console.log(error);
  }
}

export async function updateUser(
  handle: string | undefined,
  userData: Partial<User>
) {
  const tokenUser = localStorage.getItem("token");
  try {
    await Api.patch(backendRoutes.profile(handle), userData, {
      headers: { Authorization: `Bearer ${tokenUser}` },
    });
  } catch (error) {
    console.log(error);
  }
}
