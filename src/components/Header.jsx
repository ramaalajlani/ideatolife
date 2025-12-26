import React, { useState, useEffect } from "react";
import {
  CubeTransparentIcon,
  UserCircleIcon,
  CodeBracketSquareIcon,
  Square3Stack3DIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  InboxArrowDownIcon,
  LifebuoyIcon,
  PowerIcon,
  RocketLaunchIcon,
  Bars2Icon,
} from "@heroicons/react/24/solid";

// profile menu component
const profileMenuItems = [
  {
    label: "My Profile",
    icon: UserCircleIcon,
  },
  {
    label: "Edit Profile",
    icon: Cog6ToothIcon,
  },
  {
    label: "Sign Out",
    icon: PowerIcon,
  },
];

function ProfileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto text-white hover:bg-gray-700 transition-colors"
      >
        <img
          src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
          alt="tania andrew"
          className="w-8 h-8 rounded-full border border-gray-500 p-0.5"
        />
        <ChevronDownIcon
          strokeWidth={2.5}
          className={`h-3 w-3 transition-transform ${
            isMenuOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-600 py-1 z-50">
          {profileMenuItems.map(({ label, icon: Icon }, key) => {
            const isLastItem = key === profileMenuItems.length - 1;
            return (
              <button
                key={label}
                onClick={closeMenu}
                className={`flex items-center gap-2 w-full px-3 py-2 text-sm ${
                  isLastItem
                    ? "text-red-400 hover:bg-red-800"
                    : "text-white hover:bg-gray-700"
                } transition-colors`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// nav list menu
const navListMenuItems = [
  {
    title: "HTML Components",
    description: "Learn how to use our HTML components packed with rich features.",
  },
  {
    title: "React Components",
    description: "Learn how to use our React components packed with rich features.",
  },
  {
    title: "PRO Version",
    description: "A complete set of UI Elements for building faster websites in less time.",
  },
];

function NavListMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderItems = navListMenuItems.map(({ title, description }) => (
    <a
      href="#"
      key={title}
      className="block px-3 py-2 hover:bg-gray-700 transition-colors rounded-lg"
    >
      <div className="mb-1">
        <h6 className="text-sm font-semibold text-white">{title}</h6>
        <p className="text-xs text-gray-300 font-normal">{description}</p>
      </div>
    </a>
  ));

  return (
    <div className="relative">
      {/* Desktop Version */}
      <div className="hidden lg:block">
        <button
          onMouseEnter={() => setIsMenuOpen(true)}
          onMouseLeave={() => setIsMenuOpen(false)}
          className="flex items-center gap-2 font-medium text-white rounded-full px-3 py-2 hover:bg-gray-700 transition-colors"
        >
          <Square3Stack3DIcon className="h-[18px] w-[18px] text-gray-300" />
          Pages
          <ChevronDownIcon
            strokeWidth={2}
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isMenuOpen && (
          <div
            onMouseEnter={() => setIsMenuOpen(true)}
            onMouseLeave={() => setIsMenuOpen(false)}
            className="absolute top-full left-0 w-[36rem] grid grid-cols-7 gap-3 bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-600 z-50"
          >
            <div className="col-span-3 grid h-full w-full place-items-center rounded-md bg-gradient-to-r from-blue-600 to-blue-700">
              <RocketLaunchIcon strokeWidth={1} className="h-28 w-28 text-white" />
            </div>
            <div className="col-span-4 flex w-full flex-col gap-1">
              {renderItems}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Version */}
      <div className="lg:hidden">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-2 font-medium text-white w-full px-3 py-2 hover:bg-gray-700 transition-colors rounded-lg"
        >
          <Square3Stack3DIcon className="h-[18px] w-[18px] text-gray-300" />
          Pages
        </button>
        {isMenuOpen && (
          <div className="ml-6 flex w-full flex-col gap-1 mt-1">
            {renderItems}
          </div>
        )}
      </div>
    </div>
  );
}

// nav list component
const navListItems = [
  // يمكنك إضافة عناصر هنا لاحقاً
];

function NavList() {
  return (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
      <li>
        <NavListMenu />
      </li>
      {navListItems.map(({ label, icon: Icon }) => (
        <li key={label}>
          <a
            href="#"
            className="flex items-center gap-2 font-medium text-gray-300 px-3 py-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            <Icon className="h-[18px] w-[18px]" />
            <span className="text-white">{label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function ComplexNavbar() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setIsNavOpen(false),
    );
    
    return () => {
      window.removeEventListener("resize", () => window.innerWidth >= 960 && setIsNavOpen(false));
    };
  }, []);

  return (
    <nav className="mx-auto max-w-screen-xl p-2 lg:rounded-full lg:pl-6 bg-gray-900 shadow-sm border border-gray-700">
      <div className="relative mx-auto flex items-center justify-between text-white">
        <a
          href="#"
          className="mr-4 ml-2 cursor-pointer py-1.5 font-medium italic text-xl font-sans"
        >
         Roadmap For My Idea
        </a>
        
        <div className="hidden lg:block">
          <NavList />
        </div>
        
        <button
          onClick={toggleIsNavOpen}
          className="ml-auto mr-2 lg:hidden p-2 text-gray-300 hover:bg-gray-700 rounded-full transition-colors"
        >
          <Bars2Icon className="h-6 w-6" />
        </button>

        <button className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-full transition-colors">
          {/* زر إضافي */}
        </button>
        
        <ProfileMenu />
      </div>
      
      {/* Mobile Navigation */}
      {isNavOpen && (
        <div className="lg:hidden mt-4 pb-4 border-t border-gray-700 pt-4 bg-gray-900">
          <NavList />
        </div>
      )}
    </nav>
  );
}

export default ComplexNavbar;