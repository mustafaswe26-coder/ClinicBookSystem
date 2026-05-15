function SearchInput({
value,
onChange,
placeholder
}){

return(

<div className="admin-search-box2">

<input
type="text"
placeholder={placeholder}
value={value}
onChange={(e)=>onChange(e.target.value)}
/>

</div>

);

}

export default SearchInput;
