import { StoreonModule } from "storeon";
import { State as S, Events as E } from "lib/store";
import set from "lodash.set";

export type State = {
  user: any;
  token?: string;
}

const loginEndpoint = "http://localhost:5000/api/v1.0/login";
const newUserEndpoint = "http://localhost:5000/api/v1.0/new_user";

export type Events = {
  "auth.signin": {
    email: string;
    password: string;
  },
  "auth.signin.success": {
    token: string;
  },
  "auth.signin.error": {
    error: string;
  }
}

export const module: StoreonModule<S, E> = (store) => {
  store.on("@init", () => ({
    user: null,
  }));

  store.on("auth.signin", (state, { email, password }) => {
    fetch(loginEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }).then((res) => {
      if (res.status === 200 || res.status === 201) {
        res.json().then((data) => {
          store.dispatch("auth.signin.success", {
            token: data,
          });
        });
      } else {
        store.dispatch("auth.signin.error", {
          error: "Invalid email or password",
        });
      }
    }).catch((err) => {
      store.dispatch("auth.signin.error", {
        error: err.message,
      });
    });
    return set(state, "user", { email, password });
  });
  
  store.on("auth.signin.success", (state, { token }) => {
    return set(state, "token", token);
  });
}