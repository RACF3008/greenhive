import SearchIcon from "@mui/icons-material/Search";

const SearchInput = () => {
  return (
    <div className="w-full flex items-center gap-2 text-md rounded-full px-2 ring-[1.5px] ring-primary-300 focus-within:ring-white transition-all duration-200">
      <SearchIcon
        className="text-primary-300 focus:text-white transition-colors"
        sx={{ fontSize: 32 }}
      />
      <input
        type="text"
        placeholder="Search"
        className="bg-transparent p-2 outline-none text-white"
      />
    </div>
  );
};

export default SearchInput;
