import React, { ChangeEvent, useState } from "react";
import Link from "next/link";
import classNames from "classnames";
import { Input, NoAccount, Spinner } from "components";
import { useAuth } from "context";
import { LockIcon } from "components/icons";

interface LoginState {
  username: string;
  password: string;
}

export default function Login() {
  const { login, loading } = useAuth();
  const [state, setState] = useState<LoginState>({
    username: "",
    password: "",
  });

  const { username, password } = state;

  const handleChange = (key: keyof LoginState) => (
    event: ChangeEvent<HTMLInputElement>
  ) => setState({ ...state, [key]: event.target.value });

  const handleLogin = () => login(username, password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full py-12 px-6">
        <img
          className="mx-auto h-32 w-auto"
          src="/assets/logo_lippia_final_color.png"
          alt="lippia"
        />
        <p className="mt-6 text-sm leading-5 text-center text-gray-900">
          Lippia Report Server
        </p>
        <div className="mt-5">
          <div className="rounded-md shadow-sm">
            <div>
              <Input
                aria-label="Usuario"
                name="email"
                type="email"
                value={username}
                className={classNames("rounded-t-md")}
                placeholder="Usuario"
                onChange={handleChange("username")}
              />
            </div>
            <div className="-mt-px relative">
              <Input
                aria-label="Contraseña"
                name="password"
                type="password"
                value={password}
                className={classNames("rounded-b-md")}
                placeholder="Contraseña"
                onChange={handleChange("password")}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                <Link href="/recover-password">
                  <a className="text-gray-900 underline">
                    Olvidaste tu contraseña?
                  </a>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <button
              className="relative block w-full py-2 px-3 border border-transparent rounded-md text-white font-semibold bg-gray-800 hover:bg-gray-700 focus:bg-gray-900 focus:outline-none focus:shadow-outline sm:text-sm sm:leading-5"
              onClick={handleLogin}
            >
              <span className="absolute left-0 inset-y pl-3">
                <div className="h-5 w-5 text-gray-500">
                  {loading  ? <Spinner /> : <LockIcon />}
                </div>
              </span>
              Iniciar sesion
            </button>
          </div>
        </div>
        <NoAccount />
      </div>
    </div>
  );
}
