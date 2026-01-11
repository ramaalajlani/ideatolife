const ResponsivePage = ({ children }) => {
  return (
    <div className="w-full">
      <div
        className="
          mx-auto
          w-full
          max-w-screen-2xl
          px-4
          sm:px-6
          lg:px-8
          xl:px-10
          2xl:px-12
        "
      >
        {children}
      </div>
    </div>
  );
};

export default ResponsivePage;
