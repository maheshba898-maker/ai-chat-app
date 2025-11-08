import React from "react";
import Drive from "./components/Drive";
import Chat from "./components/Chat";

export default function App(){
  return(
    <div className="app-root">
      <header className="topbar">
        <div className="brand">
          <div className="logo">☁</div>
          <div className="brand-text">
            <h1>CloudDrive . ChatAI</h1>
            <p className="sub">MERN . Modern . Fast - Copy & Run</p>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="cards">
          <Drive />
          <Chat />
        </div>

        <footer className="footer">
          <small>
            Built with ❤ by you - make changes, improvem ship. Run server on <code>
               :5000
            </code> and client <code>:5173</code>
          </small>
        </footer>
      </main>
    </div>
  );
}