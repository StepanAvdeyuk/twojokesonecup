import './header.scss';
import { useState, createRef, useEffect } from 'react';

const Header = ({showModal, searchValue}) => {

    const [search, setSearch] = useState('');

    const SearchRef = createRef();

    useEffect(() => {
        if (SearchRef.current) {
                SearchRef.current.focus();
        }
        searchValue(search.toLowerCase());
    }, [search])

    return (
        <div className="header__wrapper">
            <div className="container">
            <header className="header">
            <input 
                type="text"
                ref={SearchRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="header__search"
                placeholder="Поиск по анекдотам"/>
                <button className="header__btn" onClick={() => showModal()}>Добавить анекдот</button>
            </header>
            </div>
        </div>
    )
}

export default Header;