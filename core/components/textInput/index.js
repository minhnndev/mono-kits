import InputBase from './Input';
import SearchInput from './searchInput/SearchInput';
import UnderlineTextInput from './underlineTextInput/UnderlineTextInput';
import RoundTextInput from './roundTextInput/RoundTextInput';

const Input = Object.assign(
    InputBase,
    {
        Search: SearchInput,
        Underline: UnderlineTextInput,
        Round: RoundTextInput,
    }
);

export default Input;
