import React from "react";

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-green-600 text-white px-6 py-3 shadow-md">
      <div className="flex items-center gap-3">
        <img
          src="/logo.svg"
          alt="Logo"
          className="h-10 w-10"
        />
        <h1 className="text-xl font-bold tracking-wide">
          سیستم مدیریتی ترینری شفاخانه چشم نور
        </h1>
      </div>
    </header>
  );
};

export default Header;
