import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { navItems } from "../constants";

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const handleNavigation = (item) => {
    if (item.scrollId && window.location.pathname === "/") {
      const element = document.getElementById(item.scrollId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(item.path);
    }
    setMobileDrawerOpen(false);
  };

  const orangeItems = ["Features", "Workflow", "Success Stories", "Expert Committee"];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-3 bg-gray-900 border-b border-gray-800">
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center">
          
          <div 
            className="flex flex-col items-start cursor-pointer select-none" 
            onClick={() => navigate("/")}
          >
            <span className="text-3xl font-black text-[#f87115] tracking-[ -0.05em] leading-[0.8]">
              Idea
            </span>
            <div className="bg-[#f87115] px-1.5 py-0.5 rounded-[2px] mt-0.5 ml-5">
              <span className="text-white text-lg font-black tracking-tighter leading-none">
                2Life
              </span>
            </div>
          </div>

          {/* روابط الـ Desktop */}
          <ul className="hidden lg:flex ml-14 space-x-12">
            {navItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => handleNavigation(item)}
                  className={`transition-colors ${
                    orangeItems.includes(item.label)
                      ? "text-[#FFBF78] hover:text-orange-500"
                      : "text-gray-300 hover:text-[#f87115]"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex justify-center space-x-6 items-center">
            <button
              onClick={() => navigate("/login")}
              className="py-2 px-3 border border-gray-700 rounded-md text-white hover:bg-gray-800"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-[#f87115] py-2 px-3 rounded-md text-white font-bold hover:bg-orange-600 transition-colors"
            >
              Create an account
            </button>
          </div>

          <div className="lg:hidden flex items-center">
            <button onClick={toggleNavbar} className="text-white">
              {mobileDrawerOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileDrawerOpen && (
          <div className="fixed top-[70px] left-0 right-0 z-20 bg-gray-900 w-full p-8 flex flex-col justify-center items-center lg:hidden border-t border-gray-800">
            <ul className="w-full">
              {navItems.map((item, index) => (
                <li key={index} className="py-4 text-center border-b border-gray-800">
                  <button
                    onClick={() => handleNavigation(item)}
                    className={`w-full transition-colors ${
                      orangeItems.includes(item.label)
                        ? "text-[#f87115] hover:text-orange-500"
                        : "text-white hover:text-[#f87115]"
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex flex-col space-y-4 mt-6 w-full">
              <button onClick={() => navigate("/login")} className="py-3 border border-gray-700 text-white rounded-md">
                Sign In
              </button>
              <button onClick={() => navigate("/register")} className="py-3 bg-[#f87115] text-white rounded-md font-bold">
                Create account
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
