import './modalAddJoke.scss';
import {useState, useCallback, useEffect, createRef} from 'react';
import { Formik, Form, Field, ErrorMessage, useField } from 'formik';
import axios from 'axios';
import Spinner from '../spinner/Spinner';

const ModalAddJoke = ({hideModal}) => {
        
        const [loading, setLoading] = useState(false);
        const [postDone, setPostDone] = useState(false);


        useEffect(() => {
                if (postDone) {
                        const postRefreshInput = setTimeout(function() {
                                setPostDone(false);
                                hideModal();
                        }, 2000)
                        const postRefresh = setTimeout(function() {
                                hideModal();
                        }, 1500)
                        return () => {
                                clearInterval(postRefreshInput);
                                clearInterval(postRefresh);
                        }
                }
        }, [postDone])

        const sendJoke = (values) => {
                setLoading(true);
                axios({
                        method: 'POST',
                        url: 'http://89.108.76.196:8000/anecdotes/',
                        headers: {
                                'Content-Type': 'application/json'
                        },
                        data: {
                                title: values.title,
                                content: values.content, 
                                author: values.author,
                        }})
                .then(() => {
                        setLoading(false);
                        setPostDone(true);
                })
                .catch(error => {
                        console.log(error);
                })
        }


        const Visible = () => {
                return (
                        <Formik 
                        initialValues={{author: "", title: "" , content: ""}}
                        validate={values => {
                                const errors = {};
                                if (!values.author) {
                                  errors.author = '???????????????????????? ????????';
                                }
                                if (values.author === '???????? ??????????????') {
                                        errors.author = '???? ?????????????? ????????????????'
                                }
                                if (!values.title) {
                                    errors.title = '???????????????????????? ????????';
                                }
                                if (!values.content) {
                                    errors.content = '???????????????????????? ????????';
                                }   
                                return errors;
                              }}
                        onSubmit={values => sendJoke(values)}>
                        <Form className="modal__input">
                        <Field 
                                type="text"
                                className="modal__form"
                                name="author"
                                id="name"
                                placeholder="???????? ??????"/>
                        <ErrorMessage name="author" component="div" className="modal__form-error"/>
                        <Field 
                                type="text"
                                className="modal__form"
                                name="title"
                                id="joke-name"
                                placeholder="???????????????? ????????????????"/>
                        <ErrorMessage name="title" component="div" className="modal__form-error"/>
                        <Field  
                                as="textarea"
                                type="text"
                                name="content"
                                id="joke"
                                className="modal__form modal__form-text"
                                placeholder="??????????????"/>
                        <ErrorMessage name="content" component="div" className="modal__form-error"/>
                        <button className="modal__btn" type="submit">???????????????? ??????????????</button>
                        </Form>
                        </Formik>
                )
        }

        const Success = () => {
                return (
                        <div className="modal__success">
                                ???????? ???????????? ?????????????? ????????????????????!
                        </div>
                )
        }

        return (
        <>
                <div className="modal__title">???????????????? ??????????????</div>
                <div className="modal__close" onClick={() => hideModal(false)}>&times;</div>
                {(!loading && !postDone) ? <Visible/> : null}
                {loading ? <Spinner/>: null}
                {postDone ? <Success/> : null}
        </>
        )
}

export default ModalAddJoke;