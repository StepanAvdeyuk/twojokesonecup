import './admin.scss';

import {BrowserRouter as Router, Route, Routes, NavLink} from 'react-router-dom';
import { useState, createRef, useEffect } from 'react';
import axios from 'axios';

import AddJokeAdmin from './AddJokeAdmin';
import JokeListAdmin from './JokeListAdmin';    
import JokeRequestList from './JokeRequestList';

const Admin = () => {

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState("");
    const [tokenType, setTokenType] = useState("");
    const [wrongPass, setWrongPass] = useState(null);

    const LoginRef = createRef();
    const PasswordRef = createRef();

    const [logged, setLogged] = useState(false);

    useEffect(() => {
        if (PasswordRef.current) {
                PasswordRef.current.focus();
        }
    }, [password])

    useEffect(() => {
        if (LoginRef.current) {
                LoginRef.current.focus();
        }
    }, [login])


    const getLogin = async (e) => {
        e.preventDefault();
        let res = await fetch('http://89.108.76.196:8000/auth/login', {
            method: 'POST',
            body: new URLSearchParams({
                'username': login,
                'password': password
            })
        })
        return await res.json();

    }

    const onLogin = (e) => {
        getLogin(e)
        .then(res => {
            if (res.access_token) {
                setToken(res.access_token);
                setTokenType(res.token_type);
                setLogged(true);
            }
            if (res.detail) {
                setWrongPass(res.detail);
            }
        })
        .catch(error => {
            console.log(error);
        })
        .finally(
            setWrongPass(null),
            setPassword(''),
            setLogin('')
        )
    }


    const toLogin = (logged) => {
        if (!logged) {
            return (
                <form action="#" className="admin__login" onSubmit={onLogin}>
                    <input type="text" className="admin__input" name="login" ref={LoginRef} value={login}  onChange={(e) => setLogin(e.target.value)} placeholder="Логин"/>
                    <input type={"password"} className="admin__input" name="password" ref={PasswordRef} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль"/>
                    <button className="admin__btn-in" type="submit">Войти</button>
                </form>
            )}
        else {
            return (
                <>
                <div className="admin__nav">
                    <NavLink exact to="requests">Входящие заявки</NavLink> 
                    <NavLink exact to="addjoke">Добавить анекдот</NavLink> 
                    <NavLink exact to="jokelist">Список анекдотов</NavLink> 
                    <NavLink exact to="/">На сайт</NavLink>
                </div>

                <Routes>
                    <Route exact path="requests" element={<JokeRequestList token={token}/>}/>
                    <Route exact path="addjoke" element={<AddJokeAdmin token={token}/>}/>
                    <Route exact path="jokelist" element={<JokeListAdmin token={token}/>}/>
                </Routes>
                </>
            )
        }
    }
    const visible = toLogin(logged);
    return (
            <div className="admin">
            <div className="container">
                {visible}
                {wrongPass ? <div className="admin__wrong">{wrongPass}</div> : null}
            </div>
        </div>
    )
}

export default Admin;