import { Menu, X } from "lucide-react";
import { useState } from "react";
import { navItems } from "../constants";

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-3 bg-black border-b border-neutral-800">
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
        
            <span className="text-xl font-bold text-white"></span>
          </div>

          <ul className="hidden lg:flex ml-14 space-x-12">
            {navItems.map((item, index) => (
              <li key={index}>
                <a href={item.href} className="text-white hover:text-orange-500 transition-colors">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          
          <div className="hidden lg:flex justify-center space-x-12 items-center">
            <a href="#" className="py-2 px-3 border border-gray-600 rounded-md text-white hover:bg-gray-800 transition-colors">
              Sign In
            </a>
            <a
              href="#"
              className="bg-gradient-to-r from-orange-500 to-orange-800 py-2 px-3 rounded-md text-white hover:from-orange-600 hover:to-orange-900 transition-colors"
            >
              Create an account
            </a>
          </div>
          
          <div className="lg:hidden md:flex flex-col justify-end">
            <button onClick={toggleNavbar} className="text-white">
              {mobileDrawerOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        
        {mobileDrawerOpen && (
          <div className="fixed top-16 left-0 right-0 z-20 bg-black w-full p-8 flex flex-col justify-center items-center lg:hidden border-t border-neutral-800">
            <ul>
              {navItems.map((item, index) => (
                <li key={index} className="py-4">
                  <a href={item.href} className="text-white hover:text-orange-500 transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex space-x-6 mt-4">
              <a href="#" className="py-2 px-3 border border-gray-600 rounded-md text-white hover:bg-gray-800 transition-colors">
                Sign In
              </a>
              <a
                href="#"
                className="py-2 px-3 rounded-md bg-gradient-to-r from-orange-500 to-orange-800 text-white hover:from-orange-600 hover:to-orange-900 transition-colors"
              >
                Create an account
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;