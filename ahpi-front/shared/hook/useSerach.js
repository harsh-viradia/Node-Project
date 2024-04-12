import { useDebouncedCallback } from "use-debounce"
/**
 *
 *
 * @param {*} { setSearchValue, setValue }
 * @return {*}
 */
const useSearch = ({ setSearchValue, setValue = () => {} }) => {
  const debounced = useDebouncedCallback((input) => {
    setSearchValue(input)
  }, 1000)

  const onSearch = (input) => {
    debounced(input)
    setValue(input)
  }
  return { onSearch }
}

export default useSearch
