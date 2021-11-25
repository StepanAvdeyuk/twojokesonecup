import { useEffect, useState, useCallback } from 'react';
import './mainList.scss';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import axios from 'axios';


import level1 from "../../resources/img/joke-level-1.svg";
import level2 from "../../resources/img/joke-level-2.svg";
import level3 from "../../resources/img/joke-level-3.svg";
import level4 from "../../resources/img/joke-level-4.svg";
import level5 from "../../resources/img/joke-level-5.svg";
import level6 from "../../resources/img/joke-level-6.svg";
import level7 from "../../resources/img/joke-level-7.svg";
import level8 from "../../resources/img/joke-level-8.svg";
import level9 from "../../resources/img/joke-level-9.svg";
import level10 from "../../resources/img/joke-level-10.svg";

import hueta from '../../resources/img/hueta.png' 


const MainList = ({searchValue}) => {

    const [jokes, setJokes] = useState([]);
    const [offset, setOffset] = useState(0);
    const [fetching, setFetching] = useState(false);
    const [jokeEnd, setJokeEnd] = useState(false);


    const [jokesSearch, setJokesSearch] = useState([]);
    const [zeroSearch, setZeroSearch] = useState(false);

    const level = [level1, level2, level3, level4, level5, level6, level7, level8, level9, level10];

    const {loading, error, getAllJokes, getSearchJokes} = useMarvelService();

    useEffect(() => {
        onRequest(offset, 4);
        document.addEventListener('scroll', scrollHandler)

        return function() {
            document.removeEventListener('scroll', scrollHandler)
        }
    }, []);

    useEffect(() => {
        if (searchValue.length != 0) {
            if(zeroSearch) {
                setZeroSearch(false);
            }
            setJokesSearch([]);
            onRequestSearch(searchValue, 0, -1);
        }
    } , [searchValue])

    useEffect(() => {
        if (fetching && !jokeEnd && searchValue.length == 0) {
            onRequest(offset, 2);
            const uploadTime = setTimeout(function() {
                setFetching(false);   
                            }, 500)
            return () => {
                    clearInterval(uploadTime);
            }
        }
    }, [fetching])

    const scrollHandler = (e) => {
        if (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 100) {
            setFetching(true);
        }
    }

    const onRequest = (offset, limit) => {
        getAllJokes(offset, limit)
            .then(onJokesLoaded)
    }

    const onRequestSearch = (search, offset, limit) => {
        getSearchJokes(search, offset, limit)
            .then(onJokesSearchLoaded)
    }

    const onJokesLoaded = (newJokes) => {
        if (newJokes.length == 0) {setJokeEnd(true)}
        setJokes(jokes => [...jokes, ...newJokes]);
        setOffset(offset => offset + newJokes.length);
    }

    const onJokesSearchLoaded = (newJokes) => {
        if (newJokes.length == 0) {setZeroSearch(true)}
        setJokesSearch(jokesSearch => [...jokesSearch, ...newJokes]);
    }

    const onLikeUpdate = (id) => {
        setJokes(jokes => jokes.map(item => {
            if (item.id !== id) {
                return item;
            } else {
                return {author: item.author, title: item.title, level: item.level, show: item.show, content: item.content, id: item.id, published_at: item.published_at, picture: item.picture, likes: item.likes + 1, isLiked: true}
            }
        }))
    }

    const onLike = useCallback((id) => {
            axios.put(`http://89.108.76.196:8000/anecdotes/${id}/like`)
            .then(onLikeUpdate(id));
    })


    function renderItems(jokes) {
        const items = jokes.map((item) => {
                let likes = item.likes;
                if (likes > 1000000) {
                    likes = (likes - (likes % 10000)) / 1000000 + ' M';
                }
                if (likes > 1000) {
                    likes = (likes - (likes % 10)) / 1000 + ' K';
                }
                return (
                    <div className="main__item" key={item.id}>
                        <div className="main__top">
                            <h2 className="main__title">{item.title}</h2>
                            <div className="main__level"><img src={level[item.level - 1]} alt={`level: ${item.level}`} /></div>
                        </div>
                        <div className="main__joke">{item.content}</div>
                        <div className="main__bottom">
                            <div className="main__author">Автор: {item.author}</div>
                            <div className="main__like">{likes}
                                <div className="main__like-btn" onClick={() => onLike(item.id)}>
                                    <img src={hueta} 
                                         onClick={(e) => {e.target.classList.add('like__active'); setTimeout(() => {e.target.classList.remove('like__active')}, 150);}} alt="like" />
                                    </div>
                            </div>
                        </div>
                        <div className="main__line"></div>
                    </div>
                )
        })

 
        return (
            <div className="main__wrapper">
                {items}
            </div>
        )
    }

    const EndMessage = () => {
        return (
            <div className="main__end">
                Упс... Вы долистали до конца(
            </div>
        )
    }

    const spinner = loading ? <Spinner/> : null;

    const end = (jokeEnd && !zeroSearch) ? <EndMessage/> : null;

    const visible = (searchValue.length == 0) ? renderItems(jokes) : renderItems(jokesSearch);

    return (
        <div className="container">
            {spinner}
            {visible}
            {end}
            {zeroSearch ? <div className="main__zero-search">По вашему запросу ничего не нашлось...</div> : null}
        </div>
    )
}

export default MainList;