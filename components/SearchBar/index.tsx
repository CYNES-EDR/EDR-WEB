// components/SearchBar.tsx
import { useState, ChangeEvent, KeyboardEvent, FocusEvent } from "react";
import { SearchOutlined } from "@ant-design/icons";
import parseInput from "@/helpers/parse-search-data";
import { Button } from "antd";
interface SearchBarProps {
  searchFunction?: React.Dispatch<
    React.SetStateAction<{ field: string; operator: string; value: string }[]>
  >;
  filterKey: string[];
  placeHolder: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchFunction,
  filterKey,
  placeHolder,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  console.log("setSearch", searchFunction);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const lastWord = value.split(" ").pop()?.toLowerCase() || "";
    if (lastWord) {
      const filteredKeys = filterKey.filter((key) => key.startsWith(lastWord));
      setSuggestions(filteredKeys);
    } else {
      setSuggestions(filterKey); // Hiển thị tất cả gợi ý khi ô tìm kiếm trống
    }
    setHighlightedIndex(-1); // Reset highlighted index
  };

  const handleSuggestionClick = (suggestion: string) => {
    const words = inputValue.split(" ");
    words.pop();
    words.push(suggestion);
    setInputValue(words.join(" "));
    setSuggestions([]);
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    if (!inputValue) {
      setSuggestions(filterKey); // Hiển thị tất cả gợi ý khi ô tìm kiếm được focus
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    // Thêm delay để cho phép click vào suggestion trước khi ẩn danh sách
    setTimeout(() => setSuggestions([]), 100);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prevIndex) =>
          prevIndex === suggestions.length - 1 ? 0 : prevIndex + 1
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prevIndex) =>
          prevIndex <= 0 ? suggestions.length - 1 : prevIndex - 1
        );
      } else if (e.key === "Enter" && highlightedIndex >= 0) {
        e.preventDefault();
        handleSuggestionClick(suggestions[highlightedIndex]);
      }
    }
  };

  const handleSearch = () => {
    console.log("setSearch", searchFunction);
    if (searchFunction) {
      searchFunction(parseInput(inputValue));
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeHolder}
      />
      {suggestions.length > 0 && (
        <div className="suggestions">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              className={highlightedIndex === index ? "highlighted" : ""}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
      {/* <button onClick={handleSearch}>Search</button> */}
      <Button
        className="ml-2"
        type="primary"
        icon={<SearchOutlined />}
        onClick={handleSearch}
      ></Button>
    </div>
  );
};

export default SearchBar;
