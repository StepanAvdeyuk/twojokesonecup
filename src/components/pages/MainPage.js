import { useState } from 'react';

import Header from '../header/Header';
import MainList from '../mainList/MainList';
import Modal from '../modal/Modal';
import ModalAddJoke from '../modalAddJoke/modalAddJoke';

const MainPage = () => {
    const [modalActive, setModalActive] = useState(false);
    const [search, setSearch] = useState('');

    const showModal = () => {
        setModalActive(true);
    }
    const searchValue = (item) => {
        setSearch(item);
    }
    return (
        <>
        <Header showModal={showModal} searchValue={searchValue}/>
        <MainList searchValue={search}/>
        <Modal active={modalActive} setActive={setModalActive}>
            <ModalAddJoke hideModal={setModalActive}/>
        </Modal>
        </>
    )
}

export default MainPage;