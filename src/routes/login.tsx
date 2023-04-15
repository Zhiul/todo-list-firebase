import { useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

import TodolistIcon from "../assets/todo-list-icon.png";
import GoogleLogo from "../assets/google.png";
import TodolistHeroImage from "../assets/todo-sign-in-illustration.png";

import { signIn } from "../firebase/firebase";

import { PageProps } from "../App";

export function Login({
  userIsLoggedIn,
  loadingScreen,
  setShowLoadingScreen,
}: PageProps) {
  const navigate = useNavigate();

  useLayoutEffect(() => {
    setShowLoadingScreen(true);

    setTimeout(() => {
      setShowLoadingScreen(false);
    }, 300);
  }, []);

  useEffect(() => {
    if (userIsLoggedIn === true) navigate("/app/inbox");
  }, [userIsLoggedIn]);

  return (
    <>
      {loadingScreen}
      <div className="login-wrapper">
        <header className="login-header">
          <div className="logo">
            <img src={TodolistIcon} alt="" />
            <h1>todo</h1>
          </div>
        </header>

        <main className="login-section">
          <div>
            <h2>Log in</h2>

            <button className="login-cta" onClick={signIn}>
              <img src={GoogleLogo} alt="" />
              <span className="login-cta-text">Continue with Google</span>
            </button>
          </div>

          <div className="login-section-image-wrapper">
            <img
              src={TodolistHeroImage}
              alt=""
              className="login-section-image"
            />
          </div>
        </main>
      </div>
    </>
  );
}
