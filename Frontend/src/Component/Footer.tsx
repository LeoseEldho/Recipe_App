const Footer = () => {
  return (
    <footer className="border-0 border-t-2 border-gray-400 bg-black">
      <h3 className="text-sm text-center items-center py-6 text-white">
        © {new Date().getFullYear()} Recipe App | All Rights Reserved.
      </h3>
    </footer>
  );
};

export default Footer;