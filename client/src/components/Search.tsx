import SearchIcon from "@mui/icons-material/Search";

const Search = () => {
  return (
    <div className="w-full md:w-auto md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-primary-300 px-2">
      <SearchIcon className="text-primary-300" sx={{ fontSize: 24 }} />
      <input
        type="text"
        placeholder="Search"
        className="w-[200px] bg-transparent p-2 outline-none text-white"
      />
    </div>
  );
};

export default Search;
